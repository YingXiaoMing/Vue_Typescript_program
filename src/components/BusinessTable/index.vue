<template>
    <a-col :span="8" style="margin:10px 0;">
        <a-table bordered :columns="column" size="small" :dataSource="data"
        :pagination="false" :loading="loading">
            <template slot="name" slot-scope="text,record">
                <a-input v-if="record.editable" :value="text"
                @change="e => handleChange(e.target.value, record.key)"></a-input>
                <template v-else>{{text}}</template>
            </template>
            <template slot="type" slot-scope="text,record">
                <a-select v-if="record.editable" 
                labelInValue :value="text" @change="e => typeHandleChange(e,record.key)">
                    <a-select-option v-for="(item,index) in optionType" :key="index" :value="item.key">{{ item.label }}</a-select-option>
                </a-select>
                <template v-else>{{text.label}}</template>
            </template>
            <template slot="action" slot-scope="text,record">
                <template v-if="record.editable">
                    <span v-if="record.isNew">
                        <a @click="addRow(record.key)">添加</a>
                    </span>
                    <span v-else>
                        <a @click="saveRow(record.key)">保存</a>
                        <a-divider type="vertical"></a-divider>
                        <a @click="makeBusinessRowNotEditable(record.key)">取消</a>
                    </span>
                </template>
                <span v-else>
                    <a @click="makeBusinessRowEditable(record.key)">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="removeRow(record.key)">删除</a>
                </span>
            </template>
        </a-table>
    </a-col>
</template>
<script lang="ts">
import Vue from 'vue';
import { ColumnList, SelectValue } from '@/interface';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Col, Divider, Input, Select, message } from 'ant-design-vue';
import _ from 'lodash';
import { newBusinessClassify, deleteBusinessClassify, patchBusinessClassify } from '@/api/basic';
interface TableData {
    type: {
        key: string;
        label: string;
    };
    key: string;
    name: string;
    editable: boolean;
    isNew: boolean;
}
@Component({
    components: {
        'a-col': Col,
        'a-table': Table,
        'a-divider': Divider,
        'a-input': Input,
        'a-select': Select,
        'a-select-option': Select.Option,
    },
})
export default class PrizeTable extends Vue {
    @Prop() private tableList!: TableData[];
    @Prop() private options!: SelectValue[];
    private loading: boolean = false;
    private data: TableData[] = this.tableList;
    private optionType: SelectValue[] = this.options;
    private cacheOriginData: { [key: string]: any } = {};
    private column: ColumnList[] = [{
        title: '奖/惩',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'type' },
    }, {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Watch('tableList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Watch('options')
    private optionDataChange(value: any) {
        this.data = value;
    }
    private handleChange(value: any, key: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            target.name = value;
        }
    }
    private makeBusinessRowEditable(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    private typeHandleChange(value: any, key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            target.type = value;
        }
    }
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (this.cacheOriginData[key] && !_.isEqual(this.cacheOriginData[key].name, target.name)) {
            patchBusinessClassify(key, {
                askforLeaveOvertimeBusinesstripTypeClassifyValue: target.type.key,
                name: target.name,
            }).then(() => {
                const newData = [...this.data];
                target.editable = false;
            });
        } else {
            const newData = [...this.data];
            target.editable = false;
        }
    }
    private addRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target && this.isNullData(target)) {
            newBusinessClassify({
                name: target.name,
                askforLeaveOvertimeBusinesstripTypeClassifyValue: target.type.key,
            }).then((res: any) => {
                const newData = [...this.data];
                target.editable = false;
                target.key = res.id;
                target.isNew = false;
                this.data.push({
                    name: '',
                    editable: true,
                    isNew: true,
                    key: 'new_i2_1',
                    type: this.optionType[0],
                });
            });
        }
    }
    private removeRow(key: string) {
        deleteBusinessClassify(key).then(() => {
            const newData = this.data.filter((item) => !_.isEqual(item.key, key));
            this.data = newData;
        });
    }
    private isNullData(target: TableData): boolean {
        if (target.name === '') {
            message.error('奖惩名称不能为空');
            return false;
        }
        return true;
    }
    private makeBusinessRowNotEditable(key: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data =  newData;
        }
        target.editable = false;
    }
}
</script>
