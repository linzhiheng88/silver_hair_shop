<template>
  <div class="container">
      <Divider orientation="left">商品</Divider>
      <div class="good-item">
        <div class="cover">
          <img :src="orderDetail.order_good.images">
        </div>
        <div class="info">
          <div class="name">商品名称：{{orderDetail.order_good.name}}</div>
          <div class="spec">商品编码：{{orderDetail.order_good.good_no}}</div>
          <div class="spec">规格：{{orderDetail.order_good.art_names}}</div>
          <div class="number">数量：{{orderDetail.order_good.number}}</div>
          <div class="price">购买价格：{{orderDetail.order_good.price}}</div>
        </div>
      </div>
      <Divider orientation="left">订单信息</Divider>
      <Row :gutter="20">
        <Col span="12">订单编号：{{orderDetail.order_no}}</Col>
        <Col span="12">
          <div  v-for="item in orderAfterStateList.filter(obj=>{return obj.state==orderDetail.state})">
            订单状态：{{orderDetail.state_name}}
          </div>

        </Col>
      </Row>
      <Row :gutter="20">
        <Col span="8">售后类型：{{orderDetail.type_name}}</Col>
        <Col span="8">申请数量：{{orderDetail.number}}</Col>
        <Col span="8" v-if="orderDetail.type==1">退款金额：{{orderDetail.real_refund_money}}</Col>
      </Row>
      <Divider orientation="left">申请原因</Divider>
      <Row :gutter="20">
        <Col span="12">理由：{{orderDetail.reason}}</Col>
        <Col span="12">原因：{{orderDetail.content}}</Col>
      </Row>
      <div class="pingzheng-images">
          <el-image style="width: 100px;" :preview-src-list="orderDetail.images" v-for="(item,index) in orderDetail.images" :key="index" :src="item"></el-image>
      </div>
    <template v-if="orderDetail.type==1||orderDetail.type==2">
      <Divider orientation="left">用户寄回地址</Divider>
      <div style="background: #f9f9f9;padding: 10px;">
        <Input v-model="formData.recycling_address"  type="textarea" />
        <i-button style="margin-top: 10px;" v-if="!orderDetail.take_logistics_id" type="info" @click="auditClick">提交</i-button>
      </div>
      <Divider orientation="left">用户寄回快递单号</Divider>
      <Row :gutter="20" v-if="orderDetail.take_logistics_no" style="font-size: 16px;font-weight: bold;align-items: center;display: flex;margin-bottom: 10px">
        <Col span="10">快递公司：{{orderDetail.take_logistics_name}}</Col>
        <Col span="10">快递单号：{{orderDetail.take_logistics_no}}</Col>
        <!--          <Col span="4"><i-button @click="seeLogistics('take')">查看物流</i-button></Col>-->
      </Row>
      <div v-else>未填写</div>
    </template>


<!--      <Row :gutter="20" v-if="orderDetail.take_logistics_id" style="font-size: 16px;font-weight: bold;align-items: center;display: flex;margin-bottom: 10px">-->
<!--        <Col span="10"><a @click="editLogistics('take')">快递公司：{{orderDetail.take_logistics.name}}</a></Col>-->
<!--        <Col span="10"><a @click="editLogistics('take')">快递单号：{{orderDetail.take_logistics_no}}</a></Col>-->
<!--        <Col span="4"><i-button @click="seeLogistics('take')">查看物流</i-button></Col>-->
<!--      </Row>-->
<!--      <Row :gutter="20">-->
<!--        <Col span="6">收货人：{{orderDetail.take_name}}</Col>-->
<!--        <Col span="6">电话：{{orderDetail.take_phone}}</Col>-->
<!--        <Col span="12">地址：{{orderDetail.take_address}}</Col>-->
<!--      </Row>-->


      <template v-if="orderDetail.type==2">
        <Divider orientation="left">收货地址</Divider>
        <Row :gutter="20" v-if="orderDetail.consignee_logistics_id" style="font-size: 16px;font-weight: bold;align-items: center;display: flex;margin-bottom: 10px">
          <Col span="10"><a @click="editLogistics('consignee')">快递公司：{{orderDetail.consignee_logistics.name}}</a></Col>
          <Col span="10"><a @click="editLogistics('consignee')">快递单号：{{orderDetail.consignee_logistics_no}}</a></Col>
          <Col span="4"><i-button @click="seeLogistics('consignee')">查看物流</i-button></Col>
        </Row>
        <Row :gutter="20">
          <Col span="6">收货人：{{orderDetail.consignee_name}}</Col>
          <Col span="6">电话：{{orderDetail.consignee_phone}}</Col>
          <Col span="12">地址：{{orderDetail.consignee_address}}</Col>
        </Row>
        <i-button v-if="!orderDetail.consignee_logistics_id" type="info" @click="editLogistics('consignee')">发货</i-button>
      </template>

    <Divider orientation="left">操作</Divider>
    <i-button type="success" :disabled="(orderDetail.state==4||orderDetail.state==6)?true:false" style="width: 100px" @click="refundMoney">完成</i-button>
    <i-button type="error" :disabled="orderDetail.state==4?true:false" style="width: 100px;margin-left: 20px" @click="refusedModals">拒绝</i-button>

  </div>
