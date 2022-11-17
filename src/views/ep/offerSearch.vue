<template>
  <div>
    <my-header :breadcrumbList="['阿里选品','搜索结果']"></my-header>
    <div class="page-body-main" id="neiPage">
      <Card>
        <div class="search-div">
          <div class="left">
            <h3>搜索选品平台</h3>
            <p>支持关键词、1688商品链接、公司名全称搜索</p>
          </div>
          <div class="right">
            <i-input v-model="keywordObj.keyWords" search enter-button="搜本市场" @on-search="searchClick" size="large" class="input-search" placeholder="关键词" />
          </div>
        </div>
      </Card>
      <Card style="margin-top: 15px">
        <Breadcrumb>
          <BreadcrumbItem>所有分类</BreadcrumbItem>
          <BreadcrumbItem v-if="$route.query.categoryTitle">{{$route.query.categoryTitle}}</BreadcrumbItem>
          <BreadcrumbItem v-if="$route.query.categorySubTitle">{{$route.query.categorySubTitle}}</BreadcrumbItem>
        </Breadcrumb>
      </Card>


      <div style="margin-top: 15px;min-height: 300px;position: relative;">
        <Spin size="large" fix v-if="pageLoading||itemList.length==0"></Spin>
        <div class="good-div">
          <div class="good" v-for="item in itemList" :key="item.offerId" @click="goDetail(item)">
            <div class="cover">
              <img :src="item.imgUrl">
              <div class="addXp no-select" @click.stop="addCar(item)" v-if="weapp==0">
                <Icon type="ios-list-box" />
                <div>加入选品</div>
              </div>
            </div>
            <div class="info">
              <div class="name" @click.stop="handleCopy(item)">{{item.title}}</div>
              <div class="price">¥{{item.currentPrice}}</div>
            </div>

            <div class="buttons">
              <Button style="width: 90px;" type="warning" @click.stop="goAlibabaUrl(item)">阿里巴巴</Button>
              <Button style="width: 90px;margin-left: 20px" type="primary" @click.stop="goDetail(item)">商城浏览</Button>
            </div>

          </div>
        </div>
      </div>

      <Card>
        <Page style="margin-top: 10px" :current="keywordObj.page" :total="allTotal" @on-change="changePage"
              placement="top"
              :show-total="true"
              :show-elevator="true"
              :page-size="keywordObj.pageSize">
        </Page>
<!--        :show-sizer="true"-->
      </Card>
      <xuan-pin-ku-modal :itemList="itemList"></xuan-pin-ku-modal>




    </div>
  </div>
</template>
<script>
  import xuanPinKuModal from "./components/xuanPinKuModal";
  import store from "@/store";
  export default {
    name: 'hostList',
    components:{xuanPinKuModal},
    data: function () {
      return {
        keywordObj:{
          page:1,
          pageSize:28,
          postCategoryId:null,
          keyWords:'',
        },
        pageLoading:false,
        // itemList:[],
        // allTotal:0
      }
    },
    computed:{
      allTotal:function () {
        return this.$store.state.alibabaAfferSearchResult.count||0
      },
      itemList:function () {
        return this.$store.state.alibabaAfferSearchResult.rows||[]
      },
      weapp:function (){
        return this.$store.state.userInfo.weapp
      }
    },
    watch:{
      '$store.state.alibabaKeywordObj':function (data) {
        console.log("---------",data)
        this.keywordObj.keyWords=data.keyWords;
        this.keywordObj.postCategoryId=data.postCategoryId;
      }
    },
    async mounted() {
      this.keywordObj.postCategoryId=this.$route.query.postCategoryId
      this.keywordObj.keyWords=this.$route.query.keyWords

      if(this.$store.state.alibabaAfferSearchResult.load)this.loadData();
    },
    methods: {
      handleCopy(item) {
        this.$utils.copy(item.title)
      },

      addCar(item){
        this.$store.commit('setAlibabaCar',{
          type:'add',
          good:item
        })
        this.$Message.success('添加成功')
      },

      async searchClick(){
        this.keywordObj.page=1
        // this.keywordObj.keyWords=this.$store.state.alibabaKeywordObj.keyWords;

        // this.$store.commit('setAlibabaKeywordObj',params)
        this.$store.commit('setAlibabaKeywordObj',this.keywordObj)
        this.loadData()
      },
      changePage(page){
        this.keywordObj.page=page

        document.getElementById('neiPage').scrollTop=0
        document.documentElement.scrollTop=0
        this.loadData()
      },
      async loadData(){
        this.pageLoading=true;
        let data={}
        for(let i in this.keywordObj){
          if(this.keywordObj[i])data[i]=this.keywordObj[i];
        }

        console.log("----------------loadData")
        // let result = await this.$request({
        //   url: `/alibaba/searchCybOffers/${this.keywordObj.page}/${this.keywordObj.pageSize}`,
        //   method: 'post',
        //   data:data
        // })alibabaAfferSearchResult
        await this.$store.dispatch('getAlibabaAfferSearchResult',data)
        // this.allTotal=result.data.count
        // this.itemList=result.data.rows
        this.pageLoading=false
      },

      goDetail(item){
        this.$router.push('/epShop/goodDetail/'+item.offerId)
        // let routeUrl = this.$router.resolve({
        // path: '/epShop/goodDetail/1'+item.id,
        // });
        // window.open(routeUrl.href, '_blank');
      },
      goAlibabaUrl(item){
        window.open(`https://detail.1688.com/offer/${item.offerId}.html`, '_blank');
      },

    },
  }
</script>

<style scoped lang="scss">
  .page-body-main{
    padding-bottom: 100px;
  }
  .search-div{
    display: flex;
    align-items: center;
    width:900px;
    margin: 0 auto;
    .right{
      margin-left: 20px;
      flex: 1;
    }
  }
  .class-div{
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    .li{
      width: 100px;
      &:hover{
        .name{
          color: #FFFFFF;
          background:#2d8cf0 ;
        }
      }
      .name{
        width: 100px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .good-div{
    display: flex;
    flex-wrap: wrap;
    .good{
      width: 220px;
      /*height: 380px;*/
      /*height: 310px;*/
      background: #FFFFFF;
      margin-bottom: 10px;
      margin-right: 10px;
      position: relative;
      &:hover{
        .cover .addXp{
          transform: translateY(0);
          opacity: 1;
        }
      }
      .cover{
        width: 220px;
        height: 220px;
        position: relative;
        img{
          width: 100%;
          height: 100%;
        }
        .addXp{
          width: 180px;
          height: 36px;
          position: absolute;
          left: 0;
          right: 0;
          margin: 0 auto;
          bottom: 20px;
          background: #999999;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          border-radius: 100px;
          font-size: 16px;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s;
          cursor: pointer;
          i{
            color: #FFFFFF;
            font-size: 20px;
          }
          div{
            margin-left: 5px;
          }
        }
      }
      .info{
        padding: 10px;
        .name{
          display:-webkit-box;
          -webkit-box-orient: vertical;
          overflow:hidden;
          -webkit-line-clamp:2;
        }
        .price{
          font-size: 20px;
        }
      }
      .buttons{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px;
      }

    }
  }

</style>
