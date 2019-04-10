import { ScopedSlot } from 'vue/types/vnode';

export interface RouterItem {
    name?: string;
    component?: any;
    path: string;
    icon?: string;
    hidden?: boolean;
    redirect?: string | object;
    meta?: any;
    children?: RouterItem[];
}
export interface FormItem {
    type: string;
    label: string;
    param?: any;
    key: string;
}

export interface ColumnList {
    align?: 'left' | 'right' | 'center';
    dataIndex: string;
    key?: string;
// tslint:disable-next-line: ban-types
    customRender?: Function| ScopedSlot;
    title: string;
    width?: string | number;
    scopedSlots?: object;
}

export interface CascderOption {
    value: string;
    label: string;
    children?: CascderOption[];
}
export interface SelectValue {
    label: string;
    value: string;
}

export interface BasicData {
    name: string;
    id: string;
    isRequired: boolean;
}