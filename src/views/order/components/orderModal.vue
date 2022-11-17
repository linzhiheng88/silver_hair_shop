<template>
  <div class="container">
      <Divider orientation="left">订单信息</Divider>
      <Row :gutter="20">
        <Col span="8">订单ID：{{orderDetail.id}}</Col>
        <Col span="8">订单编号：{{orderDetail.order_no}}</Col>
        <Col span="8">订单状态：{{orderDetail.state_name}}</Col>
      </Row>
    <Row :gutter="20">
      <Col span="8">优惠券金额：{{orderDetail.coupons_discount_money}}</Col>
      <Col span="8">返现金额：{{orderDetail.return_cash_coupon_money}}</Col>
      <Col span="8">支付方式：{{orderDetail.pay_type_name}}</Col>
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
    <Row :gutter="20">
      <Col span="24">订单备注：{{orderDetail.user_note||'无'}}</Col>
    </Row>

    <Divider orientation="left">商品</Divider>
    <div class="good-item" v-for="item in orderDetail.order_goods">
      <div class="cover">
        <el-image :src="item.images" :previewSrcList="[item.images]"></el-image>
      </div>
      <div class="info">
        <div class="name">商品名称：{{item.name}}</div>
        <div class="name">商品编号：{{item.good_no}}</div>
        <div class="spec">规格：{{item.art_names}}</div>
        <div class="number">数量：{{item.number}}</div>
        <div class="price">购买价格：{{item.price}}</div>
        <div class="price">进货平台：{{item.good.platform.name}} <i-button v-if="orderDetail.platform_id==100||orderDetail.platform_id==200" style="margin-left: 10px;" size="small" type="info" @click="goGoodInfo">查看详细</i-button></div>
        <div class="price" v-if="item.good.third_party_url">链接：<a target="view_frame" :href="item.good.third_party_url">{{item.good.third_party_url}}</a></div>
      </div>
    </div>

    <template v-if="orderDetail.platform_id==100">
      <Divider orientation="left">阿里订单</Divider>
      <template v-if="alibabaOrderDetail.baseInfo">
        <Row :gutter="20">
          <Col span="12">订单编号：{{alibabaOrderDetail.baseInfo.id}}</Col>
          <Col span="12">订单状态：{{ alibabaOrderDetail.baseInfo.status | albabaOrderStatus }}</Col>
        </Row>
        <Row :gutter="20">
          <Col span="8">订单总金额：{{alibabaOrderDetail.baseInfo.totalAmount}}</Col>
          <Col span="8">商品金额：{{alibabaOrderDetail.baseInfo.sumProductPayment}}</Col>
          <Col span="8">运费：{{alibabaOrderDetail.baseInfo.shippingFee}}</Col>
        </Row>
        <Row :gutter="20">
          <Col span="6">收货人：{{alibabaOrderDetail.baseInfo.receiverInfo.toFullName}}</Col>
          <Col span="6">收货人号码：{{alibabaOrderDetail.baseInfo.receiverInfo.toPhone}}</Col>
          <Col span="12">收货人地址：{{alibabaOrderDetail.baseInfo.receiverInfo.toArea}}</Col>
        </Row>
        <div style="margin-top: 10px;display: flex;align-items: center;">
          <i-button type="warning" @click="goUrl('https://trade.1688.com/order/new_step_order_detail.htm?orderId='+alibabaOrderDetail.baseInfo.idOfStr)">查看订单详情</i-button>
          <div style="color: red;">（需登录平台）</div>
        </div>
      </template>
      <template v-else>未下单</template>
    </template>

    <template v-if="orderDetail.platform_id==200">
      <Divider orientation="left">京东订单</Divider>
      <template v-if="jdOrderDetail.jdOrderId">
        <Row :gutter="20">
          <Col span="12">订单编号：{{jdOrderDetail.jdOrderId}}</Col>
<!--          <Col span="12">订单状态：{{ jdOrderDetail.jdOrderState | jdOrderState }}</Col>-->
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
      <template v-else>未下单</template>
    </template>


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

        alibabaOrderDetail:{},
        jdOrderDetail:{}
      };
    },
    filters:{
      albabaOrderStatus: function (value) {
        let list=[
          {
            value:'waitbuyerpay',
            label:'等待买家付款',
          },
          {
            value:'waitsellersend',
            label:'等待卖家发货',
          },
          {
            value:'waitbuyerreceive',
            label:'等待买家收货',
          },
          {
            value:'confirm_goods',
            label:'已收货',
          },
          {
            value:'success',
            label:'交易成功',
          },
          {
            value:'cancel',
            label:'交易取消',
          },
          {
            value:'terminated',
            label:'交易终止',
          },
          {
            value:'',
            label:'其他状态',
          }
        ]
        let status='其他状态'
        for(let i in list){
          if(value==list[i].value){
            status=list[i].label;
            break;
          }
        }

        return status
      },
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
      this.orderDetail=this.extra
      if(this.orderDetail.platform_id==100&&this.orderDetail.alibaba_order&&this.orderDetail.alibaba_order.alibaba_order_id){
        this.getAliOrderInfo(this.orderDetail.alibaba_order.alibaba_order_id)
      }else if(this.orderDetail.platform_id==200&&this.orderDetail.jd_order&&this.orderDetail.jd_order.jd_order_id){
        this.getJdOrderInfo(this.orderDetail.jd_order.jd_order_id)
      }
    },

    methods: {
      goGoodInfo(){
        let path=''
        if(this.orderDetail.platform_id==100){
          // this.$router.push('/epShop/goodDetail/'+this.orderDetail.order_goods[0].alibaba_good_id)
          path='/epShop/goodDetail/'+this.orderDetail.order_goods[0].alibaba_good_id

        }else if(this.orderDetail.platform_id==200) {
          path='/epShop/jdGoodDetail/'+this.orderDetail.order_goods[0].jd_skuid
        }
        const {href} = this.$router.resolve({
          path: path,
        })
        window.open(href, '_blank')
      },


      goUrl(url){
        window.open(url, '_blank');
      },
      async getAliOrderInfo(id){
        let alResult = await this.$request({
          url:'/alibaba/orderDetail/'+id,
          method: 'get'
        })
        this.alibabaOrderDetail=alResult.data
      },
      async getJdOrderInfo(id){
        let alResult = await this.$request({
          url:'/jd/orderDetail/'+id,
          method: 'get'
        })
        this.jdOrderDetail=alResult.data
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
