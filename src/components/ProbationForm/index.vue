<template>
    <div>
        <a-row>
          <a-col :span="3">
              <a-checkbox :checked="checked" @change="handleChange"></a-checkbox>
          </a-col>
          <a-col :span="21">
              <a-date-picker :value="momentDate(date)" :disabled="!checked" @change="handleDateChange"></a-date-picker>
          </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';
interface Values {
    check: boolean;
    date: string | null;
}
@Component({
    components: {},
})
export default class ProbationForm extends Vue {
    @Prop() private value: Values | undefined;
    private checked: boolean = this.value ? this.value.check : true;
    private date: string| null = this.value ? this.value.date : null;
    private dateFormat = 'YYYY-MM-DD';
    @Watch('value')
    private valueChange(newValue: Values) {
        if (newValue) {
            this.date = newValue.date;
            this.checked = newValue.check;
        }
    }
    private momentDate(date: any) {
        if (!date) { return null; }
        return moment(date, this.dateFormat);
    }
    private handleChange(e: any) {
        this.checked = e.target.checked;
        const check = e.target.checked;
        this.triggerChange({check});
    }
    private triggerChange(changedValue: any) {
        this.$emit('change', Object.assign({}, this.$data, changedValue));
    }
    private handleDateChange(dates: string, dateString: string) {
        this.date = dateString;
        const date = dateString;
        const check = this.checked;
        this.triggerChange({check, date});
    }
}
</script>

