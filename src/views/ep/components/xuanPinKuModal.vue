<template>
  <div class="xuan-pin-ku-modal"  v-if="weapp==0">
    <div class="xuan-pin-ku-info">
      <div class="but all no-select" @click="selectAll">选取全页商品</div>
      <div class="but see no-select" @click="goodAuto=!goodAuto">已选取 {{carList.length}} / 1000个商品 </div>
      <div class="but add no-select" @click="selecClass">{{classAuto?'隐藏':'加入选品'}}</div>
    </div>


    <div class="mask-bar" @click="goodAuto=false,classAuto=false" v-if="goodAuto||classAuto"></div>

    <div class="content-div good-div" :class="{'content-div-cur':goodAuto}">
      <div class="good-div-head">
        <div class="clear-all no-select" @click="delAll">清空已选</div>
      </div>
      <div v-if="carList.length==0" style="text-align: center;padding: 50px 0">
        <img src="https://img.alicdn.com/tps/TB16y.6MpXXXXbyXXXXXXXXXXXX-204-200.png">
        <div>您还没有选取任何普通商品哦~</div>
      </div>
      <div class="good-list" v-else>
        <template v-if="type==2">
          <div class="item" v-for="(item,index) in carList" @click="del(index)">
            <img class="img" :src="$store.state.jdImageUrl+item.imageUrl">
            <div class="close">
              <Icon type="md-close-circle" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="item" v-for="(item,index) in carList" @click="del(index)">
            <img class="img" :src="item.imgUrl">
            <div class="close">
              <Icon type="md-close-circle" />
            </div>
          </div>
        </template>

      </div>
    </div>

    <div class="class-div content-div" :class="{'content-div-cur':classAuto}">
      <div class="class-box">
        <div class="item">
          <div class="search">
            <Input v-model="searchValue.one" @input="searchChange('one')" size="large" search placeholder="一级类目"/>
          </div>
          <div class="categoryGroup">
            <div class="li" :class="{'cur':selectClass.oneId==item.id}"
                 v-for="item in oneClassListShow"
                 @click="selectClassClick('one',item.id,item.name)"
            >
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="search">
            <Input v-model="searchValue.two" @input="searchChange('two')" size="large" search placeholder="二级类目"/>
          </div>
          <div class="categoryGroup">
            <div class="li" :class="{'cur':selectClass.twoId==item.id}"
                 v-for="item in twoClassListShow"
                 @click="selectClassClick('two',item.id,item.name)"
            >
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="search">
            <Input v-model="searchValue.three" @input="searchChange('three')" size="large" search placeholder="三级类目"/>
          </div>
          <div class="categoryGroup">
            <div class="li" :class="{'cur':selectClass.threeId==item.id}"
                 v-for="item in threeClassListShow"
                 @click="selectClassClick('three',item.id,item.name)"
            >
              {{item.name}}
            </div>
          </div>
        </div>
      </div>


      <div style="padding-top: 10px;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;">
        <div style="width: 100%;display: flex;align-items: center;justify-content: center;margin-bottom: 10px">
          <div>
            定价利润：
            <InputNumber :max="100000" :min="0" style="width: 100px;margin-right: 10px;" v-model="pricing_profits"></InputNumber> %
          </div>
          <div style="margin-left: 50px;">
            运费：
            <InputNumber :max="100000" :min="0" style="width: 100px;margin-right: 10px;" v-model="pricing_freight"></InputNumber> 元
          </div>
        </div>
        <Button style="width: 230px;" type="primary" @click="submit">提交</Button>
      </div>

    </div>


  </div>
</template>

