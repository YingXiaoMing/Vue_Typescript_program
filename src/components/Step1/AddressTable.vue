<template>
    <a-table :pagination="false" bordered size="small"
    :columns="column" :dataSource="data" :loading="loading">
        <template slot="addressType" slot-scope="text,record">
            <a-select labelInValue  v-if="record.editable" :value="text" @change="e => handleChange(e,record.key, 'addressType')">
                <a-select-option v-for="(item,index) in AddressType" :key="index" :value="item.key">{{ item.label }}</a-select-option>
            </a-select>
            <template v-else>{{text.label}}</template>
        </template>
        <template slot="province" slot-scope="text,record">
            <a-select v-if="record.editable" :value="text" @change="e => onAreaCityChange(e,'province',record.key)">
              <a-select-option v-for="(item,index) in provinceOptions" :key="item" :value="item">{{item}}</a-select-option>
            </a-select>
            <template v-else>{{text}}</template>
        </template> 
        <template slot="city" slot-scope="text,record">
            <a-select v-if="record.editable" :value="text" @change="e => onAreaCityChange(e,'city',record.key)">
              <a-select-option v-for="(item,index) in cityOptions" :key="item" :value="item">{{item}}</a-select-option>
            </a-select>
            <template v-else>{{text}}</template>
        </template>
        <template slot="area" slot-scope="text,record">
            <a-select v-if="record.editable" :value="text" @change="e => onAreaCityChange(e,'area',record.key)">
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
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Table, Divider, Select, Input, message } from 'ant-design-vue';
import { ColumnList, SelectValue, BasicData } from '@/interface';
import provinceData from '@/utils/province';
import cityData from '@/utils/city';
import areaData from '@/utils/area';
import { getAddressTypeOption } from '@/api/basic';
import jsonpatch from 'fast-json-patch';
import { getEmployeeContactAddressData, putEmployeeContactAddressData, newEmployeeContactAddressData, deleteEmployeeContactAddressData } from '@/api/staff';
import _ from 'lodash';
interface TableData {
    addressType: {
        key: string,
        label: string,
    };
    province: string;
    city: string;
    area: string;
    address: string;
    key: string;
    editable: boolean;
    isNew: boolean;
    [key: string]: any;
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
    @Prop() private options!: SelectValue[];
    @Prop() private tabList!: TableData[];
    @Prop({default : false}) private tloading!: boolean;
    @Prop({default : true}) private isNew!: boolean;
    @Prop({default: ''}) private employeeId!: string;
    private $store: any;
    private cacheOriginData: any = [];
    private province: string = '广东省';
    private city: string = '佛山市';
    private area: string = '顺德区';
    private loading: boolean = this.tloading;
    private provinceOptions = provinceData;
    private cityOptions: string[] = [];
    private areaOptions: string[] = [];
    private AddressType: SelectValue[] = [];
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
        width: 130,
        dataIndex: 'action',
        align: 'center',
        scopedSlots: { customRender: 'action' },
    }];
    private data: TableData[] = this.tabList;
    private mounted() {
        const provinceName = '广东省';
        const cityName = '佛山市';
        this.cityOptions = cityData[provinceName];
        this.areaOptions = areaData[cityName];
    }
    @Watch('options')
    private optionChange(value: any) {
        this.AddressType = value;
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Watch('tloading')
    private loadingChange(value: any) {
        this.loading = value;
    }
    private isNullAddress(target: TableData): boolean {
        if (target.province === '' || target.city === '' || target.area === '' || target.address === '') {
            message.error('联系地址信息请填写完整');
            return false;
        }
        return true;
    }
    private loadAddressData() {
        this.loading = true;
        getEmployeeContactAddressData(this.employeeId).then((res: any) => {
            const newData = _.map(res, (item) => {
                const targetLegalType = _.find(this.AddressType, { key: item.typeId});
                return {
                    addressType: targetLegalType ? targetLegalType : {key: '', label: ''},
                    province: item.address.provinceOrState,
                    area: item.address.districtOrTown,
                    city: item.address.city,
                    address: item.address.street,
                    key: item.id,
                    editable: false,
                    isNew: false,
                };
            });
            this.data = newData;
            this.data.push({
                addressType: this.AddressType[0],
                province: '',
                area: '',
                city: '',
                address: '',
                key: '1',
                editable: true,
                isNew: true,
            });
            this.loading = false;
        }).catch((err) => {
            this.loading = false;
            message.error('加载数据失败，请联系管理员');
        });
    }
    @Emit()
    private toggle(key: number) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
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
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
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
        const target = newData.filter((item) => _.isEqual(item.key, key))[0];
        if (target) {
            target[name] = value;
            this.data = newData;
        }
    }
    @Emit()
    private saveRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(key, item.key))[0];
        if (target && this.isNullAddress(target)) {
            if (this.isNew) {
                this.saveNewData(target);
            } else {
                const diff = this.compareNewAndOldValue(target, this.cacheOriginData[key]);
                this.remoteUpdateEmployeeAddressData(key, diff, target);
            }
        }
    }
    private remoteUpdateEmployeeAddressData(key: string, diff: any, target: any) {
        if (diff.length > 0) {
            putEmployeeContactAddressData(this.employeeId, key, diff).then((res) => {
                this.loadAddressData();
            }).catch((err) => {
                message.error('更新失败');
            });
        } else {
            target.editable = false;
        }
    }
    private saveNewData(target: any) {
        target.editable = false;
        const newData = [...this.data];
        newData.pop();
        this.$store.dispatch('ReplaceContactAddressList', newData);
    }
    private compareNewAndOldValue(newValue: TableData, oldValue: TableData) {
        const newValues = {
            typeId: newValue.addressType.key,
            address: {
                provinceOrState: newValue.province,
                city: newValue.city,
                districtOrTown: newValue.area,
                street: newValue.address,
            },
        };
        const oldValues = {
            typeId: oldValue.addressType.key,
            address: {
                provinceOrState: oldValue.province,
                city: oldValue.city,
                districtOrTown: oldValue.area,
                street: oldValue.address,
            },
        };
        const diff = jsonpatch.compare(oldValues, newValues);
        return diff;
    }
    @Emit()
    private removeRow(key: string) {
        if (this.data.length === 2) {
            message.error('请至少保留一条联系地址信息');
            return;
        }
        if (this.isNew) {
            const newData = this.data.filter((item) => !_.isEqual(key, item.key));
            this.data = newData;
            this.$store.dispatch('RemoveContactAddressList', key);
        } else {
            deleteEmployeeContactAddressData(this.employeeId, key).then((res) => {
                this.loadAddressData();
            }).catch((err) => {
                message.error('删除失败');
            });
        }
    }
    @Emit()
    private onAreaCityChange(value: string, fieldName: string, key: number) {
        const newData = [...this.data];
        const target = newData.filter((item) => _.isEqual(key, item.key))[0];
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
    private addRow(key: string) {
        const target = this.data.filter((item) => _.isEqual(item.key, key))[0];
        if (target && this.isNullAddress(target)) {
            if (this.isNew) {
                this.firstAddRow(target, key);
            } else  {
                newEmployeeContactAddressData(this.employeeId, {
                    typeId: target.addressType.key,
                    address: {
                        provinceOrState: target.province,
                        city: target.city,
                        districtOrTown: target.area,
                        street: target.address,
                    },
                }).then((res) => {
                    this.loadAddressData();
                }).catch((err) => {
                    message.error('新增失败');
                });
            }
        }
    }
    private firstAddRow(target: any, key: string) {
        const index = key + 1;
        const newData = [...this.data];
        target.editable = false;
        target.isNew = false;
        this.$store.dispatch('ReplaceContactAddressList', newData);
        this.data.push({
            addressType: this.AddressType[0],
            province: '',
            area: '',
            city: '',
            address: '',
            key: index,
            editable: true,
            isNew: true,
        });
    }
}
</script>
