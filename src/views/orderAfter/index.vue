<template>
  <div class="page-wrap">
    <my-header :breadcrumbList="['售后处理']"></my-header>
    <div class="page-body-main">
      <!--      <condition @addClick="addOrEditModal" :showAdd="false" :showSelect="false" @searchClick="doSearch" @selectClick="doSelect"></condition>-->

      <div class="condtion-body-main">
        <div class="search-wrapper">
          <div style="margin-bottom: 10px;">
            <DatePicker type="daterange" size="large" split-panels placeholder="时间范围" @on-change="timeChange"
                        style="width: 230px;margin-right: 10px;"></DatePicker>
            <i-select @on-change="selectClick('weapp_id')" :disabled="$store.state.userInfo.weapp>0" clearable placeholder="平台" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.weapp_id">
              <i-option v-for="item in weappList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>
            <i-select @on-change="selectClick('state')" clearable placeholder="订单状态" size="large"
                      style="width:200px;margin-right: 10px;" v-model="keywordObj.state">
              <i-option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>

            <i-select @on-change="selectClick('state')" clearable placeholder="发起者" size="large"
                      style="width:200px;" v-model="keywordObj.originator">
              <i-option v-for="item in originatorList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>


          </div>
          <div style="width: 100%;">
            <i-input style="width: 500px" search enter-button="搜索" @on-search="searchClick" size="large"
                     class="input-search" placeholder="ID、订单号、收货人、收货人电话、物流单号"/>
          </div>
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
  import refusedModal from "./components/refusedModal";
  import orderModal from "./components/orderModal";
  import refundMoneyModal from "./components/refundMoneyModal";

  export default {
    components: {refusedModal, orderModal, refundMoneyModal},
    name: 'orderAfter',
    data: function () {
      return {
        keywordObj: {
          keyword: '',
          start_time: '',
          end_time: '',
          state: null,
          originator: null,
          order_type: 1,
          pay_type: null,
        },
        stateList: [
          {
            value: 1,
            label: '处理中'
          },
          {
            value: 2,
            label: '用户寄回中'
          },
          {
            value: 3,
            label: '配送中'
          },
          {
            value: 4,
            label: '已完成'
          },
          {
            value: 5,
            label: '已取消'
          },
          {
            value: 6,
            label: '已拒绝'
          },
        ],
        originatorList:[
          {
            value: 1,
            label: '用户'
          },
          {
            value: 2,
            label: '后台系统'
          },
        ],
        dataList: [],
        columns: [
          {
            title: '#ID',
            key: 'id',
            align: 'center',
            fixed: 'left',
            minWidth: 80,
          },
          {
            title: '平台',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.weapp?params.row.weapp.name:'-')
            }
          },
          {
            title: '申请时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
            }
          },
          {
            title: '退款时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.refund_time?this.$utils.changeTimeDate(params.row.refund_time).dateTime:'-')
            }
          },
          {
            title: '发起者',
            key: 'user_id',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h('div',params.row.originator==1?'用户':'后台系统')
            }
          },
          {
            title: '用户id',
            key: 'user_id',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '订单编号',
            key: 'order_no',
            align: 'center',
            minWidth: 200,
          },
          {
            title: '原订单ID',
            key: 'order_id',
            align: 'center',
            minWidth: 120,
          },
          {
            title: '售后类型',
            key: 'type_name',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '退款金额',
            key: 'real_refund_money',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '理由',
            key: 'reason',
            minWidth: 200,
            align: 'center'
          },
          {
            title: '原因',
            key: 'content',
            minWidth: 200,
            align: 'center'
          },

          {
            title: '状态',
            key: 'state_name',
            minWidth: 100,
            align: 'center',
            fixed: 'right',
          },

          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 140,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'info',
                  },
                  style: {
                    // marginRight: '10px',
                  },
                  on: {
                    click: () => this.orderModal(params.row)
                  }
                }, '订单详情'),
                // h('Button', {
                //   props: {
                //     size: 'small',
                //     type: 'error',
                //     disabled:params.row.state==4?true:false
                //   },
                //   style: {
                //     marginRight: '10px',
                //   },
                //   on: {
                //     click: () => this.refusedModals(params.row)
                //   }
                // }, '拒绝'),
                // h('Button', {
                //   props: {
                //     size: 'small',
                //     type: 'warning',
                //     disabled:params.row.state==4?true:false
                //   },
                //   on: {
                //     click: () => this.refundMoney(params.row)
                //   }
                // }, '确定完成')
              ])
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
    methods: {
      //拒绝售后
      async refusedModals(params) {
        this.$dialog.open({
          title: '订单详情',
          resizable: true,
          component: refusedModal,
          height: 400,
          width: 600,
          extra: params ? params : undefined,
          btn: ["确定", "关闭"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },
      //确定退款
      async refundMoney(params) {
        this.$dialog.open({
          title: '订单详情',
          resizable: true,
          component: refundMoneyModal,
          height: 300,
          width: 400,
          extra: params ? params : undefined,
          btn: ["确定", "关闭"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },

      //订单详情
      async orderModal(params) {
        params['orderAfterStateList']=this.$store.state.orderAfterStateList
        this.$dialog.open({
          title: '订单详情',
          resizable: true,
          component: orderModal,
          height: 800,
          width: 1000,
          extra: params ? params : undefined,
          btn: [],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },


      //添加或编辑
      async addOrEditModal(params) {
        this.$dialog.open({
          title: params ? "修改" : '添加',
          resizable: true,
          component: Modal,
          height: 300,
          width: 600,
          extra: params ? params.row : undefined,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },
      //删除
      async deleteModal(params) {
        this.$dialog.confirm({
          message: '是否删除此数据？',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url: '/good/add/' + params.row.id,
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


      onDataLoad: async function (options, callback) {
        if (this.keywordObj.state||this.keywordObj.state==0) {
          options.state =this.keywordObj.state;
        }
        if (this.keywordObj.start_time) {
          options.start_time =this.keywordObj.start_time;
        }
        if (this.keywordObj.end_time) {
          options.end_time =this.keywordObj.end_time;
        }
        options.order_type =this.keywordObj.order_type;

        if(this.keywordObj.originator)options.originator=this.keywordObj.originator
        if(this.keywordObj.keyword){
          options.keyword = [
            {id: this.keywordObj.keyword},
            {order_no: this.keywordObj.keyword},
            {consignee_name: this.keywordObj.keyword},
            {consignee_phone: this.keywordObj.keyword},
            {logistics_no: this.keywordObj.keyword}
          ];
        }
        if(this.keywordObj.weapp_id){
          options.weapp_id=this.keywordObj.weapp_id
        }
        const result = await this.$request({
          url: '/orderAfter/list/' + options.page + '/' + options.pageSize,
          method: 'post',
          data: options
        });
        callback(result);
      },

      refreshCurrent: function () {
        this.$refs.pageTable.loadData();
      },

      pushData(items) {
        console.log(items);
        for (let i in items) {
          let stateName=''
          for(let o in this.$store.state.orderAfterStateList){
            if(this.$store.state.orderAfterStateList[o].state==items[i].state)stateName=this.$store.state.orderAfterStateList[o].label;
          }
          items[i]['state_name'] = stateName;
          console.log(stateName)
          items[i]['type_name'] = items[i].type == 1 ? '退货退款' : items[i].type == 2 ? '换货' : items[i].type == 3 ? '维修' : items[i].type == 4 ? '仅退款' : '-'
        }

        this.dataList = items
      },
      timeChange(date) {
        let start_time=new Date(date[0]+' 00:00:00')
        let end_time=new Date(date[1]+' 23:59:59')
        this.keywordObj.start_time=start_time
        this.keywordObj.end_time=end_time
        this.$refs.pageTable.reload();

      },
      selectClick() {
        this.$refs.pageTable.reload();
      },
      searchClick(value) {
        this.keywordObj.keyword = value;
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
