<template>
  <div>
    <my-header :breadcrumbList="['京东订单管理']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="false" :showAdd="false"  @searchClick="doSearch" @selectClick="doSelect"></condition>
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
import jdOrderModal from "../components/jdOrderModal";
import jdLogisticsModal from "../components/jdLogisticsModal";
export default {
  name: 'Alibaba',
  data: function () {
    return {
      keyword: '',
      state:-1,
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
          title: '订单ID',
          key: 'order_id',
          align: 'center',
          minWidth:80,
        },
        {
          title: '京东订单ID',
          key: 'jd_order_id',
          align: 'center',
          minWidth:200,
          render: (h, params) => {
            return h('div',params.row.jd_order_id||'-')
          }
        },
        {
          title: '备注',
          key: 'stateName',
          align: 'center',
          minWidth:200,
          render: (h, params) => {
            return h('div',params.row.note||'-')
          }
        },
        {
          title: '下单时间',
          minWidth:170,
          align: 'center',
          render: (h, params) => {
            return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
          }
        },
        {
          title: '状态',
          key: 'stateName',
          align: 'center',
          minWidth:180,
        },
        {
          title: '京东返回结果',
          key: 'result',
          align: 'center',
          tooltip:true,
          minWidth:200,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:200,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [

              h('Button', {
                props: {
                  size: 'small',
                  type: 'primary',
                },
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => this.addOrEditModal(params)
                }
              }, '订单详情'),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'info',
                  // disabled:params.row.state==1?false:true
                },
                on: {
                  click: () => this.logisticsModal(params.row)
                }
              }, '查看物流')
            ])
          },
        },
      ],
    }
  },
  async mounted() {
    // let result = await this.$request({
    //   url:'/alibaba/group',
    //   method: 'get'
    // })
    // this.autoClick()
  },
  methods: {
    goPay(params){
      window.open(`https://trade.1688.com/order/new_step_order_detail.htm?orderId=${params.alibaba_order_id}`, '_blank');
    },

    logisticsModal(params){
      this.$dialog.open({
        title: '物流信息',
        resizable: true,
        component: jdLogisticsModal,
        height: 700,
        width: 800,
        extra:params||{},
        btn:["关闭"],// ["确定", "取消"],
        onDismiss: index => {
          this.refreshCurrent();
          // if (index === 0) {
          //
          //   return true;
          // }
        }
      });
    },

    async autoClick(){
      let result = await this.$request({
        url:'/alibaba/synchronous',
        method: 'get'
      })
    },

    //添加或编辑
    async addOrEditModal(params) {
      console.log(params)
      let extra= params?params.row:{}
      extra.orderStateList=this.$store.state.orderStateList
      this.$dialog.open({
        title: '订单详情',
        resizable: true,
        component: jdOrderModal,
        height: 1000,
        width: 1200,
        extra:extra,
        btn:["关闭"],// ["确定", "取消"],
        onDismiss: index => {
          this.refreshCurrent();
          // if (index === 0) {
          //
          //   return true;
          // }
        }
      });
    },
    //删除
    async deleteModal(params){
      this.$dialog.confirm({
        message: '是否删除此数据？',
        width: 300,
        height: 180,
        onBtn: async index => {
          if (index !== 0) return true;
          let result = await this.$request({
            url:'/newZoneGood/del/'+params.row.id,
            method: 'delete'
          })
          if (result.code == 200) {
            this.$Message.success('刪除成功');
            this.refreshCurrent();
            return true;
          } else {
            this.$Message.info('删除失败');
          }
        }
      });
    },


    onDataLoad: async function (options, callback) {
      if (this.keyword) {
        options.keyword = this.keyword;
      }
      // const result = await this.$request({
      //   url:'/good/phone/brand/list',
      //   method:'get',
      //   params:options
      // });
      const result = await this.$request({
        url:'/jd/orderList/'+options.page+'/'+options.pageSize,
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
        items[i].stateName=items[i].state==0?'未下单':items[i].state==1?'预下单':items[i].state==2?'下单失败':items[i].state==5?'下单成功':'-'
      }
      this.dataList =items;

    },
    doSearch(keyword){
      this.keyword = keyword;
      this.$refs.pageTable.reload();
    },
    doSelect(state){
      this.state=state
      this.$refs.pageTable.reload();
    },
  },
}
</script>

<style scoped="">

</style>
