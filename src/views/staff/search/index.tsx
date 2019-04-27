import { Component, Vue } from 'vue-property-decorator';
import { Row, Col, Form, AutoComplete, Button, Select } from 'ant-design-vue';
import SearchTable from './searchTable.vue';
import { getEmployeeData, searchEmployeeData } from '@/api/staff';
import URLSearchParams from 'url-search-params';
import _ from 'lodash';
import './index.less';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
}
@Component({
    name: 'staffsearch',
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-autoComplete': AutoComplete,
        'a-button': Button,
        'a-seach-table': SearchTable,
        'a-select-option': Select.Option,
    },
    props: {
        Form: Object,
    },
})
export default class Search extends Vue {
    private employeeDataList: EmployeeData[] = [];
    private basicItemLayout = {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
    };
    private basicItemLayout2 = {
        lg: {span: 6},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private form: any;
    private tabData: any = [];
    private searchLoading: boolean = false;
    private $form: any;
    private created() {
        this.form = this.$form.createForm(this);
    }
    private searchData() {
        this.searchLoading = true;
        getEmployeeData({
            employeeStringIdOrFullName: '',
            pageIndex: 1,
            pageSize: 5,
        }).then((res) => {
            this.tabData = _.map(res, (item) => {
                return {
                    key: item.id,
                    id: item.employeeStringID,
                    name: item.fullName,
                    gender: item.genderValue === 1 ? '男' : '女',
                    num: item.id,
                };
            });
            this.searchLoading = false;
        });
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        searchEmployeeData(params.toString()).then((res) => {
            this.employeeDataList = _.map(res, (item) => {
                return {
                    value: item.id,
                    text: item.employeeStringID + '-' + item.fullName,
                    id: item.id,
                };
            });
        });
    }
    private createdEmployeeOptions(data: EmployeeData[]) {
        if (this.employeeDataList.length > 0) {
            return <a-select-option>123</a-select-option>;
        } else {
            return null;
        }
    }
    private render() {
        const { getFieldDecorator } = this.form;
        return (
            <div class='wrapper'>
                <div class='staff-head'>
                    <a-row gutter={24}>
                        <a-col { ... {props: this.basicItemLayout}}>
                            <a-form-item {... this.fromItemLayout}>
                                <a-autoComplete placeholder='请输入姓名或工号进行智能搜索'
                                onSearch={this.handleChange}
                                scopedSlots={{ dataSource: (ref: any) => <a-select-option key='21'>喜新恋旧</a-select-option> }}></a-autoComplete>
                            </a-form-item>
                        </a-col>
                        <a-col {... {props: this.basicItemLayout2}}>
                            <a-form-item>
                                <a-button type='primary' on-click={this.searchData}>快速查询</a-button>
                                {/* <a-button type='primary' style='marginLeft: 15px'>高级查询</a-button> */}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-seach-table tabList={this.tabData} loading={this.searchLoading}/>
                    </a-row>
                </div>
            </div>
        );
    }
}