</template>

<script>

  import logisticsModal from "./logisticsModal";
  import seeLogisticsModalComp from "@/components/see-logistics-modal-comp";
  import refusedModal from "./refusedModal";
  import refundMoneyModal from "./refundMoneyModal";

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

          recycling_address:''


        },
        orderDetail:{order_good:{}},
        orderAfterStateList:[]
      };
    },

    async mounted() {
      this.orderDetail=this.extra
      this.formData.recycling_address=this.extra.recycling_address
      console.log(this.orderDetail)
        this.orderAfterStateList=this.extra.orderAfterStateList

    },

    methods: {
        auditClick(){
            this.$dialog.confirm({
                message: '是否通过审核？',
                width: 300,
                height: 180,
                onBtn: async index => {
                    if (index !== 0) return true;
                    let result = await this.$request({
                        url: '/orderAfter/audit/' + this.orderDetail.id,
                        method: 'post',
                        data:{
                            recycling_address:this.formData.recycling_address
                        }
                    })
                    if (result.code == 200) {
                        this.$Message.success('提交成功');
                        return true;
                    } else {
                        this.$Message.info('提交失败');
                    }
                }
            });
        },

      //拒绝售后
      async refusedModals() {
        this.$dialog.open({
          title: '订单详情',
          resizable: true,
          component: refusedModal,
          height: 400,
          width: 600,
          extra: this.orderDetail,
          btn: ["确定", "关闭"],
          onDismiss: index => {
            if (index === 0) {
              this.getData();
              return true;
            }
          }
        });
      },
      //确定退款
      async refundMoney() {
        this.$dialog.open({
          title: '订单详情',
          resizable: true,
          component: refundMoneyModal,
          height: 300,
          width: 400,
          extra:this.orderDetail,
          btn: ["确定", "关闭"],
          onDismiss: index => {
            if (index === 0) {
              this.getData();
              return true;
            }
          }
        });
      },

      async getData(){
        const result = await this.$request({
          url: '/orderAfter/detail/'+this.orderDetail.id,
          method: 'get',
        })
        this.orderDetail.state=result.data.state
        this.orderDetail.consignee_logistics_id=result.data.consignee_logistics_id
        this.orderDetail.consignee_logistics=result.data.consignee_logistics
        this.orderDetail.consignee_logistics_no=result.data.consignee_logistics_no
        this.orderDetail.take_logistics_id=result.data.take_logistics_id
        this.orderDetail.take_logistics=result.data.take_logistics
        this.orderDetail.take_logistics_no=result.data.take_logistics_no

        this.orderDetail.recycling_address=result.data.recycling_address
        this.formData.recycling_address=result.data.recycling_address

      },

      //查看物流
      async seeLogistics(type){
        let logistics={
          code:type=='take'?this.orderDetail.take_logistics.coding:this.orderDetail.consignee_logistics.coding,
          number:type=='take'?this.orderDetail.take_logistics_no:this.orderDetail.consignee_logistics_no,
        }
        this.$dialog.open({
          title: type=='take'?"上门取件物流":'发货物流',
          resizable: true,
          component: seeLogisticsModalComp,
          height: 400,
          width: 600,
          extra: logistics,
          btn: ["取消"],
          onDismiss: index => {
            if (index === 0) {
              return true;
            }
          }
        });
      },


      //填写物流单号
      async editLogistics(type) {
        this.orderDetail['logisticsType']=type
        this.$dialog.open({
          title: type=='take'?"上门取件":'发货',
          resizable: true,
          component: logisticsModal,
          height: 300,
          width: 600,
          extra: this.orderDetail,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.getData();
              return true;
            }
          }
        });
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
  .pingzheng-images{
    display: flex;
    img{
      width: 100px;
      height: 100px;
      display: block;
      margin-right: 10px;
      margin-top: 10px;
    }
  }


</style>
