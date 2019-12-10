import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Form, Row, Col, Select, DatePicker, Button, Input, message } from 'ant-design-vue';
import { BasicData, SelectValue } from '@/interface';
import { putEmployeePositionModification, getEmployeePositionDismissType } from '@/api/operation';
import _ from 'lodash';
import moment from 'moment';
import { __asyncValues } from 'tslib';
@Component({
    components: {
        'a-form-item': Form.Item,
        'a-select': Select,
        'a-option': Select.Option,
        'a-date': DatePicker,
        'a-row': Row,
        'a-col': Col,
        'a-button': Button,
        'a-textarea': Input.TextArea,
    },
    props: {
        Form,
    },
})
class Tab1 extends Vue {
    @Prop({default: ''}) private employeeId!: string;
    @Prop({default: []}) private valueOption!: SelectValue[];
    private typeOption: SelectValue[] = [];
    private dateFormat: string = 'YYYY-MM-DD';
    private basicItemLayout = {
        lg: {span: 20},
        md: {span: 24},
        sm: {span: 24},
    };
    private basicItemLayout2 = {
        lg: {span: 10},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
    };
    private fromItemLayout2 = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    private Form: any;
    @Watch('valueOption')
    private valueOptionChange(value: SelectValue[]) {
        this.Form.setFieldsValue({
            position: value[0],
        });
    }
    private created() {
        getEmployeePositionDismissType().then((res: any) => {
            const data = res.data;
            this.typeOption = this.transformSelectData(data);
        });
    }
    private transformSelectData(data: any) {
        return _.map(data, (item: BasicData) => {
            return {
                key: item.id,
                label: item.name,
            };
        });
    }
    private leaveClick() {
        this.Form.validateFields((err: any, values: any) => {
            if (!err) {
                putEmployeePositionModification({
                    employeeId: this.employeeId,
                    employeePositionModificationTypeId: values.typeId.key,
                    originalPositionId: values.position.key,
                    effectiveDate: moment(values.issueDate).format(this.dateFormat),
                    reason: values.reason,
                }).then((res) => {
                    this.Form.resetFields();
                    message.success('撤职操作成功');
                    this.$emit('getData');
                });
            }
        });
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24}>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='工单号' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('orderNum', {
                                    initialValue: '系统自动生成',
                                })(
                                    <a-input disabled></a-input>
                                )}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='撤职职位' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('position', {
                                    initialValue: this.valueOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue>
                                {this.valueOption.map((item: any, index: number) => <a-option
                                        value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='撤职类型' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('typeId', {
                                    initialValue: this.typeOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue>
                                {this.typeOption.map((item: any, index: number) => <a-option
                                        value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='生效日期' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('issueDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date></a-date>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='撤职原因' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('reason')(<a-textarea rows={4}></a-textarea>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-row>
                <a-row class='bottom_button'>
                    <a-button type='primary' on-click={this.leaveClick}>保存</a-button>
                </a-row>
            </div>
        );
    }

}
export default Form.create({
    props: {
        employeeId: String,
        valueOption: Array,
    },
})(Tab1);
