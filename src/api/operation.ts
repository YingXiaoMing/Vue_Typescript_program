import request from '@/utils/request';
import t_request from '@/utils/t_request';


// 员工调职操作
export const employeeTransferPosition = (employeeId: string, param: any ) =>
    request.put('/employee/' + employeeId + '/EmployeePositionTransfer', param);
// 员工离职操作
export const employeeLeavePosition = (employeeId: string, param: any) =>
    request.put('/employee/' + employeeId + '/PositionEnded', param);
// 员工撤职
export const employeeDismissedPosition = (employeeId: string, param: any) =>
    request.put('/employee/' + employeeId + '/EmployeePositionDismissed', param);

// 员工复职
export const employeeRenistatedPosition = (employeeId: string, param: any) =>
    request.put('/employee/' + employeeId + '/EmployeePositionReinstated', param);

// 查看员工被撤职的职位
export const getEmployeeDismissedPosition = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionReinstated/GetEmployeePositionToPositionReinstated');

// 查看员工调离职的记录
export const getEmployeeModificationRecord = (employeeId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionModificationRecord');

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
    request.post('/Employee/' + employeeId + '/PrizePenalty', param);

// 新增员工日常请假出差操作
export const newBusinesstrip = (employeeId: string, param: any) =>
    request.post('/Employee/' + employeeId + '/AskforLeaveOvertimeBusinesstrip', param);

// 查询员工调离职
export const searchPrizePenaltyRecord = (params: any) =>
    request.get('/PrizePenaltyRecord?' + params);

// 查询员工加班请假记录
export const searchBusinessRecord = (params: any) =>
    request.get('/AskforLeaveOvertimeBusinesstripRecord?' + params);

// 操作员工加班请假记录
export const operateBusinessRecord = (employeeId: string, id: string, params: any) =>
    request.patch('/Employee/' + employeeId + '/AskforLeaveOvertimeBusinesstrip/' + id, params);

// 修改员工奖惩
export const editPrizePenaltyRecord = (employeeId: string, id: string, params: any) =>
    request.patch('/Employee/' + employeeId + '/PrizePenalty/' + id, params);


// 员工任职
export const newEmployeePositionDelegated = (employeeId: string, param: any) =>
    request.post('/employee/' + employeeId + '/PositionDelegated', param);


// 查看员工撤职所需的职位
export const getEmployeePositionDismissedRecord = (employeeId: string, recordId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionDismissed/' + recordId + '/GetEmployeePositionForUpdatePositionDismissedRecord');


// 查询员工复职所需的职位
export const getEmployeePositionReinstatedRecord = (employeeId: string, recordId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionReinstated/' + recordId + '/GetEmployeePositionForUpdateEmployeePositionReinstatedRecord');

// 更新员工复职记录
export const updateEmployeePositionReinstatedRecord = (employeeId: string, recordId: string, param: any) =>
    request.put('/employee/' + employeeId + '/EmployeePositionReinstated/' + recordId + '/UpdateEmployeePositionReinstatedRecord', param);

// 查询员工调职所需的职位
export const getEmployeePositionTransferRecord = (employeeId: string, recordId: string) =>
    request.get('/employee/' + employeeId + '/EmployeePositionTransfer/' + recordId + '/GetEmployeePositionForUpdatePositionTransferRrcord');


export const getEmployeeToken = (url: string, param: any) =>
    t_request.post(url, param);

export const getEmployeeTokenByRrefreshToken = (url: string, param: any) =>
    t_request.post(url, param);
