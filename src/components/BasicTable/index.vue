<template>
    <a-col :span="8" style="margin:10px 0;">
        <a-table bordered :columns="column" size="small"
        :dataSource="data" :pagination="false">
            <template slot="name" slot-scope="text, record">
                <a-input v-if="record.editable" :value="text"
                @change="e => handleChange(e.target.value, record.key, 'name')"></a-input>
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
                    <a @click="removeRow(record.key)" class="red">删除</a>
                </span>
            </template>
        </a-table>
    </a-col>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Col, Divider, Input } from 'ant-design-vue';
import { ColumnList } from '@/interface';
import { newBasicData, putBasicData, deleteBasicData } from '@/api/basic';
import _ from 'lodash';
interface TableData {
    name: string;
    key?: string;
    editable: boolean;
    isNew: boolean;
    [key: string]: any;
}
@Component({
    components: {
        'a-table': Table,
        'a-col': Col,
        'a-divider': Divider,
        'a-input': Input,
    },
})
export default class BasicTable extends Vue {
    @Prop() private tableList!: TableData[];
    @Prop() private colName!: string;
    private data: TableData[] = this.tableList;
    private cacheOriginData: { [key: string]: any } = {};
    private column: ColumnList[] = [{
        title: this.colName,
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
    private basicItemLayout = {
        lg: {span : 6},
        md: {span: 12},
        sm: {span: 24},
    };
    @Prop() private url!: string;
    @Watch('tableList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    private created() {
        // this.data = [...this.data, ...[{
        //     editable: true,
        //     name: '',
        //     key: 'new_01',
        //     isNew: true,
        // }]];
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        // 与之前的值进行比较
        if (this.cacheOriginData[key] && !_.isEqual(this.cacheOriginData[key].name, target.name)) {
            putBasicData(this.url + '/' + key, { name: target.name }).then((res) => {
                const newData = [...this.data];
                target.editable = false;
            });
        } else {
            const newData = [...this.data];
            target.editable = false;
        }
    }
    @Emit()
    private removeRow(key: string) {
        deleteBasicData(this.url + '/' + key).then((res) => {
            const newData = this.data.filter((item) => !_.isEqual(item.key, key));
            this.data = newData;
        });
    }
    @Emit()
    private toggle(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
        }
    }
    @Emit()
    private cancel(key: string) {
        const newData = [...this.data];
        // const target = this.data.filter(item => item.key === key)[0];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            delete this.cacheOriginData[key];
            this.data = newData;
        }
        target.editable = false;
    }
    @Emit()
    private handleChange(value: any, key: string, name: string) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    @Emit()
    private addRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        newBasicData(this.url, {name: target.name}).then((response: any) => {
            const index = key + 1;
            const newData = [...this.data];
            target.editable = false;
            target.key = response.id;
            target.isNew = false;
            this.data.push({
                name: '',
                editable: true,
                isNew: true,
                key: 'new_id_1',
            });
        });
    }
}
</script>

