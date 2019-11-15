<template>
    <a-locale-provider :locale="locale">
        <div id="app">
            <app-main></app-main>
        </div>
    </a-locale-provider>
</template>
<script lang="ts">
import Vue from 'vue';
import '@/style/global.less';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import AppMain from '@/components/Layout/AppMain.tsx';
import Component from 'vue-class-component';
@Component({
    components: {
        'app-main': AppMain,
    },
})
export default class App extends Vue {
    private locale: any = zhCN;
}
</script>

