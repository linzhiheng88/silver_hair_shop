<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <Form-item label="行业包" prop="industry_package_id" >
        <Select v-model="formData.industry_package_id"  style="width:100%">
          <Option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="类型" prop="type">
        <Select v-model="formData.type" style="width:100%">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <FormItem label="跳转链接" prop="url">
        <Input v-model="formData.url"/>
      </FormItem>

      <FormItem label="封面图" prop="image">
        <upload-image :imgLists="formData.image?[formData.image]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
      </FormItem>

<!--      <Form-item label="上下架" >-->
<!--        <i-switch  size="large" v-model="formData.shelves">-->
<!--          <span slot="open">上架</span>-->
<!--          <span slot="close">下架</span>-->
<!--        </i-switch>-->
<!--      </Form-item>-->

    </Form>
  </div>
</template>
<script>
export default {
  name: "EditDialog",
  props: ["extra"],
  data: function() {
    return {
      formData: {
        id:null,
        type: null,
        image: '',
        url:'',
        shelves:null,
        industry_package_id:null
      },
      industryPackageList:[],
      rules: {
        industry_package_id: [
          {required: true,type:'number', message: '行业包不能为空', trigger: 'change'},
        ],
        url: [
          {required: true, message: '跳转链接不能为空', trigger: 'blur'},
        ],
        image: [
          {required: true, message: '封面图不能为空', trigger: 'change'},
        ],
        type: [
          {required: true,type:'number', message: '提示语不能为空', trigger: 'change'},
        ],
      },
      typeList: [
        {
          value: 1,
          label: '小程序跳转',
        },
        {
          value: 2,
          label: 'H5跳转',
        }
      ]
    };
  },
  async mounted() {
    if(this.extra.industry_package_id){
      this.formData.industry_package_id=this.extra.industry_package_id
    }
    if (this.extra) {
      this.formData.id = this.extra.id;
      this.formData.type = this.extra.type;
      this.formData.image = this.extra.image;
      this.formData.url = this.extra.url;
      this.formData.shelves = this.extra.shelves==1?true:false;
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
      this.formData.image = data[0]
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        this.formData.shelves=this.formData.shelves?1:0
        const result = await this.$request({
          url: '/scoreTask/scoreTaskActivityEdit',
          method: 'post',
          data:this.formData
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
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