<script>
export default {
  components:{
  },
  name: "EditPointsDialog",
  props: {
    type: {
      type: Number,
      default: 1
    },
    itemList: {
      type: Array,
      default: function () {
        return []
      }
    },
  },
  data: function() {
    return {
      goodAuto:false,
      classAuto:false,

      classList: [],
      oneClassListShow: [],
      twoClassListShow: [],
      threeClassListShow: [],
      pricing_profits:20,
      pricing_freight:4,
      selectClass:{
        oneId:null,
        oneName:'',
        twoId:null,
        twoName:'',
        threeId:null,
        threeName:'',
      },
      searchValue:{
        one:'',
        two:'',
        three:'',
      },

    };
  },
  computed:{
    carList:function () {
      return this.type==1?this.$store.state.alibabaCar:this.$store.state.jdCar
    },
    weapp:function (){
      return this.$store.state.userInfo.weapp
    }
  },
  async mounted() {
    const result = await this.$request({
      url: '/class/all',
      method: 'get',
    });
    this.classList = result.data
    this.oneClassListShow = result.data
  },

  methods: {
    del(index){
      if(this.type==1){
        this.$store.commit('setAlibabaCar',{
          type:'del',
          index:index
        })
      }else {
        this.$store.commit('setJdCar',{
          type:'del',
          index:index
        })
      }

    },
    selectAll(){
      this.delAll();
      if(this.type==1){
        for(let i in this.itemList) {
          this.$store.commit('setAlibabaCar', {
            type: 'add',
            good: this.itemList[i]
          })
        }
      }else {
        for(let i in this.itemList) {
          this.$store.commit('setJdCar', {
            type: 'add',
            good: this.itemList[i]
          })
        }
      }

    },
    selecClass(){
      if(this.carList.length==0){
        this.$Message.error('请选择商品')
      }else {
        // if(this.type==2){
        //   this.$Message.warning('功能暂未开放')
        //   return false;
        // }
        this.classAuto=!this.classAuto;
      }
    },
    delAll(){
      if(this.type==1){
        this.$store.commit('setAlibabaCar',{
          type:'delAll',
        })
      }else {
        this.$store.commit('setJdCar',{
          type:'delAll',
        })
      }

    },

    async submit(){
      let skus=[]
      if(this.type==1){
        skus=this.$store.state.alibabaCar.map(item=>{
          return item.offerId
        })
      }else {
        skus=this.$store.state.jdCar.map(item=>{
          return item.wareId
        })
      }

      if(!this.selectClass.threeId){
        this.$Message.error('请选择分类')
        return false;
      }
      if(skus.length==0){
        this.$Message.error('请选择商品')
        return false;
      }
      let result={}
      if(this.type==1){
        result = await this.$request({
          url: `/alibaba/syncCustom`,
          method: 'post',
          data:{
            class_id:this.selectClass.threeId,
            profits:this.pricing_profits,
            freight:this.pricing_freight,
            alibabaIds:skus
          }
        })
      }else {
        result = await this.$request({
          url: `/jd/syncCustom`,
          method: 'post',
          data:{
            class_id:this.selectClass.threeId,
            skus:skus
          }
        })
      }

      if(result.code==200){
        this.delAll()
        this.$Message.success('加入成功')
        this.goodAuto=false
        this.classAuto=false
      }
    },

    searchChange(type){
      if(type=='one'){
        let classListShow=this.fuzzQuery(this.classList,this.searchValue.one)
        if(this.selectClass.oneId!=null&&this.searchValue.one){
          let curData=this.classList.filter(item=>{
            return item.id==this.selectClass.oneId
          })
          classListShow.unshift(curData[0])
        }
        this.oneClassListShow=classListShow
      }else if(type=='two'){
        let oneCurData=this.classList.filter(item=>{
          return item.id==this.selectClass.oneId
        })
        let twoClassListShow=this.fuzzQuery(oneCurData[0].children,this.searchValue.two)
        if(this.selectClass.twoId!=null&&this.searchValue.two){
          let curData=oneCurData[0].children.filter(item=>{
            return item.id==this.selectClass.twoId
          })
          twoClassListShow.unshift(curData[0])
        }
        this.twoClassListShow=twoClassListShow
      }else {
        let twoCurData=this.twoClassListShow.filter(item=>{
          return item.id==this.selectClass.twoId
        })
        let threeClassListShow=this.fuzzQuery(twoCurData[0].children,this.searchValue.three)
        if(this.selectClass.threeId!=null&&this.searchValue.three){
          let curData=twoCurData[0].children.filter(item=>{
            return item.id==this.selectClass.threeId
          })
          threeClassListShow.unshift(curData[0])
        }
        this.threeClassListShow=threeClassListShow
      }

    },
    selectClassClick(type,classId,className){
      if(type=='one'){
        this.selectClass.oneId=classId
        this.selectClass.oneName=className
        this.selectClass.twoId=null
        this.selectClass.threeId=null

        let curData=this.classList.filter(item=>{
          return item.id==classId
        })
        this.twoClassListShow=curData[0].children
        this.threeClassListShow=[]
        this.searchChange('two')
      }else if(type=='two'){
        this.selectClass.twoId=classId
        this.selectClass.twoName=className
        this.selectClass.threeId=null
        let curData=this.twoClassListShow.filter(item=>{
          return item.id==classId
        })
        this.threeClassListShow=curData[0].children
        this.searchChange('three')
      }else {
        this.selectClass.threeId=classId
        this.selectClass.threeName=className
      }

    },
    fuzzQuery(list,keyword){
      var reg=new RegExp(keyword),arr=[]
      for(let i=0;i<list.length;i++){
        if(reg.test(list[i].name)){
          arr.push(list[i])
        }
      }
      return arr;
    }


  }
};
</script>

