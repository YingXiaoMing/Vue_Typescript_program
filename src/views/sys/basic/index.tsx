import { Component, Vue } from 'vue-property-decorator';
import { Collapse } from 'ant-design-vue';
import BasicTable from '@/components/BasicTable/index.vue';
import { getWorkLocation, getAddressTypeOption, getCredentialTypeOption, getBankNameOption, getContractTypeOption, getEducationLevelOption } from '@/api/basic';
import _ from 'lodash';
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
@Component({
    name: 'basic',
    components: {
        'a-collapse': Collapse,
        'a-collapse-panel': Collapse.Panel,
        'a-basic-table': BasicTable,
    },
})
export default class Baisc extends Vue {
    private workLocationList: TableData[] = [];
    private addressTypeList: TableData[] = [];
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
        colName: '证件类型',
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
                </a-collapse>
            </div>
        );
    }
}
