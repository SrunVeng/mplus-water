import ProductSlider from '../pages/ProductSlider.jsx'
import { IMAGES } from '../data'
import { Link } from 'react-router-dom'


export default function Home() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                            Hydration, elevated with <span className="text-brand-700">PureBlue</span>
                        </h1>
                        <p className="mt-4 text-lg text-slate-600 max-w-prose">
                            Ultra‑pure bottled water designed for daily wellness. Subtle minerals, crisp taste, and reliable delivery for homes & offices.
                        </p>
                        <div className="mt-8 flex items-center gap-3">
                            <Link to="/products" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-brand-600 text-white font-medium shadow-soft hover:bg-brand-700 transition">See Products</Link>
                            <Link to="/contact" className="inline-flex items-center justify-center rounded-xl px-5 py-3 ring-1 ring-inset ring-slate-200 hover:ring-brand-300 text-slate-700">Contact Us</Link>
                        </div>
                        <dl className="mt-10 grid grid-cols-3 gap-6 text-center">
                            <div className="p-4 rounded-2xl bg-white ring-1 ring-slate-100 shadow-soft">
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Purity</dt>
                                <dd className="mt-1 text-xl font-semibold">99.9%</dd>
                            </div>
                            <div className="p-4 rounded-2xl bg-white ring-1 ring-slate-100 shadow-soft">
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Minerals</dt>
                                <dd className="mt-1 text-xl font-semibold">Balanced</dd>
                            </div>
                            <div className="p-4 rounded-2xl bg-white ring-1 ring-slate-100 shadow-soft">
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Delivery</dt>
                                <dd className="mt-1 text-xl font-semibold">Fast</dd>
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