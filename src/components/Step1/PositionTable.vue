<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data">
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
        <template slot="position" slot-scope="text,record">
            <a-cascader style='width:100%' :options="cascderOption"
             v-if="record.editable" placeholder="请选择职位"
             @change="(value,selectOption) => onChange(value,selectOption,'position',record.key)" :value="record.selectOption"
             :displayRender="({labels, selectedOptions}) => labels.join('->')">
             </a-cascader>
            <template v-else>{{text}}</template>
        </template>
        <template slot="mainPosition" slot-scope="text,record">
            <a-radio :checked="text" @change="onRadioChange(record.key)" :disabled="record.editable"></a-radio>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { Table, Cascader, Divider, Radio } from 'ant-design-vue';
import { ColumnList, CascderOption } from '@/interface';
import _ from 'lodash';
interface TableData {
    editable: boolean;
    isNew: boolean;
    key: number;
    mainPosition: boolean;
    position: string;
    selectOption: string[]
}
@Component({
    components: {
        'a-table': Table,
        'a-cascader': Cascader,
        'a-divider': Divider,
        'a-radio': Radio,
    },
})
export default class PhoneTable extends Vue {
    private cacheOriginData: any = [];
    private cascderOption: CascderOption[] = [{
        value: '新感觉有限公司',
        label: '新感觉有限公司',
        children: [{
            value: '乐从分公司',
            label: '乐从分公司',
            children: [{
                value: '研发部',
                label: '研发部',
                children: [{
                    value: '研发主管',
                    label: '研发主管',
                }, {
                    value: '研发经理',
                    label: '研发经理',
                }],
            }, {
                value: '电脑部',
                label: '电脑部',
            }, {
                value: '设计部',
                label: '设计部',
                children: [{
                    value: '设计总监',
                    label: '设计总监',
                }, {
                    value: '设计主任',
                    label: '设计主任',
                }, {
                    value: '设计师',
                    label: '设计师',
                }, {
                    value: '设计助理',
                    label: '设计助理',
                }],
            }, {
                value: '客服部',
                label: '客服部',
                children: [{
                    value: '客服人员',
                    label: '客服人员',
                }, {
                    value: '投诉专员',
                    label: '投诉专员',
                }, {
                    value: '客服组长',
                    label: '客服组长',
                }],
            }, {
                value: '财务部',
                label: '财务部',
                children: [{
                    value: '财务经理',
                    label: '财务经理',
                }, {
                    value: '出纳',
                    label: '出纳',
                }, {
                    value: '会计人员',
                    label: '会计人员',
                }],
            }, {
                value: '生产部',
                label: '生产部',
            }],
        }, {
            value: '均安分公司',
            label: '均安分公司',
        }],
    }];
    private data = [{
        position: '新感觉有限公司->乐从分公司->研发部->研发主管',
        mainPosition: true,
        editable: true,
        key: 1,
        isNew: true,
        selectOption: [] as string[],
    }];

    private column: ColumnList[] = [{
        title: '职位信息',
        dataIndex: 'position',
        align: 'center',
        scopedSlots: { customRender: 'position' },
    }, {
        title: '主职位',
        dataIndex: 'mainPosition',
        align: 'center',
        scopedSlots: { customRender: 'mainPosition' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];

    @Emit()
    private onChange(value: string[], selectOption: CascderOption[], name: string, key: number) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[name] = _.join(value, '->');
            target.selectOption = value;
            this.data = newData;
        }
    }
    @Emit()
    private saveRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const newData = [...this.data];
        target.editable = false;
    }
    @Emit()
    private onRadioChange(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const newData = [...this.data];
        newData.filter(item => {
            item.key === key ? item.mainPosition = true : item.mainPosition = false;
        });
        this.data  = newData;
    }
    @Emit()
    private toggle(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const str = target.position;
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
            target.selectOption = _.split(str, '->');
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
    private addRow(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        const index = key + 1;
        const newData = [...this.data];
        target.editable = false;
        target.isNew = false;
        target.selectOption = [];
        this.data.push({
            position: '',
            key: index,
            mainPosition: false,
            editable: true,
            isNew: true,
            selectOption: [],
        });
    }
    @Emit()
    private removeRow(key: number) {
        const newData = this.data.filter(item => item.key !== key);
        this.data = newData;
    }

}
</script>
