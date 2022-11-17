<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>

      <Form-item label="分类" prop="class_activity_id">
        <Select v-model="formData.class_activity_id"  style="width:100%">
          <Option v-for="item in classActivityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>

      <FormItem label="权重" prop="index">
        <Input type="number" number v-model="formData.index"/>
      </FormItem>
      <FormItem label="描述" prop="describe">
        <Input type="textarea" :rows="3" v-model="formData.describe"/>
      </FormItem>
<!--      <FormItem label="背景颜色" prop="background">-->
<!--        <ColorPicker alpha  size="large" v-model="formData.background" />-->
<!--      </FormItem>-->
<!--      <FormItem label="封面" prop="images">-->
<!--        <upload-image :width="350" :height="220" :imgLists="formData.images?[formData.images]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>-->
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
          class_activity_id:null,
          name: '',
          background: '',
          images:'',
          describe:'',
          index:1,

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          background: [
            {required: true, message: '背景不能为空', trigger: 'change'},
          ],
          images:[
            {required: true, message: '请上传LOGO封面', trigger: 'change'},
          ],
          describe: [
            {required: true, message: '描述不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

        classActivityList:[]

      };
    },
    async mounted() {
      if (this.extra.id) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.background = this.extra.background;
        this.formData.images = this.extra.images;
        this.formData.class_activity_id = this.extra.class_activity_id;
        this.formData.describe = this.extra.describe;
        this.formData.index = this.extra.index;
      }

      this.classActivityList=this.extra.classActivityList
      // const result = await this.$request({
      //   url:'/activity/classlist/1/999',
      //   method:'post',
      // });
      // this.classActivityList=result.data.rows.map(item=>{
      //   return {
      //     id:item.id,
      //     name:item.name,
      //   }
      // })
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

            if(this.operationType == 'add'){
              delete this.formData.id;
            }
            const result = await this.$request({
              url: '/activity/edit',
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
