<template>
  <div class="page-wrap">
    <my-header  :breadcrumbList="breadcrumbList"></my-header>
    <div class="page-body-main">


      <div class="condtion-body-main">
        <div class="search-wrapper">

          <div style="margin-bottom: 10px;">
<!--            <Date-picker  v-model="keywordObj.start_time" style="width:180px" size="large" type="datetime" @on-ok="timeChange" @on-clear="timeChange(1)" placeholder="开始时间"></Date-picker>-->
<!--            <Date-picker v-model="keywordObj.end_time" style="width:180px; margin: 0 10px;" size="large" @on-ok="timeChange" @on-clear="timeChange(2)" type="datetime" placeholder="结束时间"></Date-picker>-->
<!--            daterange-->
            <DatePicker type="daterange" size="large" split-panels placeholder="时间范围" @on-change="timeChange" style="width: 230px;margin-right: 10px;"></DatePicker>

            <i-select @on-change="selectClick('order_type')" clearable placeholder="订单类型" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.order_type">
              <i-option v-for="item in orderTypeList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>

            <i-select @on-change="selectClick('platform_id')" clearable placeholder="进货平台" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.platform_id">
              <i-option v-for="item in platformList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>

            <i-select @on-change="selectClick('state')" clearable placeholder="订单状态" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.state">
              <i-option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>

            <i-select @on-change="selectClick('pay_type')" clearable placeholder="支付方式" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.pay_type">
              <i-option v-for="item in payTypeList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>
              <i-select @on-change="selectClick('weapp_id')" :disabled="$store.state.userInfo.weapp>0" clearable placeholder="平台" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.weapp_id">
                  <i-option v-for="item in weappList" :value="item.value" :key="item.value">{{item.label}}</i-option>
              </i-select>
              <i-select @on-change="selectClick('shop_id')" :disabled="$store.state.userInfo.shop_id>0" clearable placeholder="商户" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.shop_id">
                  <i-option v-for="item in shopList" :value="item.value" :key="item.value">{{item.label}}</i-option>
              </i-select>
          </div>


          <div style="width: 100%;"><i-input style="width: 500px" search enter-button="搜索" @on-search="searchClick" size="large" class="input-search" placeholder="ID、订单号、收货人、收货人电话、物流单号" /></div>


        </div>
      </div>


      <page-table
        ref="pageTable"
        @onDataLoad="onDataLoad"
        @pushData="pushData"
        :columns="columns"
        :dataList="dataList"
      >
      </page-table>
    </div>
  </div>
</template>

