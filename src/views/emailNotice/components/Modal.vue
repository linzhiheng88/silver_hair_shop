<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="类型" prop="type">
        <i-select placeholder="通知类型" size="large" style="width:100%" v-model="formData.type">
          <i-option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <Input v-model="formData.email"/>
      </FormItem>
<!--      <FormItem label="LOGO封面" prop="images">-->
<!--        <upload-image :imgLists="formData.images?[formData.images]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>-->
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
          name: '',
          email: '',
          type: null

        },
        typeList:[{label:'订单通知',value:1},{label:'客服通知',value:2}],
        rules: {
          type: [
            {required: true,type:'number', message: '类型不能为空', trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.email = this.extra.email;
        this.formData.type = this.extra.type;
      }


    },

    methods: {
      imagesFun(data) {
        this.formData.images = data[0]
      },
      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            let formData={
              name:this.formData.name,
              email:this.formData.email,
              type:this.formData.type,
            }
            if(this.operationType == 'edit'){
              formData.id=this.formData.id
            }

            const result = await this.$request({
              url: '/emailNotice/edit',
              method: 'post',
              data:formData
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
