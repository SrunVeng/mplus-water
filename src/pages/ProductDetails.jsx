// src/pages/ProductDetails.jsx
import { IMAGES } from '../data/imgLink.js'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Keep product meta lean: ids + images (+ optional price if you want)
const products = [
    { id: 1, img: IMAGES[0] },
    { id: 3, img: IMAGES[2] },
    { id: 4, img: IMAGES[3] },
]

// Optional: if you have prices in a catalog, map them here (otherwise omit)
const PRICE_MAP = {
    1: 2.5,
    3: 14.0,
    4: 11.5,
}

export default function ProductDetails() {
    const { t } = useTranslation()

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {t('product_details.title')}
                </h1>
                <p className="mt-2 text-slate-600">{t('product_details.sub')}</p>
            </header>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => {
                    const nameKey = `products.${p.id}.name`
                    const descKey = `products.${p.id}.desc`
                    const details = t(`products.${p.id}.details`, {
                        returnObjects: true,
                        defaultValue: [],
                    })
                    const name = t(nameKey)
                    const desc = t(descKey)
                    const price = PRICE_MAP[p.id]

                    return (
                        <li
                            key={p.id}
                            className="group bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft overflow-hidden flex flex-col transition hover:shadow-md"
                        >
                            <div className="relative aspect-[4/3]">
                                <img
                                    src={p.img}
                                    alt={name}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-semibold group-hover:text-brand-700 transition">
                                    {name}
                                </h3>

                                <p className="mt-1 text-slate-600">{desc}</p>

                                {Array.isArray(details) && details.length > 0 && (
                                    <ul className="mt-4 grid gap-1 text-sm text-slate-600 list-disc list-inside">
                                        {details.map((d, i) => (
                                            <li key={i}>{d}</li>
                                        ))}
                                    </ul>
                                )}

                                <div className="mt-5 flex items-center gap-3">
                                    {typeof price === 'number' && (
                                        <span className="text-slate-900 font-semibold">
                      ${price.toFixed(2)}
                    </span>
                                    )}

                                    <Link
                                        to={`/order?pid=${String(p.id)}`}
                                        className="inline-flex items-center rounded-xl px-4 py-2 bg-brand-600 text-white hover:bg-brand-700"
                                    >
                                        {t('cta.order')}
                                    </Link>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>

            <div className="mt-12 grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">{t('product.water_quality')}</h2>
                    <p className="mt-2 text-slate-600">{t('product.water_quality_desc')}</p>
                </div>
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    {/* fixed key here */}
                    <h2 className="text-xl font-semibold">{t('product.delivery')}</h2>
                    <p className="mt-2 text-slate-600">{t('product.delivery_desc')}</p>
                </div>
            </div>
        </section>
    )
}
