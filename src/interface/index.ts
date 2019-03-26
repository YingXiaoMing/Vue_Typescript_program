export interface routerItem {
    name?: string,
    component?: any,
    path: string,
    icon?: string,
    hidden?: boolean,
    redirect?: string | object,
    meta?: any,
    children?: routerItem[]
}