<style scoped lang="scss">
  .xuan-pin-ku-modal{
    position: fixed;
    right: 30px;
    bottom: 15px;
    width: calc(100% - 285px);
    background: #FFFFFF;
    height: 61px;
    z-index: 100;
    border-radius: 4px;
    &:hover{
      box-shadow: 0 1px 6px rgba(0,0,0,0.2);
      border-color: #eee;
    }
    .xuan-pin-ku-info{
      height: 61px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 20;
      background: #FFFFFF;
      .but{
        height: 61px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .all{
        padding:0 30px;
      }
      .add{
        width: 200px;
        background: #2d8cf0;
        color: #FFFFFF;
        font-size: 16px;
      }
      .see{
        padding:0 30px;
        &:hover{
          background: #f9f9f9;
        }
      }
    }
  }




  .content-div{
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    background: #FFFFFF;
    transform: translateY(100%);
    transition: all 0.3s;
  }
  .content-div-cur{
    transform: translateY(-100%)!important;
  }
  .good-div{
    /*box-shadow: 0 1px 6px rgba(0,0,0,0.2);*/
    /*border-color: #eee;*/
    .good-div-head{
      background: #fafafc;
      .clear-all{
        margin-left: auto;
        height: 50px;
        line-height: 50px;
        width:100px;
        text-align: center;
        cursor: pointer;
      }
    }
    .good-list{
      display: flex;
      flex-wrap: wrap;
      padding: 15px;
      height: 320px;
      overflow-y: auto;
      .item{
        width: 120px;
        height: 120px;
        position: relative;
        margin-right: 15px;
        margin-bottom: 15px;
        .img{
          width: 100%;
          height: 100%;
        }
        .close{
          width: 40px;
          height: 40px;
          position: absolute;
          right: -20px;
          top: -20px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover{
            i{
              color: #1e88e5;
            }
          }
          i{
            font-size: 30px;
            color: #cccccc;
          }
        }
      }
    }
  }

  .class-div{
    z-index: 10;
    .class-title{
      padding: 0 20px;
    }
  }


  .class-box {
    display: flex;
    background: #f9f9f9;
    border-radius: 5px;
    height: 300px;
    .item {
      flex-grow: 1;
      padding: 15px 15px;
      border-right: 1px solid #dddddd;
      &:last-child{
        border-right: none;
      }

      .search {
        margin-bottom: 20px;
      }

      .categoryGroup {
        height: 220px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #c2c2c2;
          background-clip: padding-box;
          min-height: 28px;
        }

        .li {
          height: 35px;
          padding: 0 16px;
          border-radius: 4px;
          line-height: 35px;
          box-sizing: border-box;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
        }

        .li.cur {
          color: #ff6146;
          position: relative;
        }
      }
    }

  }

  .mask-bar{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }

</style>
