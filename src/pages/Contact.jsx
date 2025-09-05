export default function Contact() {
    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact Us</h1>
                <p className="mt-2 text-slate-600">
                    Reach us on Telegram or Facebook — or through our direct contact info below.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Social & Info card */}
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">Stay Connected</h2>

                    {/* Social buttons */}
                    <div className="w-full h-auto py-6 flex items-center justify-start gap-4 flex-wrap">
                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/share/1GbcRSdnFc/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md shadow-gray-200 group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <svg
                                className="transition-all duration-300 group-hover:scale-110"
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 72 72"
                                fill="none"
                            >
                                <path
                                    d="M46.4927 38.6403L47.7973 30.3588H39.7611V24.9759C39.7611 22.7114 40.883 20.4987 44.4706 20.4987H48.1756V13.4465C46.018 13.1028 43.8378 12.9168 41.6527 12.8901C35.0385 12.8901 30.7204 16.8626 30.7204 24.0442V30.3588H23.3887V38.6403H30.7204V58.671H39.7611V38.6403H46.4927Z"
                                    fill="#337FFF"
                                />
                            </svg>
                        </a>

                        {/* Telegram */}
                        <a
                            href="https://t.me/keat888"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Telegram"
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md shadow-gray-200 group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <svg
                                className="transition-all duration-300 group-hover:scale-110"
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 72 72"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M61.03 36.015C61.03 49.8304 49.8304 61.03 36.015 61.03C22.1996 61.03 11 49.8304 11 36.015C11 22.1996 22.1996 11 36.015 11C49.8304 11 61.03 22.1996 61.03 36.015ZM38.4121 28.3392C34.1147 30.1955 21.7235 35.4671 21.7235 35.4671C18.7869 36.6551 20.5058 37.7688 20.5058 37.7688C20.5058 37.7688 23.0127 38.6599 25.1615 39.328C27.3103 39.9963 28.4563 39.2538 28.4563 39.2538C28.4563 39.2538 33.47 35.8384 38.5554 32.2002C42.1366 29.6757 41.2772 31.7547 40.4176 32.6457C38.5554 34.5762 35.4755 37.6204 32.897 40.0706C31.751 41.1101 32.324 42.001 32.8254 42.4465C34.2836 43.7256 37.718 46.0518 39.2773 47.1079C39.7093 47.4005 39.9974 47.5956 40.0596 47.6439C40.4176 47.941 42.4232 49.2774 43.6408 48.9804C44.8584 48.6834 45.0017 46.9757 45.0017 46.9757C45.0017 46.9757 45.9328 40.8873 46.7923 35.3186C46.9515 34.2252 47.1107 33.1548 47.2592 32.1567C47.645 29.5623 47.9582 27.4565 48.0099 26.7058C48.2248 24.1814 45.6463 25.2208 45.6463 25.2208C45.6463 25.2208 40.0596 27.5968 38.4121 28.3392Z"
                                    fill="#34AADF"
                                />
                            </svg>
                        </a>
                    </div>

                    {/* General info */}
                    <div className="mt-6 space-y-4 text-slate-700">
                        <p>
                            <span className="font-medium">Phone:</span>{" "}
                            <a href="tel:+85511300374" className="text-blue-600 hover:underline">
                                +855 (11) 300-374
                            </a>
                        </p>
                        <p>
                            {/*<span className="font-medium">Email:</span>{" "}*/}
                            {/*<a href="mailto:info@pureblue.example" className="text-blue-600 hover:underline">*/}
                            {/*    info@pureblue.example*/}
                            {/*</a>*/}
                        </p>
                        <p>
                            <span className="font-medium">Address:</span> Sangkat Toul Sangke, Phnom Penh City
                        </p>
                    </div>
                </div>

                {/* QR card */}
                <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-soft p-6">
                    <h2 className="text-xl font-semibold">Telegram QR</h2>
                    <p className="mt-2 text-slate-600">
                        Scan the QR below to connect with us on Telegram.
                    </p>
                    <div className="mt-4 w-full max-w-xs rounded-2xl bg-slate-50 overflow-hidden ring-1 ring-slate-200">
                        <img
                            src="https://res.cloudinary.com/dayrc0f7r/image/upload/v1757057941/IMG_1655_tg1vcf.jpg"
                            alt="Telegram QR"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
