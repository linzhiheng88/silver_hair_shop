<template>
  <div class="container">
    <div class="good-info">
<!--      <json-viewer :value="classsArr" :expand-depth="2"></json-viewer>-->
      <el-tree
          :data="classsArr"
          show-checkbox
          node-key="id"
          :show-checkbox="false"
          :default-expand-all="true"
          :props="defaultProps">
      </el-tree>

    </div>

  </div>
</template>

<script>
  import JsonViewer from 'vue-json-viewer'
export default {
  components:{
    JsonViewer
  },
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


      classsArr:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      }

    };
  },
  async mounted() {
    console.log(this.extra)
    let itemClass=this.extra.industry_package_classes
    let classsArr=[]

    for(let o in itemClass){
      if(itemClass[o].class.level==1){
        classsArr.push({
          id:itemClass[o].class_id,
          name:itemClass[o].class.name,
          children:[]
        })
      }
    }
    for(let o in itemClass){
      if(itemClass[o].class.level==2){
        console.log("============",itemClass[o].class_id)
        for(let t in classsArr){
          console.log("---",classsArr[t].id)
          if(classsArr[t].id==itemClass[o].class.f_calss_id){
            console.log("111")
            classsArr[t].children.push({
              id:itemClass[o].class_id,
              name:itemClass[o].class.name,
              children:[]
            })
          }
        }
      }
    }


    for(let o in itemClass){
      if(itemClass[o].class.level==3){
        for(let t in classsArr){
          for(let u in classsArr[t].children){

            if(classsArr[t].children[u].id==itemClass[o].class.f_calss_id){
              classsArr[t].children[u].children.push({
                id:itemClass[o].class_id,
                name:itemClass[o].class.name,
              })
            }
          }

        }
      }
    }

    console.log(classsArr)
    this.classsArr=classsArr




  },

  methods: {
    selectClick(){

    },
    onBtn: async function (index) {
      return true;
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
