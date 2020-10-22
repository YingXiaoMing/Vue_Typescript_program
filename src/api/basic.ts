import request from '@/utils/request';
import x_request from '@/utils/u_request';

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
        url: '/EmployeePositionModificationType/PositionTransfer',
        method: 'get',
    });

// 离职类型
export const getEmployeeEndJonType = () =>
    request({
        url: '/EmployeePositionModificationType/PositionEnded',
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

export const getBasicDataTypeOption = (url: string) =>
    request({
        url,
        method: 'get',
    });


export const newBasicData = (url: string, params: any) =>
    request.post(url, params);

export const patchBasicData = (url: string, params: any, headerObj: any) =>
    request.patch(url, params, { headers: headerObj });

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


// 上传EXCEL附件

export const uploadExcelFile = (url: string, param: any) =>
    x_request({
        url,
        method: 'post',
        responseType: 'arraybuffer',
        data: param,
    });


// 获取有薪假强制提醒信息
export const GetAskforLeaveOvertimeBusinesstripExpirationStatistics = () =>
    request({
        url: '/InstrumentPanel/GetAskforLeaveOvertimeBusinesstripExpirationStatistics',
        method: 'get',
    });


// 获取首页合同情况
export const GetContractExpirationData = () =>
    request({
        url: '/InstrumentPanel/GetContractExpirationStatistics',
        method: 'get',
    });

// 获取首页合同列表数据
export const GetContractExpirationList = (paramString: string) =>
    request({
        url: '/InstrumentPanel/GetContractExpirationList?' + paramString,
        method: 'get',
    });

// 获取首页试用期到期的员工
export const GetEmploymentProbrationExpirationStatistics = () =>
    request({
        url: '/InstrumentPanel/GetEmploymentProbrationExpirationStatistics',
        method: 'get',
    });

// 获取首页试用期到期员工列表数据
export const getEmploymentProbrationExpirationStatisticsList = (paramString: string) =>
    request({
        url: '/InstrumentPanel/GetEmploymentProbrationExpirationList?' + paramString,
        method: 'get',
    });

// 获取首页证书到期情况数据
export const getCredentialExpirationStatistics = () =>
    request({
        url: '/InstrumentPanel/GetCredentialExpirationStatistics',
        method: 'get',
    });

// 获取首页证书到期情况列表数据
export const getCredentialExpirationStatisticsList = (paramString: string) => 
    request({
        url: '/InstrumentPanel/GetCredentialExpirationList?' + paramString,
        method: 'get',
    })