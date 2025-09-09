// src/context/OrderProgressContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const OrderProgressContext = createContext(null);

export function OrderProgressProvider({ children }) {
    // You can hydrate these from persisted state if needed.
    const [steps, setSteps] = useState({
        info: false,
        products: false,
        review: false,
        payment: false,
    });

    const maxAllowedStep = useMemo(() => {
        if (!steps.info) return 1;
        if (!steps.products) return 2;
        if (!steps.review) return 3;
        return 4; // payment allowed
    }, [steps]);

    const value = { steps, setSteps, maxAllowedStep };
    return <OrderProgressContext.Provider value={value}>{children}</OrderProgressContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrderProgress() {
    const ctx = useContext(OrderProgressContext);
    if (!ctx) throw new Error("useOrderProgress must be used within OrderProgressProvider");
    return ctx;
}
