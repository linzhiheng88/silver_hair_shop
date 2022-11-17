<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="最小值" prop="min">
        <Input number type="number"  v-model="formData.min"/>
      </FormItem>
      <FormItem label="最大值" prop="max">
        <Input number type="number" v-model="formData.max"/>
      </FormItem>

    </Form>
  </div>
</template>
<script>
export default {
  name: "EditDialog",
  props: ["extra"],
  data: function() {
    return {
      formData: {
        id:null,
        weapp_id:null,
        min:null,
        max:null,
      },
      rules: {
        min: [
          {required: true,type:'number', message: '最小值不能为空', trigger: 'blur'},
        ],
        max: [
          {required: true,type:'number', message: '最大值不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  mounted() {
    this.formData.weapp_id = this.extra.weapp_id;
    if (this.extra.id) {
      this.formData.id = this.extra.id;
      this.formData.min = this.extra.min;
      this.formData.max = this.extra.max;
    }
  },
  methods: {
    imagesFun(data) {
      this.formData.image = data[0]
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        const result = await this.$request({
          url: '/scoreGood/sectionEdit',
          method: 'post',
          data:this.formData
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
