<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">
      <FormItem label="商品" prop="good_id" v-if="formData.id">
        <Select
          style="width:100%"
          :disabled="formData.id?true:false"
          v-model="formData.good_id"
          filterable
          :remote-method="searchFunc"
          :loading="searchLoading">
          <Option v-for="(item, index) in searchResultList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>

      <Form-item label="行业包" prop="industry_package_id"  v-if="!formData.id">
        <Select :disabled="formData.weapp_id?true:false" v-model="industry_package_id"  style="width:50%;">
          <Option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span style="color: red;display: inline-block;margin-left: 10px;">(仅用于方便精准筛选商品，选填)</span>
      </Form-item>

      <FormItem label="商品ID" v-if="!formData.id">
        <Input type="number" number style="width: 50%;" v-model="formData.good_id"/>
        <Button style="width: 120px;margin-left: 10px;" type="primary" @click="addGood">添加</Button>
      </FormItem>

      <FormItem label="已选商品" v-if="!formData.id">
        {{goodList.length==0?'无':''}}
        <Tag closable @on-close="delGood(index)" size="large" v-for="(item,index) in goodList" :key="index">{{item.id+' - '+item.name}}</Tag>
      </FormItem>

      <FormItem label="权重" prop="index">
        <Input type="number" number v-model="formData.index"/>
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
      industry_package_id:null,
      formData: {
        id:null,
        good_id:null,
        activity_id:null,
        good_ids:[],
        index:1,
      },
      rules: {
        good_id: [
          {required: true,type:'number', message: '请选择商品', trigger: 'change'},
        ],
      },
      industryPackageList:[],
      goodList:[],

      searchLoading:true,
      searchResultList:[],

    };
  },
  async mounted() {
    this.formData.activity_id = this.extra.activity_id;
    console.log(this.extra)
    if(this.extra.id){
      this.formData.index = this.extra.activity_good.index;
      this.formData.good_id = this.extra.id;
      this.formData.id = this.extra.activity_good.id;
    }else {
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
    }

    console.log(this.formData)

  },

  methods: {
    async addGood(){
      if(!this.formData.good_id){
        this.$Message.warning("请输入商品ID");
        return false;
      }
      let have=false
      for (let i in this.goodList){
        if(this.goodList[i].id==this.formData.good_id){
          have=true;
          break;
        }
      }
      if(have){
        this.$Message.warning("该商品已存在");
        return false;
      }

      const result = await this.$request({
        url: 'good/get/' + this.formData.good_id,
        method: 'get',
        params:{
          industry_package_id:this.industry_package_id
        }
      });
      if(result.code==200){
        this.goodList.push({
          id:result.data.id,
          name:result.data.name,
        })
        this.formData.good_id=null
      }
    },
    delGood(index){
      this.goodList.splice(index,1)
    },
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
      this.searchResultList=result.data.map(item=>{
        return {
          id:item.id,
          name:item.name+' （ ¥'+item.price+'）'
        }
      })

      if(this.extra.id){
        this.searchResultList.push({
          id:this.extra.id,
          name:this.extra.name+' （ ¥'+this.extra.price+'）'
        })
      }

      this.searchLoading = false;
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      let that = this;
      let flag = false;
      if (valid) {
        try {
          if(!this.formData.id){
            this.formData.good_ids=this.goodList.map(item=>{
              return item.id
            })
            if(this.formData.good_ids.length==0){
              this.$Message.warning("请选择商品");
              return false;
            }
          }

          const result = await this.$request({
            url: '/activity/addGood',
            method: 'post',
            data:this.formData
          })
          if (result.code == 200) {
            this.$Message.success("操作成功");
            return true;
          } else {
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
