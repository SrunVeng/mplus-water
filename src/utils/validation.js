import {isValidPhoneKH} from "./khPhone.js";

export function infoComplete(form) {
    return Boolean(
        form?.name &&
        form?.phoneRaw &&
        form?.province &&
        form?.district &&
        form?.commune
    );
}

export function cartHasItems(items) {
    return Array.isArray(items) && items.some(i => Number(i.quantity) > 0);
}

export function productsComplete(items) {
    if (!items || items.length === 0) return false;
    return items.every((it) => it.productId && Number(it.quantity) > 0);
}

export function continueFromProducts({
                                         items,
                                         setSteps,
                                         nav,
                                     }) {
    if (!productsComplete(items)) return;
    setSteps((s) => ({ ...s, info: true, products: true }));
    nav("/order/review");
}



export function validateInfoForm(form) {
    const isValidName = !!form.name && form.name.trim().length >= 2;
    const isValidPhone = isValidPhoneKH(form.phoneRaw);

    // Adjust this depending on your AddressFields implementation
    const isValidAddress =
        !!form.address || !!form.street || !!form.village || !!form.commune;

    return {
        isValidName,
        isValidPhone,
        isValidAddress,
        isInfoValid: isValidName && isValidPhone && isValidAddress,
    };
}


export function requestUserLocation(formUpdate, setLocation) {
    if (!navigator.geolocation) {
        formUpdate("geoStatus", "error");
        return;
    }
    formUpdate("geoStatus", "requesting");

    navigator.geolocation.getCurrentPosition(
        (pos) =>
            setLocation({
                lat: String(pos.coords.latitude),
                lng: String(pos.coords.longitude),
                geoSet: true,
                geoStatus: "success",
            }),
        () => formUpdate("geoStatus", "error"),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}

export function continueFromInfo({ form, setSteps, nav }) {
    const { isInfoValid } = validateInfoForm(form);
    if (!isInfoValid) return false;
    setSteps((s) => ({ ...s, info: true }));
    nav("/order/products");
    return true;
}