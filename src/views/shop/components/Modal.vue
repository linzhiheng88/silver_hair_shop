<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">

      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="登录账号" prop="username">
        <Input v-model="formData.username"/>
      </FormItem>
      <FormItem label="是否分账">
        <i-switch v-model="fashionableReset" size="large" />
      </FormItem>
      <FormItem label="商户全称" prop="mch_name" v-if="fashionableReset">
        <Input v-model="formData.mch_name"/>
      </FormItem>
      <FormItem label="商户号" prop="mch_id" v-if="fashionableReset">
        <Input v-model="formData.mch_id"/>
      </FormItem>
      <FormItem label="商户密钥" prop="mch_api_key" v-if="fashionableReset">
        <Input v-model="formData.mch_api_key"/>
      </FormItem>

      <FormItem label="分账比例" prop="proportion" v-if="fashionableReset">
        <InputNumber style="width: 40%" :step="0.01" :max="1" :min="0.00001" v-model="formData.proportion"></InputNumber>（取值范围：0.00001～1）
      </FormItem>

      <FormItem label="重置密码" v-if="operationType=='edit'">
        <i-switch v-model="passwordReset" size="large" />
      </FormItem>
      <FormItem label="密码" prop="password" v-if="passwordReset||operationType=='add'">
        <Input v-model="formData.password"/>
      </FormItem>

    </Form>
  </div>
</template>

<script>
  import crypto from "crypto";
  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function() {
      return {
        formData: {
          id:null,
          name: '',
          username: '',
          password: '',
          fashionable: 0,
          mch_id: '',
          mch_name: '',
          mch_api_key:'',
          proportion: null,
          weapp_id:null
        },
        passwordReset:false,
        fashionableReset:false,
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'},
          ],
          mch_id: [
            {required: true, message: '商户号不能为空', trigger: 'blur'},
          ],
          mch_name: [
            {required: true, message: '商户全称不能为空', trigger: 'blur'},
          ],
          mch_api_key: [
            {required: true, message: '商户密钥不能为空', trigger: 'blur'},
          ],
          proportion: [
            {required: true, type:'number', message: '商户全称不能为空', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
          ],
        },
        industryPackageList:[],
        operationType:'add',
      };
    },
    watch:{
      fashionableReset:{
        handler(val){
          this.formData.fashionable=val?1:0;
          this.rules.mch_id.required=val;
          this.rules.mch_id.mch_name=val;
          this.rules.mch_id.proportion=val;
        },
        deep:true,
        immediate:true
      },
      passwordReset(data){
        if(data){
          this.rules['password']= [
            {required: true, message: '密码不能为空', trigger: 'blur'},
          ]
        }else {
          delete this.rules.password;
        }
      },
    },

    async mounted() {
      if (this.extra&&this.extra.id) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.mch_id = this.extra.mch_id;
        this.formData.mch_name = this.extra.mch_name;
        this.formData.mch_api_key = this.extra.mch_api_key;
        this.formData.proportion = Number(this.extra.proportion);
        this.formData.username = this.extra.admin?this.extra.admin.username:'';

        this.fashionableReset = this.extra.fashionable==1?true:false;
        delete this.rules.password;
      }
      console.log(this.extra)
      this.formData.weapp_id=this.extra.weapp_id;
    },


    methods: {
      imagesFun(data) {
        this.formData.images = data[0]
      },
      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            let data= {
              id:that.formData.id,
              name: that.formData.name,
              username: that.formData.username,
              fashionable: that.formData.fashionable,
              mch_id: that.formData.mch_id,
              mch_name: that.formData.mch_name,

              mch_api_key: that.formData.mch_api_key,
              proportion: that.formData.proportion,
              weapp_id:that.formData.weapp_id
            }
            if(that.formData.password){
              let md5 = crypto.createHash('md5');
              md5.update(that.formData.password);
              data.password = md5.digest("hex");
            }

            const result = await this.$request({
              url: '/shop/edit',
              method: 'post',
              data:data
            })
            console.log(result);
            if (result.code == 200) {
              this.$Message.success("操作成功");
              return true;
            }

            return false;

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

<style scoped="">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
