<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <Form-item label="类型" prop="type">
        <Select v-model="formData.type" style="width:100%">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <FormItem label="关键字" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="跳转链接" prop="url">
        <Input v-model="formData.url"/>
      </FormItem>
      <Form-item label="优惠券" prop="coupon_id" v-if="formData.type==4">
        <Select v-model="formData.coupon_id" style="width:100%">
          <Option v-for="item in couponList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <FormItem label="权重">
        <Input v-model="formData.index"/>
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
      <Row>
        <Col span="12">
          <FormItem label="封面图1" prop="images">
            <upload-image :imgLists="formData.images?[formData.images]:[]" tip="上传尺寸同格子宽高一致" @imageReturnData="imagesFun"
                          :count="1"></upload-image>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="封面图2" prop="images_two">
            <upload-image :imgLists="formData.images_two?[formData.images_two]:[]" tip="上传尺寸同格子宽高一致" @imageReturnData="imagesFunTwo"
                          :count="1"></upload-image>
            (优惠券领取状态)
          </FormItem>
        </Col>
      </Row>


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
          activity_id:null,
          coupon_id:null,
          type:null,
          name: '',
          url: '',
          images: '',
          images_two: '',
          height: null,
          width: null,
          index: 1,

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          index: [
            {required: true,type:'number', message: '权重不能为空', trigger: 'blur'},
          ],
          coupon_id: [
            {required: true,type:'number', message: '请选择优惠券', trigger: 'change'},
          ],
          type: [
            {required: true,type:'number', message: '类型不能为空', trigger: 'change'},
          ],
          width: [
            {required: true,type:'number', message: '格子宽度不能为空', trigger: 'blur'},
          ],
          height: [
            {required: true,type:'number', message: '格子高度不能为空', trigger: 'blur'},
          ],
          images: [
            {required: true, message: '请上传封面图1', trigger: 'change'},
          ]
        },
        operationType: 'add',
        typeList: [
          {
            value: 0,
            label: '展示',
          },
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
            label: '优惠券',
          }
        ],
        couponList:[]

      };
    },
    async mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.activity_id = this.extra.activity_id;
        this.formData.coupon_id = this.extra.coupon_id;
        this.formData.name = this.extra.name;
        this.formData.url = this.extra.url;
        this.formData.type = this.extra.type;
        this.formData.width = this.extra.width;
        this.formData.height = this.extra.height;
        this.formData.index = this.extra.index;
        this.formData.images = this.extra.images;
        this.formData.images_two = this.extra.images_two;


        // if(this.formData.id==1){
        //   this.tip='建议上传尺寸：473*300'
        // }
      }

      console.log(this.extra)

      const result = await this.$request({
          url: '/coupon/activity/'+this.extra.activity_id,
          method: 'get',
        })

      this.couponList=result.data.map(item=>{
        return {
          value:item.id,
          label:`（ID:${item.id}）${item.name}`
        }
      })



    },

    methods: {
      imagesFun(data) {
        this.formData.images = data[0]
      },
      imagesFunTwo(data){
        this.formData.images_two = data[0]
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
              url: '/activity/boxEdit',
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
