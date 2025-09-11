export default function CardShell({
                                      children,
                                      className = "",
                                      aspectRatio = "218 / 360",   // taller card
                                      shadow = "shadow-2xl",
                                      ring = "ring-1 ring-slate-200",
                                  }) {
    return (
        <div
            className={`relative w-full rounded-[20px] bg-white ${shadow} ${ring} ${className}`}
            style={{ aspectRatio }}
        >
            <div className="absolute inset-0 rounded-[20px] flex flex-col">
                {children}
            </div>
        </div>
    );
}
