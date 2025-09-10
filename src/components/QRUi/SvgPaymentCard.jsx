import React from "react";

export default function SvgPaymentCard({ children, className = "" }) {
    // Native size: 218 × 316. Scales responsively while preserving aspect ratio.
    return (
        <div className={`relative w-full ${className}`} style={{ aspectRatio: "218 / 316" }}>
            <svg
                viewBox="0 0 218 316"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
            >
                <g filter="url(#filter0_d_0_826)">
                    <path
                        d="M190 11H28C18.6112 11 11 18.6112 11 28V288C11 297.389 18.6112 305 28 305H190C199.389 305 207 297.389 207 288V28C207 18.6112 199.389 11 190 11Z"
                        fill="white"
                    />
                </g>

                {/* HTML content inside the rounded card via foreignObject */}
                <foreignObject
                    x="11"
                    y="11"
                    width="196"
                    height="296"
                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                >
                    <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        className="w-full h-full rounded-[20px] overflow-visible flex flex-col"
                    >
                        {children}
                    </div>
                </foreignObject>

                <defs>
                    <filter
                        id="filter0_d_0_826"
                        x="0.132501"
                        y="0.132501"
                        width="217.735"
                        height="315.735"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="5.43375" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_826" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_826" result="shape" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
}
