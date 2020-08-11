<template>
    <div class='wrapper'>
        <div class='staff-head'>
                <a-row :gutter="24">
                    <a-form :form="form">
                    <a-col :lg="8" :md="12" :sm="24">
                        <a-form-item>
                            <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
                            @search="handleChange" @select="onSelect" @focus="focusHandle">
                                <template slot="dataSource">
                                    <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                                </template>
                                    <a-input @change="e => valueChange(e.target.value)"></a-input>
                            </a-auto-complete>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="4">
                        <a-form-item>
                            <a-checkbox v-decorator="['IsIncludeTerminated', { valuePropName: 'checked', initialValue: false }]">包含离职员工</a-checkbox>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="12" :md="12" :sm="24">
                        <a-form-item>
                            <a-button type="primary" @click="search">快速查询</a-button>
                            <a-button type="primary" style='marginLeft:15px' @click="detailSearch">高级查询</a-button>
                            <a-button type="primary" style='marginLeft:15px' icon="export" @click="basicExport">导出基本资料</a-button>
                            <a-button type="primary" style='marginLeft:15px' icon="export" @click="detailExport">导出详细资料</a-button>
                        </a-form-item>
                    </a-col>
                    </a-form>
                </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-search-table :loading="searchLoading" :tabList="tabData" :paginationData="pagination" @tableChange="pageChange"></a-search-table>
                </a-col>
            </a-row>
            <a-modal okText="查询" width="1040px" :visible="visible" @cancel="cancelHandle" @ok="okHandle" :destroyOnClose="true">
                <a-spin :spinning="tloading">
                    <a-form-modal ref="dialog" @loadFormModalData="loadFormModalData"></a-form-modal>
                </a-spin>
            </a-modal>
            <a-detail-modal :visible="exportModal.visible" @cancel="detailCancelHandle" 
            :propsData="exportModal.data" @ok="downloadExcelData"></a-detail-modal>
        </div>
        
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Row, Col, Form, AutoComplete, Select, Button, Input } from 'ant-design-vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import SearchTable from './searchTable.vue';
import { getEmployeeData, searchEmployeeData } from '@/api/staff';
import FormModal from '@/components/FormModal/index.vue';
import config from '@/utils/config';
import DetailModal from './searchModal.vue';
import { Pagination } from '@/interface';
import _ from 'lodash';
import './index.less';
import moment from 'moment';
import { message } from 'ant-design-vue';

