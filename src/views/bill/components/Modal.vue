<template>
  <div class="container">
    <div class="list" v-if="!extra.shop_id">
      <div class="li">
         <div class="h"></div>
         <div class="h">{{extra.type==1?'当日':'当月'}}（总数=官方+平台）</div>
         <div class="h">累计（总数=官方+平台）</div>
      </div>
      <div class="li">
        <div class="d">订单数</div>
        <div class="d">{{extra.order +' = '+extra.order_weapp+' + '+extra.order_shop}}</div>
        <div class="d">{{extra.order_total +' = '+extra.order_total_weapp+' + '+extra.order_total_shop}}</div>
      </div>
      <div class="li">
        <div class="d">销售额</div>
        <div class="d">{{extra.sales +' = '+extra.sales_weapp+' + '+extra.sales_shop}}</div>
        <div class="d">{{extra.sales_total +' = '+extra.sales_total_weapp+' + '+extra.sales_total_shop}}</div>

      </div>
      <div class="li">
        <div class="d">退款金额</div>
<!--        <div class="d">{{extra.refund}}</div>-->
<!--        <div class="d">{{extra.refund_total}}</div>-->
        <div class="d">{{extra.refund +' = '+extra.refund_weapp+' + '+extra.refund_shop}}</div>
        <div class="d">{{extra.refund_total +' = '+extra.refund_total_weapp+' + '+extra.refund_total_shop}}</div>

      </div>
      <div class="li">
        <div class="d">利润金额</div>
<!--        <div class="d">{{extra.profits}}</div>-->
<!--        <div class="d">{{extra.profits_total}}</div>-->

        <div class="d">{{extra.profits +' = '+extra.profits_weapp+' + '+extra.profits_shop}}</div>
        <div class="d">{{extra.profits_total +' = '+extra.profits_total_weapp+' + '+extra.profits_total_shop}}</div>

      </div>
    </div>

    <div class="list" v-else>
      <div class="li">
        <div class="h"></div>
        <div class="h">{{extra.type==1?'当日':'当月'}}</div>
      </div>
      <div class="li">
        <div class="d">订单数</div>
        <div class="d">{{extra.order}}</div>
      </div>
      <div class="li">
        <div class="d">销售额</div>
        <div class="d">{{extra.sales}}</div>
      </div>
      <div class="li">
        <div class="d">退款金额</div>
        <div class="d">{{extra.refund}}</div>
      </div>
      <div class="li">
        <div class="d">利润金额</div>
        <div class="d">{{extra.profits}}</div>
      </div>
    </div>


  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function() {
      return {

      };
    },
    mounted() {
      console.log(this.extra)


    },

    methods: {

      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            const result = await this.$request({
              url: '/weapp/edit',
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
  .list{
    .li{
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      height: 45px;
      .h{
        width: 33.33%;
        font-weight: bold;
      }
      .d{
        width: 33.33%;
      }
    }
  }
</style>
