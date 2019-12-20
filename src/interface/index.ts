import { ScopedSlot } from 'vue/types/vnode';

export interface RouterItem {
    name: string;
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


export interface DocumentTableData {
    key: string;
    name: string;
    description: string;
    editable: boolean;
}
export interface RemoteDocumentTableData {
    name: string;
    description: string;
}

export interface BankTableData {
    key: string;
    bankType: {
        key: string;
        label: string;
    };
    accountOpenedBranch: string;
    accountHolderName: string;
    bankAccountNumber: string;
    note: string;
    editable: boolean;
}

export interface RemoteBankTableData {
    bankNameId: string;
    accountOpenedBranch: string;
    bankAccountNumber: string;
    accountHolderName: string;
    note: string;
}

export interface ContractTableData {
    key: string;
    contractType: {
        key: string;
        label: string;
    };
    name: string;
    contractNum: string;
    note: string;
    issueDate: string;
    expireDate: string;
    editable: boolean;
}

export interface RemoteContractTableData {
    typeId: string;
    name: string;
    no: string;
    issueDate: string;
    expireDate: string;
    note: string;
}


export interface LegalTableData {
    legalType: {
        key: string,
        label: string,
    };
    legalNum: string;
    disable: boolean;
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


export interface RemoteCredntialTableData {
    typeId: string;
    name: string;
    issueDate: string;
    expireDate: string;
}

export interface CredntialTableData {
    key: string;
    name: string;
    credentialType: {
        key: string;
        label: string;
    };
    issueDate: string;
    editable: boolean;
    expireDate: any;
    employeeCredentialAttachments: RemoteAttachmentData[];
}

export interface EducationTableData {
    key: string;
    startedDate: string;
    endDate: string;
    major: string;
    schoolName: string;
    educationLevel: {
        key: string;
        label: string;
    };
    editable: boolean;
}

export interface WorkExperienceTableData {
    key: string;
    companyName: string;
    positionName: string;
    startedDate: string;
    endedDate: string;
    endedJobReason: string;
    salary: string;
    reference: string;
    referencePhoneNumber: string;
    editable: boolean;
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
    companyId: string;
    description: string;
    key?: string;
    children?: CascderOption[];
}
export interface CascderOptionItem {
    value: string;
    key: string;
    label: string;
    departmentId: string;
    description: string;
    companyId: string;
}
export interface CascderServerOption {
    name: string;
    subCompanies: any;
    departments: any;
}

export interface SelectValue {
    key: string;
    label: string;
}

export interface BasicDataOption {
    highEducationOption: SelectValue[];
    employeeOriginOption: SelectValue[];
    workpalceOption: SelectValue[];
    employeeTypeOption: SelectValue[];
    ethnicGroupOption: SelectValue[];
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

export interface BasicForm {
    num: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    birthOfDate: string;
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
    employeeType: {
        key: string;
        label: string;
    };
    ethnicGroupId: {
        key: string;
        label: string;
    };
    employeeStatus: string;
    personalAbilityDescription: string;
    dueDate: {
        check: boolean;
        date: any;
    };
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
    employeeType: {
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
    imageUrl: string;
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
    disable: boolean;
}

export interface Pagination {
    pageSize: number;
    total: number;
    current: number;
    onChange?: any;
    showSizeChanger?: boolean;
    pageSizeOptions?: string[];
    showSizeChange?: any;
    showTotal?: any;
}

export interface RemotePostionChangeRecord {
    id: string;
    employeePositionModificationClassifyName: string;
    employeePositionModificationTypeName: string;
    originalPositionFullPath: string;
    newPositionFullPath: string;
    lastOperatorDateTime: string;
    employeeStringID: string;
    employeeFullName: string;
    reason: string;
    employeeId: string;
    effectiveDate: string;
    employeePositionModificationTypeId: string;
    recordStateValue: number;
    recordStateName: string;
    workOrderNumber: string;
    isAllowModification: boolean;
    createDateTime: string;
}

export interface PositionReinstatedRecordData {
    id: string;
    effectiveDate: string;
    reason: string;
    employeeId: string;
    selectOption: SelectValue[];
}

export interface PositionDismissedRecordData {
    id: string;
    effectiveDate: string;
    reason: string;
    employeeId: string;
    selectOption: SelectValue[];
}
export interface PositionTransferRecordData {
    id: string;
    effectiveDate: string;
    selectOption: SelectValue[];
    employeeId: string;
}