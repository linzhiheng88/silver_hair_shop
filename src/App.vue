<template>
  <div id="app"  class="main-content">
      <left-side-menu v-if="$route.meta.view==undefined"></left-side-menu>

<!--    <worktab></worktab>-->

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />

  </div>
</template>
<script>
  import LeftSideMenu from "@/widget/LeftSideMenu";
  import Worktab from "@/widget/Worktab";
  export default {
    components: {LeftSideMenu,Worktab},
    name: 'Home',
    data(){
      return {
        includeArr:['good','secondsKill'],

      }
    },
    created() {
      this.$store.dispatch('getWeapp')

      this.$store.dispatch('getIndustryPackage',true)

      // var str = " ";
      // var str_1 = str.replace(/\s*/g,"");


    }
    // watch: {
    //   $route(to, from) {
    //     console.log(to)
    //
    //   }
    // },

  }
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  .main-content {
    width: 100%;
    height: 100%;
  }

  html, body {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    overflow: hidden !important;
  }

  .page-wrap{
      background-color: #f2f2f2;
      height: 100vh;
      width: 100vw;
      padding-left: 240px;
      box-sizing: border-box;
  }

  .page-body-main {
    overflow-y: auto;
    position: relative;
    box-sizing: border-box;
    padding: 15px;
    right: 0;
    /*height: calc(100% - 50px);*/
    height: calc(100% - 97px);
    /*background-color: rgb(255, 255, 255);*/
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 1px 2px 0;
    font-size: 14px;
    /*margin: 0 15px 15px 15px;*/
  }

  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .ivu-table-cell {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }


  .condtion-body-main {
    padding: 10px 30px;
    background-color: rgb(255, 255, 255);
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 1px 2px 0;
    font-size: 14px;
    /*margin:0 15px;*/
    margin-bottom: 15px;

    .search-wrapper {
      padding: 15px;
      border-left: 5px solid #419688;
      background: white;
      /*margin-bottom: 10px;*/
      /*margin-top: 10px;*/

      width: 100%;
      text-align: left;

      /*display: inline-block;*/
      display: flex;
      align-content: center;
      flex-wrap: wrap;
    }

    .input-search {
      /*padding: 5px;*/
      /*line-height: 24px;*/
      /*border: 1px solid #d3d3d3;*/
      /*border-radius: 2px;*/
      /*width: 250px;*/
      /*margin-right: 10px;*/
      width: 300px;
      position: relative;
      top: -0.5px;
    }

    .button {
      margin-right: 10px;
      font-size: 14px;
    }

    .btn-search {
      background-color: #419688;
      border-radius: 6px;
      border: 0 solid;
      display: inline-block;
      cursor: pointer;
      color: #ffffff;
      font-family: Arial;
      font-size: 14px;
      padding: 6px 13px;
      text-decoration: none;
      outline: none;
    }
  }

  .no-select{
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
  }

</style>
