import ProductSlider from '../pages/ProductSlider.jsx'
import { IMAGES } from '../data'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'

export default function Home() {
    const { t } = useTranslation();

    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                            <Trans i18nKey="hero.headline_prefix" />{' '}
                            <span className="text-brand-700"><Trans i18nKey="hero.headline_brand" /></span>
                        </h1>

                        <p className="mt-4 text-lg text-slate-600 max-w-prose">
                            {t('hero.sub')}
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            <Link to="/products" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-brand-600 text-white font-medium shadow-soft hover:bg-brand-700 transition">
                                {t('cta.see_products')}
                            </Link>
                            <Link to="/contact" className="inline-flex items-center justify-center rounded-xl px-5 py-3 ring-1 ring-inset ring-slate-200 hover:ring-brand-300 text-slate-700">
                                {t('cta.contact_us')}
                            </Link>
                        </div>

                        <dl className="mt-10 grid grid-cols-3 gap-6 text-center">
                            <div className="p-4 rounded-2xl bg-white ring-1 ring-slate-100 shadow-soft">
                                <dt className="text-xs uppercase tracking-wide text-slate-500">{t('stats.purity')}</dt>
                                <dd className="mt-1 text-xl font-semibold">{t('stats.purity_value')}</dd>
                            </div>
                            <div className="p-4 rounded-2xl bg-white ring-1 ring-slate-100 shadow-soft">
                                <dt className="text-xs uppercase tracking-wide text-slate-500">{t('stats.minerals')}</dt>
                                <dd className="mt-1 text-xl font-semibold">{t('stats.minerals_value')}</dd>
                            </div>
                            <div className="p-4 rounded-2xl bg-white ring-1 ring-slate-100 shadow-soft">
                                <dt className="text-xs uppercase tracking-wide text-slate-500">{t('stats.delivery')}</dt>
                                <dd className="mt-1 text-xl font-semibold">{t('stats.delivery_value')}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-6 -z-10 bg-gradient-to-tr from-brand-200/60 via-transparent to-brand-300/60 rounded-3xl blur-2xl" />
                        <ProductSlider images={IMAGES} />
                    </div>
                </div>
            </div>
        </section>
    )
}
