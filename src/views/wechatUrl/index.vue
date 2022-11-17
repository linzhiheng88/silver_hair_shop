<template>
  <div>
    <my-header :breadcrumbList="['获取链接']"></my-header>
    <div class="page-body-main">

      <div class="page-body-main-content">


        <Form ref="form" :model="formData" :rules="rules" :label-width="100">
          <Form-item label="平台" prop="weapp_id" >
            <Select v-model="formData.weapp_id"  style="width:400px">
              <Option v-for="item in weappList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>

          <FormItem label="小程序链接" prop="url" >
            <Input style="width:400px" v-model="formData.url"/>
          </FormItem>

          <FormItem label="有效天数" prop="day" >
            <Input style="width:400px" number type="number" v-model="formData.day"/>
          </FormItem>

          <div style="padding-left: 100px;height: 100px">
            <div>链接：{{wechatUrl||'无'}}</div>
            <Button v-if="wechatUrl" style="width: 100px;" type="success" @click="copy">复制链接</Button>
          </div>

          <div class="button-div" style="padding-left: 80px">
            <Button style="width: 200px;margin-left: 20px" type="primary" :loading="buttonLoading" @click="submit">提交</Button>
          </div>

        </Form>


      </div>

    </div>
  </div>
</template>
<script>
export default {
  name: 'Demo',
  data: function () {
    return {
      formData:{
        weapp_id: null,
        url:'',
        day:30,
      },
      wechatUrl:'',
      rules: {
        weapp_id: [
          {required: true,type:'number', message: '请选择平台', trigger: 'change'},
        ],
        url:[
          {required: true, message: '请填写跳转链接', trigger: 'blur'},
        ],
        day:[
          {required: true,type:'number', message: '请填写跳转链接', trigger: 'blur'},
          {min:1,type:'number', message: '最短1天', trigger: 'blur'},
          {max:30,type:'number', message: '最长30天', trigger: 'blur'},
        ],
      },
      buttonLoading:false,

    }
  },
  computed: {
    weappList: function () {
      return this.$store.state.weappList.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
    },
  },

  async mounted() {
    this.$store.dispatch('getWeapp')

  },



  methods: {
    copy(){
      this.$utils.copy(this.wechatUrl)
    },
    async submit(){
      let valid = await this.$refs['form'].validate();
      let that = this;
      if (valid) {
        this.buttonLoading=true
        let result = await this.$request({
          url:'/wechatUrl/generatescheme',
          method: 'POST',
          data:this.formData
        })
        if(result.code==200&&result.data.errcode==0){
          this.$Message.success('获取成功')
          this.wechatUrl=result.data.openlink
        }else {
          this.$Message.error(result.data.errmsg)
        }
        this.buttonLoading=false



      }
    },

    //删除
    async deleteModal(params){
      this.$dialog.confirm({
        message: '是否删除此数据？',
        width: 300,
        height:200,
        onBtn: async index => {
          if (index !== 0) return true;
          let result = await this.$request({
            url:'/good/add/'+params.row.id,
            method: 'delete'
          })
          if (result.status == 1) {
            this.$Message.success('刪除成功');
            this.refreshCurrent();
            return true;
          } else {
            this.$Message.info('删除失败');
          }
        }
      });
    },


    onDataLoad: async function (options, callback) {
      if (this.keywordObj.keyword) {
        // options.keyword = [
        //   {openid:this.keywordObj.keyword},
        // ];
      }
      const result = await this.$request({
        url:'/list/'+options.page+'/'+options.pageSize,
        method:'post',
        data:options
      });
      callback(result);
    },

    refreshCurrent: function () {
      this.$refs.pageTable.loadData();
    },

    pushData(items){
      console.log(items);
      this.dataList = items
    },
    doSearch(keyword){
      this.keywordObj.keyword = keyword;
      this.$refs.pageTable.reload();
    },
    doSelect(state){
      this.keywordObj.state=state
      this.$refs.pageTable.reload();
    },
  },
}
</script>

<style scoped="">
.page-body-main-content {
  padding: 15px;
  background: #ffffff;
}

</style>
