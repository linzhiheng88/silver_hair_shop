<template>
  <div class="page-wrap">
    <my-header  :breadcrumbList="['账单']"></my-header>
    <div class="page-body-main">
      <condition :weappAuto="true"  @weappClick="weappClick" :showAdd="false" :showSearch="false" :showSelect="false">
        <i-select @on-change="selectClick" placeholder="账单类型" size="large" style="width:200px;margin-right: 10px;" v-model="keywordObj.type">
          <i-option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </condition>
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
  import Modal from "./components/Modal";
  import payModal from "./components/payModal";
  export default {
    components: {Modal},
    name: 'Users',
    data: function () {
      return {
        keywordObj: {
          weapp_id:null,
          keyword: '',
          type: 1,
        },
        typeList:[
          {
            label:'日账单',
            value:1
          },
          {
            label:'月账单',
            value:2
          }
        ],
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
            title: '平台',
            align: 'center',
            fixed: 'left',
            minWidth:100,
            render: (h, params) => {
              return h('div',params.row.weapp?params.row.weapp.name:'全部')
            }
          },
          {
            title: '访客数',
            key: 'fw_user',
            align: 'center',
            minWidth:200,
          },
          {
            title: '订单数',
            key: 'order',
            minWidth:120,
            align: 'center'
          },
          {
            title: '销售额',
            key: 'sales',
            minWidth:120,
            align: 'center'
          },
          {
            title: '退款金额',
            key: 'refund',
            minWidth:120,
            align: 'center'
          },
          {
            title: '总利润金额',
            key: 'profits',
            minWidth:120,
            align: 'center'
          },
          {
            title: '已支付金额',
            key: 'pay_money',
            minWidth:120,
            align: 'center'
          },

          {
            title: '账单日期',
            minWidth:200,
            align: 'center',
            render: (h, params) => {
              let dataObj=this.$utils.changeTimeDate(params.row.time)
              console.log(dataObj)
              return h('div',params.row.type==1?dataObj.date:dataObj.year+'-'+dataObj.month)
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width:160,
            fixed: 'right',
            render: (h, params) => {
              let buttonArr=[
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'primary',
                  },
                  on: {
                    click: () => this.addOrEditModal(params)
                  }
                }, '详细'),
              ]
              if(params.row.type==2&&this.$store.state.userInfo.weapp==0){
                buttonArr.push(h('Button', {
                  props: {
                    size: 'small',
                    type: 'error',
                    ghost:params.row.state==0?true:false
                  },
                  style: {
                    marginLeft: '10px',
                  },
                  on: {
                    click: () => this.showPayModal(params)
                  }
                }, params.row.state==0?'付款':'已支付'))
              }
              return h('div', buttonArr)
            },
          },
        ],
      }
    },
    methods: {



      //添加或编辑
      async addOrEditModal(params) {
        this.$dialog.open({
          title: '账单详细',
          resizable: true,
          component: Modal,
          height: 380,
          width: 900,
          extra: params?params.row:undefined,
          btn: [],
          onDismiss: index => {

          }
        });
      },

      async showPayModal(params){
        this.$dialog.open({
          title: '支付账单',
          resizable: true,
          component: payModal,
          height: 400,
          width: 700,
          extra: params?params.row:undefined,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },

      onDataLoad: async function (options, callback) {
        // if (this.keywordObj.keyword) {
        //   options.keywordObj.keyword = [
        //     {name:this.keywordObj.keyword},
        //   ];
        // }
        options.type=this.keywordObj.type
        if(this.keywordObj.weapp_id)options.weapp_id=this.keywordObj.weapp_id;
        const result = await this.$request({
          url:'/bill/list/'+options.page+'/'+options.pageSize,
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
        this.dataList = items
      },
      selectClick(){
        this.$refs.pageTable.reload();
      },
      weappClick(weapp_id){
        this.keywordObj.weapp_id=weapp_id
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
