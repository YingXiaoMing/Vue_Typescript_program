<template>
    <div class="wrapper">
        <a-row :gutter="24" class="setting_card">
            <a-col :span="12">
                <div class="SettingClassTitle">发卡员工信息</div>
                <div class="SettingClassDetail" >
                    <a-col :span="24">
                        <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="员工姓名(工号)">
                            <a-auto-complete placeholder="请输入姓名或工号进行智能搜索" @focus="focusHandle"
                            @search="handleChange" @select="onSelect" v-model="searchKey">
                                <template slot="dataSource">
                                    <a-select-option v-for="item in employeeDataList" :key="item.value">{{item.text}}</a-select-option>
                                </template>
                                <a-input @change="e => valueChange(e.target.value)"></a-input>
                            </a-auto-complete>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工工号">
                            <a-input disabled v-model="employeeNum"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="员工姓名">
                            <a-input disabled v-model="employeeName"></a-input>
                        </a-form-item>
                    </a-col>
                </div>
                <div class="SettingClassTitle">IC卡信息</div>
                <div class="SettingClassDetail">
                    <a-col :span="24">
                        <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="IC卡号">
                            <a-input v-model="cardNums" style="width: 200px" :disabled="cardNumShow"></a-input>
                            <a-button style="marginLeft: 18px" @click="shuaiCard" id="mybtn">{{ buttonText }}</a-button>
                            <div style="color:red">*刷卡时请勿进行其他操作，以免造成卡号错误</div>
                            <!--   -->
                            <div id="test">

                                <a-input v-model="cardNumsDisplay" ref="mark" @change="e => handleInputVal(e.target.value)"  class="show_input_1"
                            v-on:keydown="e => handleKeyDown(e)"></a-input>
                            </div>  
                            
                            <div class="m_red"></div>
                        </a-form-item>
                    </a-col>
                </div>
                <div class="SettingClassTitle">操作选项</div>
                <div class="SettingClassDetail">
                    <a-col :span="24">
                        <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="">
                            <a-checkbox-group v-model="operateList">
                                <a-row>
                                    <a-col :span="12">
                                        <a-checkbox value="IsXiaofei">员工信息导入消费系统</a-checkbox>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-checkbox value="IsXiaofei63">员工信息导入消费系统(新系统)</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="IsMenjin">员工信息导入门禁系统</a-checkbox>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-checkbox value="IsCreateICCardInfo">门禁发卡</a-checkbox>
                                    </a-col>
                                </a-row>
                            </a-checkbox-group>
                            <a-button @click="saveData">保存</a-button>
                        </a-form-item>
                    </a-col>
                </div>
            </a-col>
            <a-col :span="12">
                <a-card title="读取IC卡信息">
                    <div class="card_read">
                        <fieldset>
                            <legend>IC卡信息</legend>
                            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="IC卡号">
                                <a-input v-model="rCardNums" style="width: 200px" :disabled="cardNumShow"></a-input>
                                <a-button style="marginLeft: 18px" @click="rShuaiCard" id="myReadbtn">{{ rButtonText }}</a-button>
                                <div style="color:red">*刷卡时请勿进行其他操作，以免造成卡号错误</div>
                                <!--  class="show_input_1" -->
                                <div id="test">
                                    <a-input v-model="rCardNumDisplay" ref="rmark" @change="e => handleInputVal(e.target.value)"  
                                v-on:keydown="e => rhandleKeyDown(e)" class="show_input_1"></a-input>
                                </div>
                                <div class="m_red"></div>
                            </a-form-item>
                        </fieldset>
                        <fieldset>
                            <legend>查询结果</legend>
                            <a-col :span="12">
                                <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="员工编号">
                                    <span>{{ EmployeeNum }}</span>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="员工姓名">
                                    <span>{{ EmployeeName }}</span>
                                </a-form-item>
                            </a-col>
                        </fieldset>
                    </div>
                    
                </a-card>
            </a-col>
            
        </a-row>
        <a-modal :visible="isVisible" title="处理结果" :width="488" :maskClosable="false" @cancel="cancelHandle"
         >
            <div v-for="(item, index) in returnMsgList" :key="index" style="marginBottom: 10px">
                <a-alert v-if="item.code === 0" :message="item.message" type="success" show-icon />
                <a-alert v-if="item.code === 1" :message="item.message" type="error" show-icon />
            </div>
            <template slot="footer">
                <a-button @click="cancelHandle">确认</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { searchEmployeeData } from '@/api/staff';
