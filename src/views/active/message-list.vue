<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form :model="searchForm" class="tools" inline ref="searchForm">
        <FormItem prop="title">
          <Input placeholder="请输入员工姓名/员工Id" type="text" v-model="searchForm.keyword" />
        </FormItem>
        <FormItem prop="sendStatus">
          <Select style="width:200px" v-model="searchForm.messageType" placeholder="请选择留言类型">
            <Option
              :value="item.value"
              v-for="item in messageTypeList"
              :key="item.vallue"
            >{{item.desc}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="startDate">
          <DatePicker
            placeholder="请选择日期"
            type="daterange"
            v-model="time"
            @on-change="(e)=>{searchForm.startDate=e[0];searchForm.endDate=e[1]}"
          ></DatePicker>
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
  name: 'MessageList',
  components: {},
  props: {},
  data () {
    return {
      // 数据量
      total: null,
      messageTypeList: this.$enum.getValueDescList('MESSAGE_TYPE_ENUM'),
      time: null,
      // 查询参数
      searchForm: {
        endDate: null,
        messageType: null,
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        searchCount: true, // 是否查询总条数
        startDate: null
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
          key: 'userId'
        },
        {
          title: '留言类型',
          key: 'messageType',
          render: (h, param) => {
            return h(
              'div',
              this.$enum.getDescByValue(
                'MESSAGE_TYPE_ENUM',
                param.row.messageType
              )
            );
          }
        },
        {
          title: '创建时间',
          key: 'createTime'
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
                title: '详情',
                action: () => {
                  this.details(params);
                }
              },
              {
                title: '删除',
                action: () => {
                  this.$Modal.confirm({
                    title: '友情提醒',
                    content: '确定要删除吗？',
                    onOk: () => {
                      let obj = { messageIdList: [] };
                      obj.messageIdList[0] = params.row.messageId;
                      this.deleteMessage(obj);
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
    this.getMessage();
  },
  methods: {
    details (params) {
      this.$router.push({
        path: '/active/message-detail',
        query: { id: params.row.messageId }
      });
    },
    // 重置
    reset () {
      Object.assign(this.searchForm, this.initData);
      this.time = null;
      this.find();
    },
    // 删除确定
    async deleteMessage (data) {
      this.$Spin.show();
      let res = await activeApi.deleteMessage(data);
      this.$Message.success('删除成功');
      this.$Spin.hide();
      this.getMessage();
    },
    // 删除操作
    batchDelete () {
      let table = this.$refs['table'];
      let all = table.getSelection();
      let params = {};
      let messageIdList = [];
      messageIdList = all.map(item => item.messageId);
      if (all.length == 0) {
        this.$Message.error('请选择一条记录');
      } else {
        this.$Modal.confirm({
          title: '友情提醒',
          content: '确定要删除吗？',
          onOk: () => {
            params.messageIdList = messageIdList;
            this.deleteMessage(params);
          }
        });
      }
    },
    // 查询
    find () {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.getMessage();
    },
    // 更改分页查询条数
    changePageSize (pageSize) {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = pageSize;
      this.getMessage();
    },
    // 获取据
    async getMessage () {
      this.$Spin.show();
      let res = await activeApi.getMessage(this.searchForm);
      this.$Spin.hide();
      this.tableData = res.data.list;
      this.total = res.data.total;
      if (res.data.pages < this.searchForm.pageNum) {
        this.searchForm.pageNum = res.data.pages;
      }
    },
    // 页码改变
    changePage (pageNum) {
      this.searchForm.pageNum = pageNum;
      this.getMessage();
    }
  }
};
</script>
