import request from '@/utils/request';

// 新增员工第一页资料
export const newEmployeeBasicData = (params: any) =>
    request.post('/employee', params);

// 新增员工教育经历
export const newEmployeeEducationHistory = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/employeeEducationHistory', param);

// 获取员工教育经历
export const getEmployeeEducationHistory = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/employeeEducationHistory');

// 更新员工教育经历
export const putEmployeeEducationHistory = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/employeeEducationHistory/' + id, param);

// 删除员工教育经历
export const deleteEmployeeEducationHistory = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/employeeEducationHistory/' + id);

// 获取员工工作经历
export const getEmployeeWorkExperience = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/workExperience');

// 新增员工工作经历
export const newEmployeeWorkExperience = (employeeId: string, params: any) =>
    request.post('/employee/' + employeeId + '/workExperience', params);

// 更新员工工作经历
export const putEmployeeWorkExperience = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/workExperience/' + id, param);

// 删除员工工作经历
export const deleteEmployeeWorkExperience = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/workExperience/' + id);

// 新增员工证件资料
export const newEmployeeCredential = (employeeId: string, params: any) =>
    request.post('/employee/' + employeeId + '/employeecredential', params);

// 上传员工证件附件
export const newEmployeeCredentialAttachment = (employeeId: string, id: string, params: any) =>
    request.post('/employee/' + employeeId + '/employeecredential/' + id + '/Attachment', params);

// 获取员工证书资料
export const getEmployeeCredentialData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/employeecredential');

// 更新员工证书资料
export const putEmployeeCredentialData = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/employeecredential/' + id, param);

// 获取员工某一证书的所有附件
export const getEmployeeAttachmentById = (employeeId: string, id: string, pathName: string) =>
    request.get('/employee/' + employeeId + '/' + pathName +  '/' + id);

// 更新员工某一证书某一附件的文件描述
export const getEmployeeAttachmentDescriptionById = (employeeId: string, employeePropertyId: string, id: string, pathName: string, param: any) =>
    request.patch('/employee/' + employeeId + '/' + pathName + '/' + employeePropertyId + '/Attachment/' + id, param);

// 删除员工证书的附件
export const deleteEmployeeAttachment = (employeeId: string, employeePropertyId: string, id: string, pathName: string) =>
    request.delete('/employee/' + employeeId + '/' + pathName + '/' + employeePropertyId + '/Attachment/' + id);
// 新增员工附件
export const newEmployeeAttachment = (employeeId: string, employeePropertyId: string, pathName: string, params: any) =>
    request.post('/employee/' + employeeId + '/' + pathName + '/' + employeePropertyId + '/Attachment', params);

// 删除员工证书资料
export const deleteEmployeeCredentialData = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/employeecredential/' + id);

// 获取员工身份证件资料
export const getEmployeeLegalData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/legal_Id');

// 更新员工身份证件资料
export const putEmployeeLegalData = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/legal_Id/' + id, param);

// 新增员工身份证件资料
export const newEmployeeLegalData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/legal_Id', param);

// 删除员工身份证件资料
export const deleteEmployeeLegalData = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/legal_Id/' + id);

// 获取员工联系电话资料
export const getEmployeePhoneData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/employeePhoneNumber');

// 更新员工联系电话资料
export const putEmployeePhoneData = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/employeePhoneNumber/' + id, param);

// 新增员工联系电话资料
export const newEmployeePhoneData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/employeePhoneNumber', param);

// 删除员工联系电话资料
export const deleteEmployeePhoneData = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/employeePhoneNumber/' + id);

// 更换员工主号码
export const replaceeEmployeeMainPhoneNum = (employeeId: string, id: string) =>
    request.put('/employee/' + employeeId + '/employeePhoneNumber/SetDefault/' + id);

// 获取员工联系地址资料
export const getEmployeeContactAddressData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/contactAddress');

// 更新员工联系地址资料
export const putEmployeeContactAddressData = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/contactAddress/' + id, param);

// 新增员工联系地址资料
export const newEmployeeContactAddressData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/contactAddress', param);

// 删除员工联系地址资料
export const deleteEmployeeContactAddressData = (employeeId: string, id: string) =>
request.delete('/employee/' + employeeId + '/contactAddress/' + id);

// 获取员工紧急联系人资料
export const getEmployeeContractData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/emergencyContact');

// 更新员工紧急联系人资料
export const putEmployeeContractData = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/emergencyContact/' + id, param);

// 新增员工联系地址资料
export const newEmployeeContractData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/emergencyContact', param);

// 删除员工联系地址资料
export const deleteEmployeeContractData = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/emergencyContact/' + id);

// 新增员工职位
export const newEmployeePostionData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/position', param);

// 删除员工职位
export const deleteEmployeePostionData = (employeeId: string, positionId: string) =>
    request.delete('/employee/' + employeeId + '/position/' + positionId);

// 获取员工所有职位
export const getEmployeePositionData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/position');


// 查询员工资料
export const getEmployeeData = (params: any) =>
    request.get('/employee?' + params);

// 获取员工基本资料
export const getEmployeeBasicData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/BasicInfo');

// 更新员工基本资料
export const putEmployeeBasicData = (employeeId: string, param: any) =>
    request.patch('/employee/' + employeeId, param);


// 添加员工合同
export const addEmployeeContactData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/employeecontract', param);

// 上传员工合同附件
export const newEmployeeContactAttachment = (employeeId: string, id: string, params: any) =>
    request.post('/employee/' + employeeId + '/employeecontract/' + id + '/Attachment', params);

// 获取员工合同资料
export const getEmployeeContactData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/employeecontract');

// 更新员工合同资料
export const putEmployeeContactData = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/employeecontract/' + id, param);

// 删除员工合同资料
export const deleteEmployeeContactData = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/employeecontract/' + id);

// 添加员工银行资料
export const addEmployeeBankData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/employeebankaccount', param);

// 上传员工银行资料附件
export const newEmployeeBankAttachment = (employeeId: string, id: string, params: any) =>
    request.post('/employee/' + employeeId + '/employeebankaccount/' + id + '/Attachment', params);

// 获取员工银行资料
export const getEmployeeBankData = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/employeebankaccount');

// 更新员工银行资料
export const putEmployeeBankData = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/employeebankaccount/' + id, param);

// 删除员工银行资料
export const deleteEmployeeBankData = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/employeebankaccount/' + id);

// 添加员工相关文档
export const addEmployeeRelatedDocumentData = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/EmployeeRelatedDocument', param);

// 上传员工相关文档附件
export const newEmployeeRelatedDocumentAttachment = (employeeId: string, id: string, params: any) =>
    request.post('/employee/' + employeeId + '/EmployeeRelatedDocument/' + id + '/Attachment', params);

// 获取员工相关文档
export const getEmployeeRelatedDocument = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/EmployeeRelatedDocument');

// 更新员工相关文档
export const putEmployeeRelatedDocument = (employeeId: string, id: string, param: any) =>
    request.patch('/employee/' + employeeId + '/EmployeeRelatedDocument/' + id, param);

// 删除员工相关文档
export const deleteEmployeeRelatedDocument = (employeeId: string, id: string) =>
    request.delete('/employee/' + employeeId + '/EmployeeRelatedDocument/' + id);

// 查询员工姓名和工号
export const searchEmployeeData = (paramString: any) =>
    request.get('/employee/GetAllEmployeeBasic?' + paramString);




