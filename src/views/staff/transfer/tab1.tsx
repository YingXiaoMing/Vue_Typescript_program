import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Cascader, Row, Col, Select, DatePicker, Divider, Button } from 'ant-design-vue';
import { CascderOption, CascderOptionItem, BasicData, SelectValue } from '@/interface';
import { getOrginzationData, getEmployeePositionChangeType } from '@/api/basic';
import _ from 'lodash';
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
    private OriginPostionOption = [];
    private transferTypeOption: SelectValue[] = [];
    private cascderOption: CascderOption[] = [];
    private created() {
        getEmployeePositionChangeType().then((res: any) => {
            this.transferTypeOption = this.transformSelectData(res);
            console.log(this.transferTypeOption);
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
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return (
            <div>
                <a-row gutter={24}>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item label='原职位' {...{props: this.fromItemLayout}}>
                                {getFieldDecorator('originPostion',{
                                    initialValue: this.OriginPostionOption[0],
                                })(<a-select labelInValue>
                                {this.OriginPostionOption.map((item: any, index: number) => <a-option
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
                                })(<a-cascader options={this.cascderOption} style='width:100%'></a-cascader>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-row>
                <a-row class='bottom_button'>
                    <a-button type='primary'>保存</a-button>
                </a-row>
            </div>
        );
    }

}
export default Form.create({
    props: {},
})(Tab1);
