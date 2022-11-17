<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
<!--      <FormItem label="背景颜色" prop="background">-->
<!--        <ColorPicker alpha  size="large" v-model="formData.background" />-->
<!--      </FormItem>-->

        <FormItem label="封面" prop="image">
            <upload-image :tip="formData.level<=2?'建议上传尺寸：490*180':'建议上传尺寸：200*200'" :imgLists="formData.image?[formData.image]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
        </FormItem>

      <FormItem label="权重" prop="index">
        <Input number type="number" style="width: 200px" v-model="formData.index"/> （值越大越靠前）
      </FormItem>
<!--      <FormItem label="是否违禁" prop="index">-->
<!--        <i-switch  size="large" v-model="formData.violation">-->
<!--          <span slot="open">是</span>-->
<!--          <span slot="close">否</span>-->
<!--        </i-switch>-->
<!--        （标记为违禁分类则在审核时不显示）-->
<!--      </FormItem>-->

    </Form>

  </div>
</template>

<script>

  import editor from "../../../widget/editor";
export default {
  name: "EditPointsDialog",
  props: ["extra"],
  components:{editor},
  data: function() {
    return {
      formData: {
        id:null,
        name: '',
        background: '',
        image: '',
        index:1,
        level:1,
        f_calss_id:0,
        violation:false

      },
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ]
      },
      operationType:'add',

    };
  },
  mounted() {
    if (this.extra) {
      this.formData.id = this.extra.id;
      this.formData.name = this.extra.name;
      this.formData.background = this.extra.background;
      this.formData.image = this.extra.image;
      this.formData.index = this.extra.index;
      this.formData.violation = this.extra.violation==1?true:false;

      if(this.extra.id){
        this.operationType='edit'
      }
      if(this.extra.level){
        this.formData.level = this.extra.level;
      }
      if(this.extra.f_calss_id){
        this.formData.f_calss_id = this.extra.f_calss_id;
      }
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

          let formData=this.operationType == 'add'?{
            name:this.formData.name,
            background:this.formData.background,
            image:this.formData.image,
            index:this.formData.index,
            level:this.formData.level,
            f_calss_id:this.formData.f_calss_id,
            violation:this.formData.violation?1:0,
          }:{
            id:this.formData.id,
            name:this.formData.name,
            background:this.formData.background,
            image:this.formData.image,
            index:this.formData.index,
            violation:this.formData.violation?1:0,
          }
          console.log(formData)

          const result = await this.$request({
            url: '/class/edit',
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
