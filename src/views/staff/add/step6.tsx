import { Component, Vue, Emit } from 'vue-property-decorator';
import { Form, Divider, Checkbox, Col, Radio, Input, Row, Button } from 'ant-design-vue';
@Component({
    components: {
        'a-divider': Divider,
        'a-check-box': Checkbox,
        'a-col': Col,
        'a-radio-group': Radio.Group,
        'a-radio': Radio,
        'a-input': Input,
        'a-row': Row,
        'a-form-item': Form.Item,
        'a-button': Button,
    },
    props: {
        Form,
    },
})
class Step6 extends Vue {
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    };
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private $store: any;
    @Emit()
    private nextStep() {
        this.$emit('nextStep');
    }
    @Emit()
    private preStep() {
        this.$emit('preStep');
    }
    private render() {
        const { employeeStatus } = this.$store.state.step;
        return(
            <div class='basciData'>
                <a-divider class='diliver_item'>电脑登录账户</a-divider>
                <a-col offset={1}>
                    <a-check-box>开通局域网电脑登录账号</a-check-box>
                </a-col>
                <a-divider class='diliver_item'>企业邮箱</a-divider>
                <a-col offset={1} span={4}>
                    <a-form-item>
                        <a-check-box>开通企业邮箱</a-check-box>
                    </a-form-item>
                </a-col>
                <a-col span={17}>
                    <a-form-item>
                        <a-radio-group value={1}>
                            <a-radio value={1}>默认邮箱用户名</a-radio>
                            <a-radio value={2}>期望邮箱用户名
                            <a-input style='marginLeft: 8px'></a-input>
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-divider>企业钉钉</a-divider>
                <a-col offset={1} span={4}>
                    <a-check-box>开通企业钉钉</a-check-box>
                </a-col>
                <a-col span={16} class='red'>*需要有效的手机号码</a-col>
                {employeeStatus === 3 ? null : <a-row>
                    <a-col {...{props: this.botttomLayout}}>
                        <a-col {...{props: this.bottomLayoutBtn}}>
                            <a-button type='primary' on-click={this.preStep}>上一步</a-button>
                        </a-col>
                        <a-col {...{props: this.bottomLayoutBtn}}>
                            <a-button type='primary' on-click={this.nextStep}>下一步</a-button>
                        </a-col>
                    </a-col>
                </a-row>}
            </div>
        );
    }
}
export default Form.create({
    props: {},
})(Step6);
