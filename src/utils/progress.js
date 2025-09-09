// Order-flow navigation helpers

export const isOrderPath = (path = "") => path.startsWith("/order");
export const isOrderTo = (to = "") => String(to).startsWith("/order");

/**
 * When on an order route with dirty state, confirm if navigating outside /order.
 */
export const shouldConfirmLeave = (pathname, to, dirty) =>
    isOrderPath(pathname) && !isOrderTo(to) && !!dirty;
