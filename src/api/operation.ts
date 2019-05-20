import request from '@/utils/request';
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
    request.get('/employee/' + employeeId + '/EmployeePositionDismissed');

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