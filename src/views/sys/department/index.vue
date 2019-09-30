<template>
    <div class='department_wrapper'>
        <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :span="24">
                    <div class="colorMark">
                        <div class="mark-inline">
                            <div class="circle deepblue"></div>
                            <span>公司</span>
                        </div>
                        <div class="mark-inline">
                            <div class="circle blue"></div>
                            <span>部门</span>
                        </div>
                    </div>
                    <vue-organization :datasource="data">
                        <template slot-scope="{ nodeData }">
                            <a-popover placement="rightTop" v-if="nodeData.description === 'company'">
                                <template slot="content">
                                    <div class="mind-Btn">
                                        <a-button class="child-Btn" size="small" @click="newCompany(nodeData)">新增公司</a-button>
                                        <a-button class="child-Btn" size="small" @click="newDepartment(nodeData)">新增部门</a-button>
                                        <a-button class="child-Btn" size="small" @click="edit(nodeData,'company')">编辑</a-button>
                                        <a-button class="child-Btn" size="small" @click="deleteCompany(nodeData)">删除</a-button>
                                    </div>
                                </template>
                                <div class="title">{{nodeData.name}}</div>
                            </a-popover>
                            <a-popover placement="rightTop" v-if="nodeData.description === 'department'">
                                <template slot="content">
                                    <div class="mind-Btn">
                                        <a-button class="child-Btn" size="small" @click="newDepartment(nodeData)">新增部门</a-button>
                                        <a-button class="child-Btn" size="small" @click="edit(nodeData,'department')">编辑</a-button>
                                        <a-button class="child-Btn" size="small" @click="deleteDepartment(nodeData)">删除</a-button>
                                    </div>
                                </template>
                                <div class="title department">{{nodeData.name}}</div>
                                <div class="content department" v-for="p in nodeData.positions">{{p.name}}</div>
                            </a-popover>
                        </template>
                    </vue-organization>
                </a-col>
            </a-row>
        </a-card>
        <a-mind-modal :visible="visible" @cancel="handleCancel" :tabName="tabName" 
        @InputHanlde="InputHanlde" @getOrganizationData="getOrganizationData"
        :isNew="isNew" :newId="newId" :headName="headName" :titleName="titleName"></a-mind-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Card, Row, Col, Popover, Button } from 'ant-design-vue';
import OrganizationChart from 'vue-organization-chart';
import { getCompanyOrganizationChart } from '@/api/operation';
import MindModal from '@/components/MindModal/index.vue';
import { deleteCompany, deleteDepartment } from '@/api/operation';
import _ from 'lodash';
import 'vue-organization-chart/dist/orgchart.css';
import './index.less';
interface Data {
    name: string;
    id: string;
    description: string;
    parentCompanyId?: string;
    parentDepartmentId?: string;
}
interface PositionData {
    id: string;
    name: string;
    key: string;
    parentCompanyId?: string;
    parentDepartmentId?: string;
    editable: boolean;
    isNew: boolean;
}
interface TableData {
    key: string;
    name: string;
    id: string;
    description: string;
    parentCompanyId?: string;
    parentDepartmentId?: string;
    children?: Data[];
    positions?: PositionData[];
}

