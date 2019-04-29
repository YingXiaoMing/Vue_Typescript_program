<template>
    <div class='wrapper'>
        <div class='staff-head'>
            <a-row :gutter="24">
                <a-col :lg="8" :md="12" :sm="24">
                    <a-form-item>
                        <a-auto-complete placeholder="请输入姓名或工号进行智能搜索"
                        @search="handleChange" @select="onSelect">
                            <template slot="dataSource">
                                <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                            </template>
                             <a-input @change="e => valueChange(e.target.value)"></a-input>
                        </a-auto-complete>
                    </a-form-item>
                </a-col>
                <a-col :lg="6" :md="12" :sm="24">
                    <a-form-item>
                        <a-button type="primary" @click="search">快速查询</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-search-table :loading="searchLoading" :tabList="tabData" :paginationData="pagination"></a-search-table>
            </a-row>
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
import { Pagination } from '@/interface';
import _ from 'lodash';
import './index.less';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
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
    },
    name: 'staffsearch',
})
export default class Search extends Vue {
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        onChange: this.pageChange,
    };
    private tabData: any = [];
    private searchLoading: boolean = false;
    private searchKey: string = '';
    private employeeDataList: EmployeeData[] = [];
    private dataSource = ['123', '22', '223'];
    private created() {
        this.fetch('');
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
        this.searchData(1, 5);
    }
    private searchData(current: number, pageSize: number) {
        this.searchLoading = true;
        const params = new URLSearchParams();
        params.set('SearchQuery', this.searchKey);
        params.set('PageNumber', current.toString());
        params.set('PageSize', pageSize.toString());
        getEmployeeData(params).then((res) => {
            this.tabData = _.map(res.data, (item) => {
                return {
                    key: item.id,
                    id: item.employeeStringID,
                    name: item.fullName,
                    gender: item.genderValue === 1 ? '男' : '女',
                    num: item.id,
                };
            });
            this.searchLoading = false;
            this.searchKey = '';
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
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
}
</script>
