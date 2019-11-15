<template>
    <div>
        <a-divider class='diliver_item'>电脑登录账户</a-divider>
        <a-col :offset="1">
            <a-checkbox>开通局域网电脑登录账号</a-checkbox>
        </a-col>
        <a-divider class='diliver_item'>企业邮箱</a-divider>
        <a-col :span="4" :offset="1">
            <a-form-item>
                <a-checkbox>开通企业邮箱</a-checkbox>
            </a-form-item>
        </a-col>
        <a-col :span="17">
            <a-form-item>
                <a-radio-group :value="1">
                    <a-radio value="1">默认邮箱用户名</a-radio>
                    <a-radio value="2">期望邮箱用户名</a-radio>
                    <a-input style='marginLeft: 8px'></a-input>
                </a-radio-group>
            </a-form-item>
        </a-col>
        <a-divider>企业钉钉</a-divider>
        <a-col :span="4" :offset="1">
            <a-checkbox>开通企业钉钉</a-checkbox>
        </a-col>
        <a-col :span="16" class='red'>*需要有效的手机号码</a-col>
        <a-row v-if="employeeStatus !== 3">
          <a-col v-bind="botttomLayout" style="marginTop: 20px">
              <a-col v-bind="bottomLayoutBtn">
                  <a-button type="primary" @click="preStep">上一步</a-button>
              </a-col>
              <a-col v-bind="bottomLayoutBtn">
                  <a-button type="primary" @click="nextStep">下一步</a-button>
              </a-col>
          </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Emit } from 'vue-property-decorator';
@Component({
    components: {},
})
export default class Step6 extends Vue {
    private $store: any;
    private employeeStatus: number = 1;
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    };
    private created() {
        const { employeeStatus } = this.$store.state.step;
        this.employeeStatus = employeeStatus;
    }
    private nextStep() {
        this.$emit('nextStep');
    }
    private preStep() {
        this.$emit('preStep');
    }
}
</script>

