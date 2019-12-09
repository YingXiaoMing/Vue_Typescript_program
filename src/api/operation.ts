import request from '@/utils/request';
import t_request from '@/utils/t_request';

// 员工撤职
export const employeeDismissedPosition = (employeeId: string, param: any) =>
    request.put('/employee/' + employeeId + '/EmployeePositionDismissed', param);

// 查看员工被撤职的职位
export const getEmployeeDismissedPosition = (employeeId: string) =>
    t_request.get('/employee/' + employeeId + '/EmployeePositionModificationRecord/EmployeePositionReinstated');

// 查看员工调离职的记录
export const getEmployeeModificationRecord = ( param: any) =>
    request.get('/EmployeePositionModification/Collection?' + param);

// 根据记录ID来查询员工的操作记录
export const getEmployeeModificationByRecordId = (employeeId: string, recordId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionModification/' + recordId);

// 根据记录ID来更新员工的操作记录
export const putEmployeeModificationByRecordId = (employeeId: string, recordId: string, param: any) =>
    request.put('/employee/' + employeeId + '/EmployeePositionModification/' + recordId, param);


// 查询公司的组织架构
export const getCompanyOrganizationChart = () =>
    request.get('/CompanyOrganizationChart');

// 编辑公司
export const editCompanyData = (id: string, param: any) =>
    request.patch('/company/' + id, param);

// 编辑部门
export const editDepartmentData = (companyId: string, id: string, param: any) =>
    request.patch('/company/' + companyId + '/departments/' + id, param);

// 新增公司
export const newCompany = (param: any) =>
    request.post('/company', param);

// 新增部门
export const newDepartment = (companyId: string, param: any) =>
    request.post('/company/' + companyId + '/departments', param);

// 新增顶级部门
export const newHeadDeepartment = (companyId: string, param: any) =>
    request.post('/company/' + companyId + '/HeadDepartment', param);

// 删除公司
export const deleteCompany = (companyId: string) =>
    request.delete('/company/' + companyId);

// 删除部门
export const deleteDepartment = (companyId: string, departmentId: string) =>
    request.delete('/company/' + companyId + '/departments/' + departmentId);

// 编辑职位
export const editPosition = (companyId: string, departmentId: string, id: string, param: any) =>
    request.patch('/company/' + companyId + '/department/' + departmentId + '/Position/' + id, param);

// 获取职位信息
export const getPosition = (companyId: string, departmentId: string) =>
    request.get('/company/' + companyId + '/department/' + departmentId + '/Position');

// 删除职位
export const deletePosition = (companyId: string, departmentId: string, id: string) =>
    request.delete('/company/' + companyId + '/department/' + departmentId + '/Position/' + id);

// 新增职位
export const newPostion = (companyId: string, departmentId: string, param: any) =>
    request.post('/company/' + companyId + '/department/' + departmentId + '/Position', param);

// 新增员工奖惩
export const newPrizePenalty = (employeeId: string, param: any) =>
    request.post('/Employee/' + employeeId + '/PrizePenaltyRecord', param);

// 新增员工日常请假出差操作
export const newBusinesstrip = (employeeId: string, param: any) =>
    request.post('/Employee/' + employeeId + '/AskforLeaveOvertimeBusinesstrip', param);

// 查询员工调离职
export const searchPrizePenaltyRecord = (params: any) =>
    request.get('/PrizePenaltyRecord/Collection?' + params);

// 查询员工加班请假记录
export const searchBusinessRecord = (params: any) =>
    request.get('/AskforLeaveOvertimeBusinesstrip/Collection?' + params);

// 查看员工加班请假记录工单
export const getAskforLeaveOvertimeBusinesstripRecordByEmployeeId = (employeeId: string, recordId: string) =>
    request.get('/Employee/' + employeeId + '/AskforLeaveOvertimeBusinesstrip/' + recordId);

// 操作员工加班请假记录
export const operateBusinessRecord = (employeeId: string, id: string, params: any) =>
    request.patch('/Employee/' + employeeId + '/AskforLeaveOvertimeBusinesstrip/' + id, params);

// 修改员工奖惩
export const editPrizePenaltyRecord = (employeeId: string, id: string, params: any, headerObj: any) =>
    request.patch('/Employee/' + employeeId + '/PrizePenaltyRecord/' + id, params, { headers: headerObj });

// 查看员工奖惩记录工单
export const getPrizePenaltyRecordByEmployeeId = (employeeId: string, recordId: string) =>
    request.get('/Employee/' + employeeId + '/PrizePenaltyRecord/' + recordId);

// 查看员工撤职所需的职位
export const getEmployeePositionDismissedRecord = (employeeId: string, recordId: string) =>
request.get('/employee/' + employeeId + '/EmployeePositionDismissed/' + recordId + '/GetEmployeePositionForUpdatePositionDismissedRecord');


// 查询员工复职所需的职位
export const getEmployeePositionReinstatedRecord = (employeeId: string, recordId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionModificationRecord/' + recordId + '/EmployeePositionReinstated');

// 查询员工更新调职记录的职位
export const getEmployeePositionForUpdatePositionTransferRrcord = (employeeId: string, recordId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionModificationRecord/' + recordId + '/EmployeePositionTransfer');

// 查询员工更新撤职记录的职位
export const getEmployeePositionForUpdatePositionDismissedRecord = (employeeId: string, recordId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionModificationRecord/' + recordId + '/EmployeePositionDismissed');

// 更新员工加班请假出差记录
export const putAskforLeaveOvertimeBusinesstripRecord = (employeeId: string, recordId: string, param: any) =>
    request.put('/Employee/' + employeeId + '/AskforLeaveOvertimeBusinesstrip/' + recordId, param);

// 获取任职类型
export const getEmployeePositionDelegatedType = () =>
    request.get('/EmployeePositionModificationType/PositionDelegated');

// 获取撤职类型
export const getEmployeePositionDismissType = () =>
    request.get('/EmployeePositionModificationType/PositionDismiss');

// 获取复职类型
export const getEmployeePositionReinstatedType = () =>
    request.get('/EmployeePositionModificationType/PositionReinstated');

// 新增 调职/任职/离职类型数据
export const putEmployeePositionModification = (employeeId: string, param: any) =>
    request.put('/employee/' + employeeId + '/EmployeePositionModification', param);

export const getEmployeeToken = (url: string, param: any) =>
    t_request.post(url, param);

export const getEmployeeTokenByRrefreshToken = (url: string, param: any) =>
    t_request.post(url, param);

// 撤销奖惩记录工单
export const DeletePrizePenaltyRecord = (employeeId: string, recordId: string) =>
    request.delete('/employee/' + employeeId + '/PrizePenaltyRecord/' + recordId);

// 撤销考勤记录工单
export const DeleteAttendRecord = (employeeId: string, recordId: string) =>
    request.delete('/employee/' + employeeId + '/AskforLeaveOvertimeBusinesstrip/' + recordId);

// 撤销职位变更记录工单
export const DeletePositionRecord = (employeeId: string, recordId: string) =>
    request.delete('/employee/' + employeeId + '/EmployeePositionModification/' + recordId);
