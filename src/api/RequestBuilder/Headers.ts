export enum Headers {
    JSON,
    URL_ENCODED
}
export function intoRecord(header: Headers): Record<string, string> {
    switch(header) {
        case Headers.JSON:
            return { "Content-type": "application/json"}
        case Headers.URL_ENCODED:
            return { "Content-type": "x-www-form-urlencoded" }
        default:
            return { "Content-type": "application/json"}
    }
}