<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data">
        <template slot="addressType" slot-scope="text,record">
            <a-select labelInValue  v-if="record.editable" :defaultValue="{ key: text.value }" @change="e => handleChange(e.target.value,record.key, 'legalType')">
                <a-select-option v-for="(item,index) in AddressType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
        </template>
        <template slot="province" slot-scope="text,record">
            <a-select v-if="record.editable" :value="province" @change="e => onAreaCityChange(e,'province',record.key)">
              <a-select-option v-for="(item,index) in provinceOptions" :key="item" :value="item">{{item}}</a-select-option>
            </a-select>
            <template v-else>{{text}}</template>
        </template> 
        <template slot="city" slot-scope="text,record">
            <a-select v-if="record.editable" :value="city" @change="e => onAreaCityChange(e,'city',record.key)">
              <a-select-option v-for="(item,index) in cityOptions" :key="item" :value="item">{{item}}</a-select-option>
            </a-select>
            <template v-else>{{text}}</template>
        </template>
        <template slot="area" slot-scope="text,record">
            <a-select v-if="record.editable" :value="area" @change="e => onAreaCityChange(e,'area',record.key)">
              <a-select-option v-for="(item,index) in areaOptions" :key="item" :value="item">{{item}}</a-select-option>
            </a-select>
            <template v-else>{{text}}</template>
        </template>
        <template slot="action" slot-scope="text,record">
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
        <template slot="address" slot-scope="text,record">
            <a-input v-if="record.editable" :value="text" @change="e => handleChange(e.target.value,record.key, 'address')"></a-input>
            <template v-else>{{text}}</template>
        </template>
    </a-table>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { Table, Divider, Select, Input } from 'ant-design-vue';
import { ColumnList } from '@/interface';
import provinceData from '@/utils/province';
import cityData from '@/utils/city';
import areaData from '@/utils/area';
interface TableData {
    addressType: {
        value: string,
        label: string,
    };
    province: string;
    city: string;
    area: string;
    address: string;
    key: number;
    editable: boolean;
    isNew: boolean;
}
@Component({
    components: {
        'a-table': Table,
        'a-divider': Divider,
        'a-select': Select,
        'a-select-option': Select.Option,
        'a-input': Input,
    },
})
export default class AddressTable extends Vue {
    private cacheOriginData: any = [];
    private province: string = '广东省';
    private city: string = '佛山市';
    private area: string = '顺德区';
    private provinceOptions = provinceData;
    private cityOptions: string[] = [];
    private areaOptions: string[] = [];
    private AddressType = [{
        value: '1',
        label: '居住地址',
    }, {
        value: '2',
        label: '身份证地址',
    }, {
        value: '3',
        label: '老家地址',
    }, {
        value: '4',
        label: '通讯地址',
    }];
    private column: ColumnList[] = [{
        title: '地址类型',
        dataIndex: 'addressType',
        align: 'center',
        scopedSlots: { customRender: 'addressType' },
    }, {
        title: '所属省份',
        dataIndex: 'province',
        align: 'center',
        scopedSlots: { customRender: 'province' },
    }, {
        title: '所属市',
        dataIndex: 'city',
        align: 'center',
        scopedSlots: { customRender: 'city' },
    }, {
        title: '所属区/县',
        dataIndex: 'area',
        align: 'center',
        scopedSlots: { customRender: 'area' },
    }, {
        title: '详细地址',
        dataIndex: 'address',
        align: 'center',
        scopedSlots: { customRender: 'address' },
    }, {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private data: TableData[] = [{
        addressType: {
            value: '1',
            label: '居住地址',
        },
        province: '广东省',
        area: '顺德区',
        city: '佛山市',
        address: '北滘',
        key: 1,
        editable: true,
        isNew: true,
    }];
    private mounted() {
        this.cityOptions = cityData['广东省'];
        this.areaOptions = areaData['佛山市'];
    }
    @Emit()
    private toggle(key: number) {
        const target = this.data.filter(item => item.key === key)[0];
        if (target) {
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            this.province = target.province;
            this.cityOptions = cityData[target.province];
            this.areaOptions = areaData[target.city];
            this.city = target.city;
            this.area = target.area;
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
            this.data  = newData;
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
    private removeRow(key: number) {
        const newData = this.data.filter(item => item.key !== key);
        this.data = newData;
    }
    @Emit()
    private onAreaCityChange(value: string, fieldName: string, key: number) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            switch (fieldName) {
                case 'province':
                    this.province = value;
                    this.city = cityData[value][0];
                    this.area = areaData[cityData[value][0]][0];
                    this.cityOptions = cityData[value];
                    this.areaOptions = areaData[cityData[value][0]];
                    target.province = value;
                    target.city = cityData[value][0];
                    target.area = areaData[cityData[value][0]][0];
                    break;
                case 'city':
                    this.city = value;
                    this.area = areaData[value][0];
                    this.areaOptions = areaData[value];
                    target.city = value;
                    target.area = areaData[value][0];
                    break;
                default:
                    this.area = value;
                    target.area = value;
                    break;
            }
            this.data = newData;
        }
    }
    @Emit()
    private addRow(key: number) {
        const target = this.data.filter(item => item.key)[0];
        const index = key + 1;
        const newData = [...this.data];
        target.editable = false;
        target.isNew = false;
        this.data.push({
            addressType: {
                value: '1',
                label: '居住地址',
            },
            province: '广东省',
            area: '顺德区',
            city: '佛山市',
            address: '北滘',
            key: index,
            editable: true,
            isNew: true,
        });
    }
}
</script>