<script>
  import seeLogisticsModalComp from "@/components/see-logistics-modal-comp";
  import aliLogisticsModal from "./components/aliLogisticsModal";
  import jdLogisticsModal from "./components/jdLogisticsModal";


  import Modal from "./components/Modal";
  import orderModal from "./components/orderModal";
  // import exportModal from "./components/exportModal";
  import orderStateModal from "./components/orderStateModal";
  import orderReturnModal from "./components/orderReturnModal";
  export default {
    components: {},
    name: 'order',
    data: function () {
      return {
        keywordObj: {
          keyword:'',
          start_time:'',
          end_time:'',
          state:null,
          platform_id:null,
          order_type:1,
          pay_type:null,
          shop_id:null,
          weapp_id:null,
        },
        breadcrumbList:['订单管理'],
        orderTypeList:[
          {
            value:1,
            label:'普通订单'
          },
          {
            value:2,
            label:'售后订单'
          }
        ],
        platformList:[],

        payTypeList:[
          {
            value:1,
            label:'线上支付'
          },
          {
            value:2,
            label:'货到付款'
          }
        ],
        stateList:[
          {
            value:0,
            label:'未付款'
          },
          {
            value:1,
            label:'待发货'
          },
          {
            value:2,
            label:'待收货'
          },
          {
            value:3,
            label:'已完成'
          },
          {
            value:4,
            label:'已取消'
          },
          {
            value:5,
            label:'用户拒收'
          },
          {
            value:6,
            label:'已退款'
          },
          {
            value:10,
            label:'未成团'
          },
        ],
          shopList:[],

        dataList: [],
        columns: [
          {
            title: '#ID',
            key: 'id',
            align: 'center',
            fixed: 'left',
            minWidth:80,
          },
          {
            title: '进货平台',
            minWidth:100,
            align: 'center',
            fixed: 'left',
            render: (h, params) => {
              return h('div',params.row.platform?params.row.platform.name:'-')
            }
          },
            {
                title: '平台',
                key: 'id',
                align: 'center',
                minWidth:110,
                render: (h, params) => {
                    return h('div',params.row.weapp?params.row.weapp.name:'-')
                }
            },
          {
            title: '下单时间',
            minWidth:160,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
            }
          },
          {
            title: '付款时间',
            key: 'pay_time',
            align: 'center',
            minWidth:200,
            render: (h, params) => {
              return h('div',params.row.pay_time?this.$utils.changeTimeDate(params.row.pay_time).dateTime:'-')
            }
          },
          {
            title: '订单类型',
            key: 'order_type_name',
            align: 'center',
            minWidth:100,
          },

          {
            title: '订单号',
            key: 'order_no',
            align: 'center',
            minWidth:190,
          },
            {
                title: '商户',
                key: 'user_id',
                align: 'center',
                minWidth:120,
                render: (h, params) => {
                    return h('div',params.row.shop.name||'-')
                }
            },
            {
                title: '用户ID',
                key: 'user_id',
                align: 'center',
                minWidth:120,
            },
          {
            title: '订单状态',
            key: 'state_name',
            align: 'center',
            minWidth:80,
            fixed: 'right',
          },
          {
            title: '订单金额',
            key: 'total_money',
            align: 'center',
            minWidth:120,
          },
          {
            title: '支付金额',
            key: 'real_total_money',
            align: 'center',
            minWidth:120,
          },
            {
                title: '成本（商品+运费）',
                key: 'cost_money',
                align: 'center',
                minWidth:140,
            },
            {
                title: '支付手续费',
                key: 'pay_poundage_money',
                align: 'center',
                minWidth:110,
            },
          {
            title: '优惠券金额',
            key: 'coupons_discount_money',
            align: 'center',
            minWidth:110,
            render: (h, params) => {
              return h('div',{
                style: {
                  color: params.row.coupons_discount_money==0?'#cccccc':'',
                },
              },params.row.coupons_discount_money)
            }
          },
          {
            title: '返现金额',
            key: 'return_cash_coupon_money',
            align: 'center',
            minWidth:110,
            render: (h, params) => {
              return h('div',{
                style: {
                  color: params.row.return_cash_coupon_money==0?'#cccccc':'',
                },
              },params.row.return_cash_coupon_money)
            }
          },
            {
                title: '分销佣金',
                key: 'distribution_money',
                align: 'center',
                minWidth:100,
              render: (h, params) => {
                return h('div',{
                  style: {
                    color: params.row.distribution_money==0?'#cccccc':'',
                  },
                },params.row.distribution_money)
              }
            },
            {
                title: '利润',
                key: 'pay_poundage_money',
                align: 'center',
                minWidth:110,
                render: (h, params) => {
                    let data=params.row
                    let pay_poundage_money=(data.real_total_money-data.cost_money-data.pay_poundage_money-data.return_cash_coupon_money-data.distribution_money).toFixed(2)
                    return h('div',{
                      style: {
                        color: pay_poundage_money>0?'green':'red',
                      },
                    },pay_poundage_money)
                }
            },
          {
            title: '支付方式',
            key: 'pay_type_name',
            align: 'center',
            minWidth:120,
          },


          {
            title: '收货人姓名',
            key: 'consignee_name',
            align: 'center',
            minWidth:120,
          },
          {
            title: '收货人电话',
            key: 'consignee_phone',
            align: 'center',
            minWidth:140,
          },
          {
            title: '收货人地址',
            key: 'consignee_address',
            align: 'center',
            minWidth:200,
            render:(h,params)=>{
              return h('div',params.row.consignee_province+params.row.consignee_city+params.row.consignee_county+params.row.consignee_address)
            }
          },
          {
            title: '订单备注',
            key: 'user_note',
            align: 'center',
            tooltip: true,
            minWidth:200
          },
          {
            title: '物流公司',
            key: 'logistics_no',
            align: 'center',
            minWidth:120,
            render: (h, params) => {
              // return h('div',params.row.logistic?params.row.logistic.name:'-')
              return h('div',[
                params.row.logistic?h('a', {
                  on: {
                    click: () => this.seeLogistics(params.row)
                  }
                },params.row.logistic.name):'-'
              ])
            }
          },
          {
            title: '物流单号',
            key: 'logistics_no',
            align: 'center',
            minWidth:140,
            render: (h, params) => {
              return h('div',[
                params.row.logistics_no?h('a', {
                  on: {
                    click: () => this.seeLogistics(params.row)
                  }
                },params.row.logistics_no):'-'
              ])
            }
          },

          {
            title: '操作',
            key: 'action',
            align: 'center',
            width:400,
            fixed: 'right',
            render: (h, params) => {
                let weapp=this.$store.state.userInfo.weapp
                let buttonArr=[
                    h('Button', {
                        props: {
                            size: 'small',
                            type: 'info',
                        },
                        style: {
                            marginRight: '10px',
                        },
                        on: {
                            click: () => this.showOrderModal(params.row)
                        }
                    },'订单详情')
                ]
                // if(weapp==0){
                if(weapp==0||(weapp>0&&params.row.shop_id>0)){
                    buttonArr.push(h('Button', {
                        props: {
                            size: 'small',
                            type: params.row.state>=2?'success':'primary',
                        },
                        style: {
                            marginRight: '10px',
                        },
                        on: {
                            click: () => this.addOrEditModal(params.row)
                        }
                    },(params.row.state==2)||params.row.state==3?'已发货':'发货'))
                    // },(params.row.state==2&&params.row.logistics_id)||params.row.state==3?'已发货':'发货'))
                  buttonArr.push(h('Button', {
                    props: {
                      size: 'small',
                      type: 'info',
                      ghost:true,
                      disabled: params.row.state<2?true:false
                    },
                    style: {
                      marginRight: '10px',
                    },
                    on: {
                      click: () => this.seeLogistics(params.row)
                    }
                  },'查看物流'))

                    if(!this.$store.state.userInfo.shop_id>0){
                        buttonArr.push(h('Button', {
                            props: {
                                size: 'small',
                                type: 'warning',
                            },
                            on: {
                                click: () => this.stateModal(params.row)
                            }
                        }, '修改状态'))
                    }

                }
                if(weapp==0){
                  let disabled=true
                  if(params.row.state==1||params.row.state==2)disabled=false;
                  if(params.row.order_after_sale && params.row.order_after_sale.state==4)disabled=true
                    buttonArr.push(h('Button', {
                        props: {
                            size: 'small',
                            type: 'error',
                            disabled:disabled
                        },
                        style: {
                            marginLeft: '10px',
                        },
                        on: {
                            click: () => this.returnModal(params.row)
                        }
                    }, params.row.order_after_sale && params.row.order_after_sale.state==4?'已退款':'发起退款'))
                }

              return h('div', buttonArr)
            },
          },

        ],
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
      },

    async created(){
        if(this.$store.state.userInfo.shop_id>0){
            this.keywordObj.shop_id=this.$store.state.userInfo.shop_id
        }
        this.$store.dispatch('getWeapp')
        let shopResult=await this.$store.dispatch('getShop',this.$store.state.userInfo.weapp)
        this.shopList=shopResult.map(item=>{
            return {
                label:item.name,
                value:item.id
            }
        })


      const platformResult = await this.$request({
        url: '/platform/list/1/999',
        method: 'POST',
      });
      this.platformList=platformResult.data.rows.map(item=>{
        return {
          value:item.id,
          label:item.name
        }
      })

    },
    methods: {


      async seeLogistics(item){
        //aliLogisticsModal,jdLogisticsModal,seeLogisticsModalComp
        let component=seeLogisticsModalComp
        let extra={}
        if(item.logistic){
          extra={
            code:item.logistic.coding,
            number:item.logistics_no,
          }
        }
        if(item.platform_id==100){
          component=aliLogisticsModal
          if(!item.alibaba_order||!item.alibaba_order.alibaba_order_id){
            this.$Message.warning('暂时没有物流信息')
            return false;
          }
          extra={
            alibaba_order_id:item.alibaba_order.alibaba_order_id
          }
        }else if(item.platform_id==200){
          component=jdLogisticsModal
          if(!item.jd_order||!item.jd_order.jd_order_id){
            this.$Message.warning('暂时没有物流信息')
            return false;
          }
          extra={
            jd_order_id:item.jd_order.jd_order_id
          }
        }



        this.$dialog.open({
          title: '物流查询',
          resizable: true,
          component: component,
          height: 400,
          width: 600,
          extra: extra,
          btn: ["取消"],
          onDismiss: index => {
            if (index === 0) {
              return true;
            }
          }
        });
      },

      //查看物流
      // async seeLogistics(item){
      //   let logistics={
      //     code:item.logistic.coding,
      //     number:item.logistics_no,
      //   }
      //   this.$dialog.open({
      //     title: '发货物流',
      //     resizable: true,
      //     component: seeLogisticsModalComp,
      //     height: 400,
      //     width: 600,
      //     extra: logistics,
      //     btn: ["取消"],
      //     onDismiss: index => {
      //       if (index === 0) {
      //         return true;
      //       }
      //     }
      //   });
      // },



      //订单详情
      async showOrderModal(params){
        let that=this
        console.log(that.$router)
        this.$dialog.open({
          title: '订单详情',
          resizable: true,
          component: orderModal,
          height: 800,
          width: 1000,
          extra: params?params:undefined,
          router:that.$router,
          btn: [],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },

      //发货
      async addOrEditModal(params) {
        this.$dialog.open({
          title: params?"发货":'添加',
          resizable: true,
          component: Modal,
          height: 350,
          width: 500,
          extra: params?params:undefined,
          btn: ["確定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },

      //修改订单状态
      async stateModal(params){
        let extra= params?params:{}
          extra.orderStateList=this.$store.state.orderStateList
          console.log(extra)
        this.$dialog.open({
          title:'修改订单状态',
          resizable: true,
          component: orderStateModal,
          height: 350,
          width: 500,
          extra: extra,
          btn: ["確定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
        // this.$dialog.confirm({
        //   message: '是否刪除此數據？',
        //   width: 300,
        //   height: 180,
        //   onBtn: async index => {
        //     if (index !== 0) return true;
        //     let result = await this.$request({
        //       url:'/good/del/'+params.id,
        //       method: 'get'
        //     })
        //     if (result.code == 200) {
        //       this.$Message.success('刪除成功');
        //       this.refreshCurrent();
        //       return true;
        //     } else {
        //       this.$Message.info('删除失败');
        //     }
        //   }
        // });
      },
      async returnModal(params){
          let extra= params?params:{}
          extra.orderStateList=this.$store.state.orderStateList
          console.log(extra)
          this.$dialog.open({
              title:'发起退款',
              resizable: true,
              component: orderReturnModal,
              height: 550,
              width: 600,
              extra: extra,
              btn: ["确定退款", "取消"],
              onDismiss: index => {
                  if (index === 0) {
                      this.refreshCurrent();
                      return true;
                  }
              }
          });
      },



      //导出数据
      async exportData(){
        this.$dialog.confirm({
          message: '是否导出数据？',
          width: 300,
          height: 200,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/admin/exportRecord',
              method: 'post',
              data:{

              }
            })
            if (result.code == 200) {
              this.$Message.success('导出成功');
              window.location.href = this.$store.state.baseUrl + result.data
              return true;
            } else {
              this.$Message.info('导出失败');
            }
          }
        });

      },



      onDataLoad: async function (options, callback) {
        if (this.keywordObj.state||this.keywordObj.state==0) {
          options.state =this.keywordObj.state;
        }

        if (this.keywordObj.platform_id) {
          options.platform_id =this.keywordObj.platform_id;
        }

        if (this.keywordObj.pay_type) {
          options.pay_type =this.keywordObj.pay_type;
        }

        if (this.keywordObj.start_time) {
          options.start_time =this.keywordObj.start_time;
        }
        if (this.keywordObj.end_time) {
          options.end_time =new Date((this.$utils.changeTimeDate(this.keywordObj.end_time).dateTimestamp+86399)*1000);
        }
        if(this.keywordObj.shop_id){
            options.shop_id=this.keywordObj.shop_id
        }
          if(this.keywordObj.weapp_id){
              options.weapp_id=this.keywordObj.weapp_id
          }

        options.order_type =this.keywordObj.order_type;
        if(this.keywordObj.keyword){
          options.keyword = [
            {id: this.keywordObj.keyword},
            {order_no: this.keywordObj.keyword},
            {consignee_name: this.keywordObj.keyword},
            {consignee_phone: this.keywordObj.keyword},
            {logistics_no: this.keywordObj.keyword}
          ];
        }

        const result = await this.$request({
          url:'order/list/'+options.page+'/'+options.pageSize,
          method:'post',
          data:options
        });
        callback(result);
      },

      refreshCurrent: function () {
        this.$refs.pageTable.loadData();
      },

      pushData(items){
        console.log(items);

        for(let i in items){
            let state_name=''
            for(let o in this.stateList){
                if(items[i].state==this.stateList[o].value){
                    state_name=this.stateList[o].label;
                    break;
                }
            }

          items[i]['state_name']=items[i].state==6?'用户已拒收':state_name
          items[i]['is_pay_name']=items[i].is_pay==1?'已付款':'未付款'
          items[i]['pay_type_name']=items[i].pay_type==1?'在线支付':items[i].pay_type==2?'货到付款':'-'
          items[i]['order_type_name']=items[i].order_type==1?'普通订单':'售后订单'

        }

        this.dataList=items
      },


      timeChange(date){
        let start_time=new Date(date[0]+' 00:00:00')
        let end_time=new Date(date[1]+' 23:59:59')
        this.keywordObj.start_time=start_time
        this.keywordObj.end_time=end_time
        this.$refs.pageTable.reload();

      },
      selectClick(){
        this.$refs.pageTable.reload();
      },
      searchClick(value){
        this.keywordObj.keyword = value;
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped lang="scss">



</style>
