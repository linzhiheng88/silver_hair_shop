<template>
  <div class="container">
    <div class="good-info">
      <json-viewer :value="goodDate" :expand-depth="2"></json-viewer>
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

      goodList:[],

      goodDate:{}

    };
  },
  async mounted() {

    const result = await this.$request({
      url: '/alibaba/goodDetail/'+this.extra.feedId,
      method: 'get',
    })

    this.goodDate=result.data
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
