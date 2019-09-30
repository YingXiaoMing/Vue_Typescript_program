<template>
    <div>
        <a-radio-group :value="radioValue" @change="onRadioChange">
            <a-radio value="0">永久</a-radio>
            <a-radio value="1">
                <a-date-picker :value="momentDate(date)" :disabled="isShow" @change="onDateChange"></a-date-picker>
            </a-radio>
        </a-radio-group>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';
interface Values {
    value: string;
    date: string;
}
@Component({
    components: {},
})
export default class RadioDate extends Vue {
    @Prop() private value!: Values;
    private date: string = this.value ? this.value.date : '9999-12-31';
    private radioValue: string = this.value ? this.value.value : '0';
    private isShow: boolean = true;

    private dateFormat = 'YYYY-MM-DD';
    private momentDate(date: string) {
        return moment(date, this.dateFormat);
    }
    @Watch('value')
    private valueChange(newValue: Values) {
        if (newValue) {
            this.date = newValue.date;
            this.radioValue = newValue.value;
        }
    }
    private onRadioChange(e: any) {
        switch (e.target.value) {
            case '0':
                this.isShow = true;
                this.date  = '9999-12-31';
                break;
            default:
                this.isShow = false;
                break;
        }
        this.radioValue = e.target.value;
        this.triggerChange({ value: this.radioValue, date: this.date });
    }
    private onDateChange(value: any, dateString: string) {
        this.date = dateString;
        this.triggerChange({ value: this.radioValue, date: this.date });
    }
    private triggerChange(changedValue: any) {
        this.$emit('change', Object.assign({}, this.$data, changedValue));
    }
}
</script>

