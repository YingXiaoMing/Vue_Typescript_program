<template>
    <div>
        <a-row :gutter="24" class='basicData'>
            <a-divider class='diliver_item'>教育经历</a-divider>
            <a-education></a-education>
            <a-divider class='diliver_item'>工作经历</a-divider>
            <a-workExperience></a-workExperience>
        </a-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Education from '@/components/Step2/Education.vue';
import WorkExperience from '@/components/Step2/WorkExperience.vue';
import { Row, Divider } from 'ant-design-vue';
import { getEducationLevelOption } from '@/api/basic';
@Component({
    components: {
        'a-education': Education,
        'a-row': Row,
        'a-divider': Divider,
        'a-workExperience': WorkExperience,
    },
})
export default class Step2 extends Vue {

}
</script>