interface EmployeeData {
    value: string;
    text: string;
    id: string;
}
interface TargetData {
    isDefault: boolean;
    phoneNumber: {
        number: string;
    };
}
interface FilterSort {
    name: string;
    title: string;
    isSelect: boolean;
}
interface ExportModal {
    visible: boolean;
    data: FilterSort[];
}
@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-search-table': SearchTable,
        'a-form-item': Form.Item,
        'a-select-option': Select.Option,
        'a-auto-complete': AutoComplete,
        'a-button': Button,
        'a-input': Input,
        'a-form-modal': FormModal,
        'a-detail-modal': DetailModal,
    },
    name: 'staffSearch',
})
export default class Search extends Vue {
    public $refs!: {
        dialog: HTMLFormElement,
    };
    private searchParams: URLSearchParams = new URLSearchParams();
    private exportButton: string = 'basic';
    private searchValue: string = '';
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15'],
        // onChange: (current: number, pageSize: number) => this.pageChange,
        showTotal: this.showTotal,
    };
    private form: any;
    private $form: any;
    private tloading: boolean = false;
    private visible: boolean = false;
    private tabData: any = [];
    private dateFormat = 'YYYY-MM-DD';
    private searchLoading: boolean = false;
    private searchKey: string = '';
    private employeeDataList: EmployeeData[] = [];
    private exportModal: ExportModal = {
        visible: false,
        data: [],
    };
    private created() {
        this.form = this.$form.createForm(this, {
            IsIncludeTerminated: false,
        });
        this.fetch('');
    }
    private showTotal(total: string, range: any) {
        return  `总记录数: ${total}条`;
    }
    private detailSearch() {
        this.visible = true;
        this.tloading = true;
    }
    private basicExport() {
        this.exportButton = 'basic';
        this.exportModal = {
            visible: true,
            data: [{
                name: 'IsExportEmployeeLastName',
                title: '员工姓',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeFirstName',
                title: '员工名',
                isSelect: false,
            }, {
                name: 'IsExportDateOfBirth',
                title: '出生日期',
                isSelect: false,
            }, {
                name: 'IsExportMarriage',
                title: '婚否',
                isSelect: false,
            }, {
                name: 'IsExportEthnicGroup',
                title: '种族',
                isSelect: false,
            }, {
                name: 'IsExportGender',
                title: '性别',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeLegal_id',
                title: '身份证件信息',
                isSelect: false,
            }, {
                name: 'IsExportHighestEducation',
                title: '最高学历',
                isSelect: false,
            }, {
                name: 'IsExportPersonalAbilityDescription',
                title: '能力&特长',
                isSelect: false,
            }, {
                name: 'IsExportEmploymentStartedDate',
                title: '入职日期',
                isSelect: false,
            }, {
                name: 'IsExportEmploymentSource',
                title: '入职来源',
                isSelect: false,
            }, {
                name: 'IsExportReferencePerson',
                title: '介绍人',
                isSelect: false,
            }, {
                name: 'IsExportWorkingLocation',
                title: '工作地点',
                isSelect: false,
            }, {
                name: 'IsExportEmploymentType',
                title: '工作性质',
                isSelect: false,
            }, {
                name: 'IsExportProbrationEndedDate',
                title: '试用期截至',
                isSelect: false,
            }, {
                name: 'IsExportEmployeePosition',
                title: '职位信息',
                isSelect: true,
            }, {
                name: 'IsExportEmploymentState',
                title: '员工状态',
                isSelect: false,
            }, {
                name: 'IsExportEmploymentEndedType',
                title: '离职类型',
                isSelect: false,
            }, {
                name: 'IsExportEmploymentEndedDate',
                title: '离职日期',
                isSelect: false,
            }, {
                name: 'IsExportEmploymentEndedReason',
                title: '离职原因',
                isSelect: false,
            }, {
                name: 'IsExportEmployeePhoneNumber',
                title: '联系电话',
                isSelect: false,
            }, {
                name: 'IsExportContactAddress',
                title: '联系地址',
                isSelect: false,
            }, {
                name: 'IsExportEmergencyContact',
                title: '紧急联系人',
                isSelect: false,
            }],
        };
    }
    private detailExport() {
        this.exportButton = 'detail';
        this.exportModal = {
            visible: true,
            data: [{
                name: 'IsExportEmployeeBasic',
                title: '基本信息',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeLegal_id',
                title: '身份证件信息',
                isSelect: false,
            }, {
                name: 'IsExportEmployeePhoneNumber',
                title: '联系电话',
                isSelect: false,
            }, {
                name: 'IsExportContactAddress',
                title: '联系地址',
                isSelect: false,
            }, {
                name: 'IsExportEmergencyContact',
                title: '紧急联系人资料',
                isSelect: false,
            }, {
                name: 'IsExportEmployeePosition',
                title: '职位信息',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeEducation',
                title: '教育经历',
                isSelect: false,
            }, {
                name: 'IsExportWorkExperience',
                title: '工作经历',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeCredential',
                title: '证件资料',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeContract',
                title: '个人合同',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeBankAccount',
                title: '银行账号',
                isSelect: false,
            }, {
                name: 'computerAccount',
                title: '电脑登录账号',
                isSelect: false,
            }, {
                name: 'email',
                title: '企业邮箱',
                isSelect: false,
            }, {
                name: 'DingDing',
                title: '企业钉钉',
                isSelect: false,
            }, {
                name: 'IsExportEmployeeRelatedDocument',
                title: '关联文档',
                isSelect: false,
            }]
        };
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
    private onSelect(value: string) {
        this.searchKey = value;
    }
    private pageChange(current: number, pageSize: number) {
        this.searchData(current, pageSize);
    }
    private search() {
        this.searchData(1, 10);
    }
    private cancelHandle() {
        this.visible = false;
    }
    private detailCancelHandle() {
        this.exportModal.visible = false;
    }
    private handleCancel() {
        this.visible = false;
    }
    private okHandle() {
        this.$refs.dialog.sumbitData((param: URLSearchParams) => {
            this.cancelHandle();
            this.searchParamData(param);
        });
    }
    private loadFormModalData() {
        this.tloading = false;
    }
    private downloadExcelData(params: any) {
        const newSearchParams = new URLSearchParams();
        for (const pair of this.searchParams.entries()) {
            newSearchParams.append(pair[0], pair[1]);
        }
        if (!_.isEmpty(this.searchParams.toString())) {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    newSearchParams.append(key, params[key]);
                }
            }
            this.exportModal.visible = false;
            let downLink;
            switch (this.exportButton) {
                case 'basic':
                    downLink = config.baseUrl + '/employee/Export/ExportBasicEmployees?' + newSearchParams;
                    break;
                default:
                    downLink = config.baseUrl + '/employee/Export/ExportDetailEmployees?' + newSearchParams;
                    break;
            }
            const link = document.createElement('a');
            link.href = downLink;
            link.click();
        } else {
            message.warning('暂无数据');
        }
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
    }
    private searchParamData(param: URLSearchParams) {
        this.searchLoading = true;
        this.visible = false;
        this.searchParams = param;
        getEmployeeData(param).then((res) => {
            console.log(res);
            const data = res.data;
            this.tabData = _.map(data, (item) => {
                const target: any = _.find(item.PhoneNumbers, { isDefault: true });
                const positionItem = _.map(item.Positions, (te: any) => {
                    return {
                        positionFullPath: te.positionFullPath,
                        isDefault: _.isEqual(te.id, item.principalPositionId),
                    };
                });
                return {
                    key: item.Id,
                    id: item.EmployeeStringID,
                    name: item.FullName,
                    gender: item.GenderValue === 1 ? '男' : '女',
                    num: item.Id,
                    employeeDate: moment(item.EmploymentStartedInfo.employmentStartedDate).format(this.dateFormat),
                    highEducation: item.HighestEducation.name,
                    employeeStatus: item.EmploymentState.name,
                    workplace: item.WorkingLocation.name,
                    tel: target.phoneNumber.number,
                    position: positionItem,
                };
            });
            this.searchLoading = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
            this.pagination.current = paginationData.currentPage;
        }).catch(() => {
            this.tabData = [];
            this.pagination.pageSize = 0;
            this.pagination.total = 0;
            this.pagination.current = 1;
            this.searchLoading = false;
        });
    }
    private searchData(current: number, pageSize: number) {
        const params = new URLSearchParams();
        if (!_.isEmpty(this.searchKey)) {
            params.set('FilterProperties.Id', this.searchKey);
        }
        params.set('PageNumber', current.toString());
        params.set('PageSize', pageSize.toString());
        if (this.form.getFieldValue('IsIncludeTerminated')) {
            const employeeStatusList = ['0FAGJ-XR8UN-Z5V2L-EWND7', '0FAGJ-XR8VC-Z5V2L-ES6RU', '0FCWK-UVPXV-Y5LQK-U5B8Y'];
            this.changeListDataToParams(params, employeeStatusList, 'FilterProperties.EmploymentStateIds');
        }
        this.searchParamData(params);
    }
    private changeListDataToParams(params: URLSearchParams, data: string[], paramName: string) {
        if ( data && data.length > 0) {
            data.filter((item: string) => {
                params.append(paramName, item);
            });
        }
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private changeDataToParamas(params: URLSearchParams, data: boolean, paramName: string) {
        if (data) {
            params.set(paramName, data.toString());
        }
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        this.changeDataToParamas(params, this.form.getFieldValue('IsIncludeTerminated'), 'FilterProperties.IsIncludeTerminated');
        searchEmployeeData(params.toString()).then((res) => {
            const data = res.data;
            this.employeeDataList = _.map(data, (item) => {
                return {
                    value: item.Id,
                    text: item.EmployeeStringID + '-' + item.FullName,
                    id: item.Id,
                };
            });
        });
    }
}
</script>
