<template>
    <div>
        <a-row v-show="showView">
            <a-col :span="6">
                <div class="row_base row_left">
                    <div class="data_list linkBgColor" :class="changeBackgroundColor(isUrgent1)">
                        <div class="leftItem">
                            <p class="investor">合同到期/签订情况</p>
                        </div>
                        <div class="rightItem">
                            <div class="r_item_text">已过期: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent1)">{{ contractExpirationStatistics.haveExpiredCount }}</span>&nbsp人</div>
                            <div class="r_item_text">一个月内到期: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent1)">{{ contractExpirationStatistics.haveMonthExpiredCount }}</span>&nbsp人</div>
                            <div class="r_item_text">未签订: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent1)">{{ contractExpirationStatistics.notSignedCount }}</span>&nbsp人</div>
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
                    <div class="data_list" :class="changeBackgroundColor(isUrgent2)">
                        <div class="leftItem">
                            <p class="investor">试用期到期员工</p>
                        </div>
                        <div class="rightItem">
                            <div class="r_item_text">总共: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent2)">{{ employmentProbrationExpirationStatistics.expiredSumCount }}</span>&nbsp人</div>
                            <div class="r_item_text">已到期人数: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent2)">{{ employmentProbrationExpirationStatistics.haveExpiredCount }}</span>&nbsp人</div>
                            <div class="r_item_text">7天内到期人数: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent2)">{{ employmentProbrationExpirationStatistics.sevenExpiredCount }}</span>&nbsp人</div>
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
                    <div class="data_list" :class="changeBackgroundColor(isUrgent3)">
                        <div class="leftItem">
                            <p class="investor">证件/证书到期情况</p>
                        </div>
                        <div class="rightItem">
                            <div class="r_item_text">已到期: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent3)">{{ credentialExpirationStatistics.haveExpiredCount }}</span>&nbsp人</div>
                            <div class="r_item_text">一个月内到期人数: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent3)">{{ credentialExpirationStatistics.haveMonthExpiredCount }}</span>&nbsp人</div>
                        </div>
                    </div>
                    <div class="data_footer">
                        <div class="right" @click="clickCertificateData">
                            查看更多
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="row_base row_left">
                    <div class="data_list" :class="changeBackgroundColor(isUrgent4)">
                        <div class="leftItem">
                            <p class="investor">请假到期提醒</p>
                        </div>
                        <div class="rightItem">
                            <div class="r_item_text">需核假总人数: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent4)">{{ businesstripExpirationStatistics.needVerificationCount }}</span>&nbsp人</div>
                            <div class="r_item_text">逾期3天以上未核假人数: <span class="r_item_text_nums" :class="changeBackgroundColor(isUrgent4)">{{ businesstripExpirationStatistics.overdueCount }}</span>&nbsp人</div>
                        </div>
                    </div>
                    <div class="data_footer">
                        <div class="right" @click="clickAttendData">
                            查看更多
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
        <a-modal :visible="isVisible1" title="合同到期/签订情况" :width="1228" :height="330" :maskClosable="false"
        class="basciData" @cancel="cancelHandle1" @ok="okHandle1">
        <a-row :gutter="24" class="x_contauiner">
            <a-col :span="24" style="marginBottom: 10px">
                <div class="right">
                    <a-button @click="downloadModal('/InstrumentPanel/ExportContractExpirationList')">导出数据</a-button>
                </div>
            </a-col>
            <a-col :span="24">
                <a-table bordered size="small" :columns="column" :dataSource="data"
                 :loading="loading1" class="xl_table" :pagination="pagination" @change="pageWorkDataChange">
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
        <a-modal :visible="isVisible2" title="试用到期员工列表" :width="1228" :maskClosable="false"
        class="basciData" @cancel="cancelHandle2" @ok="okHandle2">
            <a-row :gutter="24" class="x_contauiner">
                <a-col :span="24" style="marginBottom: 10px">
                    <div class="right">
                        <a-button @click="downloadModal('/InstrumentPanel/ExportEmploymentProbrationExpiration')">导出数据</a-button>
                    </div>
                </a-col>
                <a-col :span="24">
                    <a-table bordered size="small" :columns="column1" :dataSource="data1" :loading="loading2"
                    :pagination="pagination1" @change="pageProbrationDataChange">
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
        <a-modal :visible="isVisible3" title="证件/证书到期情况列表" :width="1228" :maskClosable="false"
        class="basciData" @cancel="cancelHandle3" @ok="okHandle3">
            <a-row :gutter="24" class="x_contauiner">
                <a-col :span="24" style="marginBottom: 10px">
                    <div class="right">
                        <a-button @click="downloadModal('/InstrumentPanel/ExportCredentialExpirationList')">导出数据</a-button>
                    </div>
                </a-col>
                <a-col :span="24">
                    <a-table bordered size="small" :columns="column2" :dataSource="data2" :loading="loading3"
                     :pagination="pagination2" @change="pageCredentialDataChange">
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
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import moment from 'moment';
import { ColumnList, Pagination } from '@/interface';
import config from '@/utils/config';
import { GetContractExpirationData, GetContractExpirationList,
 GetEmploymentProbrationExpirationStatistics, getEmploymentProbrationExpirationStatisticsList,
 getCredentialExpirationStatistics, getCredentialExpirationStatisticsList,GetAskforLeaveOvertimeBusinesstripExpirationStatistics} from '@/api/basic';
