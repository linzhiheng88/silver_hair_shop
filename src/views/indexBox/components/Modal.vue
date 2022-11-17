<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="120">

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

      <FormItem label="关键字" prop="name" v-if="formData.type==1">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="小程序APPID" prop="out_appid" v-if="formData.type==4">
        <Input v-model="formData.out_appid"/>
      </FormItem>
      <FormItem label="跳转链接" prop="url" v-if="formData.type!=1">
        <Input v-model="formData.url"/>
      </FormItem>

      <Row>
        <Col span="12">
          <FormItem label="格子宽度" prop="width">
            <Input number type="number" v-model="formData.width"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="格子高度" prop="height">
            <Input number type="number" v-model="formData.height"/>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="权重">
        <Input type="number" number v-model="formData.index"/>
      </FormItem>
      <FormItem label="封面图" prop="images">
        <upload-image :imgLists="formData.images?[formData.images]:[]" tip="上传尺寸同格子宽高一致" @imageReturnData="imagesFun"
                      :count="1"></upload-image>
      </FormItem>

    </Form>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function () {
      return {
        formData: {
          id: null,
          type:null,
          name: '',
          out_appid: '',
          url: '',
          images: '',
          height: null,
          width: null,
          index: 1,
          industry_package_id:null

        },
        industryPackageList:[],
        rules: {
          industry_package_id: [
            {required: true,type:'number', message: '行业包不能为空', trigger: 'change'},
          ],
          type: [
            {required: true,type:'number', message: '类型不能为空', trigger: 'change'},
          ],
          // url: [
          //   {required: true, message: '跳转链接不能为空', trigger: 'blur'},
          // ],
          width: [
            {required: true,type:'number', message: '格子宽度不能为空', trigger: 'blur'},
          ],
          height: [
            {required: true,type:'number', message: '格子高度不能为空', trigger: 'blur'},
          ],

          // index: [
          //   {required: true,type:'number', message: '权重不能为空', trigger: 'blur'},
          // ],
          images: [
            {required: true, message: '请上传LOGO封面', trigger: 'change'},
          ],

        },
        operationType: 'add',
        typeList: [
          {
            value: 1,
            label: '关键字搜索',
          },
          {
            value: 2,
            label: '小程序跳转',
          },
          {
            value: 3,
            label: 'H5跳转',
          },
          {
            value: 4,
            label: '外部小程序',
          }
        ]

      };
    },
    watch:{
      'formData.type': {
        handler: function (data) {
          console.log(data)
          delete this.rules.name;
          delete this.rules.url;
          delete this.rules.out_appid;
          if(data==1){
            this.rules['name']=[
              {required: true, message: '关键字不能为空', trigger: 'blur'},
            ]
          }else{
            if(data==4){
              this.rules['out_appid']=[
                {required: true, message: '小程序APPID不能为空', trigger: 'blur'},
              ]
            }
            this.rules['url']=[
              {required: true, message: '跳转链接不能为空', trigger: 'blur'},
            ]
          }
        },
        deep:true,
        immediate:true
      }
    },

    async mounted() {
      if(this.extra.industry_package_id){
        this.formData.industry_package_id=this.extra.industry_package_id
      }
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.out_appid = this.extra.out_appid;
        this.formData.url = this.extra.url;
        this.formData.type = this.extra.type;
        this.formData.width = this.extra.width;
        this.formData.height = this.extra.height;
        this.formData.index = this.extra.index;
        this.formData.images = this.extra.images;

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
            let formData = this.formData
            if (this.operationType == 'add') {
              delete formData.id;
            }
            const result = await this.$request({
              url: '/indexBox/edit',
              method: 'post',
              data: formData
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
