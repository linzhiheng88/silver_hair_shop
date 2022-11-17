<template>
  <div>
    <my-header :breadcrumbList="['京东选品','搜索结果']"></my-header>
    <div class="page-body-main" id="neiPage">
      <Card>
        <div class="search-div">
          <div class="left">
            <h3>搜索选品平台</h3>
            <p>支持关键词</p>
          </div>
          <div class="right">
            <i-input v-model="keywordObj.keyword" search enter-button="搜本市场" @on-search="searchClick" size="large" class="input-search" placeholder="关键词" />
          </div>
        </div>
      </Card>
      <Card style="margin-top: 15px">
        <Breadcrumb>
          <BreadcrumbItem>所有分类</BreadcrumbItem>
          <BreadcrumbItem v-if="$store.state.jdKeywordObj.catId">{{$store.state.jdKeywordObj.oneCatName}}</BreadcrumbItem>
          <BreadcrumbItem v-if="$store.state.jdKeywordObj.cid1">{{$store.state.jdKeywordObj.threeCatName}}</BreadcrumbItem>
        </Breadcrumb>
      </Card>

      <div style="margin-top: 15px;min-height: 300px;position: relative;">
        <Spin size="large" fix v-if="pageLoading||$store.state.jdSearchResult.count==-1"></Spin>
        <div v-else-if="itemList.length==0" class="no-data">没有搜到结果</div>
        <div class="good-div">
          <div class="good" v-for="item in itemList" v-if="item.priceInfo.price&&item.saleInfo.saleState==1" :key="item.wareId" @click="goDetail(item)">
            <div class="cover">
              <img :src="$store.state.jdImageUrl+item.imageUrl">
              <div class="addXp no-select" @click.stop="addCar(item)" v-if="weapp==0">
                <Icon type="ios-list-box" />
                <div>加入选品</div>
              </div>
            </div>
            <div class="info">
              <div class="name" @click.stop="handleCopy(item)">{{item.wareName}}</div>
              <div class="price">
                 <div class="li li-tit">
                   <div style="color: #df3033">京东价</div>
                   <div>成本价</div>
                 </div>
                <div class="li">
                  <div style="color: #df3033">¥{{item.priceInfo.jdPrice}}</div>
                  <div>¥{{item.priceInfo.price}}</div>
                </div>
              </div>
              <div class="lirun">利润：{{parseFloat(Number(item.priceInfo.jdPrice-item.priceInfo.price).toFixed(2))}}</div>
            </div>

            <div class="buttons">
              <Button style="width: 90px;" type="warning" @click.stop="goAlibabaUrl(item)">京东</Button>
              <Button style="width: 90px;margin-left: 20px" type="primary" @click.stop="goDetail(item)">商城浏览</Button>
            </div>

          </div>
        </div>
      </div>

      <Card>
        <Page style="margin-top: 10px" :current="$store.state.jdKeywordObj.pageIndex" :total="allTotal" @on-change="changePage"
              placement="top"
              :show-total="true"
              :show-elevator="true"
              :page-size="keywordObj.pageSize">
        </Page>
<!--        :show-sizer="true"-->
      </Card>
      <xuan-pin-ku-modal :type="2" :itemList="itemList"></xuan-pin-ku-modal>



    </div>
  </div>
</template>
<script>
  import xuanPinKuModal from "../components/xuanPinKuModal";
  export default {
    name: 'hostList',
    components:{xuanPinKuModal},
    data: function () {
      return {
        keywordObj:{
          pageIndex:1,
          pageSize:25,
          keyword:'',

          catId:'',
          cid1:'',
        },
        pageLoading:false,
        // itemList:[],
        // allTotal:0
      }
    },
    computed:{
      allTotal:function () {
        return this.$store.state.jdSearchResult.count||0
      },
      itemList:function () {
        this.keywordObj.keyword= this.$store.state.jdKeywordObj.keyword;
        return this.$store.state.jdSearchResult.rows||[]
      },
      weapp:function (){
        return this.$store.state.userInfo.weapp
      }
    },
    watch:{
      // '$store.state.jdKeywordObj.keyword':function (data) {
      //   console.log("--------------",data)
      // }
      // '$store.state.jdKeywordObj':{
      //   handler(data){
      //     console.log("$store.state.jdKeywordObj",data)
      //     this.keywordObj.keyword=data.keyword;
      //     // if(data.oneCatId)this.keywordObj.catId=data.oneCatId;
      //     // if(data.threeCatId)this.keywordObj.cid1=data.threeCatId;
      //   },
      //   deep:true
      // }
    },
    async mounted() {
      // this.keywordObj.postCategoryId=this.$route.query.postCategoryId
      // this.keywordObj.keyWords=this.$route.query.keyWords

      if(this.$store.state.alibabaAfferSearchResult.load)this.loadData();
    },
    methods: {
      handleCopy(item) {
        this.$utils.copy(item.title)
      },

      addCar(item){
        this.$store.commit('setJdCar',{
          type:'add',
          good:item
        })
        console.log(this.$store.state.jdCar)
        this.$Message.success('添加成功')
      },

      async searchClick(){
        this.keywordObj.page=1

        let data=this.$store.state.jdKeywordObj
        data.pageIndex=1
        data.keyword=this.keywordObj.keyword

        // this.keywordObj.keyWords=this.$store.state.alibabaKeywordObj.keyWords;

        // this.$store.commit('setAlibabaKeywordObj',params)
        await this.$store.commit('setAlibabaKeywordObj',data)
        this.loadData()
      },
      async changePage(page){
        // this.keywordObj.pageIndex=page
        let data=this.$store.state.jdKeywordObj
        data.pageIndex=page
        await this.$store.commit('setJdKeywordObj',data)

        document.getElementById('neiPage').scrollTop=0
        document.documentElement.scrollTop=0
        this.loadData()
      },
      async loadData(){
        this.pageLoading=true;
        // let data={}
        // for(let i in this.keywordObj){
        //   if(this.keywordObj[i])data[i]=this.keywordObj[i];
        // }
        // console.log("----------------loadData",data)
        // let result = await this.$request({
        //   url: `/jd/goodQuerySkuByPage`,
        //   method: 'post',
        //   data:data
        // })

        // let result = await this.$request({
        //   url: `/jd/goodSearch/${data.pageIndex}/${data.pageSize}`,
        //   method: 'post',
        //   data:data
        // })
        // this.itemList=result.data.rows
        // this.allTotal=result.data.count

        await this.$store.dispatch('getJdSearchResult')
        this.pageLoading=false
      },

      goDetail(item){
        this.$router.push('/epShop/jdGoodDetail/'+item.wareId)
      },
      goAlibabaUrl(item){
        window.open(`https://item.jd.com/${item.wareId}.html`, '_blank');
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
          font-size: 24px;
          padding: 5px 0;
          .li{
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 24px;
            &:first-child{
              font-size: 16px;
              line-height: 20px;
            }
            div{
              width: 50%;
              &:last-child{
                text-align: right;
              }
            }
          }
        }
        .lirun{
          font-size: 22px;
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


  .no-data{
    font-size: 14px;
    text-align: center;
    padding: 50px;
  }
</style>
