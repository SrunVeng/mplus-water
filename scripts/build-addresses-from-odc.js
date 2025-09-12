// scripts/build-addresses.js
import fs from "node:fs/promises";
import path from "node:path";

const INPUT_DIR = process.argv[2] || "./scripts/files";
const OUTPUT = process.argv[3] || "./src/data/addresses.json";

const FILES = {
    provinces: "provinces.json",
    districts: "districts.json",
    communes:  "communes.json",
    villages:  "villages.json",
};

function pjoin(...xs) { return path.resolve(path.join(...xs)); }
function byName(a, b) { return a.localeCompare(b, "en"); }

async function loadJSON(filePath) {
    const raw = await fs.readFile(filePath, "utf8");
    const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw; // strip BOM if present
    return JSON.parse(text);
}

async function main() {
    const pProvinces = pjoin(INPUT_DIR, FILES.provinces);
    const pDistricts = pjoin(INPUT_DIR, FILES.districts);
    const pCommunes  = pjoin(INPUT_DIR, FILES.communes);
    const pVillages  = pjoin(INPUT_DIR, FILES.villages);

    // Load all four
    const [{ provinces }, { districts }, { communes }, { villages }] = await Promise.all([
        loadJSON(pProvinces),
        loadJSON(pDistricts),
        loadJSON(pCommunes),
        loadJSON(pVillages),
    ]);

    // Basic shape checks
    if (!Array.isArray(provinces) || !Array.isArray(districts) || !Array.isArray(communes) || !Array.isArray(villages)) {
        throw new Error("One or more input files are missing the expected top-level arrays: provinces[], districts[], communes[], villages[]");
    }

    // Indexes
    const distsByProv = new Map();   // PROV_* -> [district]
    for (const d of districts) {
        if (!d?.province_code) continue;
        if (!distsByProv.has(d.province_code)) distsByProv.set(d.province_code, []);
        distsByProv.get(d.province_code).push(d);
    }

    const commsByDist = new Map();   // DIST_* -> [commune]
    for (const c of communes) {
        if (!c?.district_code) continue;
        if (!commsByDist.has(c.district_code)) commsByDist.set(c.district_code, []);
        commsByDist.get(c.district_code).push(c);
    }

    const villsByComm = new Map();   // COMM_* -> [village]
    for (const v of villages) {
        const code = v?.commune_code ?? v?.communeId ?? v?.commune_id ?? v?.COMMUNE_CODE;
        if (!code) continue;
        if (!villsByComm.has(code)) villsByComm.set(code, []);
        villsByComm.get(code).push(v);
    }

    // Build nested: Province -> District -> Commune -> [Villages]
    const out = {};
    for (const p of provinces) {
        const provName = p.name_en;
        out[provName] = {};

        const provDistricts = (distsByProv.get(p.code) || []).sort((a, b) => byName(a.name_en, b.name_en));
        for (const d of provDistricts) {
            const distName = d.name_en;
            out[provName][distName] = {};

            const distCommunes = (commsByDist.get(d.code) || []).sort((a, b) => byName(a.name_en, b.name_en));
            for (const c of distCommunes) {
                const commName = c.name_en;
                const villNames = (villsByComm.get(c.code) || [])
                    .map(v => v.name_en)
                    .filter(Boolean)
                    .sort(byName);

                out[provName][distName][commName] = villNames;
            }
        }
    }

    await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
    await fs.writeFile(OUTPUT, JSON.stringify(out, null, 2), "utf8");

    console.log("Done.");
    console.log("Input:", INPUT_DIR);
    console.log("Output:", OUTPUT);
    console.log("Counts:", {
        provinces: provinces.length,
        districts: districts.length,
        communes:  communes.length,
        villages:  villages.length,
    });
}

main().catch(err => {
    console.error("Build failed:", err?.stack || err);
    process.exitCode = 1;
});
