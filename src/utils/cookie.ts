import Cookie from 'js-cookie';

const employeeKey = 'editEmployeeId';

const accessTokenKey = 'access_token';


export const getEmployeeID = () => Cookie.get(employeeKey);
export const setEmployeeID  = (ID: string) => Cookie.set(employeeKey, ID);



// export const getAccessToke

