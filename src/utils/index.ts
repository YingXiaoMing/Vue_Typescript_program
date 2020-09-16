import { CascderOption, CascderOptionItem, RemoteCompanyOrgaizationData, RemoteSubCompanyData, RemoteSubDepartmentData } from '@/interface';
import _ from 'lodash';
export function routeToArray(route: string): { routeArr: string[], params: string } {
    if (!route) {
        return {
            routeArr: [],
            params: '',
        };
    }
    const arr: string[] = route.split('/');
    const ret: string[] = [];
    let params = '';
    arr.shift();
    arr.forEach((item, index) => {
        if (parseInt(item, 10)) {
            params = item;
            return;
        }
        ret.push(index ? item : `/${item}`);
    });
    return {
        routeArr: ret,
        params,
    };
}
export function conversionOrganizationData(remoteData: RemoteCompanyOrgaizationData, option: any): CascderOption[] {
    const Options: CascderOption[] = [];
    const TopParentNode: CascderOption = {
        value: remoteData.id,
        label: remoteData.name,
        companyId: remoteData.id,
        description: 'company',
        children: [],
    };
    if (remoteData.subCompanies) {
        traverseStepNodechilden(remoteData.subCompanies, TopParentNode, 'company', option);
    }
    if (remoteData.departments) {
        traverseStepNodechilden(remoteData.departments, TopParentNode, 'department', option);
    }
    Options.push(TopParentNode);
    return Options;
}
function traverseStepNodechilden(data: RemoteSubCompanyData[] | RemoteSubDepartmentData[], TopParentNode: CascderOption, descriptionName: string, option: any) {
    if (data) {
        data.forEach((node: any, index: number) => {
            index ++;
            const childrenNode: CascderOption = {value: node.id, label: node.name, children: [], description: descriptionName, companyId: ''};
            if (_.isEqual(descriptionName, 'company')) {
                childrenNode.companyId = node.id;
            } else if (_.isEqual(descriptionName, 'department')) {
                childrenNode.companyId = node.companyId;
            }
            childrenNode.label = node.name;
            childrenNode.value = node.id;
            if (node.subCompanies) {
                traverseStepNodechilden(node.subCompanies, childrenNode, 'company', option);
            }
            if (node.departments) {
                traverseStepNodechilden(node.departments, childrenNode, 'department', option);
            }
            if (node.subDepartments) {
                traverseStepNodechilden(node.subDepartments, childrenNode, 'department', option);
            }
            if (node.positions) {
                // tslint:disable-next-line:no-shadowed-variable
                node.positions.forEach((node: any, index: number) => {
                    index ++;
                    if ( option.isOperation && _.isEqual(option.positionId, node.id)) {
                        option.callback({
                            positionId: node.id,
                            companyId: TopParentNode.companyId,
                            departmentId: node.departmentId,
                        });
                    }
                    const object: CascderOptionItem = {
                        value: node.id,
                        label: node.name,
                        key: node.id,
                        departmentId: node.departmentId,
                        description:  'position',
                        companyId: TopParentNode.companyId,
                    };
                    if (childrenNode.children) {
                        childrenNode.children.push(object);
                    }
                });
            }
            if (TopParentNode.children) {
                TopParentNode.children.push(childrenNode);
            }
        });
    }
}
// 懒加载
export function lazyLoadView(view: any) {
    return () => import(`@/views/${view}`);
}



// 获取路由器的url参数

export function getQueryObject(url?: string): {id_token: string} {
    const newUrl = url == null ? window.location.href : url;
    const search = newUrl.substring(newUrl.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (sa: any, $1: any, $2: any) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return sa;
    });
    return obj;
} 

