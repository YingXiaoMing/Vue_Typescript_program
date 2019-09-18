<template>
    <div>
        <a-form :form="form">
            <a-row :gutter="24">
              <a-col :span="6">
                  <a-form-item label="公司名称" v-bind="formItemLayout">
                      <a-input v-decorator="['companyName', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                  </a-form-item>
              </a-col>
              <a-col :span="6">
                  <a-form-item label="职位" v-bind="formItemLayout">
                      <a-input v-decorator="['positionName', {rules: [{ required: true, message: ' ' }]}]"></a-input>
                  </a-form-item>
              </a-col>
              <a-col :span="6">
                  <a-form-item label="入职日期" v-bind="formItemLayout">
                      <a-date-picker :format="dateFormat" v-decorator="['startedDate',
                        {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                  </a-form-item>
              </a-col>
              <a-col :span="6">
                  <a-form-item label="离职日期" v-bind="formItemLayout">
                      <a-date-picker :format="dateFormat" v-decorator="['endedDate',
                        {rules: [{ required: true, message: ' ' }]}]"></a-date-picker>
                  </a-form-item>
              </a-col>
              <a-col :span="6">
                  <a-form-item label="工资" v-bind="formItemLayout">
                      <a-input v-decorator="['salary']"></a-input>
                  </a-form-item>
              </a-col>
              <a-col :span="6">
                  <a-form-item label="证明人" v-bind="formItemLayout">
                      <a-input v-decorator="['reference']"></a-input>
                  </a-form-item>
              </a-col>
              <a-col :span="6">
                  <a-form-item label="证明人电话" v-bind="formItemLayout">
                      <a-input v-decorator="['referencePhoneNumber']"></a-input>
                  </a-form-item>
              </a-col>
              <a-col :span="6">
                  <a-form-item label="离职原因" v-bind="formItemLayout">
                      <a-input v-decorator="['endedJobReason']"></a-input>
                  </a-form-item>
              </a-col>
              <a-col :span="24">
                  <a-form-item class='rightBtn'>
                      <a-button type="primary" class='rightBtn' @click="addWorkExperienceData">新增</a-button>
                  </a-form-item>
              </a-col>
            </a-row>
        </a-form>
        <a-row style="marginTop:12px">
            <a-work-table :loading="workExperienceTableLoading" :tabList="workExperienceTableData"
            :employeeId="employeeId" @loadData="remoteEmployeeWorkExperienceData" :ETag="workExperienceTag"></a-work-table>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { getEmployeeWorkExperience, newEmployeeWorkExperience } from '@/api/staff';
import Component from 'vue-class-component';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'ant-design-vue';
import WorkExperienceTable from './WorkExperienceTable.vue';
import { WorkExperienceTableData } from '@/interface';
interface ValueData {
    companyName: string;
    positionName: string;
    startedDate: string;
    endedDate: string;
    salary: string;
    reference: string;
    referencePhoneNumber: string;
    endedJobReason: string;
}
@Component({
    components: {
        'a-work-table': WorkExperienceTable,
    },
})
export default class WorkExperience extends Vue {
    private form: any;
    private $form: any;
    private $store: any;
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private dateFormat = 'YYYY-MM-DD';
    private employeeId: string = '';
    private workExperienceTableLoading: boolean = false;
    private workExperienceTableData: WorkExperienceTableData[] = [];
    private workExperienceTag: string = '';
    private created() {
        const { employeeId } = this.$store.state.step;
        this.employeeId = employeeId;
        this.form = this.$form.createForm(this);
        this.remoteEmployeeWorkExperienceData();
    }
    // 获取员工的工作经历数据
    private remoteEmployeeWorkExperienceData() {
        this.workExperienceTableLoading = true;
        getEmployeeWorkExperience(this.employeeId).then((res) => {
            const data = res.data;
            this.workExperienceTag = res.headers.etag;
            const newData = _.map(data, (item) => {
                return {
                    key: item.id,
                    companyName: item.companyName,
                    positionName: item.positionName,
                    startedDate: moment(item.startedDate).format(this.dateFormat),
                    endedDate: moment(item.endedDate).format(this.dateFormat),
                    endedJobReason: item.endedJobReason,
                    salary: item.salary,
                    reference: item.reference,
                    referencePhoneNumber: item.referencePhoneNumber,
                    editable: false,
                };
            });
            this.workExperienceTableData = newData;
            this.workExperienceTableLoading = false;
        });
    }
    private addWorkExperienceData() {
        this.form.validateFields((err: any, values: ValueData) => {
            if (!err) {
                values.startedDate = moment(values.startedDate).format(this.dateFormat);
                values.endedDate = moment(values.endedDate).format(this.dateFormat);
                if (moment(values.startedDate).isAfter(values.endedDate)) {
                    message.error('离职日期不能早于入职日期');
                    return;
                }
                newEmployeeWorkExperience(this.employeeId, {
                    companyName: values.companyName,
                    positionName: values.positionName,
                    startedDate: values.startedDate,
                    endedDate: values.endedDate,
                    endedJobReason: values.endedJobReason,
                    salary: values.salary,
                    reference: values.reference,
                    referencePhoneNumber: values.reference,
                }).then((res) => {
                    this.form.resetFields();
                    this.remoteEmployeeWorkExperienceData();
                }).catch((err) => {
                    message.error('新增失败');
                });
            }
        });
    }
}
</script>

