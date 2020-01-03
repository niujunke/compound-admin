<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form :model="searchForm" class="tools" inline ref="searchForm">
        <FormItem prop="title">
          <Input placeholder="请输入员工姓名/员工Id" type="text" v-model="searchForm.keyword" />
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button @click="find" icon="ios-search" type="primary" v-privilege="'email-query'">查询</Button>
            <Button @click="reset" icon="md-refresh" type="default" v-privilege="'email-query'">重置</Button>
          </ButtonGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="batchDelete">批量删除</Button>
        </FormItem>
      </Form>
      <Table :columns="columns" ref="table" :data="tableData"></Table>
      <Page
        :current="searchForm.pageNum"
        :page-size="searchForm.pageSize"
        :page-size-opts="[10, 20, 30, 50, 100]"
        :total="total"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        show-elevator
        show-sizer
        show-total
        style="margin:24px 0;text-align:right;"
      ></Page>
    </Card>
  </div>
</template>

<script>
import { activeApi } from '@/api/active.js';
export default {
  name: 'compoundList',
  components: {},
  props: {},
  data () {
    return {
      // 数据量
      total: null,
      // 查询参数
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        searchCount: true // 是否查询总条数
      },
      initData: {},
      // 表头
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '员工姓名',
          key: 'userName'
        },
        {
          title: '员工ID',
          key: 'faceFuseUserId'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '合成图片',
          key: 'mergeImage ',
          render (h, params) {
            return h(
              'div',
              {
                directives: [
                  {
                    name: 'viewer',
                    value: 'movable'
                  }
                ]
              },
              [
                h('img', {
                  style: {
                    width: '50px',
                    height: '50px'
                  },
                  domProps: {
                    src: params.row.mergeImage
                  }
                })
              ]
            );
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          className: 'action-hide',
          render: (h, params) => {
            return this.$tableAction(h, [
              {
                title: '删除',
                directives: [
                  {
                    name: 'privilege',
                    value: 'email-delete'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '友情提醒',
                    content: '确定要删除吗？',
                    onOk: () => {
                      let obj = { faceFuseIdList: [] };
                      obj.faceFuseIdList[0] = params.row.faceFuseId;
                      this.deleteFaceFuse(obj);
                    }
                  });
                }
              }
            ]);
          }
        }
      ],
      // table数据
      tableData: []
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created () {
    Object.assign(this.initData, this.searchForm);
    this.getFaceFuse();
  },
  methods: {
    // 重置
    reset () {
      Object.assign(this.searchForm, this.initData);
      this.find();
    },
    // 删除确定
    async deleteFaceFuse (data) {
      this.$Spin.show();
      let res = await activeApi.deleteFaceFuse(data);
      this.$Message.success('删除成功');
      this.getFaceFuse();
    },
    // 删除操作
    batchDelete () {
      let table = this.$refs['table'];
      let all = table.getSelection();
      let params = {};
      let faceFuseIdList = [];
      faceFuseIdList = all.map(item => item.faceFuseId);
      if (all.length == 0) {
        this.$Message.error('请选择一条记录');
      } else {
        this.$Modal.confirm({
          title: '友情提醒',
          content: '确定要删除吗？',
          onOk: () => {
            params.faceFuseIdList = faceFuseIdList;
            this.deleteFaceFuse(params);
          }
        });
      }
    },
    // 查询
    find () {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.getFaceFuse();
    },
    // 更改分页查询条数
    changePageSize (pageSize) {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = pageSize;
      this.getFaceFuse();
    },
    // 获取数据
    async getFaceFuse () {
      this.$Spin.show();
      let res = await activeApi.getFaceFuse(this.searchForm);
      if (res.success) {
        this.$Spin.hide();
        this.tableData = res.data.list;
        this.total = res.data.total;
        if (res.data.pages < this.searchForm.pageNum) {
          this.searchForm.pageNum = res.data.pages;
        }
      }
    },
    // 页码改变
    changePage (pageNum) {
      this.searchForm.pageNum = pageNum;
      this.getFaceFuse();
    }
  }
};
</script>
