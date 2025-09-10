// src/components/Header.jsx
import { Fragment, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Dialog, Transition } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import CountryFlag from 'react-country-flag'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { LOGO } from '../data/imgLink.js'

function LangToggle({ className }) {
    const { i18n } = useTranslation()
    const opts = useMemo(() => ([
        { code: 'en', label: 'EN', flag: 'GB' },
        { code: 'km', label: 'KM', flag: 'KH' },
    ]), [])
    const isEN = (i18n.language || 'en').startsWith('en')
    const toggle = () => i18n.changeLanguage(isEN ? 'km' : 'en')

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle language"
            aria-pressed={!isEN}
            className={clsx(
                // padding + overflow clip keeps ring & thumb 100% inside
                'relative inline-flex h-9 w-28 items-center rounded-full p-1 overflow-hidden',
                'bg-white/10 ring-1 ring-inset ring-white/25 text-white/90 backdrop-blur',
                'transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                className
            )}
        >
            {/* Thumb: sized to half minus the padding gap; animated translate keeps it inside */}
            <motion.span
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white/25"
                animate={{ x: isEN ? 0 : '100%' }}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            />
            <span className="relative z-10 grid w-full grid-cols-2 text-xs font-medium">
        <span className={clsx('flex items-center justify-center gap-1 px-2', isEN ? 'opacity-100' : 'opacity-80')}>
          <CountryFlag svg countryCode="GB" style={{ width: 14, height: 14, borderRadius: 2 }} aria-label="EN" />
          EN
        </span>
        <span className={clsx('flex items-center justify-center gap-1 px-2', !isEN ? 'opacity-100' : 'opacity-80')}>
          <CountryFlag svg countryCode="KH" style={{ width: 14, height: 14, borderRadius: 2 }} aria-label="KM" />
          KH
        </span>
      </span>
        </button>
    )
}

function DesktopNav() {
    const { t } = useTranslation()
    const NAV = useMemo(() => ([
        { to: '/', label: t('nav.home') },
        { to: '/products', label: t('nav.products') },
        { to: '/contact', label: t('nav.contact') },
    ]), [t])
    return (
        <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV.map(n => (
                <NavLink
                    key={n.to}
                    to={n.to}
                    className={({ isActive }) => clsx('text-white/90 hover:text-white', isActive && 'font-semibold')}
                >
                    {n.label}
                </NavLink>
            ))}
            <LangToggle className="ml-1" />
        </nav>
    )
}

export default function Header() {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="w-full">
                <div className="rounded-none bg-brand-600/90 backdrop-blur shadow-soft ring-1 ring-white/20">
                    <div className="flex h-14 items-center justify-between px-4 sm:px-8">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src={LOGO}
                                alt="M PLUS logo"
                                className="h-8 w-8 rounded-md ring-1 ring-white/30 object-cover"
                                loading="eager"
                                decoding="async"
                            />
                            <span className="text-white font-semibold tracking-tight">{t('brand')}</span>
                        </Link>

                        <DesktopNav />

                        <button
                            onClick={() => setOpen(true)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            aria-label="Open menu"
                            aria-controls="mobileMenuPanel"
                            aria-expanded={open}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile: animated dropdown from header */}
            <Transition show={open} as={Fragment}>
                <Dialog onClose={setOpen} className="md:hidden relative z-[70]">
                    {/* Backdrop fade */}
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity duration-200 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                    </Transition.Child>

                    {/* Panel slides down from header edge (top-14) */}
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform transition-opacity duration-200 ease-out"
                        enterFrom="-translate-y-3 opacity-0"
                        enterTo="translate-y-0 opacity-100"
                        leave="transition-transform transition-opacity duration-150 ease-in"
                        leaveFrom="translate-y-0 opacity-100"
                        leaveTo="-translate-y-2 opacity-0"
                    >
                        <Dialog.Panel
                            id="mobileMenuPanel"
                            className="fixed inset-x-0 top-14 rounded-b-2xl bg-brand-700/95 ring-1 ring-white/20 p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                                    <img
                                        src={LOGO}
                                        alt=""
                                        className="h-7 w-7 rounded-md ring-1 ring-white/30 object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span className="font-semibold tracking-tight">{t('brand')}</span>
                                </Link>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                <Link to="/" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-white/90 hover:bg-white/10 hover:text-white">
                                    {t('nav.home')}
                                </Link>
                                <Link to="/products" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-white/90 hover:bg-white/10 hover:text-white">
                                    {t('nav.products')}
                                </Link>
                                <Link to="/contact" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-white/90 hover:bg-white/10 hover:text-white">
                                    {t('nav.contact')}
                                </Link>

                                <LangToggle className="mt-2 w-full" />
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </header>
    )
}
