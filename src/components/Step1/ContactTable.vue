<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data">
        <template v-for="(col,u) in ['name','tel1','tel2','remark']" :slot="col" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"></a-input>
            <template v-else>{{text}}</template>
        </template>
        <template slot="action" slot-scope="text, record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="cancel(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="toggle(record.key)">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)">删除</a>
            </span>
        </template>
        <template slot="relationship" slot-scope="text, record">
            <a-select labelInValue  v-if="record.editable" :value="{ key: text.value }" @change="e => handleChange(e.target.value,record.key, 'relationship')">
                <a-select-option v-for="(item,index) in relationShipType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Table, Divider, Input, Select } from 'ant-design-vue';
import { ColumnList } from '@/interface';
import { Emit } from 'vue-property-decorator';
interface TableData {
    key: number;
    relationship: {
        value: string,
        label: string,
    };
    name: string;
    tel1: string;
    tel2: string;
    remark: string;
    editable: boolean;
    isNew: boolean;
}
@Component({
    components: {
        'a-table': Table,
        'a-input': Input,
        'a-divider': Divider,
        'a-select': Select,
        'a-select-option': Select.Option,
    },
})
export default class PhoneTable extends Vue {
    private relationShipType = [{
        value: '1',
        label: '夫妻',
    }, {
        value: '2',
        label: '父母',
    }, {
        value: '3',
        label: '亲属',
    }];
    private cacheOriginData: any = [];
    private data: TableData[] = [{
        name: '小茗',
        tel1: '15915211411',
        tel2: '13129256852',
        remark: '家庭电话',
        key: 1,
        editable: true,
        relationship: {
            value: '1',
            label: '父母',
        },
        isNew: true,
    }];
    private column: ColumnList[] = [{
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    }, {
        title: '关系',
        dataIndex: 'relationship',
        align: 'center',
        scopedSlots: { customRender: 'relationship' },
    }, {
        title: '联系电话1',
        dataIndex: 'tel1',
        align: 'center',
        scopedSlots: { customRender: 'tel1' },
    }, {
        title: '联系电话2',
        dataIndex: 'tel2',
        align: 'center',
        scopedSlots: { customRender: 'tel2' },
    }, {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        scopedSlots: { customRender: 'remark' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    @Emit()
    private toggle(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    @Emit()
    private cancel(key: number) {
        const newData = [...this.data];
        const target = newData.filter(item => item.key === key)[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data = newData;
        }
        target.editable = false;
    }
    @Emit()
    private handleChange(value: any, key: number, name: string) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    @Emit()
    private saveRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        target.editable = false;
    }
    @Emit()
    private addRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const index = key + 1;
        target.editable = false;
        target.isNew = false;
        this.data.push({
            relationship: {
                value: '1',
                label: '父母',
            },
            name: '',
            tel1: '',
            tel2: '',
            editable: true,
            isNew: true,
            remark: '',
            key: index,
        });
    }
    @Emit()
    private removeRow(key: number) {
        const newData = this.data.filter(item => item.key !== key);
        this.data = newData;
    }
}
</script>
