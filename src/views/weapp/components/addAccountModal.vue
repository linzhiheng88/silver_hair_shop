<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="账号" prop="username">
        <Input style="width: 200px;" v-model="formData.username"/> (只能填写字母或数字)
      </FormItem>

      <FormItem label="重置密码" v-if="formData.id">
                <i-switch  size="large" v-model="passwordRes">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
      </FormItem>

      <FormItem label="密码"v-if="!formData.id||passwordRes">
        <Input v-model="formData.password"/>
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
          id:null,
          name: '',
          username: '',
          password: '',
          weapp_id: null

        },
        passwordRes:false,
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'},
          ],
          commission_yes: [
            {required: true, message: '已结算佣金不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

      };
    },
    mounted() {
      if (this.extra.id) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.weapp_id = this.extra.weapp_id;
        this.formData.username = this.extra.username;
      }
      this.formData.weapp_id = this.extra.weapp_id;

    },

    methods: {

      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {

            if(!this.formData.id||this.passwordRes){

              if(this.formData.password){
                let md5 = crypto.createHash('md5');
                md5.update(that.formData.password);
                this.formData.password = md5.digest("hex");
              }

            }

            const result = await this.$request({
              url: '/weapp/accountEdit',
              method: 'post',
              data:this.formData
            })
            console.log(result);
            if (result.code == 200) {
              this.$Message.success("操作成功");
              return true;
            }

            return false;

          } catch (e) {
            this.$Message.error("操作失敗");
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

<style scoped="">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
