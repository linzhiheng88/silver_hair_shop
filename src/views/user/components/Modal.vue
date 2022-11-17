
<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="昵称" prop="nickname">
        <Input v-model="formData.nickname"/>
      </FormItem>
      <FormItem label="头像" prop="images">
        <upload-image :imgLists="formData.headimgurl?[formData.headimgurl]:[]" @imageReturnData="imagesFun" :count="1"></upload-image>
      </FormItem>
      <FormItem label="菜豆" prop="user_score">
        <Input number type="number" v-model="formData.user_score"/>
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
          nickname: '',
          headimgurl: '',
          user_score:0,
        },
        rules: {
          nickname: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          user_score: [
            {required: true,type:'number', message: '名称不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.nickname = this.extra.nickname;
        this.formData.headimgurl = this.extra.headimgurl;
        this.formData.user_score = this.extra.user_score;
      }

    },

    methods: {
      imagesFun(data) {
        this.formData.headimgurl = data[0]
      },
      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            const result = await this.$request({
              url: '/user/edit',
              method: 'post',
              data:this.formData
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
