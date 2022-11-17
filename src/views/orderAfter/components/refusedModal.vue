<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">


      <FormItem label="当前状态">
        {{extra.state_name}}
      </FormItem>
      <FormItem label="类型" prop="state">
        <i-select size="large" v-model="formData.state">
          <i-option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="拒绝理由" prop="admin_note">
        <Input type="textarea" :rows="4" v-model="formData.admin_note"/>
      </FormItem>

    </Form>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function () {
      return {
        operationType: 'add',
        formData: {
          id:null,
          state:null,
          admin_note: '',
        },

        stateList:[
          {
            value:1,
            label:'处理中'
          },
          {
            value:5,
            label:'取消'
          },
          {
            value:6,
            label:'拒绝'
          }
        ],

        rules: {
          state: [
            {required: true,type:'number', message: '请选择处理类型', trigger: 'change'},
          ],
          admin_note: [
            {required: true, message: '理由不能为空', trigger: 'blur'},
          ],
        },

      };
    },

    async mounted() {
      if (this.extra) {
        this.formData.id = this.extra.id;
        if(this.extra.state==1||this.extra.state==5||this.extra.state==6){
          this.formData.state = this.extra.state;
        }
        this.formData.admin_note = this.extra.admin_note;
      }
    },

    methods: {


      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let flag = false;
        if (valid) {
          try {
            const result = await this.$request({
              url: '/orderAfter/refused/'+this.formData.id,
              method: 'post',
              data: {
                state:this.formData.state,
                admin_note: this.formData.admin_note,
              }
            })
            if (result.code == 200) {
              this.$Message.success("操作成功");
              return true;
            } else {
              // this.$Message.error("操作失败");
              return false;
            }

          } catch (e) {
            this.$Message.error("操作失败");
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

<style lang="scss">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }


</style>
