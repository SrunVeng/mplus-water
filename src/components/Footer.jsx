import { LOGO } from '../data/imgLink.js'
import { useTranslation } from 'react-i18next'

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="mt-16">
            <div className="w-full">
                <div className="rounded-none bg-brand-700/90 backdrop-blur ring-1 ring-white/20 shadow-soft">
                    <div className="px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={LOGO}
                                alt="logo"
                                className="h-8 w-8 rounded-md ring-1 ring-white/30 object-cover"
                            />
                            <p className="text-white/90 text-sm">
                                {t('footer.tagline')}
                            </p>
                        </div>
                        <p className="text-white/80 text-sm">
                            © {new Date().getFullYear()} {t('brand')}. {t('footer.copyright')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
