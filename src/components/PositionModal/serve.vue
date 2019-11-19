<template>
    <a-form :form="form">
        <a-row>
           <a-col :span="12">
                <a-form-item label="员工工号" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['num', {initialValue: data.num}]"></a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="员工姓名" v-bind="formItemLayout">
                    <a-input disabled v-decorator="['name', {initialValue: data.name}]"></a-input>
                </a-form-item>
            </a-col>
        </a-row>
        <a-divider>任职操作</a-divider>
        <a-row>
          <a-col :span="18">
              <a-form-item label="新职位" v-bind="formItemLayout2">
                  <a-cascader :options="cascderOption" placeholder="请选择职位"
                  v-decorator="['newPostion',{  rules: [{ required: true, message: ' ' }] }]"
                  @change="positionsChange"></a-cascader>
              </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item label="生效日期" v-bind="formItemLayout">
                  <a-date-picker v-decorator="['effectiveDate', {initialValue: momentFromDate(data.effectiveDate), rules: [{ required: true, message: ' ' }] }]"></a-date-picker>
              </a-form-item>
          </a-col>
          <a-col :span="24">
              <a-form-item label="原因" v-bind="formItemLayout3">
                  <a-textarea v-decorator="['reason', {initialValue: data.reason}]" rows="4"></a-textarea>
              </a-form-item>
          </a-col>
        </a-row>
    </a-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { getOrginzationData } from '@/api/basic';
import { UpdatePositionDelegated } from '@/api/operation';
import { CascderOptionItem, CascderOption } from '@/interface';
import { message } from 'ant-design-vue';
import _ from 'lodash';
interface FormData {
    name: string;
    num: string;
    id: string;
    employeeId: string;
    effectiveDate: string;
    reason: string;
}
@Component({
    name: 's-serve',
    components: {},
})
export default class Serve extends Vue {
    @Prop() private data!: FormData;
    private form: any;
    private $form: any;
    private cascderOption: CascderOption[] = [];
    private isNewPosition: boolean = false;
    private dateFormat = 'YYYY-MM-DD';
    private newDepartmentId: string = '';
    private newCompanyId: string = '';
    private newPositionId: string = '';
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 18}},
    };
    private formItemLayout2 = {
        labelCol: { xs: {span: 24}, sm: {span: 4}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    private formItemLayout3 = {
        labelCol: { xs: {span: 24}, sm: {span: 3}},
        wrapperCol: { xs: {span: 24}, sm: {span: 20}},
    };
    private created() {
        this.form = this.$form.createForm(this);
        getOrginzationData().then((res: any) => {
            const data = res.data;
            const Options: CascderOption[] = [];
            const TopParentNode: CascderOption = {
                value: data.id,
                label: data.name,
                companyId: data.id,
                description: 'company',
                children: [],
            };
            if (data.subCompanies) {
                this.traverseStepNodechilden(data.subCompanies, TopParentNode, 'company');
            }
            if (data.departments) {
                this.traverseStepNodechilden(data.departments, TopParentNode, 'department');
            }
            Options.push(TopParentNode);
            this.cascderOption = Options;
        });
    }
    private traverseStepNodechilden(data: any, TopParentNode: CascderOption, descriptionName: string) {
        const thiz = this;
        if (data) {
            data.map((node: any, index: number) => {
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
                    thiz.traverseStepNodechilden(node.subCompanies, childrenNode, 'company');
                }
                if (node.departments) {
                    thiz.traverseStepNodechilden(node.departments, childrenNode, 'department');
                }
                if (node.positions) {
                    // tslint:disable-next-line:no-shadowed-variable
                    node.positions.forEach((node: any, index: number) => {
                        index ++;
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
    private positionsChange( value: string[], selectOption: CascderOptionItem[] ) {
        const target = _.last(selectOption);
        this.isNewPosition =  _.has(target, 'key');
        if (value.length > 0 && selectOption[selectOption.length - 1].key) {
            this.newPositionId = value[value.length - 1];
            this.newDepartmentId = selectOption[selectOption.length - 1].departmentId;
            this.newCompanyId =  selectOption[selectOption.length - 1].companyId;
        }
    }
    private momentFromDate(date: string) {
         if (_.isEmpty(date)) { return null; }
         return moment(date, this.dateFormat);
    }
    private sumbitData(callback: any) {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                UpdatePositionDelegated(this.data.employeeId, this.data.id, {
                    companyId: this.newCompanyId,
                    departmentId: this.newDepartmentId,
                    positionId: this.newPositionId,
                    effectiveDate: moment(values.effectiveDate).format(this.dateFormat),
                    reason: values.reason,
                }).then(() => {
                    message.success('更新成功');
                    callback(true);
                });
            }
        });
    }

}
</script>

