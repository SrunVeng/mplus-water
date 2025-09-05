import { IMAGES } from '../data'
import {Link} from "react-router-dom";


const products = [
    { id: 1, name: 'M PLUS 1.5L', desc: 'Family size, ideal for meals.', img: IMAGES[0], details: ['BPA-free bottle', 'Balance PH', 'Case of 12 available'] },
    { id: 3, name: 'M PLUS 350ml', desc: 'Small size, ideal for events', img: IMAGES[2], details: ['BPA-free bottle', 'Balance PH', 'Case of 24 available'] },
    { id: 4, name: 'M PLUS 500ml', desc: 'Medium size, ideal for sports', img: IMAGES[3], details: ['BPA-free bottle', 'Balance PH', 'Case of 24 available'] },
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
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center rounded-xl px-4 py-2 bg-brand-600 text-white hover:bg-brand-700"
                                >
                                    Order
                                </Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>


            <div className="mt-12 grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">Water Quality</h2>
                    <p className="mt-2 text-slate-600">pH 7.2–7.6 · UV + RO + micron filtration.</p>
                </div>
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">Delivery</h2>
                    <p className="mt-2 text-slate-600">Same-day delivery in city center · 1-2 days delivery in provinces · Free delivery on large orders.</p>
                </div>
            </div>
        </section>
    )
}