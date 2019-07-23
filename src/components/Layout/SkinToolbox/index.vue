<template>
    <div class="skin-toolbox" :class="{'skin-toolbox-close': collapsed}">
        <div class="panel">
            <div class="panel-head" @click="toggleSkinToolBox">
                <span class="panel-icon">
                    <a-icon type="setting"></a-icon>
                </span>
                <span class="panel-title">设置你的主题</span>
            </div>
            <div class="panel-body">
                <a-radio-group @change="themeChange" v-model="theme">
                    <a-radio value="#F5222D">
                        <a-tag color="#F5222D">薄暮</a-tag>
                    </a-radio>
                    <a-radio value="#FA541C">
                        <a-tag color="#FA541C">火山</a-tag>
                    </a-radio>
                    <a-radio value="#FAAD14">
                        <a-tag color="#FAAD14">日暮</a-tag>
                    </a-radio>
                    <a-radio value="#13C2C2">
                        <a-tag color="#13C2C2">明青</a-tag>
                    </a-radio>
                    <a-radio value="#52C41A">
                        <a-tag color="#52C41A">极光绿</a-tag>
                    </a-radio>
                    <a-radio value="#1890FF">
                        <a-tag color="#1890FF">默认</a-tag>
                    </a-radio>
                    <a-radio value="#1890ff">
                        <a-tag color="#1890ff">极客蓝</a-tag>
                    </a-radio>
                    <a-radio value="#2F54EB">
                        <a-tag color="#2F54EB">酱紫</a-tag>
                    </a-radio>
                </a-radio-group>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Icon, Radio, Tag } from 'ant-design-vue';
import { updateTheme } from '@/utils/settingConfig';
import './index.less';
@Component({
    components: {
        'a-icon': Icon,
        'a-radio-group': Radio.Group,
        'a-radio': Radio,
        'a-tag': Tag,
    },
})
export default class SkinToolbox extends Vue {
    private collapsed: boolean = true;
    private theme: string = '#1890FF';
    private toggleSkinToolBox() {
        this.collapsed = !this.collapsed;
    }
    private themeChange(e: any) {
        this.theme = e.target.value;
        updateTheme(this.theme);
    }
}
</script>

