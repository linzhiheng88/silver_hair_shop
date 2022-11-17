<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="130">
      <Form-item label="行业包" prop="industry_package_id" v-if="extra.admin_weapp_id==0">
        <Select :disabled="formData.weapp_id?true:false" v-model="formData.industry_package_id"  style="width:400px">
          <Option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>

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


      <FormItem label="小程序APPID" prop="out_appid" v-if="formData.url_type==3">
        <Input v-model="formData.out_appid"  style="width:400px"/>
      </FormItem>
      <FormItem label="跳转链接">
        <Input v-model="formData.url"  style="width:400px"/>
      </FormItem>
      <FormItem label="权重">
        <Input v-model="formData.index"  style="width:400px"/>
      </FormItem>

<!--      <Form-item label="是否显示">-->
<!--        <i-switch  size="large" v-model="formData.is_show">-->
<!--          <span slot="open">显示</span>-->
<!--          <span slot="close">不</span>-->
<!--        </i-switch>-->
<!--      </Form-item>-->
      <FormItem label="图片" prop="images">
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
          type: null,
          index: null,
          url_type: null,
          is_show: false,
          images:'',
          url:'',
          out_appid:'',
          industry_package_id:null,
          weapp_id:null

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          url_type: [
            {required: true,type:'number', message: '名称不能为空', trigger: 'blur'},
          ],
          coding: [
            {required: true, message: '编码不能为空', trigger: 'blur'},
          ],
          url:[
            {required: true, message: '请填写跳转链接', trigger: 'blur'},
          ],
          images:[
            {required: true, message: '请上传LOGO封面', trigger: 'change'},
          ]
        },
        industryPackageList:[],
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
        urlTypeList:[
          {
            value:1,
            label:'小程序跳转'
          },
          {
            value:2,
            label:'H5跳转'
          },
          {
            value:3,
            label:'外部小程序'
          }

        ],

      };
    },
    watch:{
      'formData.url_type':{
        handler(data){
          delete this.rules.out_appid;
          if(data==3){
            this.rules['out_appid']=[
              {required: true, message: '请填写小程序APPID', trigger: 'blur'},
            ];
          }
        },
        deep:true,
        immediate:true
      }
    },

    async mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.type = this.extra.type;
        this.formData.index = this.extra.index;
        this.formData.url_type = this.extra.url_type;
        this.formData.is_show = this.extra.is_show==1?true:false;
        this.formData.images = this.extra.images;
        this.formData.out_appid = this.extra.out_appid;
        this.formData.url = this.extra.url;
        this.formData.weapp_id = this.extra.weapp_id;
        this.formData.industry_package_id = this.extra.industry_package_id;

        this.formData = this.extra
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
              out_appid:this.formData.out_appid,
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
