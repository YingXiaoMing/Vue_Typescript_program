<template>
    <div>
        <a-tabs type="card">
            <a-tab-pane key="1" tab="调职"><a-tab1/></a-tab-pane>
            <a-tab-pane key="2" tab="离职"><a-tab2/></a-tab-pane>
        </a-tabs>
    </div>
</template>
<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Tabs } from 'ant-design-vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import Tab1 from './tab1';
import Tab2 from './tab2';
@Component({
    components: {
        'a-tabs': Tabs,
        'a-tab-pane': Tabs.TabPane,
        'a-tab1': Tab1,
        'a-tab2': Tab2,
    },
})
export default class Tab extends Vue {

}
</script>

