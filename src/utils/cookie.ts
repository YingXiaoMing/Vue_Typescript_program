import Cookie from 'js-cookie';

const employeeKey = 'editEmployeeId';

const accessTokenKey = 'access_token';

const userNameKey = 'userName';


export const getEmployeeID = () => Cookie.get(employeeKey);
export const setEmployeeID  = (ID: string) => Cookie.set(employeeKey, ID);




export const getUserName = () => Cookie.get(userNameKey);

export const setUserName = (name: string) => Cookie.set(userNameKey, name);

// export const getAccessToke

