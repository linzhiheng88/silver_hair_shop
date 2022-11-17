<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="姓名" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="账号" prop="account">
        <Input v-model="formData.account"/>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="formData.password"/>
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
        account:'',
        password:'',
      },
      rules: {
        name: [
          {required: true, message: '姓名不能為空', trigger: 'blur'},
        ],
        account: [
          {required: true, message: '账号不能為空', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码不能為空', trigger: 'blur'},
        ],
      },
    };
  },
  mounted() {
    if (this.extra) {
      this.formData.id = this.extra.id;
      this.formData.name = this.extra.name;
      this.formData.account = this.extra.account;
    }
  },
  methods: {
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        if (this.formData.id) {
          const result = await this.$request({
            url: '/admin/phone/brand',
            method: 'post',
            data:{
              name:this.formData.name,
              remark:this.formData.remark,
            }
          })
          if (result.status == 1) {
            this.$Message.success("操作成功");
            return true;
          } else {
            this.$Message.error("操作失敗");
            return false;
          }
        } else {
          const result = await this.$request({
            url: '/admin/phone/brand/'+this.formData.id,
            method: 'put',
            data:{
              name:this.formData.name,
              remark:this.formData.remark,
            }
          })
          console.log(result);
          if (result.status == 1) {
            this.$Message.success("操作成功");
            return true;
          } else {
            this.$Message.error("操作失敗");
            return false;
          }
        }

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
