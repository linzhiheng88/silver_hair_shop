<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="编码" prop="coding">
        <Input v-model="formData.coding"/>
      </FormItem>
      <FormItem label="LOGO封面" prop="images">
        <upload-image :imgLists="formData.images?[formData.images]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
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
          coding: '',
          images:'',

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          coding: [
            {required: true, message: '编码不能为空', trigger: 'blur'},
          ],
          images:[
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
        this.formData.coding = this.extra.coding;
        this.formData.images = this.extra.images;
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
              images:this.formData.images,
              coding:this.formData.coding
            }
            if(this.operationType == 'edit'){
              formData.id=this.formData.id
            }

            const result = await this.$request({
              url: '/logistics/edit',
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
