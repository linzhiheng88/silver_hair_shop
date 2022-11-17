<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">

      <Form-item label="类型" prop="type">
        <Select v-model="formData.type"  style="width:400px">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>

      <Form-item label="跳转类型" prop="url_type">
        <Select v-model="formData.url_type"  style="width:400px">
          <Option v-for="item in urlTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>

      <FormItem label="权重">
        <Input v-model="formData.index"  style="width:400px"/>
      </FormItem>
      <FormItem label="跳转链接">
        <Input v-model="formData.url"/>
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
        type: null,
        note: '',
        ad_id: '',
        weapp_id:null

      },
      rules: {
        note: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ],
        type: [
          {required: true,type:'number', message: '类型不能为空', trigger: 'blur'},
        ],
        ad_id: [
          {required: true, message: '编码不能为空', trigger: 'blur'},
        ],
      },
      operationType:'add',
      typeList:[
        {
          value:1,
          label:'首页进入广告'
        },
        {
          value:2,
          label:'首页背景图片'
        },
        {
          value:3,
          label:'首页Banner图片'
        },
        {
          value:4,
          label:'首页浮窗icon'
        },
      ],


    };
  },

  async mounted() {
    if (this.extra) {
      this.operationType = 'edit';
      this.formData.id = this.extra.id;
      this.formData.type = this.extra.type;
      this.formData.ad_id = this.extra.ad_id;
      this.formData.note = this.extra.note;
      this.formData.weapp_id = this.extra.weapp_id;

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
            type:this.formData.type,
            index:this.formData.index,
            url_type:this.formData.url_type,
            is_show:this.formData.is_show?1:0,
            images:this.formData.images,
            url:this.formData.url,
            industry_package_id:this.formData.industry_package_id
          }
          if(this.operationType == 'edit'){
            formData.id=this.formData.id
          }

          const result = await this.$request({
            url: '/banner/edit',
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

<style scoped="">
.container {
  margin: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
