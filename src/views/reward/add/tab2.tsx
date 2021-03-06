import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Form, Row, Col, Input, Select, DatePicker, Divider, Button, message } from 'ant-design-vue';
import { SelectValue, BasicData } from '@/interface';
import _ from 'lodash';
import { getPrizePenaltyTypePenalty } from '@/api/basic';
import { newPrizePenalty } from '@/api/operation';
import moment from 'moment';
@Component({
    components: {
        'a-row': Row,
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-select': Select,
        'a-option': Select.Option,
        'a-date': DatePicker,
        'a-divider': Divider,
        'a-textarea': Input.TextArea,
        'a-button': Button,
    },
    props: {
        Form,
    },
})
class Tab2 extends Vue {
    private basicItemLayout = {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
    };
    private basicItemLayout2 = {
        lg: {span: 20},
        md: {span: 24},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private fromItemLayout2 = {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 },
    };
    private dateFormat: string = 'YYYY-MM-DD';
    @Prop({default: ''}) private employeeId!: string;
    private punishType: SelectValue[] = [];
    private Form: any;
    private created() {
        getPrizePenaltyTypePenalty().then((res) => {
            const data = res.data;
            this.punishType = this.transformSelectData(data);
        });
    }
    private rewardClick() {
        if (_.isEqual(this.employeeId, '')) {
            message.error('请指定某一个员工');
            return;
        }
        this.Form.validateFields((err: any, values: any) => {
            if (!err) {
                newPrizePenalty({
                    employeeId: this.employeeId,
                    prizePenaltyTypeId: values.punishType.key,
                    effectiveDate: moment(values.issueDate).format(this.dateFormat),
                    situationDescription: values.description,
                    solution: values.deal,
                }).then(() => {
                    this.Form.resetFields();
                    message.success('员工惩罚添加成功');
                    this.$emit('clearEmployeeData');
                });
            }
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
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24}>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='工单号' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('orderNum', {
                                    initialValue: '由系统自动生成',
                                })(<a-input disabled></a-input>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='惩罚类型' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('punishType', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                    initialValue: this.punishType[0],
                                })(<a-select labelInValue>
                                {this.punishType.map((item: any, index: number) => <a-option
                                        value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='生效日期' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('issueDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date></a-date>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-divider >具体情况</a-divider>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='情况描述' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('description')(<a-textarea rows={4}></a-textarea>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='处理方式' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('deal')(<a-textarea rows={4}></a-textarea>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row class='bottom_button'>
                            <a-button type='primary' on-click={this.rewardClick}>保存</a-button>
                    </a-row>
                </a-row>
            </div>
        );
    }
}

export default Form.create({
    props: {
        employeeId: String,
    },
})(Tab2);
