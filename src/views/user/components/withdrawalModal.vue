,jm<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="状态" prop="state">
        <i-select size="large" :disabled="extra.state==1?true:false" v-model="formData.state">
          <i-option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>

      <FormItem label="备注" prop="logistics_no">
        <Input v-model="formData.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
      </FormItem>


<!--      <FormItem label="头像" prop="images">-->
<!--        <upload-image :imgLists="formData.headimgurl?[formData.headimgurl]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>-->
<!--      </FormItem>-->

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
          state: null,
          note: ''

        },
        rules: {
          state: [
            {required: true,type:'number', message: '请选择状态', trigger: 'blur'},
          ],
        },
        operationType:'add',

        stateList:[
          {
            value:1,
            label:'已打款'
          },
          {
            value:2,
            label:'不通过'
          },
          {
            value:0,
            label:'待审核'
          }
        ]

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.state = this.extra.state;
        this.formData.note = this.extra.note;
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
              url: '/distribution/auditWithdrawal',
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
