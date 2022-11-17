<template>
  <div>
    <my-header :breadcrumbList="['京东消息推送']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :show-select="false" :showTime="false" :showSearch="false" :showAdd="false"  @searchClick="doSearch" @timeChange="timeChange">

<!--        <div style="line-height: 40px;font-size: 18px;font-weight: bold;margin-left: auto;">账户余额：{{balance}}</div>-->
        <i-select @on-change="doSelect" placeholder="类型" size="large"  style="width:200px;margin-right: 10px;" v-model="keywordObj.type">
          <i-option v-for="item in selectList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
      </condition>


      <page-table
        ref="pageTable"
        @onDataLoad="onDataLoad"
        @pushData="pushData"
        :columns="columns"
        :dataList="dataList"
        :disabled="true"
      >
      </page-table>
    </div>
  </div>
</template>

<script>
import jdOrderModal from "../components/jdOrderModal";
import jdLogisticsModal from "../components/jdLogisticsModal";
export default {
  name: 'Jd',
  data: function () {
    return {
      keywordObj: {
        type:10,
      },
      selectList:[
        {
          label:'商品价格变更',
          value:2,
        },

        {
          label:'订单拆分消息',
          value:1,
        },
        {
          label:'商品上下架变更',
          value:4,
        },
        {
          label:'订单取消',
          value:10,
        },
        {
          label:'配送单生成',
          value:12,
        },
        {
          label:'支付失败',
          value:14,
        },
        {
          label:'订单配送退货',
          value:23,
        },
        {
          label:'新订单消息',
          value:25,
        },
      ],
      dataList: [],
      columns: [
        {
          title: '#ID',
          key: 'id',
          align: 'center',
          fixed: 'left',
          minWidth:120,
        },
        {
          title: '类型',
          minWidth:200,
          align: 'center',
          render: (h, params) => {
            let typeName=''
            for(let i in this.selectList){
              if(this.selectList[i].value==params.row.type){
                typeName=this.selectList[i].label
                break;
              }
            }
            return h('div',typeName)
          }
        },
        {
          title: '时间',
          minWidth:200,
          align: 'center',
          render: (h, params) => {
            return h('div',params.row.time)
          }
        },

        {
          title: '内容',
          key: 'result',
          align: 'center',
          minWidth:300,
          tooltip: true
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
                  type: 'error',
                },
                on: {
                  click: () => this.deleteModal(params)
                }
              }, '删除')
            ])
          },
        },
      ],
    }
  },
  async mounted() {



  },
  methods: {
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
            url:'/jd/delMessage/'+params.row.id,
            method: 'delete'
          })
          if (result.code == 200) {
            this.$Message.success('刪除成功');
            this.refreshCurrent();
            return true;
          }
        }
      });
    },


    onDataLoad: async function (options, callback) {
      if (this.keywordObj.startDate) {
        options.startDate = this.$utils.changeTimeDate(this.keywordObj.startDate).numDate;
      }
      options.type = this.keywordObj.type
      // const result = await this.$request({
      //   url:'/good/phone/brand/list',
      //   method:'get',
      //   params:options
      // });
      const result = await this.$request({
        // url:'/jd/getMessage/'+options.page+'/'+options.pageSize,
        url:'/jd/getMessage',
        method:'post',
        data:options
      });
      callback({
        code:result.code,
        data:{
          rows:result.data||0,
          count: result.data.length,
          page: 1,
          pageCount: parseInt(result.data.length/10),
          pageSize: result.data.length,
        }
      });
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
    timeChange(data){
      // if(data.start_time)this.keywordObj.startDate=data.start_time
      // if(data.end_time)this.keywordObj.endDate=data.end_time
      this.keywordObj.startDate=data.start_time
      this.keywordObj.endDate=data.end_time
      this.$refs.pageTable.reload();
    }
  },
}
</script>

<style scoped="">

</style>
