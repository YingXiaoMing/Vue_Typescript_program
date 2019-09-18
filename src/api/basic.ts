import request from '@/utils/request';


export const getWorkLocation = () =>
    request({
        url: '/workingLocation',
        method: 'get',
    });
// 地址类型
export const getAddressTypeOption = () =>
    request({
        url: '/addressType',
        method: 'get',
    });
// 证书类型
export const getCredentialTypeOption = () =>
    request({
        url: '/credentialType',
        method: 'get',
    });

// 银行名称
export const getBankNameOption = () =>
    request({
        url: '/bankName',
        method: 'get',
    });

// 合同类型
export const getContractTypeOption = () =>
    request({
        url: '/contractType',
        method: 'get',
    });
// 最高学历
export const getEducationLevelOption = () =>
    request({
        url: '/educationLevel',
        method: 'get',
    });
// 关系
export const getRelationship = () =>
    request({
        url: '/relationship',
        method: 'get',
    });

// 民族
export const getethnicGroupOption = () =>
    request({
        url: '/ethnicGroup',
        method: 'get',
    });

// 电话类型
export const getPhoneTypeOption = () =>
    request({
        url: '/employeePhoneType',
        method: 'get',
    });
// 入职来源
export const getEmploymentSource = () =>
    request({
        url: '/employmentSource',
        method: 'get',
    });
// 工作性质
export const getEmploymentTypeOption = () =>
    request({
        url: '/EmployementType',
        method: 'get',
    });
// 调职类型
export const getEmployeePositionChangeType = () =>
    request({
        url: '/EmployeePositionChangeType/PositionTransfer',
        method: 'get',
    });

// 离职类型
export const getEmployeeEndJonType = () =>
    request({
        url: '/EmployeePositionChangeType/PositionEnded',
        method: 'get',
    });

// 证件类型
export const getLegalIdentiticationTypeOption = () =>
    request({
        url: '/legalIdentiticationType',
        method: 'get',
    });

// 员工职位信息
export const getOrginzationData = () =>
    request({
        url: '/CompanyOrganizationChart',
        method: 'get',
    });


// 获取第一页基本数据
export const getBasicInfoAllOption = () =>
    request({
        url: '/EmployeeBasicInfoAllOptionType',
        method: 'get',
    });



export const newBasicData = (url: string, params: any) =>
    request.post(url, params);

export const putBasicData = (url: string, params: any) =>
    request.put(url, params);

export const deleteBasicData = (url: string) =>
    request.delete(url);

// 获取奖惩分类
export const getPrizePenaltyClassify = () =>
    request({
        url: '/prizePenaltyTypeClassify',
        method: 'get',
    });

export const newPrizePenaltyClassify = (param: any) =>
    request.post('/PrizePenaltyType', param);

export const deletePrizePenaltyClassify = (id: string) =>
    request.delete('/PrizePenaltyType/' + id);

export const patchPrizePenaltyClassify = (id: string, param: any) =>
    request.put('/PrizePenaltyType/' + id, param);

// 获取全部奖惩分类
export const getAllPrizePenaltyClassify = () =>
    request({
        url: '/PrizePenaltyType/All',
        method: 'get',
    });

// 获取奖励类
export const getPrizePenaltyTypePrize = () =>
    request({
        url: '/PrizePenaltyType/Prize',
        method: 'get',
    });

// 获取惩罚类
export const getPrizePenaltyTypePenalty = () =>
    request({
        url: '/PrizePenaltyType/Penalty',
        method: 'get',
    });

// 获取全部加班出差请假分类
export const getAllBusinessClassify = () =>
    request({
        url: 'AskforLeaveOvertimeBusinesstripType/All',
        method: 'get',
    });

export const newBusinessClassify = (param: any) =>
    request.post('/AskforLeaveOvertimeBusinesstripType', param);

export const deleteBusinessClassify = (id: string) =>
    request.delete('/AskforLeaveOvertimeBusinesstripType/' + id);

export const patchBusinessClassify = (id: string, param: any) =>
    request.put('/AskforLeaveOvertimeBusinesstripType/' + id, param);

// 获取请假类型
export const getLeaveOptions = () =>
    request({
        url: '/AskforLeaveOvertimeBusinesstripType/AskforLeave',
        method: 'get',
    });

// 获取加班类型
export const getOvertimeOptions = () =>
    request({
        url: '/AskforLeaveOvertimeBusinesstripType/Overtime',
        method: 'get',
    });

// 获取出差类型
export const getBusinessOptions = () =>
    request({
        url: '/AskforLeaveOvertimeBusinesstripType/Businesstrip',
        method: 'get',
    });
