<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">

      <template>
        <FormItem label="订单状态" prop="logistics_id">
          <i-select size="large" v-model="formData.state">
<!--            .filter(obj=>{return obj.state==4||obj.state==5})-->
<!--            <i-option v-for="item in $store.state.orderStateList" :value="item.state" :key="item.state">{{item.label}}</i-option>-->
            <i-option v-for="item in orderStateList" :value="item.state" :key="item.state">{{item.label}}</i-option>
          </i-select>
        </FormItem>

      </template>



<!--      <FormItem label="备注" prop="note">-->
<!--        <Input type="textarea" :rows="4" v-model="formData.note"/>-->
<!--      </FormItem>-->

    </Form>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function () {
      return {
        formData: {
          id:null,
          state: null,

        },

        rules: {
          state: [
            {required: true, type:'number', message: '请选择订单状态', trigger: 'change'},
          ]

        },

      };
    },
      computed:{
          orderStateList:function () {
              return this.extra.orderStateList
          }
      },

    async mounted() {
      if (this.extra) {
        this.formData.id = this.extra.id;
        this.formData.state = this.extra.state;
      }


    },

    methods: {

      selectClick(){

      },

      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let flag = false;
        if (valid) {
          try {
            const result = await this.$request({
              url: '/order/editstate/'+this.formData.id,
              method: 'post',
              data: {
                state:this.formData.state,
              }
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
