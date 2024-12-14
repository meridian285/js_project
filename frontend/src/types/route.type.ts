
export type RouteType = {
    route: string,
    useLayout?: string | boolean,
    load(): void,
    styles?: string[],
    title?: string,
    scripts?: string[],
    filePathTemplate?: string
}