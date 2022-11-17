<template>
  <div class="content">
    <vue-particles
            color="#fff"
            :particleOpacity="0.7"
            :particlesNumber="60"
            shapeType="circle"
            :particleSize="4"
            linesColor="#fff"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="2"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
            class="lizi"
    >
    </vue-particles>
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          乐子商城
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名" :maxlength="20" style="width: 100%">
              <span slot="prepend">
                <Icon type="md-person" :size="16" />
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码" :maxlength="20"
                     style="width: 100%" @keyup.enter.native="handleSubmit">
              <span slot="prepend">
                <Icon :size="16" type="md-lock" />
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>

  </div>
</template>

<script>
  import crypto from "crypto";

  export default {
    name: 'Login',
    data () {
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'},
            {message: '用户名不少于4位', trigger: 'blur', min: 1}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {message: '密码不少于6位', trigger: 'blur', min: 6}
          ]
        },

      };
    },
    mounted(){

    },

    methods: {
      handleSubmit: async function () {
        var that = this;
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            if (this.form.userName && this.form.password) {
              let md5 = crypto.createHash('md5');
              md5.update(this.form.password);
              let pwd = md5.digest("hex").toLowerCase();

              let data={
                username:this.form.userName,
                password:pwd
              }

              let result=await this.$request({
                url: '/login',
                method: 'POST',
                data
              })
              if(result.code==200){


                this.$store.commit('setUserInfo',{
                  account:this.form.userName,
                  accessToken:result.data.accessToken,
                })

                let userInfo=await this.$store.dispatch('getUserInfo')
                console.log(userInfo)
                if(userInfo.shop_id>0){
                  this.$router.push({name: 'order'})
                }else {
                  this.$router.push({name: 'Index'})
                }

                // this.$router.push({name: 'good'})
                // this.$router.push({name: 'Index'})
              }
            }
            else {
              that.$Message.error('登录失败，请重试');
            }
          }
        });
      }
    },
  }
</script>

<style scoped lang="scss">
  .lizi{

  }
  .content {
    width: 100%;
    height: 100%;
    background-image: url('https://qiniu.touchdot.top/Fj6In3Q_48sIKkq9iLUM0vreIzdY');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    /*background: url("../../libs/logo.png") no-repeat;*/
    /*background-size: 304px 289px;*/
    /*background-position: center;*/

  }

  .login-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
  }

  .form-con {
    padding: 10px 0 0;
  }

  .login-tip {
    font-size: 10px;
    text-align: center;
    color: #c3c3c3;
  }
</style>
