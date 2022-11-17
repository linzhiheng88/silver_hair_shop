<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">
<!--      <FormItem label="类型" prop="content">-->
<!--        <i-select clearable placeholder="订单类型"  v-model="formData.type">-->
<!--          <i-option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</i-option>-->
<!--        </i-select>-->
<!--      </FormItem>-->
      <Form-item label="选择用户" v-if="formData.type==2">
        <Select
          style="width: 100%"
          v-model="formData.user_id"
          filterable
          :remote-method="searchFunc"
          :loading="searchLoading">
          <Option v-for="(item, index) in searchResultList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </Form-item>
<!--      <FormItem label="用户ID" prop="user_id">-->
<!--        <Input number type="number" v-model="formData.user_id"/>-->
<!--      </FormItem>-->
      <FormItem label="内容" prop="content">
        <Input v-model="formData.content"/>
      </FormItem>
      <FormItem label="图片" prop="background">
           <upload-image :imgLists="formData.images" @imageReturnData="coverImagesFun" :count="20"></upload-image>
      </FormItem>
      <FormItem label="评分" prop="index">
        <Rate v-model="formData.score" />
      </FormItem>
      <Form-item label="是否显示" prop="is_show">
        <i-switch  size="large" v-model="formData.is_show">
          <span slot="open">显示</span>
          <span slot="close">隐藏</span>
        </i-switch>
      </Form-item>
    </Form>

  </div>
</template>

<script>

  import editor from "../../../widget/editor";
export default {
  name: "EditPointsDialog",
  props: ["extra"],
  components:{editor},
  data: function() {
    return {
      searchResultList:[],
      searchLoading:false,
      formData: {
        id:null,
        type:2,
        user_id:null,
        good_id: null,
        content: '',
        images:[],
        is_show:true,
        score:5,
        audio:'',

      },
      rules: {
        type: [
          {required: true,type:'number', message: '类型不能为空', trigger: 'change'},
        ],
        user_id: [
          {required: true,type:'number', message: '用户ID不能为空', trigger: 'change'},
        ],

        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
        ]
      },
      operationType:'add',
      typeList:[
        {
          label:'机器人',
          value:2,
        },
        {
          label:'普通用户',
          value:1,
        }
      ],

    };
  },
  mounted() {
    if (this.extra) {
      if(this.extra.id){
        this.operationType='edit'
        this.formData.id = this.extra.id;
        this.formData.user_id = this.extra.type==1?this.extra.user_id:this.extra.system_user_id;
        this.formData.content = this.extra.content;
        this.formData.type = this.extra.type;
        this.formData.images = this.extra.images;
        this.formData.is_show = this.extra.is_show==1?true:false;
        this.formData.score = this.extra.score;
      }
      if(this.extra.good_id){
        this.formData.good_id = Number(this.extra.good_id);
      }
    }



  },

  methods: {
    async searchFunc(data){
      console.log(data)
      if(data==''){return false}
      this.searchLoading = true;
      const result = await this.$request({
        url: '/user/systemSearch',
        method: 'post',
        data:{
          keyword:[
              {
            id:data
             },
            {
              nickname:data
            }
            ]
        }
      });

      this.searchResultList=result.data.map(item=>{
        return {
          id:item.id,
          name:'（ ID:'+item.id+'）'+item.nickname
        }
      })
      this.searchLoading = false;
    },
    coverImagesFun(data) {
      this.formData.images = data
    },
    onBtn: async function (index) {
      if (index !== 0) return true;
      let valid = await this.$refs['form'].validate();
      let that = this;
      let flag = false;
      if (valid) {
        try {

          if(that.operationType == 'add')delete that.formData.id;
          const result = await this.$request({
            url: '/comments/save',
            method: 'post',
            data:that.formData
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
