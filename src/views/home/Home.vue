<template>
  <div class="main">
<!--    <left-side-menu></left-side-menu>-->
<!--    <div class="nav">-->
<!--      <div class="li" v-for="item in $store.state.navList">{{item.name}}</div>-->
<!--    </div>-->

<!--    <router-view class="content" />-->

<!--    <keep-alive :include="includeArr">-->
    <keep-alive>
      <router-view class="content" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view class="content" v-if="!$route.meta.keepAlive" />


  </div>
</template>
<!--:exclude="exclude"-->
<script>
import LeftSideMenu from "../../widget/LeftSideMenu";
export default {
  components: {LeftSideMenu},
  name: 'Home',
  data(){
    return {
      includeArr:['good','secondsKill'],

    }
  },
  watch: {
    $route(to, from) {
      console.log(to)

    }
  },

}
</script>

<style scoped="" lang="scss">
  .main {
    width: 100%;
    height: 100%;
  }
  .content{
    background-color: rgb(242,242,242);
    position: relative;
    width: 100%;
    height: 100%;
    padding-left: 240px;
    box-sizing: border-box;
  }

  .nav{
    margin-left: 240px;
    padding: 15px;
    display: flex;
    .li{
      background: #FFFFFF;
      padding: 0 10px;
      height: 35px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border-radius: 3px;
    }
  }

</style>
