import { useEffect } from "react";

// Native confirm on tab close/refresh if transaction is dirty
export function useLeaveConfirm(isDirty) {
    useEffect(() => {
        if (!isDirty) return;
        const handler = (e) => {
            e.preventDefault();
            e.returnValue = ""; // shows browser prompt
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);
}
