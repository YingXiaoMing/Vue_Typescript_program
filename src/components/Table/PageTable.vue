<template>
    <div>
        <a-table :columns="columnList" bordered size="small" :dataSource="data"
        :loading="tloading" :pagination="pagination" @change="tableChange">
            <template slot="Index" slot-scope="text,record,index">
                <span>{{ index + 1 }}</span>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { ColumnList, Pagination } from '@/interface';
@Component({
    components: {},
})
export default class PageTable extends Vue {
    @Prop({ default: false }) private loading!: boolean;
    @Prop() private tabList!: any[];
    @Prop() private paginationData!: Pagination;
    @Prop() private columnList!: ColumnList[];
    private tloading: boolean = this.loading;
    private data: any[] = this.tabList;
    private pagination: Pagination = this.paginationData;
    @Watch('loading')
    private loadingChange(value: boolean) {
        this.tloading = value;
    }
    @Watch('tabList')
    private tableDataChange(value: any) {
        this.data = value;
    }
    @Watch('paginationData')
    private paginationDataChange(value: any) {
        this.pagination = value;
    }
    private tableChange(pagination: any, filters: any, sorter: any) {
        const pageSize = pagination.pageSize;
        const pageNum = pagination.current;
        this.$emit('tableChange', pageNum, pageSize);
    }
}
</script>

