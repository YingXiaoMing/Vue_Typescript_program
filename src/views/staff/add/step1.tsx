import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Input, Row, Divider, Col, DatePicker, Select, Radio, Tag, Upload, Button } from 'ant-design-vue';
import './step1.less';
import { FormItem, BasicData, SelectValue } from '@/interface';
import ProbationForm from '@/components/ProbationForm';
import LegalTable from '@/components/Step1/LegalTable.vue';
import PhoneTable from '@/components/Step1/PhoneTable.vue';
import AddressTable from '@/components/Step1/AddressTable.vue';
import ContactTable from '@/components/Step1/ContactTable.vue';
import PositionTable from '@/components/Step1/PositionTable.vue';
import { getWorkLocation, getEmploymentSource } from '@/api/basic';
import _ from 'lodash';
@Component({
    components: {
        'a-from': Form,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-row': Row,
        'a-col': Col,
        'a-divider': Divider,
        'a-date': DatePicker,
        'a-select': Select,
        'a-option': Select.Option,
        'a-raido-group': Radio.Group,
        'a-radio': Radio,
        'a-tag': Tag,
        'a-textarea': Input.TextArea,
        'a-upload': Upload,
        'a-button': Button,
    },
    props: {
        Form,
    },
})
class Step1 extends Vue {
    private basicItemLayout = {
        lg: {span : 6},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol:  { span: 8},
        wrapperCol: { span: 16 },
    };
    private marryStateOption = [{
        value: 1,
        label: '已婚',
    }, {
        value: 0,
        label: '未婚',
    }];
    private sexOption = [{
        value: 1,
        label: '男',
    }, {
        value: 2,
        label: '女',
    }];
    private workpalceOption: SelectValue[] = [];
    private highEducationOption = [{
        value: 1,
        label: '博士',
    }, {
        value: 2,
        label: '硕士',
    }, {
        value: 3,
        label: '本科',
    }, {
        value: 4,
        label: '专科',
    }, {
        value: 5,
        label: '高中',
    }];
    private employeeOriginOption: SelectValue[] = [];
    private workNatureOption = [{
        value: 1,
        label: '正式',
    }, {
        value: 2,
        label: '临时',
    }];
    private basicFormItem: FormItem[] = [{
        type: 'input',
        label: '员工工号',
        key: 'num',
    }, {
        type: 'input',
        label: '员工(姓)',
        key: 'first_name',
        param: {
            rules: [{
                required: true,
                message: ' ',
            }],
        },
    }, {
        type: 'input',
        label: '员工(名)',
        key: 'last_name',
        param: {
            rules: [{
                required: true,
                message: ' ',
            }],
        },
    }, {
        type: 'input',
        label: '英文名',
        key: 'nick_name',
        param: {
            rules: [{
                required: true,
                message: ' ',
            }],
        },
    }];
    @Emit()
    private created() {
        this.fetchData();
    }
    private fetchData() {
        getWorkLocation().then((response) => {
            this.workpalceOption = this.transformSelectData(response);
        });
        getEmploymentSource().then((response) => {
            this.employeeOriginOption = this.transformSelectData(response);
            console.log(this.employeeOriginOption);
        });
    }
    private transformSelectData(data: any) {
        return _.map(data, function(item: BasicData) {
            return {
                value: item.id,
                label: item.name,
            };
        });
    }
    private renderFormItem(getFieldDecorator: any, item: any): (JSX.Element | null) {
        let itemDom = null;
        switch (item.type) {
            case 'input':
                itemDom = <a-input placeholder={item.placeholder}></a-input>;
                break;
            default:
                break;
        }
        return (
            <a-col {...{ props: this.basicItemLayout }}>
                <a-form-item {...{ props: this.fromItemLayout }} label={item.label}>
                    {getFieldDecorator(item.key, {...item.param})(itemDom)}
                </a-form-item>
            </a-col>
        );
    }
    @Emit()
    private nextStep() {
        this.Form.validateFields((err: any, values: object) => {
            if (!err) {}
        });
        // this.$emit('nextStep');
    }
    private render() {
        const { getFieldDecorator } = this.Form as any;
        const thiz = this;
        return (
            <div>
                <a-row gutter={24}>
                    <a-divider class='diliver_item'>基本资料</a-divider>
                    <a-col xl={20} lg={24} md={24} sm={24} xs={24} class='basicData'>
                        <a-row>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='员工工号'>
                                    {getFieldDecorator('num')(<a-input></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='员工(姓)'>
                                    {getFieldDecorator('first_name', {
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-input></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='员工(名)'>
                                    {getFieldDecorator('last_name', {
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-input></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col { ... {props: this.basicItemLayout} }>
                                <a-form-item {...{ props: this.fromItemLayout }} label='英文名'>
                                    {getFieldDecorator('nick_name')(<a-input></a-input>)}
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='出生日期'>
                                    {getFieldDecorator('birthOfDate', {
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-date></a-date>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='婚否'>
                                    {getFieldDecorator('isMarried', {
                                        initialValue: this.marryStateOption[0],
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.marryStateOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.value}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='最高学历'>
                                    {getFieldDecorator('highEducation', {
                                        initialValue: this.highEducationOption[0],
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.highEducationOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.value}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='性别'>
                                    {getFieldDecorator('sex', {
                                        initialValue: this.sexOption[0].value,
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-raido-group size='small'>{this.sexOption.map((
                                        item: any, index: number) => <a-radio
                                        key={index} value={item.value}>{item.label}</a-radio>)}</a-raido-group>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='入职日期'>
                                    {getFieldDecorator('employeeDate', {
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-date></a-date>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='入职来源'>
                                    {getFieldDecorator('employeeOrigin', {
                                        initialValue: this.employeeOriginOption[0],
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.employeeOriginOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.value}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='介绍人'>
                                    {getFieldDecorator('employeeIntroducer')(<a-input
                                    placeholder='PG.Liang'></a-input>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='试用期'>
                                    {getFieldDecorator('dueDate')(<ProbationForm/>)}
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='工作地点'>
                                    {getFieldDecorator('workplace', {
                                        initialValue: this.workpalceOption[0],
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.workpalceOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.value}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='工作性质'>
                                    {getFieldDecorator('workNature', {
                                        initialValue: this.workNatureOption[0],
                                        rules: [{
                                            required: true,
                                            message: ' ',
                                        }],
                                    })(<a-select labelInValue>
                                        {this.workNatureOption.map((item: any, index: number) => <a-option
                                        key={index} value={item.value}>{item.label}</a-option>)}
                                    </a-select>)}
                                </a-form-item>
                            </a-col>
                            <a-col {...{props: this.basicItemLayout}}>
                                <a-form-item {...{props: this.fromItemLayout}} label='员工状态'>
                                    {getFieldDecorator('employeeStatus')(<a-tag color='#2db7f5'>正式员工</a-tag>)}
                                </a-form-item>
                            </a-col>
                            <a-col span={24}>
                                <a-form-item {...{props: {labelCol: {span: 2}, wrapperCol: {span: 22}}}} label='能力&特长'>
                                    {getFieldDecorator('personalAbilityDescription')(<a-textarea rows={4}/>)}
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-divider class='diliver_item requiredLine'>身份证件信息</a-divider>
                            <LegalTable/>
                            <a-divider class='diliver_item requiredLine'>联系电话</a-divider>
                            <PhoneTable/>
                            <a-divider class='diliver_item requiredLine'>联系地址</a-divider>
                            <AddressTable/>
                            <a-divider class='diliver_item requiredLine'>紧急联系人资料</a-divider>
                            <ContactTable/>
                            <a-divider class='diliver_item requiredLine'>职位信息</a-divider>
                            <PositionTable/>
                        </a-row>
                    </a-col>
                    <a-col xl={4} lg={24} md={24} sm={24} xs={24}>
                        <a-upload name='avatar' showUploadList={false}
                        listType='picture-card' class='avatar-uploader'>
                            <div class='Avatar'>
                                <div class='container'>
                                    <img src='https://pictrue-1256199976.cos.ap-guangzhou.myqcloud.com/u929.jpg'></img>
                                </div>
                                <span>点击图片更换</span>
                                <span>提示：上传的图片不能超过3M</span>
                            </div>
                        </a-upload>
                    </a-col>
                </a-row>
                <a-row class='bottom_button'><a-button type='primary' on-click={this.nextStep}>下一步</a-button></a-row>
            </div>
        );
    }
}
export default Form.create()(Step1);
