<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
<!--      <Form-item label="分类" prop="class_activity_id">-->
<!--        <Select v-model="formData.class_activity_id"  style="width:500px">-->
<!--          <Option v-for="item in classActivityList" :value="item.id" :key="item.value">{{ item.name }}</Option>-->
<!--        </Select>-->
<!--      </Form-item>-->
      <FormItem label="背景颜色" prop="background">
        <ColorPicker alpha  size="large" v-model="formData.background" />
<!--        <Input v-model="formData.background"/>-->
      </FormItem>
      <FormItem label="封面" prop="images">
        <upload-image :width="350" :height="220" :imgLists="formData.images?[formData.images]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
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
          class_activity_id:0,
          name: '',
          background: '',
          images:'',

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
          ]
        },
        operationType:'add',

        classActivityList:[]

      };
    },
    async mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.background = this.extra.background;
        this.formData.images = this.extra.images;
        this.formData.class_activity_id = this.extra.class_activity_id;
      }

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
      // this.classActivityList.unshift({
      //   id:0,
      //   name:'不分类'
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
