<template>
    <div>
        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-item label="学校/受教育机构名称" v-bind="formItemLayout">
                        <a-input v-decorator="['schoolName', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="专业/受教育学科" v-bind="formItemLayout">
                        <a-input v-decorator="['major', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="最高学历" v-bind="formItemLayout">
                        <a-select labelInValue v-decorator="['educationLevel', {rules: [{ required: true, message: ' ' }], initialValue: educationLevelOption[0] }]">
                            <a-select-option v-for="item in educationLevelOption" :value="item.key">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item v-bind="formItemLayout" label="开始日期">
                        <a-date-picker :format="dateFormat" v-decorator="['startedDate',
                        {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item v-bind="formItemLayout" label="结束日期">
                        <a-date-picker :format="dateFormat" v-decorator="['endedDate',
                        {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item class='rightBtn'>
                        <a-button type="primary" @click='addEducationData'>新增</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row style="marginTop:12px">
                <a-education-table :loading="educationTableLoading" :tabList="educationTableData" :educationLevelOption="educationLevelOption"
                :ETag="educationTag" :employeeId="employeeId" @loadData="remoteEmployeeEducationData"></a-education-table>
            </a-row>
            
        </a-form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { BasicData, SelectValues, EducationTableData } from '@/interface';
import { getEducationLevelOption } from '@/api/basic';
import EducationTable from './EducationTable.vue';
import { getEmployeeEducationHistory, newEmployeeEducationHistory } from '@/api/staff';
import { message } from 'ant-design-vue';
import { getEmployeeID } from '@/utils/cookie';
import moment from 'moment';
import _ from 'lodash';
interface ValueData {
    major: string;
    schoolName: string;
    startedDate: string;
    endedDate: string;
    educationLevel: {
        key: string;
        label: string;
    };
}
@Component({
    components: {
        'a-education-table': EducationTable,
    },
})
export default class Education extends Vue {
    private form: any;
    private $form: any;
    private educationLevelOption: SelectValues[] = [];
    private dateFormat = 'YYYY-MM-DD';
    private educationTableLoading: boolean = false;
    private educationTableData: EducationTableData[] = [];
    private employeeId: string = '';
    private educationTag: string = '';
    private $store: any;
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private created() {
        const { employeeStatus, newEmployeeId } = this.$store.state.step;
        switch (employeeStatus) {
            case 3:
                const employeeId = getEmployeeID();
                if (employeeId) {
                    this.employeeId = employeeId;
                }
                break;
            default:
                this.employeeId = newEmployeeId;
                break;
        }
        this.form = this.$form.createForm(this);
        this.fetchData();
    }
    private fetchData() {
        getEducationLevelOption().then((response) => {
            this.educationLevelOption = this.transformSelectData(response.data);
            this.remoteEmployeeEducationData();
        });
    }
    // 获取员工的教育经历
    private remoteEmployeeEducationData() {
        this.educationTableLoading = true;
        getEmployeeEducationHistory(this.employeeId).then((res) => {
            const data = res.data;
            this.educationTag = res.headers.etag;
            const newData = _.map(data, (item) => {
                const targetEducationType = _.find(this.educationLevelOption, { key: item.educationLevelId });
                return {
                    key: item.id,
                    startedDate: moment(item.startedDate).format(this.dateFormat),
                    endDate: moment(item.endedDate).format(this.dateFormat),
                    major: item.major,
                    schoolName: item.schoolName,
                    disable: false,
                    educationLevel: targetEducationType ? targetEducationType : { key: '', label: '' },
                    editable: false,
                };
            });
            this.educationTableData = newData;
            this.educationTableLoading = false;
        });
    }
    private addEducationData() {
        this.form.validateFields((err: any, values: ValueData) => {
            if (!err) {
                if (moment(values.startedDate).isAfter(values.endedDate)) {
                    message.error('结束日期不能早于开始日期');
                    return;
                }
                newEmployeeEducationHistory(this.employeeId, {
                    educationLevelId: values.educationLevel.key,
                    schoolName: values.schoolName,
                    major: values.major,
                    startedDate: moment(values.startedDate).format(this.dateFormat),
                    endedDate: moment(values.endedDate).format(this.dateFormat),
                }).then((res) => {
                    this.form.resetFields();
                    this.remoteEmployeeEducationData();
                });
            } else {
                message.error('教育经历请填写完整');
            }
        });
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: any) => {
            return {
                key: item.id,
                label: item.Name,
            };
        });
    }
}
</script>

