<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">
      <FormItem label="兑换码" prop="code">
        <Input :placeholder="placeholder" type="textarea" :rows="20" style="width: 440px" v-model="formData.code"/>（多个兑换码，用回车换行，可直接复制excel列表过来黏贴）
      </FormItem>

    </Form>
  </div>
</template>
<script>
export default {
  name: "EditDialog",
  props: ["extra","store"],
  data: function() {
    return {
      placeholder: '例如\nTouch2021\nTouch2022\nTouch2023',
      formData: {
        score_good_id:null,
        code:'',
      },
      rules: {
        code: [
          {required: true, message: '兑换码不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  mounted() {
    this.formData.score_good_id = this.extra.score_good_id;
  },
  methods: {
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        let exchangeCodeArr=this.formData.code.split(/\n/)
        let exchangeCode=[]
        for(let i in exchangeCodeArr){
          if(exchangeCodeArr[i]&&exchangeCodeArr[i]!='')exchangeCode.push(exchangeCodeArr[i])
        }

        let formData={
          score_good_id:this.formData.score_good_id,
          code:exchangeCode
        }

        console.log(exchangeCode)

        const result = await this.$request({
          url: '/scoreGood/goodCodeEdit',
          method: 'post',
          data:formData
        })
        if (result.code == 200) {
          this.$Message.success("操作成功");
          return true;
        }
        return false;
      } catch (e) {
        this.$Message.error("操作失敗");
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