import Component from 'vue-class-component';
import { message } from 'ant-design-vue';
import { sendCardOperation, getCardInfo } from '@/api/operation';
import moment from 'moment';
import _ from 'lodash';
interface EmployeeData {
    value: string;
    text: string;
    id: string;
    name: string;
}
@Component({
    components: {},
})
export default class CardView extends Vue {
    private labelCol = { xs: {span: 24}, sm: {span: 10}};
    private labelCol1 =  { xs: {span: 24}, sm: {span: 5}};
    private wrapperCol = { xs: {span: 24}, sm: {span: 14}};
    private wrapperCol1 =  { xs: {span: 24}, sm: {span: 19}};
    private isVisible: boolean = false;
    private readonly: boolean = true;
    private buttonText: string = '刷卡';
    private buttonType:string = 'omitted';
    private employeeName: string = '';
    private employeeNum: string = '';
    private firstEnterNum: number = 0;
    private firstEnterInput: boolean = false;
    private searchKey: string = '';
    private employeeId: string = '';
    private rCardNums: string = '';
    private rCardNumDisplay: string = '';
    private rButtonText: string = '刷卡';
    private rfirstEnterInput: boolean = false;
    private EmployeeName: string = '';
    private EmployeeNum: string = '';

    private cardNums: string = '';
    private cardNumsDisplay: string = '';
    private cardNumShow: boolean = true;
    private operateList: string[] = ['IsXiaofei' , 'IsXiaofei63', 'IsMenjin', 'IsCreateICCardInfo'];
    private employeeDataList: EmployeeData[] = [];
    private returnMsgList: any = [];
    private $info: any;
    private shuaiCard() {
        // this.readonly = true;
        this.cardNumsDisplay = '';
        this.$refs.mark.focus();
        this.handleClickCardData();
        this.buttonType = 'danger';
        this.buttonText = '请刷卡...';
        this.firstEnterInput = true;
    }

    private rShuaiCard() {
        this.rCardNumDisplay = '';
        this.$refs.rmark.focus();
        this.rHandleClickCardData();
        this.rButtonText = '请刷卡...';
        this.rfirstEnterInput = true;
    }
    private rHandleClickCardData() {
        document.addEventListener('click', (e: any) => {
            const targetSource = document.getElementById('myReadbtn');
            console.log(this.rfirstEnterInput);
            if (this.rfirstEnterInput && targetSource && !targetSource.contains(e.target)) {
                console.log('show me the money');
                this.rCardNumDisplay = '';
                this.rButtonText = '刷卡';
                this.rfirstEnterInput = false;
                document.removeEventListener('click', () => {});
            }
        });
    }
    private handleClickCardData() {
            document.addEventListener('click', (e:any) => {
                const targetSource = document.getElementById('mybtn');
                if (this.firstEnterInput && targetSource && !targetSource.contains(e.target)) {
                    console.log('let me love you');
                    console.log(e.target);
                    this.cardNumsDisplay = '';
                    this.buttonText = '刷卡';
                    this.firstEnterInput = false;
                    document.removeEventListener('click',()=>{});
                }
            });
        
        
    }
    private handleInputVal(val: string) {
        // console.log(val.length);
        // this.cardNums = val;
        // if (val.length === 9) {
        //     this.$refs.mark.blur();
        // }
    }

    private rhandleKeyDown(val: any) {
        if (val.key == 'Enter' && this.rfirstEnterInput) {
            this.rCardNums = this.rCardNumDisplay.substring(this.rCardNumDisplay.length - 8);
            this.rCardNumDisplay = '';
            this.rButtonText = '刷卡';
            this.rfirstEnterInput = false;
            getCardInfo(this.rCardNums).then(res => {
                console.log('这个碗又大又圆');
                console.log(res);
                this.EmployeeNum = res.data[0]["id"];
                this.EmployeeName = res.data[0]["name"];
            });
        }
    }

