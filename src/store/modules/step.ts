import _ from 'lodash';
const step = {
    state: {
        educationList: [],
        LegalList: [],
        phoneNumberList: [],
        contactAddressList: [],
        emergencyContactsList: [],
        positionList: [],
        basicData: {},
        employeeStatus: 1,
        newEmployeeStatus: 1,
        educationHistoryList: [],
        workExperienceList: [],
        credentialList: [],
        contractList: [],
        bankList: [],
        relatedDocumentList: [],
        editEmployeeId: '',
        newEmployeeId: '',
    },
    actions: {
        AddLegalList: (context: any, data: any) => {
            const { LegalList } = context.state;
            LegalList.push(data);
        },
        RemoveLegalList: (context: any, key: number | string ) => {
            const { LegalList } = context.state;
            const newLegalList = LegalList.filter((item: any) => !_.isEqual(key, item.key));
            context.dispatch('ReplaceLegalList', newLegalList);
        },
        ReplaceLegalList: (context: any, data: any) => {
            context.state.LegalList = data;
        },
        AddPhoneNumberList: (context: any, data: any) => {
            const { phoneNumberList } = context.state;
            phoneNumberList.push(data);
        },
        RemovePhoneNumberList: (context: any, key: number | string ) => {
            const { phoneNumberList } = context.state;
            const newList = phoneNumberList.filter((item: any) => !_.isEqual(key, item.key));
            context.dispatch('ReplacePhoneNumberList', newList);
        },
        ReplacePhoneNumberList: (context: any, data: any) => {
            context.state.phoneNumberList = data;
        },
        ReplaceContactAddressList: (context: any, data: any) => {
            context.state.contactAddressList = data;
        },
        RemoveContactAddressList: (context: any, key: number | string ) => {
            const { contactAddressList } = context.state;
            const newEmergencyContactsList = contactAddressList.filter((item: any) => !_.isEqual(key, item.key));
            context.dispatch('ReplaceContactAddressList', newEmergencyContactsList);
        },
        ReplaceEmergencyContactsList: (context: any, data: any) => {
            context.state.emergencyContactsList = data;
        },
        RemoveEmergencyContactsList: (context: any, key: number | string ) => {
            const { emergencyContactsList } = context.state;
            const newEmergencyContactsList = emergencyContactsList.filter((item: any) => !_.isEqual(key, item.key));
            context.dispatch('ReplaceEmergencyContactsList', newEmergencyContactsList);
        },
        ReplacePositionList: (context: any, data: any) => {
            context.state.positionList = data;
        },
        RemovePositionList: (context: any, key: number | string ) => {
            const { positionList } = context.state;
            const newPostionList = positionList.filter((item: any) => !_.isEqual(key, item.key));
            context.dispatch('ReplacePositionList', newPostionList);
        },
        GetBasicData: (context: any, newData: any) => {
            context.state.basicData = newData;
        },
        changeEmployeeStatus: (context: any, num: number) => {
            context.state.employeeStatus = num;
        },
        changeNewEmployeeStatus: (context: any, num: number) => {
            context.state.newEmployeeStatus = num;
        },
        ReplaceEducationHistoryList: (context: any, data: any) => {
            context.state.educationHistoryList = data;
        },
        ReplaceWorkExperienceList: (context: any, data: any) => {
            context.state.workExperienceList = data;
        },
        ReplaceCredentialList: (context: any, data: any) => {
            context.state.credentialList = data;
        },
        ReplaceContractList: (context: any, data: any) => {
            context.state.contractList = data;
        },
        ReplaceBankList: (context: any, data: any) => {
            context.state.bankList = data;
        },
        ReplaceRelatedDocumentList: (context: any, data: any) => {
            context.state.relatedDocumentList = data;
        },
        ChangeNewEmployeeId: (context: any, data: string) => {
            context.state.newEmployeeId = data;
        },
        ChangeEditEmployeeId: (context: any, data: string) => {
            context.state.editEmployeeId = data;
        },
        clearEmployeeDataList: (context: any) => {
            context.state.LegalList = [];
            context.state.phoneNumberList = [];
            context.state.contactAddressList = [];
            context.state.emergencyContactsList = [];
            context.state.positionList = [];
        },
    },
};
export default step;
