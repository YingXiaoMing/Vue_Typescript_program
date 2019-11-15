import Cookie from 'js-cookie';

const employeeKey = 'editEmployeeId';


export const getEmployeeID = () => Cookie.get(employeeKey);
export const setEmployeeID  = (ID: string) => Cookie.set(employeeKey, ID);

