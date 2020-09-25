<template>
    <div>
        <a-row>
            <a-col :span="6">
                <div class="row_base row_left">
                    <div class="data_list linkBgColor">
                        <div class="leftItem">
                            <p class="investor">劳动合同情况</p>
                        </div>
                        <div class="rightItem">
                            <div class="r_item_text">已过期: <span style="color:red">{{ contractExpirationStatistics.haveExpiredCount }}</span>&nbsp人</div>
                            <div class="r_item_text">一个月内到期: <span style="color:red">{{ contractExpirationStatistics.haveMonthExpiredCount }}</span>&nbsp人</div>
                            <div class="r_item_text">未签订: <span style="color:red">{{ contractExpirationStatistics.notSignedCount }}</span>&nbsp人</div>
                        </div>
                    </div>
                    <div class="data_footer">
                        <div class="right" @click="clickWorkData">
                            查看更多
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="row_base row_left">
                    <div class="data_list linkBgColor">
                        <div class="leftItem">
                            <p class="investor">试用期到期员工</p>
                        </div>
                        <div class="rightItem">
                            <div class="r_item_text">总共: <span style="color:red">12</span>&nbsp人</div>
                            <div class="r_item_text">已到期人数: <span style="color:red">3</span>&nbsp人</div>
                            <div class="r_item_text">7天内到期人数: <span style="color:red">8</span>&nbsp人</div>
                        </div>
                    </div>
                    <div class="data_footer">
                        <div class="right" @click="clickEmployeeData">
                            查看更多
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="row_base row_left">
                    <div class="data_list linkBgColor">
                        <div class="leftItem">
                            <p class="investor">证件/证书到期情况</p>
                        </div>
                        <div class="rightItem">
                            <div class="r_item_text">已到期: <span style="color:red">12</span>&nbsp人</div>
                            <div class="r_item_text">一个月内到期人数: <span style="color:red">3</span>&nbsp人</div>
                        </div>
                    </div>
                    <div class="data_footer">
                        <div class="right" @click="clickCertificateData">
                            查看更多
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
        <a-modal :visible="isVisible1" title="劳动合同列表" :width="1228" :maskClosable="false"
        class="basciData" @cancel="cancelHandle1" @ok="okHandle1">
        <a-row :gutter="24">
            <a-col :span="24" style="marginBottom: 10px">
                <div class="right">
                    <a-button @click="downloadModal('/InstrumentPanel/ExportContractExpirationList')">导出模板</a-button>
                </div>
            </a-col>
            <a-col :span="24">
                <a-table bordered size="small" :columns="column" :dataSource="data" :loading="loading1" class="xl_table">
                    <template slot="position" slot-scope="position">
                        <div v-for="(t, i) in position">
                            <template v-if="i == 0">{{ t }}（主职位）</template>
                            <template v-else>{{ t }}</template>
                        </div>
                    </template>
                </a-table>
            </a-col>
        </a-row>
        </a-modal>
        <a-modal :visible="isVisible2" title="试用到期员工列表" :width="828" :maskClosable="false"
        class="basciData" @cancel="cancelHandle2" @ok="okHandle2">
            <a-row :gutter="24">
                <a-col :span="24" style="marginBottom: 10px">
                    <div class="right">
                        <a-button>导出模板</a-button>
                    </div>
                </a-col>
                <a-col :span="24">
                    <a-table bordered size="small" :columns="column1" :dataSource="data1">
                    </a-table>
                </a-col>
            </a-row>
        </a-modal>
        <a-modal :visible="isVisible3" title="证件/证书到期情况列表" :width="828" :maskClosable="false"
        class="basciData" @cancel="cancelHandle3" @ok="okHandle3">
            <a-row :gutter="24">
                <a-col :span="24" style="marginBottom: 10px">
                    <div class="right">
                        <a-button>导出模板</a-button>
                    </div>
                </a-col>
                <a-col :span="24">
                    <a-table bordered size="small" :columns="column2" :dataSource="data2">
                    </a-table>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import moment from 'moment';
