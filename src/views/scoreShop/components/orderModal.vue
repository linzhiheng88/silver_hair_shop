<template>
  <div class="container">
      <Divider orientation="left">订单信息</Divider>
      <Row :gutter="20">
        <Col span="8">订单ID：{{orderDetail.id}}</Col>
        <Col span="8">订单编号：{{orderDetail.order_no}}</Col>
        <Col span="8">订单金额：{{orderDetail.total_price}}</Col>
      </Row>
    <Row :gutter="20">
      <Col span="8">订单状态：{{orderDetail.state==0?'未发货':'已发货'}}</Col>
      <Col span="8">物流公司：{{orderDetail.logistic?orderDetail.logistic.name:'-'}}</Col>
      <Col span="8">物流单号：{{orderDetail.logistic_no||'-'}}</Col>
    </Row>
    <template v-if="orderDetail.score_good_type==1">
      <Divider orientation="left">表单数据</Divider>
      <Row :gutter="20" v-for="item in orderDetail.score_order_good_forms" :key="item.id">
        <Col span="6">{{item.label}}：{{item.value}}</Col>
      </Row>
    </template>
    <template v-if="orderDetail.score_good_type==2">
      <Divider orientation="left">兑换串码</Divider>
      <Row :gutter="20" v-for="(item,index) in orderDetail.score_good_codes" :key="item.id">
        <Col span="6">串码{{index+1}}：{{item.code}}</Col>
      </Row>
    </template>

    <Divider orientation="left">商品</Divider>
    <div class="good-item">
      <div class="cover" v-if="orderDetail.score_good_images">
        <el-image :src="orderDetail.score_good_images" :previewSrcList="[orderDetail.score_good_images]"></el-image>
      </div>
      <div class="info">
        <div class="name">商品名称：{{orderDetail.score_good_name}}</div>
        <div class="number">数量：{{orderDetail.score_good_number}}</div>
        <div class="price">购买价格：{{orderDetail.score_good_price}}</div>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra",'$router'],
    data: function () {
      return {
        operationType: 'add',
        formData: {
          id:null,
          logistics_id: null,
          logistics_no: '',

          good_type:'',
          user_note:'',
          admin_note:'',
        },
        orderDetail:{},
      };
    },
    filters:{

    },

    async mounted() {
      this.orderDetail=this.extra
      console.log(this.orderDetail)

    },

    methods: {
      goUrl(url){
        window.open(url, '_blank');
      },
      selectClick(){

      },
      onBtn: async function (index) {
        return true;
      }
    }
  };
</script>

<style lang="scss">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .good-item{
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    .cover{
      width: 100px;
      height: 100px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .info{
      line-height: 25px;
      margin-left: 20px;
      .name{}
    }
  }


</style>
