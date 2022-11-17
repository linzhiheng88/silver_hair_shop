<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="积分商品ID" prop="score_good_id">
        <Input v-model="formData.score_good_id"/>
      </FormItem>
      <FormItem label="封面" prop="image">
        <upload-image tip="建议上传尺寸：700*280" :imgLists="formData.image?[formData.image]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
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
        score_good_id: '',
        image:'',
      },
      rules: {
        score_good_id: [
          {required: true, message: '积分商品ID不能为空', trigger: 'blur'},
        ],
        image: [
          {required: true, message: '图片不能为空', trigger: 'change'},
        ],
      },
    };
  },
  mounted() {
    this.formData.weapp_id = this.extra.weapp_id;
    if (this.extra.id) {
      this.formData.id = this.extra.id;
      this.formData.score_good_id = String(this.extra.score_good_id);
      this.formData.image = this.extra.image;
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
          url: '/scoreGood/bannerEdit',
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
