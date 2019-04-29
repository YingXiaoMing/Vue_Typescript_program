import { ScopedSlot } from 'vue/types/vnode';

export interface RouterItem {
    name?: string;
    component?: any;
    path: string;
    icon?: string;
    hidden?: boolean;
    isShow?: boolean;
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

export interface LegalTableData {
    legalType: {
        key: string,
        label: string,
    };
    legalNum: string;
    issueDate: string | null;
    expireDate: string | null;
    editable: boolean;
    isNew: boolean;
    key: string;
}
export interface RemoteLegalTableData {
    expireDate: string;
    id: string;
    idNumber: string;
    issueDate: string;
    typeId: string;
}

export interface PhoneNumTableData {
    phoneType: {
        key: string,
        label: string,
    };
    phoneNum: string;
    isRequired: string;
    editable: boolean;
    isNew: boolean;
    key: string;
}

export interface RemotePhoneNumTableData {
    id: string;
    isDefault: boolean;
    phoneNumber: {
        number: string;
    };
    typeId: string;
}

export interface AddressTableData {
    addressType: {
        key: string,
        label: string,
    };
    province: string;
    city: string;
    area: string;
    address: string;
    key: string;
    editable: boolean;
    isNew: boolean;
}

export  interface RemoteAddressTableData {
    id: string;
    typeId: string;
    address: {
        city: string;
        districtOrTown: string;
        provinceOrState: string;
        street: string;
    };
}

export interface EmergencyContractTableData {
    key: string;
    relationship: {
        key: string,
        label: string,
    };
    name: string;
    tel1: string;
    tel2: string;
    remark: string;
    editable: boolean;
    isNew: boolean;
}

export interface RemoteEmergencyContractTableData {
    id: string;
    name: string;
    note: string;
    phoneNumber1: string;
    phoneNumber2: string;
    relationshipId: string;
}

export interface PositionsTableData {
    editable: boolean;
    isNew: boolean;
    key: string;
    mainPosition: boolean;
    position: string;
    positionId: string;
    selectOption: string[];
}

export interface RemotePositionsTableData {
    departmentId: string;
    description: string;
    id: string;
    name: string;
    positionFullPath: string;
    positionFullPathIds: string[];
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
    key?: string;
    children?: CascderOption[];
}
export interface CascderOptionItem {
    value: string;
    key: string;
    label: string;
}
export interface CascderServerOption {
    name: string;
    subCompanies: any;
    departments: any;
}

export interface SelectValue {
    label: string;
    key: string;
}

export interface SelectValues {
    label: string;
    key: string;
}
export interface BasicData {
    name: string;
    id: string;
    isRequired: boolean;
}

export interface ContactAddressForm {
    typeId: string;
    address: {
        provinceOrState: string;
        city: string;
        districtOrTown: string;
        street: string;
    };
}

export interface EmergencyContactForm {
    name: string;
    phoneNumber1: string;
    phoneNumber2: string;
    note: string;
    relationshipId: string;
}

export interface RemoteBasicData {
    isHasPortrait: boolean;
    contactAddress: RemoteAddressTableData[];
    dateOfBirth: string;
    emergencyContacts: RemoteEmergencyContractTableData[];
    employeeStringID: string;
    employmentProbrationInfo: {
        probrationEndedDate: string;
    };
    employmentStartedInfo: {
        employmentSourceId: string;
        employmentStartedDate: string;
        employmentTypeId: string;
        referencePerson: string;
    };
    ethnicGroupId: string;
    firstName: string;
    genderValue: number;
    id: string;
    lastName: string;
    legal_Ids: RemoteLegalTableData[];
    highestEducationId: string;
    marriageStateValue: number;
    nickName: string;
    personalAbilityDescription: string;
    phoneNumbers: RemotePhoneNumTableData[];
    positions: RemotePositionsTableData[];
    principalPositionId: string;
    workingLocationId: string;
}

export interface LegalIdForm {
    typeId: string;
    idNumber: string;
    issueDate: string | null;
    expireDate: string | null;
}

export interface PhoneNumberForm {
    isDefault: boolean;
    typeId: string;
    phoneNumber: {
        number: string;
    };
}

export interface FormBasicData {
    firstName: string;
    lastName: string;
    nickName: string;
    dateOfBirth: string | null;
    marriageStateValue: number;
    ethnicGroupId: string;
    genderValue: number;
    personalAbilityDescription: string;
    workingLocationId: string;
    employeeStringID?: string;
    // employmentStateId: number;
    // principalPositionId: number;
    employmentStartedInfo: {
        employmentStartedDate: string | null;
        employmentSourceId: string;
        employmentTypeId: string;
        referencePerson: string;
    };
    highestEducationId: string;
    contactAddress: ContactAddressForm[];
    emergencyContacts: EmergencyContactForm[];
    legal_Ids: LegalIdForm[];
    phoneNumbers: PhoneNumberForm[];
    positionIds: string[];
    principalPositionId: string;
    employmentProbrationInfo: {
        probrationEndedDate: string | null;
    };
}
export interface LegalTableItem {
    legalType: {
        key: string,
        label: string,
    };
    legalNum: string;
    issueDate: string | null;
    expireDate: string | null;
    editable: boolean;
    isNew: boolean;
    key: number;
}

export interface ContactAddressItem {
    addressType: {
        key: string,
        label: string,
    };
    province: string;
    city: string;
    area: string;
    address: string;
    key: number;
    editable: boolean;
    isNew: boolean;
}

export interface PhoneNumItem {
    phoneType: {
        key: string,
        label: string,
    };
    phoneNum: string;
    isRequired: string;
    editable: boolean;
    isNew: boolean;
    key: number;
}

export interface EmergencyContactItem {
    key: number;
    relationship: {
        key: string,
        label: string,
    };
    name: string;
    tel1: string;
    tel2: string;
    remark: string;
    editable: boolean;
    isNew: boolean;
}

export interface PositionItem {
    editable: boolean;
    isNew: boolean;
    key: number;
    mainPosition: boolean;
    position: string;
    positionId: string;
    selectOption: string[];
}

export interface NewBasicForm {
    id?: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    birthOfDate: string | null;
    isMarried: number;
    highEducation: {
        key: string;
        label: string;
    };
    gender: number;
    employeeDate: string | null;
    employeeOrigin: {
        key: string;
        label: string;
    };
    employeeIntroducer: string;
    workplace: {
        key: string;
        label: string;
    };
    workNature: {
        key: string;
        label: string;
    };
    ethnicGroupId: {
        key: string;
        label: string;
    };
    personalAbilityDescription: string;
    dueDate: {
        check: boolean;
        date: string | null;
    };
}

export interface RemoteAttachmentData {
    id: string;
    attachmentInfo: {
        fileName: string;
    };
    description: string;
}


export interface AttachmentData {
    key: string;
    name: string;
    description: string;
    editable: boolean;
}

export interface Pagination {
    pageSize: number;
    total: number;
    onChange: any;
}