    private handleKeyDown(val: any) {
        if (val.key == 'Enter' && this.firstEnterInput) {
            // 截取最后的8位数
            this.cardNums = this.cardNumsDisplay.substring(this.cardNumsDisplay.length - 8);
            this.cardNumsDisplay = '';
            this.buttonText = '刷卡';
            this.firstEnterInput = false;
        }
    }
    private cancelHandle() {
        this.isVisible = false;
        this.searchKey = ''
        this.employeeId = '';
        this.employeeName = '';
        this.employeeNum = '';
        this.cardNums = '';
        this.operateList = ['IsXiaofei','IsXiaofei63','IsMenjin','IsCreateICCardInfo'];
    }
    private valueChange(value: string) {
        this.searchKey = value;
    }
     private onSelect(value: string) {
        const item = _.find(this.employeeDataList, {value});
        if (item) {
            this.employeeName = item.name;
            this.employeeNum = item.id;
            this.employeeId = item.value;
        }
    }
    private saveData() {
        if (this.employeeId === '') {
            message.warning('请选择其中一个员工进行操作');
            return;
        }
        const IsXiaofei = _.includes(this.operateList, 'IsXiaofei');
        const IsXiaofei63 = _.includes(this.operateList, 'IsXiaofei63');
        const IsMenjin = _.includes(this.operateList, 'IsMenjin');
        const IsCreateICCardInfo = _.includes(this.operateList, 'IsCreateICCardInfo');
        if (this.cardNums == '' && IsCreateICCardInfo) {
            message.warning('请刷员工IC卡');
            return;
        }
        const param = {
            IsXiaofei,
            IsXiaofei63,
            IsMenjin,
            IsCreateICCardInfo,
            employeeId: this.employeeId,
            icCard: this.cardNums,
        }
        sendCardOperation(param).then((res: any) => {
            console.log(res);
            this.returnMsgList = _.orderBy(res.data, 'code', 'asc') ;
            this.isVisible = true;
            
        });
    }
    private focusHandle() {
        this.handleChange(this.searchKey);
    }
    private handleChange(value: string) {
        this.fetch(value);
    }
    private fetch(value: string) {
        const params = new URLSearchParams();
        params.set('SearchQuery', value);
        params.set('ShapedFields', 'fullName,employeeStringId,id');
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        searchEmployeeData(params.toString()).then((res) => {
            const data = res.data;
            this.employeeDataList = _.map(data, (item) => {
                return {
                    value: item.id,
                    text: item.employeeStringID + '-' + item.fullName,
                    id: item.employeeStringID,
                    name: item.fullName,
                };
            });
        });
    }
}
</script>
<style lang="less">
.setting_card {
    margin-left: 0px !important;
    margin-right: 0px !important;
    .SettingClassDetail {
        // width: 630px;
        overflow: hidden;
    }
    .ant-form-item {
        margin-bottom: 12px;
    }
}
.SettingClassTitle {
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  text-indent: 1em;
  line-height: 28px;
  border-bottom: 1px solid #4767B0;
  margin-top: 2px;
  margin-bottom: 10px;
}
.show_input_1 {
    // position: absolute;17629150

    // left: 0;
    width: 200px;
    // top:60px;
    // top: 0.1px;
    z-index: -12;
}
.m_red {
    position: absolute;
    top: 73px;
    left: 0;
    width: 205px;
    height: 33px;
    background-color: #fff;
}

.card_read fieldset {
    padding: .35em .625em .75em;
    margin: 0 2px;
    border: 1px solid silver;
    margin-bottom: 10px;
    legend {
        padding: .5em;
        border: 0;
        width: auto;
        font-size: 14px;
        color: #333;
        margin-bottom: -14px;
    }
    &.department {
        margin-top: 12px;
        min-height: 112px;
        padding-top: 20px;
    }
}


</style>
