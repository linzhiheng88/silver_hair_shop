<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="50">
      <div style="font-size: 14px; margin-bottom: 20px;">請輸入登入密碼清空選中數據!</div>
      <FormItem label="密碼" prop="password">
        <Input type="password" v-model="formData.password"/>
      </FormItem>

    </Form>

  </div>
</template>

<script>
  import crypto from "crypto";
  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function() {
      return {
        formData: {
          password:'',
        },
        rules: {
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
          ],
        },
        objectId:undefined,

        type:1,

      };
    },
    mounted() {

      if (this.extra) {
        this.type=2
        this.objectId = this.extra.id;
        // this.formData.password = this.extra.password;
      }
    },

    methods: {
      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {

          let md5 = crypto.createHash('md5');
          md5.update(this.formData.password);
          let pwd = md5.digest("hex");
          try {
            let result = await this.$http.post("/admin/handle_agency", {
              type: this.type,
              id:this.objectId,
              name: this.formData.name,
              account: this.formData.account,
              password: pwd,
            });
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
