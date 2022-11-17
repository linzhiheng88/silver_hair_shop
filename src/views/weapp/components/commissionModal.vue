<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="待结算佣金" prop="commission_no">
        <Input v-model="formData.commission_no"/>
      </FormItem>
      <FormItem label="已结算佣金" prop="commission_yes">
        <Input v-model="formData.commission_yes"/>
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
          id:null,
          commission_no: '',
          commission_yes: ''

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          commission_no: [
            {required: true, message: '待结算佣金不能为空', trigger: 'blur'},
          ],
          commission_yes: [
            {required: true, message: '已结算佣金不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.commission_no = this.extra.commission_no;
        this.formData.commission_yes = this.extra.commission_yes;
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
              url: '/weapp/editCommission',
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
