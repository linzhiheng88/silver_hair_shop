<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>

      <FormItem label="商品分类">

<!--        :default-expanded-keys="expandedKeys"-->
        <el-tree
                :data="classList"
                @check="check"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :check-strictly="true"
                :default-checked-keys="formData.class_list"
                :props="defaultProps">
        </el-tree>
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
        name: '',
        class_list:[],
      },

      rules: {
        name: [
          {required: true, message: '姓名不能為空', trigger: 'blur'},
        ],
        account: [
          {required: true, message: '账号不能為空', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码不能為空', trigger: 'blur'},
        ],
      },
      // expandedKeys:[],
      classList:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      }


    };
  },
  async mounted() {
    if (this.extra) {
      this.formData.id = this.extra.id;
      this.formData.name = this.extra.name;
      this.formData.class_list = this.extra.industry_package_classes.map(item=>{
        return item.class_id
      });

    }

    const result = await this.$request({
      url: '/class/all',
      method: 'get',
    });
    this.classList=result.data.map(item=>{
      item.name=item.name
      if(item.shelves==0)item.name=(item.name+'（⚠️已下架）')
      return item
    })
    // let expandedKeys=[]
    // for(let i in result.data){
    //   expandedKeys.push(result.data[i].id)
    //   for(let o in result.data[i].children){
    //     expandedKeys.push(result.data[i].children[o].id)
    //   }
    // }
    // this.expandedKeys=expandedKeys

  },
  methods: {

    check(e,checkData){
      console.log("e",e)
      console.log("ee",checkData)

      let class_list=checkData.halfCheckedKeys.concat(checkData.checkedKeys)

      console.log("class_list",class_list)
      this.formData.class_list=class_list
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        const result = await this.$request({
          url: '/industryPackage/edit',
          method: 'post',
          data:this.formData
        })
        if (result.code == 200) {
          this.$Message.success("操作成功");
          return true;
        } else {
          this.$Message.error("操作失败");
          return false;
        }

      } catch (e) {
        this.$Message.error("操作失败");
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
