<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="商品名称" prop="name">
        {{formData.name}}
      </FormItem>
      <FormItem label="优惠金额" prop="preferential_price">
        <Input v-model="formData.preferential_price"/>
      </FormItem>

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
        good_id:null,
        name:'',
        preferential_price: '',
      },
      rules: {
        preferential_price: [
          {required: true, message: '请输入优惠金额', trigger: 'blur'},
        ]
      },


    };
  },
  async mounted() {
    if (this.extra) {
      this.formData.good_id = this.extra.good_id;
      this.formData.preferential_price = this.extra.preferential_price;
      this.formData.name = this.extra.name;
    }

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
            url: '/spellGroup/editPrice',
            method: 'post',
            data:{
              good_id:this.formData.good_id,
              preferential_price:this.formData.preferential_price,
            }
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
