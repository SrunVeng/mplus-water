// src/pages/ProductDetails.jsx
import { IMAGES } from '../data'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Store keys instead of hard-coded strings
const products = [
    {
        id: 1,
        img: IMAGES[0],
        name: 'products.1.name',
        desc: 'products.1.desc',
        details: ['products.1.details.0', 'products.1.details.1', 'products.1.details.2'],
    },
    {
        id: 3,
        img: IMAGES[2],
        name: 'products.3.name',
        desc: 'products.3.desc',
        details: ['products.3.details.0', 'products.3.details.1', 'products.3.details.2'],
    },
    {
        id: 4,
        img: IMAGES[3],
        name: 'products.4.name',
        desc: 'products.4.desc',
        details: ['products.4.details.0', 'products.4.details.1', 'products.4.details.2'],
    },
]

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
                {products.map((p) => (
                    <li
                        key={p.id}
                        className="group bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft overflow-hidden flex flex-col"
                    >
                        <div className="relative h-48">
                            <img
                                src={p.img}
                                alt={t(p.name)}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold group-hover:text-brand-700 transition">
                                {t(p.name)}
                            </h3>

                            <p className="mt-1 text-slate-600">{t(p.desc)}</p>

                            <ul className="mt-4 grid gap-1 text-sm text-slate-600 list-disc list-inside">
                                {p.details.map((d, i) => (
                                    <li key={i}>{t(d)}</li>
                                ))}
                            </ul>

                            <div className="mt-5 flex items-center gap-2">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center rounded-xl px-4 py-2 bg-brand-600 text-white hover:bg-brand-700"
                                >
                                    {t('cta.order')}
                                </Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-12 grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">{t('product.water_quality')}</h2>
                    <p className="mt-2 text-slate-600">{t('product.water_quality_desc')}</p>
                </div>
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">{t('product.delivery')}</h2>
                    <p className="mt-2 text-slate-600">{t('product.delivery_desc')}</p>
                </div>
            </div>
        </section>
    )
}