import { ColumnList } from '@/interface';
import config from '@/utils/config';
import { GetContractExpirationData, GetContractExpirationList } from '@/api/basic';
@Component({
    components: {},
})
export default class UploadModal extends Vue {
    private data = [];
    private data1 = [];
    private data2 = [];
    private loading1: boolean = false;
    private dateFormat = 'YYYY-MM-DD';
    private contractExpirationStatistics = {
        haveExpiredCount: 0,
        haveMonthExpiredCount: 0,
        notSignedCount: 0,
    }
    private column1: ColumnList[] = [{
        title: '员工工号',
        dataIndex: 'num',
        align: 'center',
        scopedSlots: { customRender: 'contractType' },
    }, {
        title: '员工姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '性别',
        dataIndex: 'gender',
        align: 'center',
        scopedSlots: { customRender: 'gender' },
    }, {
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '在职状态',
        dataIndex: 'employeeStatus',
        align: 'center',
        scopedSlots: { customRender: 'employeeStatus' },
    }, {
        title: '工作性质',
        dataIndex: 'employeeType',
        align: 'center',
        scopedSlots: { customRender: 'employeeType' },
    }, {
        title: '工作地点',
        dataIndex: 'workplace',
        align: 'center',
        scopedSlots: { customRender: 'workplace' },
    }, {
        title: '试用期至',
        dataIndex: 'expired',
        align: 'center',
        scopedSlots: { customRender: 'expired' },
    }];
    private column2: ColumnList[] = [{
        title: '员工工号',
        dataIndex: 'num',
        align: 'center',
        scopedSlots: { customRender: 'contractType' },
    }, {
        title: '员工姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '性别',
        dataIndex: 'gender',
        align: 'center',
        scopedSlots: { customRender: 'gender' },
    }, {
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '在职状态',
        dataIndex: 'employeeStatus',
        align: 'center',
        scopedSlots: { customRender: 'employeeStatus' },
    }, {
        title: '工作性质',
        dataIndex: 'employeeType',
        align: 'center',
        scopedSlots: { customRender: 'employeeType' },
    }, {
        title: '工作地点',
        dataIndex: 'workplace',
        align: 'center',
        scopedSlots: { customRender: 'workplace' },
    }, {
        title: '证件/证书类型',
        dataIndex: 'certificateType',
        align: 'center',
        scopedSlots: { customRender: 'expired' },
    }, {
        title: '证件/证书名称',
        dataIndex: 'certificateName',
        align: 'center',
        scopedSlots: { customRender: 'employeeStatus' },
    }, {
        title: '颁发日期',
        dataIndex: 'startDate',
        align: 'center',
        scopedSlots: { customRender: 'employeeType' },
    }, {
        title: '有效日期',
        dataIndex: 'endDate',
        align: 'center',
        scopedSlots: { customRender: 'workplace' },
    }];
    private column: ColumnList[] = [{
        title: '员工工号',
        dataIndex: 'num',
        align: 'center',
        scopedSlots: { customRender: 'num' },
    }, {
        title: '员工姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '性别',
        dataIndex: 'gender',
        align: 'center',
        scopedSlots: { customRender: 'gender' },
    }, {
        title: '职位',
        dataIndex: 'position',
        width: 338,
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '在职状态',
        dataIndex: 'employeeStatus',
        align: 'center',
        scopedSlots: { customRender: 'employeeStatus' },
    }, {
        title: '工作性质',
        dataIndex: 'employeeType',
        align: 'center',
        scopedSlots: { customRender: 'employeeType' },
    }, {
        title: '工作地点',
        dataIndex: 'workplace',
        align: 'center',
        scopedSlots: { customRender: 'workplace' },
    }, {
        title: '合同类型',
        dataIndex: 'contractType',
        align: 'center',
        scopedSlots: { customRender: 'contractType' },
    }, {
        title: '合同名称',
        dataIndex: 'contractName',
        align: 'center',
        scopedSlots: { customRender: 'contractName' },
    }, {
        title: '合同编号',
        dataIndex: 'contractNum',
        align: 'center',
        scopedSlots: { customRender: 'contractNum' },
    }, {
        title: '生效日期',
        dataIndex: 'issueDate',
        align: 'center',
        scopedSlots: { customRender: 'issueDate' },
    }, {
        title: '合同到期日期',
        dataIndex: 'expireDate',
        align: 'center',
        scopedSlots: { customRender: 'expireDate' },
    }, {
        title: '备注',
        dataIndex: 'note',
        align: 'center',
        scopedSlots: { customRender: 'note' },
    }];
    private isVisible1: boolean = false;
    private isVisible2: boolean = false;
    private isVisible3: boolean = false;
    private created() {
        GetContractExpirationData().then((res: any) => {
            this.contractExpirationStatistics.haveExpiredCount = res.data.haveExpiredCount;
            this.contractExpirationStatistics.haveMonthExpiredCount = res.data.haveMonthExpiredCount;
            this.contractExpirationStatistics.notSignedCount = res.data.notSignedCount;
        });
    }
    private cancelHandle1() {
        this.data = [];
        this.isVisible1 = false;
    }
    private okHandle1() {
        this.data = [];
        this.isVisible1 = false;
    }
    private cancelHandle2() {
        this.isVisible2 = false;
    }
    private okHandle2() {
        this.isVisible2 = false;
    }
    private cancelHandle3() {
        this.isVisible3 = false;
    }
    private okHandle3() {
        this.isVisible3 = false;
    }
    private clickWorkData() {
        this.isVisible1 = true;
        const params = new URLSearchParams();
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        this.loading1 = true;
        GetContractExpirationList(params.toString()).then((res: any) => {
            this.loading1 = false;
            this.data = _.map(res.data, (item: any) => {
                return {
                    key: item.employeeStringID,
                    num: item.employeeStringID,
                    name: item.fullName,
                    gender: item.gender,
                    position: item.positions,
                    employeeStatus: item.employeeStatus,
                    employeeType: item.employmentType,
                    workplace: item.workingLocation,
                    contractType: item.contractType,
                    contractName: item.contractName,
                    contractNum: item.contractNo,
                    issueDate: item.contractIssueDate ? moment(item.contractIssueDate).format(this.dateFormat) : '',
                    expireDate: item.contractExpireDate ? moment(item.contractExpireDate).format(this.dateFormat) : '',
                    note: item.contractNote,
                };
            });
        }).catch(() => {
            this.loading1 = false;
            this.data = [];
        });
    }
    private downloadModal(murl: string) {
        let downLink;
        downLink = config.baseUrl + murl;
        const link = document.createElement('a');
        link.href = downLink;
        link.click();
    }
    private clickEmployeeData() {
        this.isVisible2 = true;
    }
    private clickCertificateData() {
        this.isVisible3 = true;
    }
}
</script>
<style lang="less">
.xl_table {
    .ant-table-thead {
        th {
            padding: 2px 2px !important;
        }
    }
    .ant-table-tbody {
        td {
            padding: 2px 2px !important;
        }
    }
}
.row_base {
    box-sizing: border-box;
    border-radius: 6px;
    background-color: #fff;
    margin-right: 20px;
    .data_footer {
        width: 100%;
        height: 28px;
        .right {
            float: right;
            margin-right: 8px;
            color: rgba(0, 0, 0, 0.45);
            cursor: pointer;
        }
    }
    .data_list {
        text-align: center;
        font-size: 14px;
        border-radius: 6px;
        padding: 10px;
        color: #fff;
        height: 100px;
        .leftItem {
            align-items: start;
            justify-content: space-between;
            text-align: left;
            }
            .card-panel-num {
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                font-size: 30px;
                margin-left: 60%;
            }
            .investor {
                font-size: 16px;
                font-weight: bold;
                margin-left: 5px;
            }
            .number {
                font-size: 22px;
                font-weight: bold;
                margin-left: 35%;
                .perTitle {
                    font-size: 13px;
                    margin-left: 5px;
                }
            }
            .rightItem {
                // width: 62px;
                // height: 19px;
                display: flex;
                align-items: center;
                justify-content: right;
                .r_item_text {
                    margin-right: 2%;
                }
                
            }
        &.saleBgcolor {
            background: #FFA3A1;
        }
        &.txsBgcolor {
            background: #84d9d2;
        }
        &.extenedBgcolor {
            background: #87DE75;
        }
        &.likeBgcolor {
            background: #a5e7f0;
        }
        &.linkBgColor {
            background: #93b7e3;
        }
        &.keleBgColor {
            background: #edafda;
        }
    }
}
</style>

