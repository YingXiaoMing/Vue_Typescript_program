<template>
    <a-modal :visible="isVisible" :title="headName" @cancel="cancenlHandle" @ok="okHandle">
        <a-row>
            <a-form layout="inline">
                <a-form-item :label="titleName">
                    <a-input v-model="name" @change="(e) => handleChange(e.target.value)"></a-input>
                </a-form-item>
            </a-form>
        </a-row>
        <template v-if="!isNew && tabName.description === 'department'">
            <a-row style="marginTop:20px">
                <v-table :tabList="tabName.positions"></v-table>  
            </a-row>
        </template>
    </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Modal, Form, Row, Input } from 'ant-design-vue';
import VTable from './table.vue';
import { newCompany, editCompanyData, editDepartmentData, newDepartment, newHeadDeepartment } from '@/api/operation';
import _ from 'lodash';
interface PropData {
    name: string;
    id: string;
    description: string;
    parentCompanyId?: string;
    parentDepartmentId?: string;
    positions: PositionData[];
}
interface PositionData {
    name: string;
    id: string;
    parentCompanyId: string;
    parentDepartmentId: string;
}
@Component({
    components: {
        'a-modal': Modal,
        'a-form': Form,
        'a-form-item': Form.Item,
        'a-row': Row,
        'a-input': Input,
        'v-table': VTable,
    },
})
export default class MindModal extends Vue {
    @Prop({ default: false}) private visible!: boolean;
    @Prop({ default: {} }) private tabName!: PropData;
    @Prop({ default: false }) private isNew!: boolean;
    @Prop({ default: '' }) private newId!: string;
    @Prop({ default: '' }) private headName!: string;
    @Prop({ default: '' }) private titleName!: string;
    private positionData = this.tabName.positions;
    private isVisible: boolean = this.visible;
    private name: string = this.tabName.name;
    private stName: string = '';
    @Watch('visible')
    private visibleChange(value: any) {
        this.isVisible = value;
    }
    @Watch('tabName')
    private tabNameChange(value: PropData) {
        this.name = value.name;
    }
    private cancenlHandle() {
        this.isVisible = false;
        this.$emit('getOrganizationData');
        this.$emit('cancel');
    }
    private okHandle() {
        if (this.isNew) {
            this.newOperation();
        } else {
            this.editOperation();
        }
    }
    private newOperation() {
        switch (this.tabName.description) {
            case 'company':
                if (_.isEqual(this.newId, '1')) {
                    newCompany({
                        parentCompanyId: this.tabName.id,
                        name: this.name,
                        description: '',
                    }).then((res) => {
                        this.isVisible = false;
                        this.$emit('getOrganizationData');
                        this.$emit('cancel');
                    });
                } else if (_.isEqual(this.newId, '2')) {
                    newHeadDeepartment(this.tabName.id,{
                        name: this.tabName.name,
                        description: '',
                    }).then((res) => {
                        this.isVisible = false;
                        this.$emit('getOrganizationData');
                        this.$emit('cancel');
                    });
                }
                break;
            case 'department':
                    if (this.tabName.parentCompanyId) {
                        newDepartment(this.tabName.parentCompanyId, {
                            parentDepartmentId: this.tabName.id,
                            name: this.tabName.name,
                            description: '',
                        }).then((res) => {
                            this.isVisible = false;
                            this.$emit('getOrganizationData');
                            this.$emit('cancel');
                        });
                    }
                    break;
            default:
                break;
        }
    }
    private editOperation() {
        switch (this.tabName.description) {
            case 'company':
                editCompanyData(this.tabName.id, [{
                    op: 'replace',
                    path: '/name',
                    value: this.name,
                }]).then((res) => {
                    this.isVisible = false;
                    this.$emit('getOrganizationData');
                    this.$emit('cancel');
                });
                break;
            case 'department':
                if (this.tabName.parentCompanyId) {
                    editDepartmentData(this.tabName.parentCompanyId, this.tabName.id, [{
                        op: 'replace',
                        path: '/name',
                        value: this.name,
                    }]).then((res) => {
                        this.isVisible = false;
                        this.$emit('getOrganizationData');
                        this.$emit('cancel');
                    });
                }
                break;
            default:
                break;
        }
    }
    private handleChange(name: string) {
        this.name = name;
        this.$emit('InputHanlde', name);
    }
}
</script>

