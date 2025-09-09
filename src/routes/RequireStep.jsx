// src/routes/RequireStep.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOrderProgress } from "../context/OrderProgressContext";

const STEP_TO_ID = {
    info: 1,
    products: 2,
    review: 3,
    payment: 4,
};

const ID_TO_PATH = {
    1: "/order/info",
    2: "/order/products",
    3: "/order/review",
    4: "/order/payment",
};

export default function RequireStep({ requiredStepId, children }) {
    const { maxAllowedStep } = useOrderProgress();
    const location = useLocation();

    if (maxAllowedStep < requiredStepId) {
        // Redirect to the next allowed step
        return <Navigate to={ID_TO_PATH[maxAllowedStep]} replace state={{ from: location }} />;
    }
    return children;
}
