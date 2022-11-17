<template>
  <div class="container">
      <Divider orientation="left">商城订单信息</Divider>
      <Row :gutter="20">
        <Col span="8">订单ID：{{orderDetail.id}}</Col>
        <Col span="8">订单编号：{{orderDetail.order_no}}</Col>
        <Col span="8">订单状态：{{orderState(orderDetail.state)}}</Col>
      </Row>
    <Row :gutter="20">
      <Col span="8">优惠券金额：{{orderDetail.coupons_discount_money}}</Col>
      <Col span="8">返现金额：{{orderDetail.return_cash_coupon_money}}</Col>
      <Col span="8">支付方式：{{orderDetail.pay_type==1?'在线支付':'货到付款'}}</Col>
    </Row>
    <Row :gutter="20">
      <Col span="8">订单金额：{{orderDetail.total_money}}</Col>
      <Col span="8">成本金额：{{orderDetail.cost_money}}</Col>
      <Col span="8">支付金额：{{orderDetail.real_total_money}}</Col>
    </Row>
      <Row :gutter="20">
        <Col span="6">收货人：{{orderDetail.consignee_name}}</Col>
        <Col span="6">收货人号码：{{orderDetail.consignee_phone}}</Col>
        <Col span="12">收货人地址：{{orderDetail.consignee_province+orderDetail.consignee_city+orderDetail.consignee_county+orderDetail.consignee_address}}</Col>
      </Row>
    <Divider orientation="left">商品</Divider>
        <div class="good-item" v-for="item in orderDetail.order_goods">
          <div class="cover">
            <img :src="item.images">
          </div>
          <div class="info">
            <div class="name">商品名称：{{item.name}}</div>
            <div class="name">商品编号：{{item.good_no}}</div>
            <div class="spec">规格：{{item.art_names}}</div>
            <div class="number">数量：{{item.number}}</div>
            <div class="price">购买价格：{{item.price}}</div>
            <div class="price">进货平台：{{item.good.platform.name}}</div>
            <div class="price" v-if="item.good.third_party_url">链接：<a target="view_frame" :href="item.good.third_party_url">{{item.good.third_party_url}}</a></div>
          </div>
        </div>

    <template v-if="jd_order_id">
      <Divider orientation="left">京东订单信息</Divider>

      <template>
        <Row :gutter="20">
          <Col span="12">订单编号：{{jdOrderDetail.jdOrderId}}</Col>
          <Col span="12">
            <div v-if="jdOrderDetail.orderState==1">订单状态：{{ jdOrderDetail.jdOrderState | jdOrderState }}</div>
            <div v-else >订单状态：<span style="color: red">订单已取消</span></div>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col span="8">订单总金额：{{jdOrderDetail.orderPrice}}</Col>
          <!--        <Col span="8">商品金额：{{alibabaOrderDetail.baseInfo.sumProductPayment}}</Col>-->
          <Col span="8">运费：{{jdOrderDetail.freight}}</Col>
        </Row>
        <!--      <Row :gutter="20">-->
        <!--        <Col span="6">收货人：{{alibabaOrderDetail.baseInfo.receiverInfo.toFullName}}</Col>-->
        <!--        <Col span="6">收货人号码：{{alibabaOrderDetail.baseInfo.receiverInfo.toPhone}}</Col>-->
        <!--        <Col span="12">收货人地址：{{alibabaOrderDetail.baseInfo.receiverInfo.toArea}}</Col>-->
        <!--      </Row>-->
      </template>
      <template v-if="jdOrderDetail.submitState==0">
        <div style="padding: 20px 0;">确定订单信息无误即可提交付款</div>
        <i-button type="info" @click="downOrder">付款</i-button>
      </template>
    </template>
    <template v-if="!jd_order_id">
      <Divider orientation="left">京东订单信息</Divider>
      <div style="padding: 20px 0;">下单失败，需要重新下单</div>
      <i-button type="info" @click="againAddOrder">重新下单</i-button>
    </template>

<!--    <i-button style="margin-top: 30px;" v-if="alibabaOrderDetail.baseInfo&&alibabaOrderDetail.baseInfo.status=='cancel'" type="info" @click="downOrder">再次下单</i-button>-->


  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
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
        jdOrderDetail:{},
        jd_order_id:null,
      };
    },
    filters:{
      jdOrderState: function (value) {
        let list=[
          {
            value:1,
            label:'新建订单',
          },
          {
            value:2,
            label:'等待支付',
          },
          {
            value:3,
            label:'等待支付确认',
          },
          {
            value:4,
            label:'延迟付款确认',
          },
          {
            value:5,
            label:'订单暂停',
          },
          {
            value:6,
            label:'店长最终审核',
          },
          {
            value:7,
            label:'等待打印',
          },
          {
            value:8,
            label:'等待出库',
          },


          {
            value:9,
            label:'等待打包',
          },
          {
            value:10,
            label:'等待发货',
          },
          {
            value:11,
            label:'自提途中',
          },
          {
            value:12,
            label:'上门提货',
          },
          {
            value:13,
            label:'自提退货',
          },
          {
            value:14,
            label:'确认自提',
          },
          {
            value:16,
            label:'等待确认收货',
          },
          {
            value:17,
            label:'配送退货',
          },
          {
            value:18,
            label:'货到付款确认',
          },

          {
            value:19,
            label:'已完成',
          },
          {
            value:21,
            label:'收款确认',
          },
          {
            value:22,
            label:'锁定',
          },
          {
            value:29,
            label:'等待三方出库',
          },
          {
            value:30,
            label:'等待三方发货',
          },
          {
            value:31,
            label:'等待三方发货完成',
          },
        ]
        let status='其他状态'
        for(let i in list){
          if(value==list[i].value){
            status=list[i].label;
            break;
          }
        }

        return status
      }
    },

    async mounted() {
      // this.orderDetail=this.extra

      console.log(this.extra)

      this.jd_order_id=this.extra.jd_order_id



      this.getData()
    },

    methods: {

      async againAddOrder(){
        let result = await this.$request({
          url:'/jd/againAddOrder/'+this.extra.order_id,
          method: 'get'
        })
        if(result.code==200){
          this.$Message.success('下单成功')
        }
      },
      orderState:function(value){
        let state=''
        const that=this
        // for(let i in this.$store.state.orderStateList){
        //   if(value==this.$store.state.orderStateList[i].state){
        //     state=this.$store.state.orderStateList[i].label;
        //     break;
        //   }
        // }
        for(let i in this.extra.orderStateList){
          if(value==this.extra.orderStateList[i].state){
            state=this.extra.orderStateList[i].label;
            break;
          }
        }
        return state
      },

      async getData(){
        let result = await this.$request({
          url:'/order/detail/'+this.extra.order_id,
          method: 'get'
        })
        this.orderDetail=result.data
        console.log(this.orderDetail)

        if(this.jd_order_id){
          let alResult = await this.$request({
            url:'/jd/orderDetail/'+this.jd_order_id,
            method: 'get'
          })
          this.jdOrderDetail=alResult.data
        }
      },

      async downOrder(){
        this.$Spin.show();
        let result = await this.$request({
          url:'/jd/orderConfirm',
          method: 'POST',
          data:{
              jdOrderId:this.extra.jd_order_id,
              // poNo:this.jdOrderDetail.
          }
        })
        if(result.code==200){
          this.$Message.success('下单成功')
          // this.alibaba_order_id=result.data.orderId
          this.getData()
        }
        this.$Spin.hide();


      },

      selectClick(){

      },
      onBtn: async function (index) {
        return true;
      }
    }
  };
</script>

<style lang="scss" scoped>
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
