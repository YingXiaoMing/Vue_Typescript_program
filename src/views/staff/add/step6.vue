<template>
    <div class="computerAccount">
        <a-row>
            <a-form :form="form">
                <a-row>
                        <a-divider class='diliver_item'>电脑登录账户</a-divider>
                        <template v-if="isCreate1">
                            <!-- 开通账号情况下 -->
                            <a-row>
                                <a-col :span="4">
                                    <a-form-item label="域账号" v-bind="formItemLayout">
                                        <span>{{ formData.account }}</span>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4">
                                    <a-form-item label="状态" v-bind="formItemLayout">
                                        <a-radio-group  v-decorator="['value1', { initialValue: formData.value1 }]">
                                            <a-radio :value="true">开启</a-radio>
                                            <a-radio :value="false">关闭</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="12" :offset="1">
                                    <a-button @click="updateCompanyAccountData">保存</a-button>
                                </a-col>
                            </a-row>
                        </template>
                        <template v-else>
                            <!-- 无开通情况下 -->
                            <a-row>
                                <a-col :span="4" :offset="1">
                                    <a-form-item  v-bind="formItemLayout">
                                        <a-checkbox v-decorator="['newValue1', { initialValue: formData.newValue1 }]">创建域账号</a-checkbox>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item>
                                         <span style="color: #0000006D">域账号: {{ formData.account }} 默认初始密码: Aa!123456</span>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="12" :offset="1">
                                    <a-button @click="addCompanyAccountData">保存</a-button>
                                </a-col>
                            </a-row>
                        </template>
                </a-row>
                <a-row>
                    <a-divider class='diliver_item'>企业邮箱</a-divider>
                    <template v-if="isCreate2">
                        <!-- 开通邮箱的情况下 -->
                        <a-row>
                            <a-col :span="4">
                                <a-form-item label="企业邮箱" v-bind="formItemLayout">
                                    <span>{{ formData.email }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="4">
                                <a-form-item label="状态" v-bind="formItemLayout">
                                    <a-radio-group  v-decorator="['value2', { initialValue: formData.value2 }]">
                                        <a-radio :value="true">开启</a-radio>
                                        <a-radio :value="false">关闭</a-radio>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        
                        <a-row>
                            <a-col :span="12" :offset="1">
                                <a-button @click="updateCompanyEmailData">保存</a-button>
                            </a-col>
                        </a-row>
                    </template>
                    <template v-else>
                        <a-row>
                            <a-row>
                                <a-col :span="4" :offset="1">
                                    <a-form-item  v-bind="formItemLayout">
                                        <a-checkbox v-decorator="['newValue2', { initialValue: formData.newValue2 }]" @change="handleCreateEmailChange">创建企业邮箱</a-checkbox>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4" :offset="1">
                                    <a-form-item  v-bind="formItemLayout1" label="邮箱地址">
                                        <a-input style="width: 220px" v-decorator="['emailPre', { initialValue: createEmailAccount }]" addon-after="@nssp.biz"></a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="12" :offset="1">
                                    <a-button @click="addCompanyEmailData">保存</a-button>
                                </a-col>
                            </a-row>
                        </a-row>
                    </template>
                </a-row>
                <a-row>
                    <a-divider class='diliver_item'>企业钉钉</a-divider>
                    <template v-if="isCreate3">
                        <a-row>
                            <a-row>
                                <a-col :span="4">
                                    <a-form-item label="企业钉钉" v-bind="formItemLayout">
                                        <span>{{ formData.dingding }}</span>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="6">
                                    <a-form-item label="状态" v-bind="formItemLayout1">
                                        <a-radio-group  v-decorator="['value3', { initialValue: formData.value3 }]">
                                            <a-radio :value="true">加入企业</a-radio>
                                            <a-radio :value="false">退出企业</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="12" :offset="1">
                                    <a-checkbox v-model="formData.replacePhoneNumStatus">更换手机号码加入企业钉钉</a-checkbox>
                                    <a-input style="width: 220px" v-model="formData.replacePhoneNum"></a-input>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="12" :offset="1">
                                    <a-button @click="handleCompanyDingDingData">保存</a-button>
                                </a-col>
                            </a-row>
                        </a-row>
                    </template>
                    <template v-else>
                        <a-row>
                            <a-row>
                                <a-col :span="4" :offset="1">
                                    <a-form-item  v-bind="formItemLayout">
                                        <a-checkbox v-decorator="['newValue3', { initialValue: formData.newValue3 }]" @change="handleDingDingAccountChange">创建企业钉钉</a-checkbox>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4" :offset="1">
                                    <a-form-item  v-bind="formItemLayout1" label="手机号码">
                                        <a-input style="width: 220px" v-model="createDingDingAccount"></a-input>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="12" :offset="1">
                                    <a-button @click="addCompanyDingDingData">保存</a-button>
                                </a-col>
                            </a-row>
                        </a-row>
                    </template>
                </a-row>
            </a-form>
        </a-row>
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
import { getEmployeeID } from '@/utils/cookie';
import { getEmployeeAccountData, addEmployeeCompanyAccount, addEmployeeCompanyEmail,
updateEmployeeCompoanyEmail, updateEmployeeCompanyAccount, addEmployeeCompanyDingDing,
replacePhoneNumCompanyDingDing, deleteCompanyDingDing } from '@/api/staff';
import { message } from 'ant-design-vue';

@Component({
    components: {},
})
export default class Step6 extends Vue {
    private form: any;
    private $form: any;
    private $store: any;
    private employeeStatus: number = 1;
    private employeeId: string = '';
    private bottomLayoutBtn = {
        lg: {span: 12},
        md: {span: 24},
        sm: {span: 24},
    };
    private isCreate1: boolean = true;
    private isCreate2: boolean = true;
    private isCreate3: boolean = true;
    private createEmailAccount: string = '';
    private createDingDingAccount: string = '';
    private formData = {
        value1: false,
        value2: false,
        value3: false,
        email: '',
        account: '',
        dingding: '',
        newValue1: false,
        newValue2: false,
        newValue3: false,
        replacePhoneNumStatus: false,
        replacePhoneNum: '',
        emailPre: '',
    };
    private formItemLayout = {
        labelCol: { xs: {span: 24}, sm: {span: 10}},
        wrapperCol: { xs: {span: 24}, sm: {span: 14}},
    };
    private formItemLayout1 = {
        labelCol: { xs: {span: 24}, sm: {span: 6}},
        wrapperCol: { xs: {span: 24}, sm: {span: 18}},
    }
    private botttomLayout = {
        lg: {span: 12, offset: 8},
        md: {span: 24, offset: 14},
        sm: {span: 24, offset: 14},
    };
    private created() {
        const { employeeStatus, newEmployeeId } = this.$store.state.step;
        this.employeeStatus = employeeStatus;
        switch (employeeStatus) {
            case 3:
                const employeeId = getEmployeeID();
                if (employeeId) {
                    this.employeeId = employeeId;
                    this.loadData();
                }
                break;
            default:
                this.employeeId = newEmployeeId;
                break;
        }
        this.form = this.$form.createForm(this);
    }
    private loadData() {
        getEmployeeAccountData(this.employeeId).then((res: any) => {
            const data = res.data;
            this.formData = {
                value1: data.companyAccount.isOpened,
                value2: data.emailAccount.isOpened,
                value3: data.dingDingAccount.isOpened,
                account: data.companyAccount.account,
                email: data.emailAccount.account + data.emailAccount.emailHost,
                dingding: data.dingDingAccount.account,
                newValue1: data.companyAccount.isCreate,
                newValue2: data.emailAccount.isCreate,
                newValue3: data.dingDingAccount.isCreate,
                emailPre: data.emailAccount.account,
                replacePhoneNumStatus: false,
                replacePhoneNum: '',
            };
            this.isCreate1 = data.companyAccount.isCreate;
            this.isCreate2 = data.emailAccount.isCreate;
            this.isCreate3 = data.dingDingAccount.isCreate;
            this.createEmailAccount = '';
            this.createDingDingAccount = '';
        });
    }
    private nextStep() {
        this.$emit('nextStep');
    }
    private preStep() {
        this.$emit('preStep');
    }
    private handleDingDingAccountChange(e: any) {

        this.createDingDingAccount =  e.target.checked ? this.formData.dingding : '';
    }
    private handleCreateEmailChange(e: any) {
        this.createEmailAccount =  e.target.checked ? this.formData.emailPre : '';
    }
    private addCompanyEmailData() {
        if (this.form.getFieldsValue().newValue2) {
            const param = {
                emailAccount: this.form.getFieldsValue().emailPre + '@nssp.biz',
                emailAccountDefaultPasswod: 'Aa!123456',
            };
            addEmployeeCompanyEmail(this.employeeId, param).then((res: any) => {
                message.success('新增成功');
                this.loadData();
            });
        }
    }
    private updateCompanyEmailData() {
        updateEmployeeCompoanyEmail(this.employeeId, this.form.getFieldsValue().value2).then((res: any) => {
            message.success('更新成功');
            this.loadData();
        });
    }
    private updateCompanyAccountData() {
        updateEmployeeCompanyAccount(this.employeeId, this.form.getFieldsValue().value1).then((res: any) => {
            message.success('更新成功');
            this.loadData();
        });
    }
    private handleCompanyDingDingData() {
        if (this.form.getFieldsValue().value3) {
            // 替换手机号码
            if (this.formData.replacePhoneNumStatus) {
                const param = {
                    dingDingRelatedPhonNumber: this.formData.replacePhoneNum,
                };
                replacePhoneNumCompanyDingDing(this.employeeId, param).then((res) => {
                    message.success('更换成功');
                    this.loadData();
                });
            }
        } else {
            // 退出企业钉钉
            deleteCompanyDingDing(this.employeeId).then((res) => {
                message.success('退出成功');
                this.loadData();
            });
        }
    }
    private addCompanyDingDingData() {
        if (this.form.getFieldsValue().newValue3) {
            const param = {
                dingDingRelatedPhonNumber: this.createDingDingAccount,
            };
            addEmployeeCompanyDingDing(this.employeeId, param).then((res: any) => {
                message.success('新增成功');
                this.loadData();
            });
        }
    }
    private addCompanyAccountData() {
        if (this.form.getFieldsValue().newValue1) {
            const params = {
                adAccount: this.formData.account,
            };
            addEmployeeCompanyAccount(this.employeeId, params).then((res: any) => {
                message.success('新增成功');
                this.loadData();
            });
        }
    }
}
</script>

<style lang="less">
.computerAccount {
    .ant-form-item {
        margin-bottom: 4px;
    }
}
</style>