@Component({
    components: {
        'a-card': Card,
        'a-row': Row,
        'a-col': Col,
        'vue-organization': OrganizationChart,
        'a-popover': Popover,
        'a-button': Button,
        'a-mind-modal': MindModal,
    },
})
export default class Department extends Vue {
    private data = {};
    private visible: boolean = false;
    private tabName: TableData = {name: '', description: '', id: '', positions: [], key: ''};
    private isNew: boolean = false;
    private newId: string = '1';  // 1代表新增公司  2代表新增部门
    private headName: string = '';
    private titleName: string = '';
    private $confirm: any;
    private created() {
        this.getOrganizationData();
    }
    private getOrganizationData() {
        getCompanyOrganizationChart().then((res: any) => {
            const data = res.data;
            const newData: TableData = {
                name: data.name,
                description: 'company',
                id: data.id,
                key: data.id,
                children: [],
            };
            if (data.subCompanies) {
                this.traverseStepNodeChildren(data.subCompanies, newData, 'company');
            }
            if (data.departments) {
                this.traverseStepNodeChildren(data.departments, newData, 'department');
            }
            this.data = newData;
        });
    }
    private newDepartment(data: TableData) {
        const newData = _.cloneDeep(data);
        newData.name = '';
        this.tabName = newData;
        this.headName = '新增部门';
        this.titleName = '部门名称';
        this.isNew = true;
        this.newId = '2';
        this.visible = true;
    }
    private newCompany(data: TableData) {
        const newData = _.cloneDeep(data);
        newData.name = '';
        this.tabName = newData;
        this.isNew = true;
        this.headName = '新增公司';
        this.titleName = '公司名称';
        this.newId = '1';
        this.visible = true;
    }
    private deleteCompany(data: TableData) {
        const thiz = this;
        this.$confirm({
            title: '你确定删除此公司吗?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteCompany(data.id).then((res) => {
                    thiz.getOrganizationData();
                });
            },
        });
    }
    private deleteDepartment(data: TableData) {
        const thiz = this;
        this.$confirm({
            title: '你确定删除此部门吗?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                if (data.parentCompanyId) {
                    deleteDepartment(data.parentCompanyId, data.id).then((res) => {
                        thiz.getOrganizationData();
                    });
                }
            },
        });
    }
    private handleCancel() {
        this.visible = false;
    }
    private edit(data: TableData, nodeName: string) {
        switch (nodeName) {
            case 'company':
                this.headName = '编辑公司';
                this.titleName = '公司名称';
                break;
            default:
                this.headName = '编辑部门';
                this.titleName = '部门名称';
                break;
        }
        const newData = _.cloneDeep(data);
        if (newData.positions) {
            newData.positions.push({
                key: '1',
                id: '1',
                name: '',
                parentCompanyId: newData.parentCompanyId,
                parentDepartmentId: newData.id,
                editable: true,
                isNew: true,
            });
        }
        this.tabName = newData;
        this.isNew = false;
        this.visible = true;
    }
    private InputHanlde(name: string) {
        this.tabName.name = name;
    }
    private traverseStepNodeChildren(data: any, TopParentNode: TableData, descriptionName: string) {
        if (data) {
            const target =  _.map(data, (item) => {
                const newTarget: TableData = {
                    name: item.name,
                    key: item.id,
                    id: item.id,
                    description: descriptionName,
                    children: [],
                };
                switch (descriptionName) {
                    case 'company':
                        newTarget.parentCompanyId = item.parentCompanyId;
                        break;
                    case 'department':
                        newTarget.parentCompanyId = item.companyId;
                        break;
                    default:
                        newTarget.parentDepartmentId = item.departmentId;
                        newTarget.parentCompanyId = TopParentNode.parentCompanyId;
                        break;
                }
                if (item.subCompanies) {
                    this.traverseStepNodeChildren(item.subCompanies, newTarget, 'company');
                }
                if (item.departments) {
                    this.traverseStepNodeChildren(item.departments, newTarget, 'department');
                }
                if (item.subDepartments) {
                    this.traverseStepNodeChildren(item.subDepartments, newTarget, 'department');
                }
                if (item.positions) {
                    this.traverseStepNodeChildren(item.positions, newTarget, 'position');
                }
                return newTarget;
            });
            if (_.isEqual(descriptionName, 'position')) {
                TopParentNode.positions = _.map(target, (it) => {
                    return {
                        key: it.id,
                        id: it.id,
                        name: it.name,
                        parentCompanyId: it.parentCompanyId,
                        parentDepartmentId: it.parentDepartmentId,
                        editable: false,
                        isNew: false,
                    };
                });
            } else {
                if (TopParentNode.children) {
                    TopParentNode.children = _.concat(TopParentNode.children, target);
                }
            }
        }
    }

}
</script>

