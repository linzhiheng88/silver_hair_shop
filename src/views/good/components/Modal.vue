<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="关联商品" prop="name">
        <i-select @on-change="selectClick" filterable placeholder="请选择关联商品" size="large" style="width:100%;" v-model="formData.good_id">
          <i-option v-for="item in goodList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="价格" prop="price">
        <Input v-model="formData.price"/>
      </FormItem>
      <FormItem label="权重" prop="order">
        <Input number type="number" style="width: 300px" v-model="formData.order"/>（从大到小排序）
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
        good_id:null,
        price: '',
        order:1,
      },
      rules: {
        good_id: [
          {required: true,type:'number', message: '请选择商品', trigger: 'blur'},
        ],
        price: [
          {required: true, message: '请输入价格', trigger: 'blur'},
        ]
      },

      goodList:[],

    };
  },
  async mounted() {
    if (this.extra) {
      this.formData.good_id = this.extra.good_id;
      this.formData.price = this.extra.price;
      this.formData.order = this.extra.order;
    }

    const result = await this.$request({
      url: '/good/list/1/999',
      method: 'post',
    })
    this.goodList=result.data.rows.map(item=>{
      return {
        value:item.id,
        label:item.name
      }
    })
  },

  methods: {
    selectClick(){

    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      let that = this;
      let flag = false;
      if (valid) {
        try {
          const result = await this.$request({
            url: '/newZoneGood/save',
            method: 'post',
            data:this.formData
          })
          if (result.code == 200) {
            this.$Message.success("操作成功");
            return true;
          } else {
            this.$Message.error("操作失敗");
            return false;
          }


        } catch (e) {
          this.$Message.error("操作失敗");
          return false;
        }
      } else {
        console.log("111");
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
