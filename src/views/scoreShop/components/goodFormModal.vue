<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="0">
      <FormItem label="">
        <div v-for="(item,index) in formData.score_good_form" style="display: flex;align-items: center;margin-bottom: 15px;">
          <Input v-model="item.label" style="width: 200px"/>：<div style="width: 300px;height: 32px;border: 1px solid #dcdee2;box-sizing:border-box;background: #f9f9f9;margin-left: 5px;border-radius: 4px;"></div>
          <div style="width: 40px;height: 32px;display: flex;align-items: center;justify-content: center;cursor: pointer;" @click="delItem(index)"><Icon type="ios-trash" /></div>

        </div>

        <Button type="dashed" long @click="handleAdd" icon="md-add">添加</Button>
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
        score_good_form:[]
      },
      rules: {
        min: [
          {required: true,type:'number', message: '最小值不能为空', trigger: 'blur'},
        ],
        max: [
          {required: true,type:'number', message: '最大值不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  mounted() {
    this.formData.weapp_id = this.extra.weapp_id;
    if (this.extra.id) {
      this.formData.score_good_id = this.extra.id;
      this.formData.score_good_form = this.extra.score_good_forms.map(item=>{
        return {
          label:item.label
        }
      });
    }
  },
  methods: {
    imagesFun(data) {
      this.formData.image = data[0]
    },
    delItem(index){
      this.formData.score_good_form.splice(index,1)
    },
    handleAdd(){
      this.formData.score_good_form.push({
        label:''
      })
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      if(!valid)return false;
      try {
        const result = await this.$request({
          url: '/scoreGood/goodFormEdit',
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

</style>
