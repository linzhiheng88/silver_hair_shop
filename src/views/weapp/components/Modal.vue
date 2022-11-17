<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="状态" prop="state">
        <i-select size="large" v-model="formData.state">
          <i-option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="行业商品包" prop="industry_package_id">
        <i-select size="large" v-model="formData.industry_package_id">
          <i-option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="APP ID" >
        <Input v-model="formData.app_id"/>
      </FormItem>
      <FormItem label="APP SECRET">
        <Input v-model="formData.app_secret"/>
      </FormItem>
      <FormItem label="风格" prop="style">
        <i-select size="large" v-model="formData.style">
          <i-option v-for="item in styleList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>

      <FormItem label="促销活动">
        <Tag checkable @on-change="weappActivityChange" :checked="formData.weapp_activity_list.includes(item.value)?true:false" color="primary" :name="item.value" v-for="item in weappActivity" :key="item.value" size="large">{{item.label}}</Tag>
      </FormItem>


      <FormItem label="分享标题">
        <Input v-model="formData.share_title"/>
      </FormItem>
      <FormItem label="分享图片" prop="image">
        <upload-image tip="建议上传尺寸：750*600" :imgLists="formData.share_image_url?[formData.share_image_url]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
      </FormItem>

      <FormItem label="跳转URL" prop="weixin_url">
        <Input v-model="formData.weixin_url"/>
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
          industry_package_id:null,
          app_id: '',
          app_secret: '',
          style:null,
          state:null,
          weixin_url:'',
          weapp_activity_list:[],
          share_image_url:'',
          share_title:'',
        },
        industryPackageList:[],
        weappActivity:[
          {
            label: '新人专区',
            value:1,
          },
          {
            label: '秒杀专区',
            value:2
          },
          {
            label: '拼团专区',
            value:3
          }
        ],
        stateList:[
          {label:'正常', value:1},
          {label:'欠费', value:2},
          {label:'禁用', value:0}
        ],
        styleList:[
          {label:'风格1', value:1},
        ],
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          industry_package_id: [
            {required: true,type:'number', message: '行业商品包不能为空', trigger: 'change'},
          ],
          state: [
            {required: true,type:'number', message: '状态不能为空', trigger: 'change'},
          ],
          style: [
            {required: true,type:'number', message: '风格不能为空', trigger: 'change'},
          ],
          weixin_url: [
            {required: true, message: '待结算佣金不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

      };
    },
    computed:{

    },

    async mounted() {
      if (this.extra.id) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.industry_package_id = this.extra.industry_package_id;
        this.formData.app_id = this.extra.app_id;
        this.formData.app_secret = this.extra.app_secret;
        this.formData.style = this.extra.style;
        this.formData.state = this.extra.state;
        this.formData.weixin_url = this.extra.weixin_url;
        this.formData.share_image_url = this.extra.share_image_url;
        this.formData.share_title = this.extra.share_title;
        if(this.extra.weapp_activities)this.formData.weapp_activity_list=this.extra.weapp_activities.map(item=>{
          return item.type
        })

      }
      this.industryPackageList=this.extra.industryPackageList
      // this.$store.dispatch('getIndustryPackage')


    },

    methods: {
      imagesFun(data) {
        this.formData.share_image_url = data[0]
      },
      weappActivityChange(checked, name){
        let index=this.formData.weapp_activity_list.indexOf(name)
        if(index==-1){
          this.formData.weapp_activity_list.push(name)
        }else{
          this.formData.weapp_activity_list.splice(index,1)
        }
      },
      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            const result = await this.$request({
              url: '/weapp/edit',
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