@Component({
    components: {},
})
export default class UploadModal extends Vue {
    private data = [];
    private data1 = [];
    private data2 = [];
    private showView: boolean = false;
    private isUrgent1: string = '';
    private isUrgent2: string = '';
    private isUrgent3: string = '';
    private isUrgent4: string = '';
    private loading1: boolean = false;
    private loading2: boolean = false;
    private loading3: boolean = false;
    private dateFormat = 'YYYY-MM-DD';
    private $router: any;
    private pagination1: Pagination = {
        pageSize: 0,
        total: 0,
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15'],
        showTotal: this.showTotal,
    };
    private pagination2: Pagination = {
        pageSize: 0,
        total: 0,
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15'],
        showTotal: this.showTotal,
    };
    private pagination: Pagination = {
        pageSize: 0,
        total: 0,
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15'],
        showTotal: this.showTotal,
    };
    private employmentProbrationExpirationStatistics = {
        expiredSumCount: 0,
        haveExpiredCount: 0,
        sevenExpiredCount: 0,
    };
    private contractExpirationStatistics = {
        haveExpiredCount: 0,
        haveMonthExpiredCount: 0,
        notSignedCount: 0,
    };
    private credentialExpirationStatistics = {
        haveExpiredCount: 0,
        haveMonthExpiredCount: 0,
    };
    private businesstripExpirationStatistics = {
        needVerificationCount: 0,
        overdueCount: 0,
    };
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
        this.showView = false;
        const p1 = new Promise((resolve, reject) => {
            GetContractExpirationData().then((res: any) => {
                this.contractExpirationStatistics.haveExpiredCount = res.data.haveExpiredCount;
                this.contractExpirationStatistics.haveMonthExpiredCount = res.data.haveMonthExpiredCount;
                this.contractExpirationStatistics.notSignedCount = res.data.notSignedCount;
                if (this.contractExpirationStatistics.haveExpiredCount > 0 || this.contractExpirationStatistics.notSignedCount > 0) {
                    this.isUrgent1 = '1';
                } else if (this.contractExpirationStatistics.haveMonthExpiredCount > 0) {
                    this.isUrgent1 = '2';
                } else {
                    this.isUrgent1 = '';
                }
                resolve();
            });
        });
        const p2 = new Promise((resolve, reject) => {
            GetEmploymentProbrationExpirationStatistics().then((res: any) => {
                this.employmentProbrationExpirationStatistics.expiredSumCount = res.data.expiredSumCount;
                this.employmentProbrationExpirationStatistics.haveExpiredCount = res.data.haveExpiredCount;
                this.employmentProbrationExpirationStatistics.sevenExpiredCount = res.data.sevenExpiredCount;
                if (this.employmentProbrationExpirationStatistics.haveExpiredCount > 0) {
                    this.isUrgent2 = '1';
                } else if (this.employmentProbrationExpirationStatistics.sevenExpiredCount > 0) {
                    this.isUrgent2 = '2';
                } else {
                    this.isUrgent2 = '';
                }
                resolve();
            });
        });
        const p3 = new Promise((resolve, reject) => {
            getCredentialExpirationStatistics().then((res: any) => {
                this.credentialExpirationStatistics.haveExpiredCount = res.data.haveExpiredCount;
                this.credentialExpirationStatistics.haveMonthExpiredCount = res.data.haveMonthExpiredCount;
                if (this.credentialExpirationStatistics.haveExpiredCount > 0) {
                    this.isUrgent3 = '1';
                } else if (this.credentialExpirationStatistics.haveMonthExpiredCount > 0) {
                    this.isUrgent3 = '2';
                } else {
                    this.isUrgent3 = '';
                }
                resolve();
            });
        });
        const p4 = new Promise((resolve, reject) => {
            GetAskforLeaveOvertimeBusinesstripExpirationStatistics().then((res: any) => {
                this.businesstripExpirationStatistics.needVerificationCount = res.data.needVerificationCount;
                this.businesstripExpirationStatistics.overdueCount = res.data.overdueCount;
                if (this.businesstripExpirationStatistics.overdueCount > 0) {
                    this.isUrgent4 = '1';
                } else if (this.businesstripExpirationStatistics.needVerificationCount > 0) {
                    this.isUrgent4 = '2';
                } else {
                    this.isUrgent4 = '';
                }
                resolve();
            });
        });
        Promise.all([p1, p2, p3, p4]).then((res)  => {
            this.showView = true;
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
    private pageWorkDataChange(pagination: any, filters: any, sorter: any) {
        const params = new URLSearchParams();
        params.set('PageNumber', pagination.current.toString());
        params.set('PageSize',  pagination.pageSize.toString());
        this.loadWorkData(params);
    }
    private pageProbrationDataChange(pagination: any, filters: any, sorter: any) {
        const params = new URLSearchParams();
        params.set('PageNumber', pagination.current.toString());
        params.set('PageSize',  pagination.pageSize.toString());
        this.loadProbrationData(params);
    }
    private pageCredentialDataChange(pagination: any, filters: any, sorter: any) {
        const params = new URLSearchParams();
        params.set('PageNumber', pagination.current.toString());
        params.set('PageSize',  pagination.pageSize.toString());
        this.loadCredentialData(params);
    }
    private showTotal(total: string, range: any) {
        return  `总记录数: ${total}条`;
    }
    private loadCredentialData(param: any) {
        this.loading3 = true;
        getCredentialExpirationStatisticsList(param.toString()).then((res: any) => {
            console.log(res);
            this.data2 = _.map(res.data, (item: any, index: any) => {
                return {
                    key: index + 1,
                    num: item.employeeStringID,
                    name: item.fullName,
                    gender: item.gender,
                    position: item.positions,
                    employeeStatus: item.employmentState,
                    employeeType: item.employmentType,
                    workplace: item.workingLocation,
                    certificateType: item.credentialType,
                    certificateName: item.credentialName,
                    startDate: item.issueDate ? moment(item.issueDate).format(this.dateFormat) : '',
                    endDate: item.expireDate ? moment(item.expireDate).format(this.dateFormat) : '',
                };
            });
            this.loading3 = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination2.pageSize = paginationData.pageSize;
            this.pagination2.total = paginationData.totalCount;
            this.pagination2.current = paginationData.currentPage;
        }).catch(() => {
            this.loading3 = false;
            this.data1 = [];
            this.pagination2.pageSize = 0;
            this.pagination2.total = 0;
            this.pagination2.current = 1;
        });
    }
    private changeBackgroundColor(star: string) {
        let showClassName = '';
        switch (star) {
            case '1':
                showClassName = 'v1';
                break;
            case '2':
                showClassName = 'v2';
                break;
            default:
                break;
        };
        return showClassName;
    }
    private loadProbrationData(param: any) {
        this.loading2 = true;
        getEmploymentProbrationExpirationStatisticsList(param.toString()).then((res: any) => {
            this.data1 = _.map(res.data, (item: any, index: any) => {
                return {
                    key: index + 1,
                    num: item.employeeStringID,
                    name: item.fullName,
                    gender: item.gender,
                    position: item.positions,
                    employeeStatus: item.employmentState,
                    employeeType: item.employmentType,
                    workplace: item.workingLocation,
                    expired: item.probrationEndedDate ? moment(item.probrationEndedDate).format(this.dateFormat) : '',
                };
            });
            this.loading2 = false;
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination1.pageSize = paginationData.pageSize;
            this.pagination1.total = paginationData.totalCount;
            this.pagination1.current = paginationData.currentPage;
        }).catch(() => {
            this.loading2 = false;
            this.data1 = [];
            this.pagination1.pageSize = 0;
            this.pagination1.total = 0;
            this.pagination1.current = 1;
        });
    }
    private loadWorkData(params: any) {
         this.loading1 = true;
         GetContractExpirationList(params.toString()).then((res: any) => {
            this.loading1 = false;
            this.data = _.map(res.data, (item: any, index: any) => {
                return {
                    key: index + 1,
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
            const paginationData = JSON.parse(res.headers['x-pagination']);
            this.pagination.pageSize = paginationData.pageSize;
            this.pagination.total = paginationData.totalCount;
            this.pagination.current = paginationData.currentPage;
        }).catch(() => {
            this.loading1 = false;
            this.data = [];
            this.pagination.pageSize = 0;
            this.pagination.total = 0;
            this.pagination.current = 1;
        });
    }
    private clickWorkData() {
        this.isVisible1 = true;
        const params = new URLSearchParams();
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        this.loadWorkData(params);
    }
    private clickAttendData() {
        this.$router.push({
            name: 'attendRecord',
            params: {
                type: 1,
            },
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
        const params = new URLSearchParams();
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        this.loadProbrationData(params);
    }
    private clickCertificateData() {
        this.isVisible3 = true;
        const params = new URLSearchParams();
        params.set('PageNumber', '1');
        params.set('PageSize', '10');
        this.loadCredentialData(params);
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
    margin-right: 8px;
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
        background-color: #93b7e3;
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
                    .r_item_text_nums {
                        font-weight: bold;
                        color: red;
                        &.v1 {
                            color: #ffeb3b;
                        }
                        &.v2 {
                            color: red;
                        }
                    }
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
            background: red;
        }
        &.v1 {
            background: red !important;
        }
        &.v2 {
            background: #f7a709 !important;
        }
        &.linkBgColor {
            background:  #93b7e3;
        }
        &.keleBgColor {
            background: #edafda;
        }
    }
}
</style>

