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
