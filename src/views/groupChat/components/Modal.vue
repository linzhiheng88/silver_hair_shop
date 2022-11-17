<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="类型" prop="type">
        <Input type="number" number v-model="formData.type"/>
      </FormItem>
      <FormItem label="二维码" prop="image">
        <upload-image :imgLists="formData.image?[formData.image]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
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
          name: '',
          type: null,
          image:'',

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          coding: [
            {required: true, message: '编码不能为空', trigger: 'blur'},
          ],
          image:[
            {required: true, message: '请上传LOGO封面', trigger: 'change'},
          ]
        },
        operationType:'add',

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.type = this.extra.type;
        this.formData.image = this.extra.image;
      }


    },

    methods: {
      imagesFun(data) {
        this.formData.image = data[0]
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
              image:this.formData.image,
              type:this.formData.type
            }
            if(this.operationType == 'edit'){
              formData.id=this.formData.id
            }

            const result = await this.$request({
              url: '/groupChat/edit',
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
