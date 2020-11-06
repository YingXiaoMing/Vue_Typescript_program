<template>
    <div class="wrapper">
        <a-row :gutter="24" class="setting_card">
            
            <div class="SettingClassTitle">发卡员工信息</div>
            <div class="SettingClassDetail" >
                <a-col :span="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="员工姓名(工号)">
                        <a-auto-complete placeholder="请输入姓名或工号进行智能搜索" @focus="focusHandle"
                        @search="handleChange" @select="onSelect" v-model="searchKey">
                            <template slot="dataSource">
                                <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                            </template>
                             <a-input @change="e => valueChange(e.target.value)"></a-input>
                        </a-auto-complete>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工工号">
                        <a-input disabled v-model="employeeNum"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工姓名">
                        <a-input disabled v-model="employeeName"></a-input>
                    </a-form-item>
                </a-col>
            </div>
            <div class="SettingClassTitle">IC卡信息</div>
            <div class="SettingClassDetail">
                <a-col :span="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="IC卡号">
                        <a-input v-model="cardNums" style="width: 200px" :disabled="cardNumShow"></a-input>
                        <a-button style="marginLeft: 18px" @click="shuaiCard">刷卡</a-button>
                        <a-input v-model="cardNumsDisplay" ref="mark" @change="e => handleInputVal(e.target.value)" class="show_input_1"></a-input>
                        <div class="m_red"></div>
                    </a-form-item>
                </a-col>
            </div>
            <div class="SettingClassTitle">操作选项</div>
            <div class="SettingClassDetail">
                <a-col :span="24">
                    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="">
                        <a-checkbox-group v-model="operateList">
                            <a-row>
                                <a-col :span="12">
                                    <a-checkbox value="A">员工信息导入消费系统</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="B">员工信息导入消费系统(新系统)</a-checkbox>
                                </a-col>
                                <a-col :span="24">
                                    <a-checkbox value="C">员工信息导入门禁系统</a-checkbox>
                                </a-col>
                                <a-col :span="24">
                                    <a-checkbox value="D">门禁发卡</a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                        <a-button>保存</a-button>
                    </a-form-item>
                </a-col>
            </div>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { searchEmployeeData } from '@/api/staff';
import Component from 'vue-class-component';

import _ from 'lodash';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
    name: string;
}
@Component({
    components: {},
})
export default class CardView extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 10}};
    private labelCol1 =  { xs: {span: 24}, sm: {span: 5}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 14}};
    private wrapperCol1 =  { xs: {span: 24}, sm: {span: 19}};
    private readonly: boolean = true;
    private employeeName: string = '';
    private employeeNum: string = '';
    private searchKey: string = '';
    private employeeId: string = '';
    private cardNums: string = '';
    private cardNumsDisplay: string = '';
    private cardNumShow: boolean = true;
    private operateList: string[] = ['A' , 'B', 'C', 'D'];
    private employeeDataList: EmployeeData[] = [];
    private shuaiCard() {
        // this.readonly = true;
        this.cardNumsDisplay = '';
        this.$refs.mark.focus();
        this.cardNums = '请输入...';
    }
    private handleInputVal(val: string) {
        console.log(val.length);
        this.cardNums = val;
        if (val.length === 8) {
            this.$refs.mark.blur();
        }
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
     private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.employeeName = item.name;
            this.employeeNum = item.id;
            this.employeeId = item.value;
        }
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        searchEmployeeData(params.toString()).then((res) => {
            const data = res.data;
            this.employeeDataList = _.map(data, (item) => {
                return {
                    value: item.id,
                    text: item.employeeStringID + '-' + item.fullName,
                    id: item.employeeStringID,
                    name: item.fullName,
                };
            });
        });
    }
}
</script>
<style lang="less">
.setting_card {
    margin-left: 0px !important;
    margin-right: 0px !important;
    .SettingClassDetail {
        width: 620px;
        overflow: hidden;
    }
    .ant-form-item {
        margin-bottom: 12px;
    }
}
.SettingClassTitle {
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  text-indent: 1em;
  line-height: 28px;
  border-bottom: 1px solid #4767B0;
  margin-top: 2px;
  margin-bottom: 10px;
}
.show_input_1 {
    // position: absolute;
    // left: 0;
    width: 200px;
    // top:60px;
    // top: 0.1px;
    z-index: -12;
}
.m_red {
    position: absolute;
    top: 33px;
    left: 0;
    width: 205px;
    height: 33px;
    background-color: #fff;
}
</style>
