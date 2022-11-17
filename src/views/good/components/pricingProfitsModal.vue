<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">
      <Form-item label="定价利润" prop="pricing_profits">
        <InputNumber :max="100000" :min="0" style="width: 200px" v-model="formData.pricing_profits"></InputNumber> %
      </Form-item>
    </Form>

  </div>
</template>

<script>

export default {
  name: "EditPointsDialog",
  props: ["extra"],
  data: function() {
    return {
      formData: {
        pricing_profits:0
      },
      rules: {
        pricing_profits: [
          {required: true,type:'number', message: '定价利润不能为空', trigger: 'blur'},
        ],
      },


    };
  },
  async mounted() {
    console.log(this.extra)

  },

  methods: {
    selectClick(){

    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      let that = this;
      let flag = false;
      if (valid) {
        try {
          let formData=this.extra
          formData.pricing_profits=this.formData.pricing_profits
          const result = await this.$request({
            url: '/good/editPricingProfits',
            method: 'post',
            data:formData
          })
          if (result.code == 200) {
            this.$Message.success("操作成功");
            return true;
          } else {
            this.$Message.error("操作失敗");
            return false;
          }


        } catch (e) {
          this.$Message.error("操作失敗");
          return false;
        }
      } else {
        console.log("111");
        return false;
      }
      return flag;
    }
  }
};
</script>

<style scoped="">
.container {
  margin: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
