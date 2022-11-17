<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="140">
      <Form-item label="请输入原密码" prop="password">
        <Input type="password" v-model="formData.password" style="width: 100%"/>
      </Form-item>
      <Form-item label="请输入新密码" prop="password1">
        <Input type="password" v-model="formData.password1" style="width: 100%"/>
      </Form-item>
      <Form-item label="请再次输入新密码" prop="password2">
        <Input type="password" v-model="formData.password2" style="width: 100%"/>
      </Form-item>

    </Form>
  </div>
</template>

<script>
  import crypto from "crypto";

  export default {
    name: 'EditPwdModal',
    components: {},
    props: ['extra'],
    data() {
      return {
        password: '',
        password2: '',
        oldPassword: '',
        formData: {
          password: '',
          password1: '',
          password2: '',
        },
        rules: {
          password: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
          ],
          password1: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码最少输入6位', trigger: 'blur'}
          ],
          password2: [
            {required: true, message: '请再次输入新密码', trigger: 'blur'},
          ],
        }
      }
    },

    mounted() {
    },

    methods: {
      onBtn: async function (index) {
        if (index !== 0) {
          return true;
        }

        // var valid = await this.$validate(this.$refs.form);
        let valid = await this.$refs['form'].validate();
        var that = this;
        var flag = false;
        if (valid) {
          if (that.formData.password1 !== that.formData.password2) {
            that.$Message.error('两次密码不一致');
            return false;
          }

          let md5 = crypto.createHash('md5');
          md5.update(that.formData.password);
          let pwd = md5.digest("hex");

          let md5s = crypto.createHash('md5');
          md5s.update(that.formData.password1);
          let newpwd = md5s.digest("hex");

          const results = await this.$request({
            url:'/editPassword',
            method: 'POST',
            data:{
              account: this.extra.account,
              password: pwd,
              newpassword: newpwd,
            }
          });
          if (results.code == 200) {
            this.$Message.info("修改成功,请重新登陆");
            return true;
          } else {
            // this.$Message.error(results.msg);
            return false;
          }
        } else {
          return false;
        }


      },
    },

  }
</script>
<style scoped="">
  .container {
    padding: 20px;
  }
</style>
