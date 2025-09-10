import React, { createContext, useContext, useMemo, useReducer } from "react";
import { PRODUCT_CATALOG } from "../data/products";
import { calcDeliveryFee } from "../utils/delivery";

const OrderContext = createContext(null);

const initialState = {
    // Step 1 — info
    form: {
        name: "", phoneRaw: "", email: "",
        province: "", district: "", commune: "", street: "", village: "",
        lat: "", lng: "", geoSet: false, geoStatus: "idle",
    },
    // Step 2 — items
    items: [{ id: crypto.randomUUID(), productId: PRODUCT_CATALOG[0].id, quantity: 1 }],
    // Flags
    dirty: false,     // marks in-progress transaction
};

function reducer(state, action) {
    switch (action.type) {
        case "FORM_UPDATE":
            return { ...state, dirty: true, form: { ...state.form, [action.field]: action.value } };
        case "SET_LOCATION":
            return { ...state, dirty: true, form: { ...state.form, ...action.location } };
        case "ITEM_ADD":
            return {
                ...state,
                dirty: true,
                items: [...state.items, { id: crypto.randomUUID(), productId: PRODUCT_CATALOG[0].id, quantity: 1 }],
            };
        case "ITEM_UPDATE":
            return {
                ...state,
                dirty: true,
                items: state.items.map((it) => (it.id === action.id ? { ...it, ...action.patch } : it)),
            };
        case "ITEM_REMOVE":
            return {
                ...state,
                dirty: true,
                items: state.items.length > 1 ? state.items.filter((it) => it.id !== action.id) : state.items,
            };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}

export function OrderProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const catalogById = useMemo(
        () => Object.fromEntries(PRODUCT_CATALOG.map(p => [p.id, p])),
        []
    );

    const enriched = useMemo(() => state.items.map(it => {
        const p = catalogById[it.productId];
        const qty = Math.max(1, Number(it.quantity) || 1);
        const price = p?.price ?? 0;
        return { ...it, product: p, qty, lineTotal: qty * price };
    }), [state.items, catalogById]);

    const amount = useMemo(() => enriched.reduce((s, it) => s + it.lineTotal, 0), [enriched]);
    const deliveryFee = useMemo(() => calcDeliveryFee(amount, state.form.province), [amount, state.form.province]);
    const grandTotal = amount + deliveryFee;

    const api = {
        state, catalogById, enriched, amount, deliveryFee, grandTotal,
        formUpdate: (field, value) => dispatch({ type: "FORM_UPDATE", field, value }),
        setLocation: (location) => dispatch({ type: "SET_LOCATION", location }),
        addItem: () => dispatch({ type: "ITEM_ADD" }),
        updateItem: (id, patch) => dispatch({ type: "ITEM_UPDATE", id, patch }),
        removeItem: (id) => dispatch({ type: "ITEM_REMOVE", id }),
        reset: () => dispatch({ type: "RESET" }),
    };

    return <OrderContext.Provider value={api}>{children}</OrderContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrder() {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error("useOrder must be used within OrderProvider");
    return ctx;
}
