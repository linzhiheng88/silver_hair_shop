<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">

      <template>
        <FormItem label="物流公司" prop="logistics_id">
          <i-select v-model="formData.logistics_id">
            <i-option v-for="item in logisticList" :value="item.value" :key="item.value">{{item.label}}</i-option>
          </i-select>
        </FormItem>
        <FormItem label="物流单号" prop="logistics_no">
          <Input v-model="formData.logistics_no"/>
        </FormItem>

      </template>

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
          logistics_id: null,
          logistics_no: '',

        },
        logisticList:[],

        rules: {
          logistics_id: [
            {required: true, type:'number', message: '物流公司不能为空', trigger: 'change'},
          ],
          logistics_no: [
            {required: true, message: '物流编号不能为空', trigger: 'blur'},
          ],
          // admin_note: [
          //   {required: true, message: '备注不能为空', trigger: 'blur'},
          // ],

        },


      };
    },

    async mounted() {
      if (this.extra) {
        this.formData.id = this.extra.id;
        this.formData.logistics_id = this.extra.logistics_id;
        this.formData.logistics_no = this.extra.logistics_no;
        // this.formData.good_type = this.extra.good_type;
        // this.formData.user_note = this.extra.user_note;
        // this.formData.admin_note = this.extra.admin_note;
      }

      let result = await this.$request({
        url:'/logistics/list/1/99',
        method: 'post'
      })

      if(result.code==200){
        this.logisticList=result.data.rows.map(item =>{
          return {
            value:item.id,
            label:item.name,
          }
        })
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
              url: '/scoreOrder/theDelivery',
              method: 'post',
              data: this.formData
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

<style lang="scss" scoped>
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }


</style>
