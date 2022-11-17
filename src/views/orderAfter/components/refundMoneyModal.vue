<template>
  <div class="container">
    <Form ref="form" :model="orderDetail" :rules="rules" :label-width="80" v-if="orderDetail.type==1">
      <FormItem label="订单编号:">
        {{orderDetail.order_no}}
        <!--        <Input disabled v-model="formData.real_refund_money"/>-->
      </FormItem>
      <FormItem label="退款金额:" v-if="orderDetail.type==1">
        {{orderDetail.real_refund_money}}
        <!--<Input disabled v-model="formData.real_refund_money"/>-->
      </FormItem>
      <div style="color: #f00000;padding-left: 8px;">提示：点击确定将立即打款给用户</div>

    </Form>

    <div v-else>
      <div style="color: #f00000;padding-left: 8px;">是否确定完成订单？</div>

    </div>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function () {
      return {
        orderDetail: {},
        rules: {

        },
      };
    },

    async mounted() {
      console.log(this.extra)
      this.orderDetail=this.extra
    },

    methods: {

      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid =true
        let flag = false;
        if (valid) {
          try {
            const result = await this.$request({
              url: '/orderAfter/confirm/'+this.orderDetail.id,
              method: 'post',
            })
            if (result.code == 200) {
              this.$Message.success("操作成功");
              return true;
            } else {
              // this.$Message.error("操作失败");
              return false;
            }

          } catch (e) {
            console.log(e)
            this.$Message.error("操作失败");
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

<style lang="scss">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }


</style>
