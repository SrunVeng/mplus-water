import { IMAGES } from '../data'


const products = [
    { id: 1, name: 'PureBlue 350ml', desc: 'Compact hydration for on-the-go.', img: IMAGES[0], details: ['BPA-free bottle', 'Light mineral profile', 'Case of 24 available'] },
    { id: 2, name: 'PureBlue 600ml', desc: 'Daily carry with the perfect balance.', img: IMAGES[1], details: ['Recyclable', 'Electrolyte-balanced', 'Bulk discounts'] },
    { id: 3, name: 'PureBlue 1.5L', desc: 'Family size, ideal for meals.', img: IMAGES[2], details: ['Resealable cap', 'Tastes crisp and clean', 'Weekly delivery plans'] },
    { id: 4, name: 'PureBlue Gallon', desc: 'Dispenser-ready for offices.', img: IMAGES[3], details: ['Refill program', 'Leak-proof seal', 'Free pump on first order'] },
]


export default function ProductDetails() {
    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Product Details</h1>
                <p className="mt-2 text-slate-600">Explore specifications, benefits, and delivery options.</p>
            </header>


            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                    <li key={p.id} className="group bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft overflow-hidden flex flex-col">
                        <div className="relative h-48">
                            <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold group-hover:text-brand-700 transition">{p.name}</h3>
                            <p className="mt-1 text-slate-600">{p.desc}</p>
                            <ul className="mt-4 grid gap-1 text-sm text-slate-600 list-disc list-inside">
                                {p.details.map((d, i) => (
                                    <li key={i}>{d}</li>
                                ))}
                            </ul>
                            <div className="mt-5 flex items-center gap-2">
                                <button className="inline-flex items-center rounded-xl px-4 py-2 bg-brand-600 text-white hover:bg-brand-700">Order</button>
                                <button className="inline-flex items-center rounded-xl px-4 py-2 ring-1 ring-inset ring-slate-200 hover:ring-brand-300">Learn more</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>


            <div className="mt-12 grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">Water Quality</h2>
                    <p className="mt-2 text-slate-600">TDS 35–55 ppm · pH 7.2–7.6 · UV + RO + micron filtration.</p>
                </div>
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">Delivery Options</h2>
                    <p className="mt-2 text-slate-600">Same‑day in city center · Weekly subscriptions · Contactless drop‑off.</p>
                </div>
            </div>
        </section>
    )
}