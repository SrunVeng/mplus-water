// QRUi/CurrencyLogo.jsx
export default function CurrencyLogo({
                                         size = 44,
                                         currency = "USD", // USD | KHR
                                         textColor = "white",
                                         className = "",
                                         style,
                                         withBorder = true,
                                         ...rest
                                     }) {
    const glyph = currency === "KHR" ? "៛" : "$";
    const fontSize = Math.round(size * 0.52);

    return (
        <div
            className={`grid place-items-center rounded-full ${className}`}
            style={{
                width: size,
                height: size,
                background: "#00526A",
                border: withBorder ? "4px solid #FFFFFF" : "none",
                ...style,
            }}
            {...rest}
        >
      <span
          style={{
              color: textColor,
              fontFamily:
                  "'Nunito Sans', system-ui, -apple-system, Segoe UI, Roboto, Arial",
              fontWeight: 800,
              lineHeight: 1,
              fontSize: 16,
          }}
      >
        {glyph}
      </span>
        </div>
    );
}
