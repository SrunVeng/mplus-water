import { Link, NavLink } from 'react-router-dom'
import { LOGO } from '../data'

export default function Header() {
    return (
        <header className="fixed top-0 inset-x-0 z-50">
            <div className="w-full">
                <div className="rounded-none bg-brand-600/90 backdrop-blur shadow-soft ring-1 ring-white/20">
                    <div className="flex h-14 items-center justify-between px-4 sm:px-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img
                                src={LOGO}
                                alt="M PLUS logo"
                                className="h-8 w-8 rounded-md ring-1 ring-white/30 object-cover"
                            />
                            <span className="text-white font-semibold tracking-tight">
                M PLUS
              </span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-8 text-sm">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `text-white/90 hover:text-white ${
                                        isActive ? 'font-semibold' : ''
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/products"
                                className={({ isActive }) =>
                                    `text-white/90 hover:text-white ${
                                        isActive ? 'font-semibold' : ''
                                    }`
                                }
                            >
                                Products
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `text-white/90 hover:text-white ${
                                        isActive ? 'font-semibold' : ''
                                    }`
                                }
                            >
                                Contact
                            </NavLink>
                        </nav>
                        <button
                            onClick={() =>
                                document.getElementById('mobileNav')?.classList.toggle('hidden')
                            }
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white"
                            aria-label="Open menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        id="mobileNav"
                        className="md:hidden hidden border-t border-white/20"
                    >
                        <div className="px-4 py-3 flex flex-col gap-2">
                            <Link to="/" className="text-white/90 hover:text-white">
                                Home
                            </Link>
                            <Link to="/products" className="text-white/90 hover:text-white">
                                Products
                            </Link>
                            <Link to="/contact" className="text-white/90 hover:text-white">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
