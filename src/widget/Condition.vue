<template>
    <div class="condtion-body-main">
      <div class="search-wrapper">
        <i-select @on-change="industryPackageClick" size="large" clearable style="width:200px;margin-right: 10px;" placeholder="行业包"  v-if="industryPackageAuto && $store.state.userInfo.weapp==0" v-model="industry_package_id">
          <i-option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>

        <i-select @on-change="weappClick" size="large" clearable style="width:200px;margin-right: 10px;" placeholder="平台" v-if="weappAuto && $store.state.userInfo.weapp==0" v-model="weapp_id">
          <i-option v-for="item in weappList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>

        <Date-picker v-if="showTime"  v-model="start_time" style="width:180px" size="large" type="datetime" @on-ok="timeChange" @on-clear="timeChange(1)" placeholder="起始时间"></Date-picker>
        <Date-picker v-if="showTime" v-model="end_time" style="width:180px; margin: 0 10px;" size="large" @on-ok="timeChange" @on-clear="timeChange(2)" type="datetime" placeholder="截止时间"></Date-picker>

        <i-select @on-change="selectClick" :placeholder="selectPlaceholder" size="large" clearable v-if="showSelect" style="width:200px;margin-right: 10px;" v-model="selectdata">
          <i-option v-for="item in selectList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
        <slot></slot>
        <div>
          <i-input search enter-button="搜索" v-if="showSearch" @on-search="searchClick" size="large" class="input-search" :placeholder="searchPlaceholder" />
        </div>

        <i-button :type="autoType" size="large" ghost v-if="autoButton!=''" class="button" @click="autoClick">{{autoButton}}</i-button>

        <i-button :type="addType" size="large" v-if="showAdd" class="button button-add" @click="addClick">{{addString}}</i-button>

      </div>
    </div>

</template>

<script>

  export default {
    components: {},
    name: 'Header',
    props: {
      searchPlaceholder: {
        default:'请输入搜索内容'
      },
      selectPlaceholder: {
        default:'请选择'
      },
      // username: {
      //     default:'admin',
      // },
      titleName:{
        default:'',
      },
      secondtitle:{
        default:''
      },
      industryPackageDefault:{
        default:false
      },
      industryPackageAuto:{
        default:false
      },
      weappDefault:{
        default:false
      },
      weappAuto:{
        default:false
      },
      showSearch: {
        default: true,
      },
      showAdd: {
        default: true
      },
      showSelect: {
        default: false
      },
      addString: {
        default: '添加'
      },
      addType: {
        default: 'success'
      },
      showTime:{
        default:false
      },
      autoType:{
        default: 'error'
      },
      autoButton:{
        default: ''
      },
      selectList:{
        type: Array,
        default: function () {
          return []
        }
      },
    },

    data(){
      return {
        industry_package_id:null,
        weapp_id:null,
        keyword: '',
        username:sessionStorage.getItem('account'),
        editPwdModal: false,
        loading:false,
        selectdata:-1,
        start_time:'',
        end_time:'',
      }
    },
    computed:{
      weappList:function () {
        return this.$store.state.weappList.map(item=>{
          return {
            label:item.name,
            value:item.id
          }
        })
      },
      industryPackageList:function () {
        return this.$store.state.industryPackageList.map(item=>{
          return {
            label:item.name,
            value:item.id
          }
        })
      }
    },
    mounted() {
      if(this.$store){
        this.$store.dispatch('getWeapp')
        this.$store.dispatch('getIndustryPackage')

        if(this.$store.state.userInfo.weapp>0){
          this.weappClick(this.$store.state.userInfo.weapp)
        }else if(this.weappDefault) {
          this.weappClick(this.weappList[0].value)
        }
      }

      if(this.industryPackageDefault)this.industryPackageClick(this.industryPackageList[0].value)
    },
    methods: {
      goClick(){
        this.$router.push({name: this.titleName})
      },
      addClick(){
        this.$emit('addClick')
      },
      autoClick(){
        this.$emit('autoClick')
      },
      industryPackageClick(value){
        this.industry_package_id=value
        this.$emit('industryPackageClick', value)
      },
      weappClick(value){
        this.weapp_id=value
        this.$emit('weappClick', value)
      },
      searchClick(value){
        this.$emit('searchClick', value)
      },
      selectClick(){
        this.$emit('selectClick', this.selectdata)
      },
      timeChange(type){
        let start_time=type==1?'':this.start_time
        let end_time=type==2?'':this.end_time
        this.$emit('timeChange', {
          start_time:start_time,
          end_time:end_time,
        })
      },

      logout(){
        sessionStorage.clear();
        this.$router.push({
          name: 'Login'
        });
      },
      editPwdCancel(){

      },
    }

  }
</script>
<style scoped="">
  .condtion-body-main {
    padding: 10px 30px;
    background-color: rgb(255, 255, 255);
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 1px 2px 0;
    font-size: 14px;
    /*margin:0 15px;*/
    margin-bottom: 15px;
  }

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
    margin-right: 10px;
    /*margin-left: auto;*/
  }

  .button{
    margin-right: 10px;
    font-size: 14px;
  }
  .button-add{
    margin-left: auto;
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


</style>
