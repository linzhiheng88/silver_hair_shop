<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="ICON" prop="icon_url">
        <upload-image :imgLists="formData.icon_url?[formData.icon_url]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
      </FormItem>
      <FormItem label="提示语" prop="tip">
        <Input v-model="formData.tip"/>
      </FormItem>
      <FormItem label="积分" prop="value">
        <Input type="number" number v-model="formData.value"/>
      </FormItem>
      <FormItem label="参数">
        <Input v-model="formData.parameter"/>
        <div style="color: red">此处填写：激励视频ID、推文链接（需为关联公众号）</div>
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
        name: '',
        icon_url: '',
        tip:'',
        value:'',
        parameter:''
      },
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ],
        icon_url: [
          {required: true, message: 'ICON不能为空', trigger: 'change'},
        ],
        tip: [
          {required: true, message: '提示语不能为空', trigger: 'blur'},
        ],
        value: [
          {required: true,type:'number', message: '积分不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  mounted() {
    if (this.extra) {
      this.formData.id = this.extra.id;
      this.formData.name = this.extra.name;
      this.formData.icon_url = this.extra.icon_url;
      this.formData.tip = this.extra.tip;
      this.formData.value = this.extra.value;
      this.formData.parameter = this.extra.parameter;
    }
  },
  methods: {
    imagesFun(data) {
      this.formData.icon_url = data[0]
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        const result = await this.$request({
          url: '/scoreTask/scoreTaskEdit',
          method: 'post',
          data:this.formData
        })
        if (result.code == 200) {
          this.$Message.success("操作成功");
          return true;
        } else {
          this.$Message.error("操作失败");
          return false;
        }

      } catch (e) {
        this.$Message.error("操作失败");
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
