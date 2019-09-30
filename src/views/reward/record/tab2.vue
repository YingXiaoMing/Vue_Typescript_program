<template>
    <div class="reward_tab2">
        <a-form :form="form">
        <a-row :gutter="24">
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门组织">
                    <a-tree-select :options="treeData" :multiple="true" noChildrenText="空"/>
                </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖惩类型">
                    <a-select mode="multiple">
                        <a-select-opt-group v-for="item in prizePentalData" :label="item.name">
                            <a-select-option v-for="it in item.children"  :value="it.id">{{it.name}}</a-select-option>
                        </a-select-opt-group>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter="24">
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
                    <a-date-picker v-decorator="['startDateTime']"></a-date-picker>
                </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
                    <a-date-picker v-decorator="['endDateTime']"></a-date-picker>
                </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
                <a-form-item :labelCol="labelCol">
                    <a-button type="primary" @click="searchClick">查询</a-button>
                    <a-button style="marginLeft:15px">导出数据</a-button>
                </a-form-item>
            </a-col>
            <a-divider>查询结果</a-divider>
            <a-table2 :tabList="tabData" :loading="searchLoading" :paginationData="pagination"></a-table2>
        </a-row>
        </a-form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import Component from 'vue-class-component';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { Row, Col, Form, Select, DatePicker, Button, Divider } from 'ant-design-vue';
import { getCompanyOrganizationChart } from '@/api/operation';
import { getAllPrizePenaltyClassify } from '@/api/basic';
import Table2 from './tabTable2.vue';
import { Pagination } from '@/interface';
import moment from 'moment';
import { searchPrizePenaltyRecord } from '@/api/operation';
import './tab2.less';
import URLSearchParams from 'url-search-params';
interface Data {
    title: string;
    value: string;
    description: string;
    key: string;
}
interface TableData {
    label: string;
    id: string;
    description: string;
    children: Data[];
}
interface PrizeData {
    name: string;
    id: string;
}
interface PrizePentalTable {
    name: string;
    id: string;
    children: PrizeData[];
}

@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-tree-select': Treeselect,
        'a-select': Select,
        'a-select-opt-group': Select.OptGroup,
        'a-select-option': Select.Option,
        'a-date-picker': DatePicker,
        'a-button': Button,
        'a-table2': Table2,
        'a-divider': Divider,
        'a-form': Form,
    },
})
export default class Tab2 extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 8}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 16}};
    private prizePentalData: PrizePentalTable[] = [];
    private searchLoading: boolean = false;
    private treeData: TableData[] = [{ label: '', id: '', description: '', children: [] }];
    private form: any;
    private $form: any;
    private tabData: any = [];
    private dateFormat = 'YYYY-MM-DD';
    private param: URLSearchParams = new URLSearchParams();
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        onChange: this.pageChange,
    }
    private pageChange(current: number, pageSize: number) {
        this.param.set('PageNumber', current.toString());
        this.loadData(this.param);
    }
    private created() {
        this.form = this.$form.createForm(this);
        this.getOrganizationData();
        this.getAllPrizePenaltyClassifyData();
    }
    private getAllPrizePenaltyClassifyData() {
        getAllPrizePenaltyClassify().then((res) => {
            const data = res.data;
            this.prizePentalData = _.map(data, (item: any) => {
                return {
                    name: item.prizePenaltyTypeClassifyDisplayName,
                    id: item.prizePenaltyTypeClassifyValue,
                    children: item.prizePenaltyTypeDtos,
                };
            });
        });
    }
    private getOrganizationData() {
        getCompanyOrganizationChart().then((res: any) => {
            const data = res.data;
            const newData: TableData = {
                label: data.name,
                id: data.id,
                description: 'company',
                children: [],
            };
            if (data.subCompanies) {
                this.traverseStepNodeChild(data.subCompanies, newData, 'company');
            }
            if (res.departments) {
                this.traverseStepNodeChild(data.departments, newData, 'department');
            }
            // 强行转换成数组
            this.treeData = _.castArray(newData);
        });
    }
    private traverseStepNodeChild(data: any, TopParentNode: any, descriptionName: string) {
        if (data) {
            const target = _.map(data, (item) => {
                let newTarget;
                if (_.isEqual(descriptionName, 'position')) {
                    newTarget = {
                        label: item.name,
                        id: item.id,
                        description: descriptionName,
                    };
                } else {
                    newTarget = {
                        label: item.name,
                        id: item.id,
                        description: descriptionName,
                        children: [],
                    };
                }
                if (item.subCompanies) {
                    this.traverseStepNodeChild(item.subCompanies, newTarget, 'company');
                }
                if (item.departments) {
                    this.traverseStepNodeChild(item.departments, newTarget, 'department');
                }
                if (item.subDepartments) {
                    this.traverseStepNodeChild(item.subDepartments, newTarget, 'department');
                }
                if (item.positions) {
                    this.traverseStepNodeChild(item.positions, newTarget, 'position');
                }
                return newTarget;
            });
            TopParentNode.children = _.concat(TopParentNode.children, target);
        }
    }
    private searchClick() {
        this.form.validateFields((err: any, values: any) => {
                this.searchLoading = true;
                const params = new URLSearchParams();
                params.set('PageNumber', '1');
                params.set('PageSize', '5');
                if (values.startDateTime) {
                    params.set('FilterProperties.EffectiveDateStartValue', moment(values.startDateTime).format(this.dateFormat));
                }
                if (values.endDateTime) {
                    params.set('FilterProperties.EffectiveDateEndValue', moment(values.endDateTime).format(this.dateFormat));
                }
                this.param = params;
                this.loadData(params);
        });
    }
    private loadData(param: URLSearchParams) {
        searchPrizePenaltyRecord(param).then((res) => {
            this.tabData = _.map(res.data, (item) => {
                return {
                    key: item.id,
                    num: item.employeeStringID,
                    name: item.employeeFullName,
                    position: item.employeePrincipalPositionFullPath,
                    isReward: item.prizePenaltyTypeClassifyName,
                    rewardType: item.prizePenaltyTypeName,
                    date: moment(item.effectiveDate).format(this.dateFormat),
                };
            });
            this.searchLoading = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
        });
    }
}
</script>

