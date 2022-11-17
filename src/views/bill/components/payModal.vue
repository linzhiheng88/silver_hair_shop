<template>
  <div class="container">
    <div class="top-box">
      <div class="title">平台账单支付</div>
      <div class="desc">
        <div class="label">总利润金额：</div>
        <div class="value" style="color: #333333;">¥{{extra.profits}}</div>
        <div class="info">{{billDate}}月账单</div>
      </div>

      <div class="desc">
        <div class="label">官方商品利润：</div>
        <div class="value">¥{{extra.profits_weapp}}</div>
        <div class="label" style="margin-left: 20px;">平台商品利润：</div>
        <div class="value">¥{{extra.profits_shop}}</div>
      </div>

    </div>

    <div class="pay-form" v-if="!payAuto">
      <div class="pay-form-box">
        <div class="title">实际支付金额：</div>
        <Input number v-model="formData.pay_money" type="number" style="width: 200px"/>
      </div>
    </div>

   <div class="qrcode-box" v-else>
     <div class="black" @click="payAuto=false">返回</div>
     <div class="qrcode-content">
       <img class="qrcode" :src="qrcodeUrl">
       <div class="q-tip">请打开手机微信，扫一扫完成支付</div>
     </div>
     <div class="jc">
       <img src="../../../assets/wxpay_tip-ac45fc3d17795a22330c.png">
     </div>
   </div>

    <Spin size="large" fix v-if="spinShow"></Spin>

  </div>
</template>

<script>
  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function() {
      return {
        spinShow:false,
        qrcodeUrl:'',

        payAuto:false,

        actualPayMoney:null,

        formData:{
          id:null,
          pay_money: null
        }
      };
    },
    computed:{
      billDate:function () {
        let dataObj=this.$utils.changeTimeDate(this.extra.time)
        return dataObj.year+'-'+dataObj.month
      }
    },
    mounted() {
      if(this.extra){
        this.formData.id=this.extra.id
        this.formData.pay_money=this.extra.pay_money
      }


    },

    methods: {
      onBtn: async function (index) {
        if (index !== 0) return true;
        // let valid = await this.$refs['form'].validate();
        let valid =true
        let that = this;
        let flag = false;
        if(!this.formData.pay_money){
          this.$Message.warning('请输入支付金额')
          return false;
        }
        if (valid) {
          try {
            const result = await this.$request({
              url: '/bill/pay',
              method: 'post',
              data:this.formData
            })
            console.log(result);
            if (result.code == 200) {
              this.$Message.success("操作成功");
              return true;
            }

            return false;

          } catch (e) {
            this.$Message.error("操作失敗");
            return false;
          }
        } else {
          return false;
        }
        return flag;
      }
    }
  };
</script>

<style scoped lang="scss">
  .top-box{
    border-bottom: 1px solid #f3f3f3;
    padding-left: 150px;
    padding-bottom: 15px;
    .title{
      font-size: 14px;
      font-weight: bold;
    }
    .desc{
      display: flex;
      align-items: center;
      font-size: 14px;
      .label{
      }
      .value{
        color: #0ac265;
        font-size: 20px;
      }
      .info{
        color: #3584cb;
        margin-left: 30px;
      }
    }
  }

  .qrcode-box{
    text-align: center;
    position: relative;
    margin-top: 30px;
    .black{
      position: absolute;
      left: 60px;
      top: -30px;
      font-size: 16px;
      color: #1e88e5;
      cursor: pointer;
      padding: 20px;
    }
    .qrcode-content{
      text-align: center;
      .qrcode{
        width: 220px;
        height: 220px;
      }
      .q-tip{
        width: 200px;
        margin: 0 auto;
        line-height: 30px;
        font-size: 12px;
        color: #fff;
        background-color: #00c800;
      }
    }
    .jc{
      position: absolute;
      width: 200px;
      right: 20px;
      top: 0px;
      img{
        width: 100%;
      }
    }
  }

  .pay-form{
    margin-top: 20px;
    padding-left: 150px;
    .pay-form-box{
      display: flex;
      align-items: center;
    }
  }
</style>
