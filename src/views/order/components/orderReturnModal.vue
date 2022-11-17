<template>
  <div class="container">
      <Form ref="form" :model="formData" :rules="rules" :label-width="100">
          <Form-item label="订单状态" >
              <span v-for="item in orderStateList" v-if="item.state==formData.state">{{item.label}}</span>
          </Form-item>
        <Form-item label="类型" prop="type">
          <Select v-model="formData.type">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label }}</Option>
          </Select>
        </Form-item>
          <Form-item label="理由" prop="reason">
              <Select v-model="formData.reason">
                  <Option v-for="item in reasonList" :value="item" :key="item">{{item }}</Option>
              </Select>
          </Form-item>

          <Form-item label="描述" prop="content" >
              <Input type="text" v-model="formData.content"/>
          </Form-item>

          <Form-item label="操作密码" prop="password" >
              <Input type="password" style="flex: 1" v-model="formData.password"/>
          </Form-item>

      </Form>

      <div style="color: #f00000;font-size: 16px;padding-top: 35px;">***一旦退款将不能撤销***</div>


  </div>
</template>

<script>
    import crypto from "crypto";
  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function () {
      return {
        formData: {
          id:null,
          state: null,
          type:null,
            reason: '',
            content: '',
           password: '',

        },
          reasonList:[
              '不想要了','商品错选/多选','商品无货','商品降价','没用/少用/错选优惠'
          ],
        typeList:[
          {
            value:1,
            label:'退货退款',
          },
          {
            value:2,
            label:'换货',
          },
          {
            value:4,
            label:'仅退款',
          }
        ],
        rules: {
            reason: [
                {required: true, message: '请选择理由', trigger: 'change'},
            ],
          type: [
            {required: true,type:'number', message: '请选择类型', trigger: 'change'},
          ],
            password: [
            {required: true, message: '请输入操作密码', trigger: 'blur'},
          ]

        },

      };
    },
      computed:{
          orderStateList:function () {
              return this.extra.orderStateList
          }
      },

    async mounted() {
      if (this.extra) {
        this.formData.id = this.extra.id;
        this.formData.state = this.extra.state;
      }


    },

    methods: {


      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let flag = false;
        if (valid) {
          try {
              let md5 = crypto.createHash('md5');
              md5.update(this.formData.password);
              let pwd = md5.digest("hex");
              const result = await this.$request({
              url: '/order/sysReturn/'+this.formData.id,
              method: 'post',
              data: {
                  password:pwd,
                  reason:this.formData.reason,
                type:this.formData.type,
                  content:this.formData.content,
              }
            })
            if (result.code == 200) {
              this.$Message.success("操作成功");
              return true;
            } else {
              return false;
            }

          } catch (e) {
            this.$Message.error("操作失败");
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

<style lang="scss" scoped>
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }



</style>
