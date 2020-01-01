<template>
  <div>
    <Card class="warp-card" dis-hover title="基本信息">
      <Row>
        <Col span="12">员工姓名：{{details.userName}}</Col>
        <Col span="12">员工Id：{{details.userId}}</Col>
        <Col span="12">留言类型：{{$enum.getDescByValue('MESSAGE_TYPE_ENUM',details.messageType)}}</Col>
        <Col span="12">创建时间：{{details.createTime}}</Col>
        <Col span="12">
          <div class="flex">
            <span>图片：</span>
            <div class="imgs" v-viewer="{movable: false}">
              <img :src="item" alt v-for="(item,index) in imgList" :key="index" />
            </div>
          </div>
        </Col>
        <Col span="12">
          <div class="flex">
            <span>留言内容：</span>
            <p v-text="details.content"></p>
          </div>
        </Col>
      </Row>
      <Row>
          <Col span="24">
             <Button type="primary" @click="backPage">返回</Button>
          </Col>
      </Row>
    </Card>
    <!-- <div class="footerBtn">
      <div>
          <Button type="primary">返回</Button>
      </div>
    </div> -->
  </div>
</template>

<script>
import { activeApi } from '@/api/active.js';
export default {
  name: 'MessageDetail',
  components: {},
  props: {},
  data () {
    return {
      details: {},
      imgList: [],
      messageTypeList: this.$enum.getValueDescList('MESSAGE_TYPE_ENUM')
    };
  },
  computed: {},
  watch: {},
  filters: {},
  mounted () {
    this.getDetail();
  },
  methods: {
    // 获取数据
    async getDetail () {
      this.$Spin.show();
      let res = await activeApi.getDetail(this.$route.query.id);
      this.$Spin.hide();
      let datas = res.data;
      this.details = datas;
      this.imgList = datas.picture ? datas.picture.split(',') : [];
    },
    backPage () {
      // 返回
      this.$router.closeCurrentPage();
    }
  }
};
</script>
<style lang="less" scoped>
.imgs {
  img {
    width: 80px;
    height: 80px;
    margin-left: 10px;
  }
}
.ivu-col {
  margin-bottom: 10px;
}
</style>
