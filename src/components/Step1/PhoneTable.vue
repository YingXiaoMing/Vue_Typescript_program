<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data">

         <!-- Phone Type -->
        <template slot="phoneType" slot-scope="text,record">
            <a-select labelInValue v-if="record.editable" :defaultValue="{ key: text.value }"
            @change="e => handleChange(e.target.value,record.key, 'phoneType')">
              <a-select-option v-for="(item,index) in phoneType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
        </template>

        <template slot="phoneNum" slot-scope="text, record">
            <a-input v-if="record.editable" :value="text"
            @change="e => handleChange(e.target.value, record.key, 'phoneNum')"></a-input>
            <template v-else>{{text}}</template>
        </template>

        <template slot="action" slot-scope="text,record">
            <template v-if="record.editable">
                <span v-if="record.isNew">
                    <a @click="addRow(record.key)">添加</a>
                </span>
                <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type='vertical'></a-divider>
                    <a @click="cancel(record.key)">取消</a>
                </span>
            </template>
            <span v-else>
                <a @click="toggle(record.key)">编辑</a>
                <a-divider type="vertical"></a-divider>
                <a @click="removeRow(record.key)">删除</a>
            </span>
        </template>

        <template slot="isRequired" slot-scope="text,record">
            <a-select v-if="record.editable" :defaultValue="text" @change="e => handleChange(e,record.key, 'isRequired')">
                <a-select-option  value="true">是</a-select-option>
                <a-select-option  value="false">否</a-select-option>
            </a-select>
            <template v-else-if="text === 'true'">
                <a-checkbox defaultChecked></a-checkbox>
            </template>
        </template>

    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import _ from 'lodash';
import { Table, Divider, Checkbox, Select, Input} from 'ant-design-vue';
import { ColumnList } from '@/interface';
interface TableData {
    phoneType: {
        value: string,
        label: string,
    };
    phoneNum: string;
    isRequired: string;
    editable: boolean;
    isNew: boolean;
    key: number;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-checkbox': Checkbox,
        'a-select': Select,
        'a-select-option': Select.Option,
        'a-input': Input,
    },
})
export default class PhoneTable extends Vue {
    private cacheOriginData: any = [];
    private phoneType = [{
        value: '1',
        label: '家庭电话',
    }, {
        value: '2',
        label: '工作电话',
    }, {
        value: '3',
        label: '个人电话',
    }];
    private column: ColumnList[] = [{
        title: '电话类型',
        dataIndex: 'phoneType',
        align: 'center',
        scopedSlots: { customRender: 'phoneType' },
    }, {
        title: '电话号码',
        dataIndex: 'phoneNum',
        align: 'center',
        scopedSlots: { customRender: 'phoneNum' },
    }, {
        title: '主号码',
        dataIndex: 'isRequired',
        align: 'center',
        scopedSlots: { customRender: 'isRequired' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private data: TableData[] = [{
        phoneType: {
            value: '1',
            label: '家庭电话',
        },
        phoneNum: '13129218652',
        isRequired: 'true',
        editable: true,
        key: 1,
        isNew: true,
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
        // const target = this.data.filter(item => item.key === key)[0];
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
    private findAndReplaceRequired(data: TableData[], key: number) {
        data.filter(item => {
            if (item.key !== key) {
                item.isRequired = 'false';
            }
        });
    }
    @Emit()
    private saveRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const newData = [...this.data];
        if (target.isRequired === 'true') {
            this.findAndReplaceRequired(newData, key);
        }
        target.editable = false;
    }
    @Emit()
    private addRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const index = key + 1;
        const newData = [...this.data];
        if (target.isRequired === 'true') {
            this.findAndReplaceRequired(newData, key);
        }
        target.editable = false;
        target.isNew = false;
        this.data.push({
            phoneType: {
                value: '1',
                label: '家庭电话',
            },
            phoneNum: '',
            isRequired: 'true',
            editable: true,
            isNew: true,
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

