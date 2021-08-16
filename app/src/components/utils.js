import { useEffect } from "react";

export function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
}

export function isValidPassword(password) {
    return String(password).length >= 10;
}

export function isValidOutwardPostcode(outwardPostcode) {
    return /^[A-Z]{1,2}[0-9][A-Z0-9]?$/.test(String(outwardPostcode).toUpperCase());
}

export function isValidReferenceId(refId) {
    return /^[0-9]{4,16}$/.test(refId);
}

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (f) => useEffect(f, []);
