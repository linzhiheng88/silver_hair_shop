<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="类型" prop="commission_no">
        <i-select size="large" v-model="formData.type" style="width: 50%">
          <i-option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="金额" prop="value">
        <InputNumber style="width: 50%" :max="999999" :min="1" v-model="formData.value"></InputNumber>
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
          type: null,
          value: 1
        },
        typeList:[
          {label:'充值',value:1},
          {label:'扣除',value:2}
        ],
        rules: {
          type: [
            {required: true,type:'number', message: '名称不能为空', trigger: 'change'},
          ],
          value: [
            {required: true,type:'number', message: '金额不能为空', trigger: 'blur'},
          ]
        },
        operationType:'add',

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
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
              url: '/weapp/tupup/'+this.formData.id,
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
