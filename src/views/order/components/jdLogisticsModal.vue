<template>
  <div class="container">

    <div v-if="error" style="text-align: center;padding: 30px 0;font-size: 20px">{{error}}</div>
    <div class="logistics-info" v-if="!error">
<!--      <img class="icon" mode="aspectFit" :src="logisticsData.source.logo"></img>-->
      <div class="info">
        <div class="name">{{logisticsData.waybillCode[0].carrier}}</div>
                <div class="number">{{logisticsData.waybillCode[0].deliveryOrderId}}</div>
<!--        <div class="but">复制</div>-->
      </div>
    </div>

    <div class="info-div" v-if="!error">
      <div class="line"></div>
      <div class="info-box">
<!--        <div class="li" v-if="logisticsData.info.current=='已签收'">-->
<!--          <div class="icon">-->
<!--            <div class="point"></div>-->
<!--            &lt;!&ndash;            <img src="../../static/icon/icon-24.png"></img>&ndash;&gt;-->
<!--          </div>-->
<!--          <div class='content'>-->
<!--            <div class="time">{{logisticsData.info.current}}</div>-->
<!--            <div class="detail">{{logisticsData.info.latest_progress}}</div>-->
<!--          </div>-->
<!--        </div>-->
        <div class="li" v-for="(item,index) in orderTrack" :key="index">
          <div class="icon">
            <div class="point"></div>
          </div>
          <div class='content'>
            <div class="time">{{item.msgTime}}</div>
            <div class="detail">{{item.content}}</div>
          </div>
        </div>
      </div>
    </div>

    <Spin size="large" fix v-if="loading"></Spin>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function () {
      return {
        logisticsData: {orderTrack: [],waybillCode:[]},
        error:'加载中...',
        loading:true

      };
    },
    computed:{
      orderTrack:function () {
        return this.logisticsData.orderTrack.reverse()
      }
    },
    async mounted() {
      const result = await this.$request({
        url: '/jd/orderTrack',
        method: 'post',
        data: {
          jdOrderId:this.extra.jd_order_id
        }
      })
      this.loading=false
      if (result.code == 200) {
        this.logisticsData = result.data
        this.error='';
      }else{
        this.error=result.message
      }

    },
    methods: {
      onBtn: async function (index) {
        if (index !== 0) return true;
        return true;
      }
    }
  };
</script>

<style scoped="" lang="scss">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .logistics-info {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #f9f9f9;

    .icon {
      width: 56px;
      /*height: 40px;*/
    }

    .info {
      margin-left: 30px;
      width: 580px;
      position: relative;

      .name {
        font-size: 18px;
        font-weight: 600;
        line-height: 40px;
        color: #333333;
      }

      .number {
        font-size: 32px;
        font-weight: 500;
        line-height: 45px;
        color: #333333;
        margin-top: 5px;
      }

      .but {
        font-size: 16px;
        font-weight: 400;
        line-height: 40px;
        color: #707070;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

  }

  .info-div {
    position: relative;
    /*margin: 0 25px;*/
    /*min-height: 500upx;*/
    .line {
      width: 1px;
      background: rgba(204, 204, 204, 0.5);
      /*height: calc(100% - 95px);*/
      height: calc(100% - 60px);
      position: absolute;
      left: 25px;
      top: 35px;
    }

    .info-box {
      margin-left: 50px;

      .li {
        position: relative;
        padding: 20px 0;

        .icon {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 100px;
          left: -45px;
          top: 20px;

          .point {
            width: 10px;
            height: 10px;
            background: #CCCCCC;
            border-radius: 100px;
            margin: 0 auto;
            position: relative;
            top: 10px;
          }
        }

        .content {
          font-size: 18px;
          font-weight: 400;
          line-height: 4 upx;
          color: #111111;

          .time {

          }
        }

      }
    }
  }
</style>
