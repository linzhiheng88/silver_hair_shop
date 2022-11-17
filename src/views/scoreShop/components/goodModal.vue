<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="140">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name" style="width:400px"/>
      </FormItem>
      <FormItem label="领取方式" prop="type">
        <Select v-model="formData.type"  style="width:400px">
          <Option v-for="item in [{label:'表单',value:1},{label:'兑换码',value:2}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <FormItem label="价格（积分）" prop="price">
        <Input number type="number" v-model="formData.price" style="width:400px"/>
      </FormItem>
      <FormItem label="库存" prop="stock">
        <Input number type="number" v-model="formData.stock" style="width:400px"/>
      </FormItem>
      <FormItem label="限制兑换数量/用户" prop="limit_number">
        <Input number type="number" v-model="formData.limit_number" style="width:400px"/>（填0代表不限制）
      </FormItem>
      <FormItem label="权重" prop="index">
        <Input number type="number" v-model="formData.index" style="width:400px"/>（越大排越前面）
      </FormItem>

      <FormItem label="展示标签">
        <Tag v-for="(item,index) in formData.label_tip" size="large" :key="index" closable @on-close="closeShowLabel(index)">
          {{item}}
        </Tag>
        <Button icon="ios-add" v-if="!labelIsinput" type="dashed" size="large" @click="labelIsinput=true">添加标签</Button>
        <div class="showinput" v-if="labelIsinput">
          <Input v-model="labelInputvalue"/>
          <Icon class="d" @click="addShowLabel" type="ios-checkmark"/>
          <Icon class="c" @click="labelIsinput=false" type="ios-close"/>
        </div>
      </FormItem>

      <FormItem label="封面" prop="images">
        <upload-image tip="建议上传尺寸：750*750" :imgLists="formData.images" @imageReturnData="imagesFun" :count="9"></upload-image>
      </FormItem>
      <FormItem label="商品详情" prop="details">
        <upload-image tip="建议上传尺寸：750*750" :imgLists="formData.details" @imageReturnData="detailImagesFun" :count="30"></upload-image>
      </FormItem>
      <FormItem label="领取方法">
        <Input type="textarea" :rows="4" style="width: 600px" v-model="formData.receive_method"/>
      </FormItem>

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
        weapp_id:null,
        type:null,
        name: '',
        images:[],
        details:[],
        receive_method:'',
        price:null,
        stock:0,
        label_tip:[],
        index:0,
        limit_number:0,
      },
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ],
        type: [
          {required: true,type:'number', message: '领取方式不能为空', trigger: 'change'},
        ],
        price: [
          {required: true,type:'number', message: '价格不能为空', trigger: 'blur'},
        ],
        stock: [
          {required: true,type:'number', message: '价格不能为空', trigger: 'blur'},
        ],
        limit_number: [
          {required: true,type:'number', message: '限制兑换数量不能为空', trigger: 'blur'},
        ],
        images: [
          {required: true,type:'array', message: '图片不能为空', trigger: 'change'},
        ],
      },

      labelInputvalue:'',
      labelIsinput: false,
    };
  },
  mounted() {
    this.formData.weapp_id = this.extra.weapp_id;
    if (this.extra.id) {
      this.formData.id = this.extra.id;
      this.formData.type = this.extra.type;
      this.formData.name = this.extra.name;
      this.formData.images = this.extra.images;
      this.formData.details = this.extra.details;
      this.formData.receive_method = this.extra.receive_method;
      this.formData.price = this.extra.price;
      this.formData.stock = this.extra.stock;
      this.formData.label_tip = this.extra.label_tip;
      this.formData.index = this.extra.index;
      this.formData.limit_number = this.extra.limit_number;
    }
  },
  methods: {
    imagesFun(data) {
      this.formData.images = data
    },
    detailImagesFun(data) {
      this.formData.details = data
    },
    closeShowLabel(index){
      this.formData.label_tip.splice(index, 1);
    },
    addShowLabel(){
      if(this.labelInputvalue==''){
        this.$Message.warning('请输入标签名称')
        return false;
      }
      this.formData.label_tip.push(this.labelInputvalue)
      this.labelInputvalue=''
      this.labelIsinput=false
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        const result = await this.$request({
          url: '/scoreGood/goodEdit',
          method: 'post',
          data:this.formData
        })
        if (result.code == 200) {
          this.$Message.success("操作成功");
          return true;
        }
        return false;
      } catch (e) {
        this.$Message.error("操作失敗");
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.showinput {
  width: 200px;
  position: relative;
  border: 1px solid #000;
  display: inline-block;
}

.showinput input {
  width: 136px;
  border: none;
}

.showinput i {
  font-size: 32px;
  position: absolute;
  top: 0;
  cursor: pointer;
}

.showinput i:hover {
  color: #cccccc;
}

.showinput .d {
  right: 30px;
}

.showinput .c {
  right: 0px;
}

</style>
