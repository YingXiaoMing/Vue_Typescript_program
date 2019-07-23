import { Component, Vue } from 'vue-property-decorator';
import { Collapse } from 'ant-design-vue';
import BasicTable from '@/components/BasicTable/index.vue';
import PrizeTable from '@/components/PrizeTable/index.vue';
import BusinessTable from '@/components/BusinessTable/index.vue';
import { getWorkLocation, getAddressTypeOption, getCredentialTypeOption,
    getBankNameOption, getContractTypeOption, getEducationLevelOption,
    getethnicGroupOption, getEmploymentSource, getLegalIdentiticationTypeOption,
    getRelationship, getPhoneTypeOption, getAllPrizePenaltyClassify, getAllBusinessClassify } from '@/api/basic';
import _ from 'lodash';
import { SelectValue } from '@/interface';
interface TableData {
    name: string;
    key: string;
    editable: boolean;
    isNew: boolean;
}
interface BasicForm {
    url: string;
    colName: string;
    tableList: any;
}
interface PrizeTableData {
    type: {
        key: string;
        label: string;
    };
    key: string;
    name: string;
    editable: boolean;
    isNew: boolean;
}
@Component({
    name: 'basic',
    components: {
        'a-collapse': Collapse,
        'a-collapse-panel': Collapse.Panel,
        'a-basic-table': BasicTable,
        'a-prize-table': PrizeTable,
        'a-business-table': BusinessTable,
    },
})
export default class Baisc extends Vue {
    private prizeDataList: PrizeTableData[] = [{
        type: {
            key: '',
            label: '',
        },
        name: '大功',
        editable: true,
        isNew: true,
        key: '1',
    }];
    private businessDataList: PrizeTableData[] = [];
    private prizePenaltyClassifyType: SelectValue[] = [];
    private businessClassifyType: SelectValue[] = [];
    private basicList: BasicForm[] = [{
        url: '/workingLocation',
        colName: '工作地点',
        tableList: [],
    }, {
        url: '/addressType',
        colName: '联系人地址类型',
        tableList: [],
    }, {
        url: '/credentialType',
        colName: '员工证书类型',
        tableList: [],
    }, {
        url: '/bankName',
        colName: '银行名称',
        tableList: [],
    }, {
        url: '/contractType',
        colName: '合同类型',
        tableList: [],
    }, {
        url: '/educationLevel',
        colName: '学历',
        tableList: [],
    }, {
        url: '/ethnicGroup',
        colName: '国籍/民族',
        tableList: [],
    }, {
        url: '/employmentSource',
        colName: '入职来源',
        tableList: [],
    }, {
        url: '/legalIdentiticationType',
        colName: '证件类型',
        tableList: [],
    }, {
        url: '/relationship',
        colName: '紧急联系人关系',
        tableList: [],
    }, {
        url: '/employeePhoneType',
        colName: '紧急联系人电话类型',
        tableList: [],
    }];
    private created() {
        this.fetchData();
    }
    private fetchData() {
        getWorkLocation().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 0);
            });
        });
        getAddressTypeOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 1);
            });
        });
        getCredentialTypeOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 2);
            });
        });
        getBankNameOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 3);
            });
        });
        getContractTypeOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 4);
            });
        });
        getEducationLevelOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 5);
            });
        });
        getethnicGroupOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 6);
            });
        });
        getEmploymentSource().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 7);
            });
        });
        getLegalIdentiticationTypeOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 8);
            });
        });
        getRelationship().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 9);
            });
        });
        getPhoneTypeOption().then((res) => {
            this.$nextTick(() => {
                this.packBasicData(res, 10);
            });
        });
        getAllPrizePenaltyClassify().then((res) => {
            let data: PrizeTableData[] = [];
            this.prizePenaltyClassifyType = _.map(res, (item: any) => {
                const newData =  _.map(item.prizePenaltyTypeDtos, (itm) => {
                    return {
                        type: {
                            key: item.prizePenaltyTypeClassifyValue,
                            label: item.prizePenaltyTypeClassifyDisplayName,
                        },
                        key: itm.id,
                        name: itm.name,
                        editable: false,
                        isNew: false,
                    };
                });
                data = _.concat(data, newData);
                return {
                    key: item.prizePenaltyTypeClassifyValue,
                    label: item.prizePenaltyTypeClassifyDisplayName,
                };
            });
            data.push({
                type: {
                    key: this.prizePenaltyClassifyType[0].key,
                    label: this.prizePenaltyClassifyType[0].label,
                },
                key: '1',
                name: '',
                editable: true,
                isNew: true,
            });
            this.prizeDataList = data;
        });
        getAllBusinessClassify().then((res) => {
            let data: PrizeTableData[] = [];
            this.businessClassifyType = _.map(res, (item: any) => {
                const newData = _.map(item.askforLeaveOvertimeBusinesstripTypeDtos, (itm: any) => {
                    return {
                        type: {
                            key: item.askforLeaveOvertimeBusinesstripTypeClassifyValue,
                            label: item.askforLeaveOvertimeBusinesstripTypeClassifyDisplayName,
                        },
                        key: itm.id,
                        name: itm.name,
                        editable: false,
                        isNew: false,
                    };
                });
                data = _.concat(data, newData);
                return {
                    key: item.askforLeaveOvertimeBusinesstripTypeClassifyValue,
                    label: item.askforLeaveOvertimeBusinesstripTypeClassifyDisplayName,
                };
            });
            data.push({
                type: {
                    key: this.businessClassifyType[0].key,
                    label: this.businessClassifyType[0].label,
                },
                key: '1',
                name: '',
                editable: true,
                isNew: true,
            });
            this.businessDataList = data;
        })
    }
    private packBasicData(res: any, nums: number) {
        const data = this.transformValueData(res);
        data.push({
            name: '',
            key: 'new_id_1',
            isNew: true,
            editable: true,
        });
        this.basicList[nums].tableList = data;
    }
    private transformValueData(data: any) {
        return _.map(data, (item) => {
            return {
                name: item.name,
                key: item.id,
                editable: false,
                isNew: false,
            };
        });
    }
    private renderBasicTable(data: BasicForm[]): Array<JSX.Element | null> {
        return data.map((item: BasicForm, index: number) => {
            const num = (index + 1).toString();
            return <a-collapse-panel header={item.colName} key={num}>
                        <a-basic-table tableList={item.tableList} colName={item.colName} url={item.url}/>
                    </a-collapse-panel>;
        });
    }
    private render() {
        return (
            <div class='container'>
                <a-collapse bordered={false} defaultActiveKey='1'>
                    {/* <a-collapse-panel header='工作地点设置' key='1'>
                        <a-basic-table tableList={this.tableList} colName='工作地点' url='/workingLocation'/>
                    </a-collapse-panel> */}
                    {this.basicList ? this.renderBasicTable(this.basicList) : null}
                    <a-collapse-panel header='奖惩分类' key='12'>
                        <a-prize-table tableList={this.prizeDataList} options={this.prizePenaltyClassifyType}></a-prize-table>
                    </a-collapse-panel>
                    <a-collapse-panel header='请假/加班/出差' key='13'>
                        <a-business-table tableList={this.businessDataList} options={this.businessClassifyType}></a-business-table>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        );
    }
}
