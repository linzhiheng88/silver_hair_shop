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

    <Divider orientation="left">阿里巴巴订单信息</Divider>

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
    <template v-else>
      <div style="padding: 20px 0;">还没下单到阿里巴巴平台</div>
      <i-button type="info" @click="downOrder">下单</i-button>
    </template>

    <i-button style="margin-top: 30px;" v-if="alibabaOrderDetail.baseInfo&&alibabaOrderDetail.baseInfo.status=='cancel'" type="info" @click="downOrder">再次下单</i-button>


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
        alibabaOrderDetail:{},
        alibaba_order_id:null,
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
      }
    },

    async mounted() {
      // this.orderDetail=this.extra

      console.log(this.extra)

      this.alibaba_order_id=this.extra.alibaba_order_id



      this.getData()
    },

    methods: {
      goUrl(url){
        window.open(url, '_blank');
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

        if(this.alibaba_order_id){
          let alResult = await this.$request({
            url:'/alibaba/orderDetail/'+this.alibaba_order_id,
            method: 'get'
          })
          this.alibabaOrderDetail=alResult.data

        }
      },

      async downOrder(){
        this.$Spin.show();
        let result = await this.$request({
          url:'/alibaba/addAlibabaOrder/'+this.extra.order_id,
          method: 'get'
        })
        if(result.code==200){
          this.$Message.success('下单成功')
          this.alibaba_order_id=result.data.orderId
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
