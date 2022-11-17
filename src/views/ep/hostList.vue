<template>
  <div>
    <my-header :breadcrumbList="['阿里选品']"></my-header>
    <div class="page-body-main">
      <Card>
        <div class="search-div">
          <div class="left">
            <h3>搜索选品平台</h3>
            <p>支持关键词</p>
<!--            <p>支持关键词、1688商品链接、公司名全称搜索</p>-->
          </div>
          <div class="right">
            <i-input v-model="keywordObj.keyWords" search enter-button="搜本市场" @on-search="searchClick" size="large" class="input-search" placeholder="关键词" />
          </div>
        </div>
      </Card>
      <Card style="margin-top: 15px">
        <p slot="title">分类</p>
        <div class="class-div">
          <div class="li" v-for="item in classList" @click="classClick(item)">
            <div class="name">{{item.name}}</div>
          </div>
        </div>
      </Card>

      <Card style="margin-top: 15px">
        <p slot="title">详细分类</p>
        <div class="class-two-div">
          <div class="item" v-for="item in classList">
            <div class="name" @click="classClick(item)">{{item.name}}</div>
            <div class="value-box">
              <div class="li" @click="classClick(item,sit)" v-for="sit in item.childCategorys">{{sit.name}}</div>
            </div>
          </div>
        </div>
      </Card>

      <div class="good-div" v-if="false">
        <div class="good" v-for="item in 20" @click="goDetail(item)">
          <div class="cover">
            <img src="http://cbu01.alicdn.com/img/ibank/O1CN01F1SXhb27D2uSnR3Az_!!6000000007762-0-cib.jpg">
            <div class="addXp no-select" @click.stop="">
              <Icon type="ios-list-box" />
              <div>加入选品</div>
            </div>
          </div>
          <div class="info">
            <div class="name">测试测试测试测试测试测试测试测试测试测试测试测试</div>
            <div class="price">¥3232</div>
          </div>
        </div>
      </div>


      <Card v-if="false">
        <Page style="margin-top: 10px" :total="100" @on-change="changePage" @on-page-size-change="pageSizeChange"
              placement="top"
              :show-total="true"
              :show-sizer="true"
              :page-size="30">
        </Page>
      </Card>

<!--      <xuan-pin-ku-modal></xuan-pin-ku-modal>-->

    </div>
  </div>
</template>
<script>
  import xuanPinKuModal from "./components/xuanPinKuModal";
export default {
  name: 'hostList',
  components:{xuanPinKuModal},
  data: function () {
    return {
      classList:[],
      keywordObj:{
        postCategoryId:null,
        keyWords:'',
        categoryTitle:'',
        categorySubTitle:'',
      }
    }
  },
  async mounted() {
    this.keywordObj.keyWords='';
    this.keywordObj.postCategoryId=null;
    const result = await this.$request({
      url: '/alibaba/categoryPost',
      method: 'get',
    })
    console.log(result)
    this.classList=result.data
  },
  methods: {
    async searchClick(){
      this.keywordObj.postCategoryId=null;
      this.keywordObj.categoryTitle='';
      this.keywordObj.categorySubTitle='';

      this.pushClick()
    },
    async pushClick(){
      let params={},paramsSrt=''
      for(let i in this.keywordObj){
        if(this.keywordObj[i]){
          paramsSrt+=(paramsSrt==''?'?':'&')
          paramsSrt+=(i+'='+this.keywordObj[i])
          params[i]=this.keywordObj[i]
        }
      }
      delete params.categoryTitle;
      delete params.categorySubTitle;
      this.$store.commit('setAlibabaAfferSearchResult')
      this.$store.commit('setAlibabaKeywordObj',params)
      this.$store.dispatch('getAlibabaAfferSearchResult',params)
      this.$router.push(`/epShop/offerSearch${paramsSrt}`)
      // let result = await this.$request({
      //   url: '/alibaba/searchCybOffers/1/20',
      //   method: 'post',
      //   data:{
      //     postCategoryId:7,
      //     keyWords:'手机'
      //   }
      // })
      // console.log(result)
    },
    classClick(item,sit){
      this.keywordObj.postCategoryId=item.id
      this.keywordObj.categoryTitle=item.name
      this.keywordObj.categorySubTitle=''
      if(sit){
        this.keywordObj.postCategoryId=sit.id
        this.keywordObj.categorySubTitle=sit.name
      }
      this.keywordObj.keyWords='';
      this.pushClick()
    },

    goDetail(item){
      this.$router.push('/epShop/goodDetail/1')
      // let routeUrl = this.$router.resolve({
        // path: '/epShop/goodDetail/1'+item.id,
      // });
      // window.open(routeUrl.href, '_blank');
    },


    //添加或编辑
    async addOrEditModal(params) {
      // this.$dialog.open({
      //   title: params?"修改":'添加',
      //   resizable: true,
      //   component: Modal,
      //   height: 300,
      //   width: 600,
      //   extra: params?params.row:undefined,
      //   btn: ["确定", "取消"],
      //   onDismiss: index => {
      //     if (index === 0) {
      //       this.refreshCurrent();
      //       return true;
      //     }
      //   }
      // });
    },
    //删除
    async deleteModal(params){
      this.$dialog.confirm({
        message: '是否删除此数据？',
        width: 300,
        height:200,
        onBtn: async index => {
          if (index !== 0) return true;
          let result = await this.$request({
            url:'/good/add/'+params.row.id,
            method: 'delete'
          })
          if (result.status == 1) {
            this.$Message.success('刪除成功');
            this.refreshCurrent();
            return true;
          } else {
            this.$Message.info('删除失败');
          }
        }
      });
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

  .class-two-div{
    font-size: 16px;
    .item{
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #cccccc;
      &:last-child{
        border-bottom: none;
      }

      .name{
        width: 100px;
        line-height: 25px;
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 5px;
        border-radius: 2px;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        &:hover{
          color: #FFFFFF;
          background:#2d8cf0 ;
        }
      }
      .value-box{
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        margin-left: 10px;
        .li{
          padding: 0 8px;
          line-height: 40px;
          height: 40px;
          border-radius: 2px;
          cursor: pointer;
          &:hover{
            color: #FFFFFF;
            background:#2d8cf0 ;
          }
        }
      }
    }
  }

  .good-div{
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    .good{
      width: 220px;
      /*height: 380px;*/
      height: 310px;
      background: #FFFFFF;
      margin-bottom: 10px;
      margin-right: 10px;
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

    }
  }

</style>
