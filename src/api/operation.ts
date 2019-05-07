import request from '@/utils/request';

export const employeeTransferPosition = (employeeId: string, param: any ) =>
    request.put('/employee/' + employeeId + '/EmployeePositionTransfer', param);

export const employeeLeavePosition = (employeeId: string, param: any) =>
    request.put('/employee/' + employeeId + '/PositionEnded', param);
