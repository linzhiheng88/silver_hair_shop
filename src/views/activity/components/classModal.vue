<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <Form-item label="添加方式" prop="addType" v-if="!formData.id">
        <Select v-model="formData.addType"  style="width:100%">
          <Option v-for="item in [{value:'one',label:'单独添加'},{value:'list',label:'批量添加'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="行业包" prop="industry_package_id" >
        <Select v-model="formData.industry_package_id"  style="width:100%">
          <Option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <FormItem label="名称" prop="name"  v-if="formData.addType=='one'">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="权重" prop="index" v-if="formData.addType=='one'">
        <Input type="number" number v-model="formData.index"/>
      </FormItem>

      <FormItem label="克隆分类id" v-if="formData.addType=='list'">
        <Input v-model="formData.ids" placeholder="多个id使用英文逗号隔开，例如:1,2,3,4" type="textarea" :rows="2"/>
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
          addType:'one',
          id:null,
          industry_package_id:null,
          name: '',
          index: 1,
          ids:''
        },
        industryPackageList:[],
        rules: {
          // name: [
          //   {required: true, message: '名称不能为空', trigger: 'blur'},
          // ],
          // industry_package_id: [
          //   {required: true,type:'number', message: '行业包不能为空', trigger: 'change'},
          // ],
        },
        operationType:'add',

      };
    },
    async mounted() {
      if(this.extra.industry_package_id){
        this.formData.industry_package_id=this.extra.industry_package_id
      }
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.index = this.extra.index;
        if(this.extra.industry_package_id)this.formData.industry_package_id = this.extra.industry_package_id;
      }


      const result = await this.$request({
        url: '/industryPackage/list/1/100',
        method: 'post',
      })
      this.industryPackageList=result.data.rows.map(item=>{
        return {
          label:item.name,
          value:item.id
        }
      })
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
              addType:this.formData.addType,
              name:this.formData.name,
              index:this.formData.index,
              industry_package_id:this.formData.industry_package_id,
              ids:this.formData.ids,
            }
            if(this.operationType == 'edit'){
              formData.id=this.formData.id
            }
            const result = await this.$request({
              url: this.formData.addType=='list'?'/activity/classeditList':'/activity/classedit',
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
