<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="关联商品" prop="name">
<!--        <i-select @on-change="selectClick" filterable placeholder="请选择关联商品" size="large" style="width:100%;" v-model="formData.good_id">-->
<!--          <i-option v-for="item in goodList" :value="item.value" :key="item.value">{{item.label}}</i-option>-->
<!--        </i-select>-->
        <Select
          style="width:100%"
          v-model="formData.good_id"
          filterable
          :remote-method="searchFunc"
          :loading="searchLoading">
          <Option v-for="(item, index) in searchResultList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="优惠金额" prop="preferential_price">
        <Input v-model="formData.preferential_price"/>
      </FormItem>
      <FormItem label="秒杀库存" prop="stock">
        <Input number type="number" style="width: 300px" v-model="formData.stock"/>
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
        good_id:null,
        seconds_kill_id:null,
        preferential_price: '',
        stock:100,
      },
      rules: {
        good_id: [
          {required: true,type:'number', message: '请选择商品', trigger: 'change'},
        ],
        preferential_price: [
          {required: true, message: '请输入价格', trigger: 'blur'},
        ],
        stock: [
          {required: true,type:'number', message: '请输入秒杀库存', trigger: 'blur'},
        ],
      },

      searchLoading:true,
      searchResultList:[],

    };
  },
  async mounted() {
    this.formData.seconds_kill_id = this.extra.seconds_kill_id;
    if (this.extra.id) {
      this.formData.id = this.extra.id;
      this.formData.good_id = this.extra.good_id;

      this.formData.preferential_price = this.extra.preferential_price;
      this.formData.stock = this.extra.stock;

      this.searchResultList.push({
        id:this.extra.good_id,
        name:this.extra.good.name
      })
    }

    // const result = await this.$request({
    //   url: '/good/list/1/999',
    //   method: 'post',
    // })
    // this.goodList=result.data.rows.map(item=>{
    //   return {
    //     value:item.id,
    //     label:item.name
    //   }
    // })
  },

  methods: {
    async searchFunc(data){
      if(data==''){return false}
      this.searchLoading = true;
      const result = await this.$request({
        url: '/good/search',
        method: 'post',
        data:{
          keyword:[
            {
              name:data
            },
            {
              tag:data
            }
          ]
        }
      });
      let searchResultList=result.data
      if(this.extra.id){
        searchResultList.push({
          id:this.extra.good_id,
          name:this.extra.good.name
        })
      }

      this.searchResultList=searchResultList


      this.searchLoading = false;
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      let that = this;
      let flag = false;
      if (valid) {
        try {
          const result = await this.$request({
            url: '/secondsKill/goodedit',
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
