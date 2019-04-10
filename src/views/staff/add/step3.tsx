import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Row, Divider, Col, Input, DatePicker, Radio, Upload, Button, Icon } from 'ant-design-vue';
@Component({
    components: {
        'a-row': Row,
        'a-divider': Divider,
        'a-col': Col,
        'a-form-item': Form.Item,
        'a-input': Input,
        'a-date-picker': DatePicker,
        'a-radio': Radio,
        'a-radio-group': Radio.Group,
        'a-upload': Upload,
        'a-button': Button,
        'a-icon': Icon,
    },
    props: {
        Form,
    }
})
class Step3 extends Vue {
    private basicItemLayout = {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
    };
    private fromItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    private Form: any;
    private render() {
        const { getFieldDecorator } = this.Form as any;
        return(
            <div>
                <a-row gutter={24} class='basicData'>
                    <a-divider class='diliver_item'>证件资料</a-divider>
                    <a-row>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='证件/证书类型'>
                                {getFieldDecorator('credentialType', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='证件/证书名称'>
                                {getFieldDecorator('credentialName', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-input></a-input>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='颁发日期'>
                                {getFieldDecorator('issueDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-date-picker></a-date-picker>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label='有效日期'>
                                {getFieldDecorator('expireDate', {
                                    rules: [{
                                        required: true,
                                        message: ' ',
                                    }],
                                })(<a-radio-group>
                                    <a-col {...{props: {lg:{span: 8}}}}><a-radio value='1'>永久</a-radio></a-col>
                                    <a-col {...{props: {lg:{span: 16}}}}>
                                        <a-radio value='2' style='width:130px'>
                                            <a-date-picker></a-date-picker>
                                        </a-radio>
                                    </a-col>
                                </a-radio-group>)}
                            </a-form-item>
                        </a-col>
                        <a-col {...{props: this.basicItemLayout}}>
                            <a-form-item {...{props: this.fromItemLayout}} label=''>
                                {getFieldDecorator('expireDate')(<a-radio-group>
                                    <a-col {...{props: {lg:{span: 8}}}}><a-radio value='1'>永久</a-radio></a-col>
                                    <a-col {...{props: {lg:{span: 16}}}}>
                                        <a-radio value='2' style='width:130px'>
                                            <a-date-picker></a-date-picker>
                                        </a-radio>
                                    </a-col>
                                </a-radio-group>)}
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-row>
            </div>
        );
    }
}
export default Form.create({
    props: {}
})(Step3);