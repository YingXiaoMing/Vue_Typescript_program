import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Form, Cascader, Row, Col, Select, DatePicker, Divider, Button, message } from 'ant-design-vue';
import { CascderOption, CascderOptionItem, BasicData, SelectValue } from '@/interface';
import { getOrginzationData, getEmployeePositionChangeType } from '@/api/basic';
import _ from 'lodash';
import { employeeTransferPosition } from '@/api/operation';
import { getEmployeePositionData } from '@/api/staff';
import moment from 'moment';
@Component({
    components: {
        'a-form-item': Form.Item,
        'a-select': Select,
        'a-option': Select.Option,
        'a-date': DatePicker,
        'a-divider': Divider,
        'a-row': Row,
        'a-col': Col,
        'a-cascader': Cascader,
        'a-button': Button,
    },
    props: {
        Form,
    },
})
class Tab1 extends Vue {
    @Prop() private OriginPostionOption!: SelectValue[];
    @Prop({default: ''}) private employeeId!: string;
    private dateFormat: string = 'YYYY-MM-DD';
    private basicItemLayout = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private basicItemLayout2 = {
        lg: {span: 6},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    private fromItemLayout2 = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private Form: any;
    private OriginPostionOptions: SelectValue[] = [];
    private transferTypeOption: SelectValue[] = [];
    private cascderOption: CascderOption[] = [];
    private isNewPosition: boolean = false;
    @Watch('OriginPostionOption')
    private OriginPostionOptionChange(value: SelectValue[]) {
        this.OriginPostionOptions = value;
    }
    private created() {
        getEmployeePositionChangeType().then((res: any) => {
            this.transferTypeOption = this.transformSelectData(res);
        });
        getOrginzationData().then((res: any) => {
            const Options: CascderOption[] = [];
            const TopParentNode: CascderOption = {
                value: res.id,
                label: res.name,
                children: [],
            };
            if (res.subCompanies) {
                this.traverseStepNodechilden(res.subCompanies, TopParentNode);
            }
            if (res.departments) {
                this.traverseStepNodechilden(res.departments, TopParentNode);
            }
            Options.push(TopParentNode);
            this.cascderOption = Options;
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
    private transferEmployeePostion() {
        if (this.employeeId === '') {
            message.error('请指定某一个员工');
            return;
        }
        this.Form.validateFields((err: any, values: any) => {
            if (!err) {
                if (!this.isNewPosition) {
                    message.error('请选择一个有效职位');
                    return;
                }
                employeeTransferPosition(this.employeeId, {
                    orginalPositionId: values.originPostion.key,
                    newPositionId: _.last(values.newPostion),
                    employeePositionChangeTypeId: values.transferType.key,
                    effectiveDate: moment(values.issueDate).format(this.dateFormat),
                }).then((res) => {
                    this.resetEmployeeData();
                });
            }
        });
    }
    // 重新获取员工的职位信息
    private resetEmployeeData() {
        getEmployeePositionData(this.employeeId).then((res: any) => {
            this.Form.resetFields();
            message.success('员工调职操作成功');
            this.$emit('clearEmployeeData');
            this.OriginPostionOptions = [];
        });
    }
    private traverseStepNodechilden(data: any, TopParentNode: CascderOption) {
        const thiz = this;
        if (data) {
            data.map((node: any, index: number) => {
                index ++;
                const childrenNode: CascderOption = {value: '', label: '', children: []};
                childrenNode.label = node.name;
                childrenNode.value = node.id;
                if (node.subCompanies) {
                    thiz.traverseStepNodechilden(node.subCompanies, childrenNode);
                }
                if (node.departments) {
                    thiz.traverseStepNodechilden(node.departments, childrenNode);
                }
                if (node.positions) {
                    // tslint:disable-next-line:no-shadowed-variable
                    node.positions.forEach((node: any, index: number) => {
                        const object: CascderOptionItem = {
                            value: '',
                            label: '',
                            key: '',
                        };
                        index ++;
                        object.value = node.id;
                        object.key = node.id;
                        object.label = node.name;
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
    private positionsChange( value: string[], selectOption: CascderOption[] ) {
        const target = _.last(selectOption);
        this.isNewPosition =  _.has(target, 'key');
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24}>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='原职位' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('originPostion', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                    initialValue: this.OriginPostionOptions[0],
                                })(<a-select labelInValue>
                                {this.OriginPostionOptions.map((item: any, index: number) => <a-option
                                        value={item.key}>{item.label}</a-option>)}
                                </a-select>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout2}}>
                            <a-form-item label='调职类型' {...{props: this.fromItemLayout2}}>
                                {getFieldDecorator('transferType', {
                                    initialValue: this.transferTypeOption[0],
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-select labelInValue>
                                {this.transferTypeOption.map((item: any, index: number) => <a-option
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
                    <a-divider class='diliver_item'>调动后</a-divider>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='新职位' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('newPostion', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-cascader options={this.cascderOption}
                                style='width:100%' on-change={this.positionsChange}></a-cascader>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-row>
                <a-row class='bottom_button'>
                    <a-button type='primary' on-click={this.transferEmployeePostion}>保存</a-button>
                </a-row>
            </div>
        );
    }

}
export default Form.create({
    props: {
        OriginPostionOption: Array,
        employeeId: String,
    },
})(Tab1);
