<template>
  <div>
    <my-header :breadcrumbList="['兑换订单']"></my-header>
    <div class="page-body-main">


      <div class="condtion-body-main">
        <div class="search-wrapper">
          <div style="margin-bottom: 10px;">
            <i-select @on-change="selectClick" :disabled="$store.state.userInfo.weapp>0" clearable placeholder="平台" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.weapp_id">
              <i-option v-for="item in weappList" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>
            <DatePicker type="daterange" size="large" split-panels placeholder="时间范围" @on-change="timeChange" style="width: 230px;margin-right: 10px;"></DatePicker>
            <Select v-model="keywordObj.score_good_type"  @on-change="selectClick" size="large" clearable style="width:160px;margin-right: 10px;"  placeholder="领取方式">
              <Option v-for="item in [{label:'表单',value:1},{label:'兑换码',value:2}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="keywordObj.state"  @on-change="selectClick" size="large" clearable style="width:160px;margin-right: 10px;"  placeholder="状态">
              <Option v-for="item in [{label:'已发货',value:1},{label:'未发货',value:0}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select
                @on-change="selectClick"
                size="large"
                placeholder="商品"
                style="width:320px;margin-right: 10px;"
                v-model="keywordObj.score_good_id"
                filterable
                clearable
                :remote-method="searchFunc"
                :loading="searchLoading">
              <Option v-for="(item, index) in searchResultList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </div>


          <div style="width: 100%;display: flex;justify-content: space-between">
            <i-input style="width: 500px" search enter-button="搜索" @on-search="doSearch" size="large" class="input-search" placeholder="ID、订单号、物流单号" />
            <div>
              <i-button type="info" size="large" class="button" @click="exportClick">导出</i-button>
            </div>

          </div>
        </div>


      </div>



      <condition @addClick="addOrEditModal" :showSelect="false" :weappAuto="true" :weappDefault="true" @searchClick="doSearch" @selectClick="doSelect" @weappClick="weappClick" v-if="false">
        <DatePicker type="daterange" size="large" split-panels placeholder="时间范围" @on-change="timeChange" style="width: 230px;margin-right: 10px;"></DatePicker>
        <Select v-model="keywordObj.score_good_type"  @on-change="selectClick" size="large" clearable style="width:120px;margin-right: 10px;"  placeholder="领取方式">
          <Option v-for="item in [{label:'表单',value:1},{label:'兑换码',value:2}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="keywordObj.state"  @on-change="selectClick" size="large" clearable style="width:120px;margin-right: 10px;"  placeholder="状态">
          <Option v-for="item in [{label:'已发货',value:1},{label:'未发货',value:0}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select
            size="large"
            placeholder="商品"
            style="width:200px;margin-right: 10px;"
            v-model="keywordObj.score_good_id"
            filterable
            :remote-method="searchFunc"
            :loading="searchLoading">
          <Option v-for="(item, index) in searchResultList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>


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
import orderStateModal from "./components/orderStateModal";
import seeLogisticsModalComp from "@/components/see-logistics-modal-comp";
import orderModal from "./components/orderModal";
import deliveryModal from "./components/deliveryModal";
export default {
  name: 'Demo',
  data: function () {
    return {
      keywordObj: {
        keyword: '',
        weapp_id:null,
        score_good_type:null,
        state:null,
        start_time:null,
        end_time:null,
        score_good_id:null,
      },
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
          key: 'nickname',
          align: 'center',
          minWidth:200,
          render: (h, params) => {
            return h('div', params.row.weapp.name);
          }
        },
        {
          title: '下单时间',
          align: 'center',
          minWidth:160,
          render: (h, params) => {
            return h('div', this.$utils.changeTimeDate(params.row.create_time).dateTime);
          }
        },
        {
          title: '订单编号',
          key: 'order_no',
          align: 'center',
          minWidth:200,
        },
        {
          title: '领奖方式',
          key: 'order_no',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', params.row.score_good_type==1?'表单':'兑换码');
          }
        },
        {
          title: '商品名称',
          key: 'score_good_name',
          align: 'center',
          minWidth:200,
          tooltip: true
        },
        {
          title: '商品图片',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [
              h('el-image', {
                attrs: {
                  src: params.row.score_good_images,
                  previewSrcList:[params.row.score_good_images]
                },
                style: {
                  width: '35px'
                },
              }),
            ]);
          }
        },
        {
          title: '物流公司',
          key: 'nickname',
          align: 'center',
          minWidth:200,
          render: (h, params) => {
            return h('div',params.row.state==1?params.row.logistics_name:'-');
          }
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
          title: '订单状态',
          key: 'state_name',
          align: 'center',
          minWidth:80,
          fixed: 'right',
          render: (h, params) => {
            return h('div',{
              style: {
                color: params.row.state==0?'red':'green'
              },
            }, params.row.state==0?'未发货':'已发货');
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:320,
          fixed: 'right',
          render: (h, params) => {
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
              },'订单详情'),
              h('Button', {
                props: {
                  size: 'small',
                  type: params.row.state==1?'success':'primary',
                  disabled:params.row.score_good_type==2?true:false
                },
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => this.addOrEditModal(params.row)
                }
              },params.row.state==1?'已发货':'发货'),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'info',
                  ghost:true,
                  disabled: (params.row.state<1||params.row.score_good_type==2)?true:false
                },
                style: {
                  // marginRight: '10px',
                },
                on: {
                  click: () => this.seeLogistics(params.row)
                }
              },'查看物流'),
              // h('Button', {
              //   props: {
              //     size: 'small',
              //     type: 'warning',
              //   },
              //   on: {
              //     click: () => this.stateModal(params.row)
              //   }
              // }, '修改状态')
            ]



            return h('div', buttonArr)
          },
        },
      ],

      searchLoading:true,
      searchResultList:[],

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

  mounted() {

  },



  methods: {


    async exportClick(){
      if(!this.keywordObj.score_good_id){
        this.$Message.warning('请先选择对应商品')
        return false;
      }
      let options={}
      if (this.keywordObj.keyword) {
        options.keyword = [
          {id:this.keywordObj.keyword},
          {order_no:this.keywordObj.keyword},
          {score_good_id:this.keywordObj.keyword},
          {score_good_name:this.keywordObj.keyword},
          {logistics_no:this.keywordObj.keyword},
        ];
      }
      if (this.keywordObj.start_time)options.start_time =this.keywordObj.start_time;
      if (this.keywordObj.end_time)options.end_time =new Date((this.$utils.changeTimeDate(this.keywordObj.end_time).dateTimestamp+86399)*1000);
      if(this.keywordObj.weapp_id)options.weapp_id=this.keywordObj.weapp_id
      if(this.keywordObj.score_good_type)options.score_good_type=this.keywordObj.score_good_type
      if(this.keywordObj.state||this.keywordObj.state==0)options.state=this.keywordObj.state
      if(this.keywordObj.score_good_id)options.score_good_id=this.keywordObj.score_good_id
      const result = await this.$request({
        url: '/scoreOrder/export',
        method: 'post',
        data:options
      });
      if(result.code==200){
        window.open(`${this.$store.state.baseUrl}${result.data.url}`, '_blank');
        this.$Message.success('导出成功')
      }

    },

    async searchFunc(data){
      if(data==''){return false}
      this.searchLoading = true;
      let postData={
        keyword:[
          {
            name:data
          },
          {
            id:data
          }
        ],
      }
      if(this.keywordObj.weapp_id)postData.weapp_id=this.keywordObj.weapp_id
      const result = await this.$request({
        url: '/scoreGood/goodList/1/30',
        method: 'post',
        data:postData
      });
      this.searchResultList=result.data.rows.map(item=>{
        return {
          id:item.id,
          name:'(ID:'+item.id+')'+item.name
        }
      })
      this.searchLoading = false;
    },


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
        component: deliveryModal,
        height: 400,
        width: 550,
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

    //查看物流
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


    onDataLoad: async function (options, callback) {
      if (this.keywordObj.keyword) {
        options.keyword = [
          {id:this.keywordObj.keyword},
          {order_no:this.keywordObj.keyword},
          {score_good_id:this.keywordObj.keyword},
          {score_good_name:this.keywordObj.keyword},
          {logistics_no:this.keywordObj.keyword},
        ];
      }
      if (this.keywordObj.start_time)options.start_time =this.keywordObj.start_time;
      if (this.keywordObj.end_time)options.end_time =new Date((this.$utils.changeTimeDate(this.keywordObj.end_time).dateTimestamp+86399)*1000);
      if(this.keywordObj.weapp_id)options.weapp_id=this.keywordObj.weapp_id
      if(this.keywordObj.score_good_type)options.score_good_type=this.keywordObj.score_good_type
      if(this.keywordObj.state||this.keywordObj.state==0)options.state=this.keywordObj.state
      if(this.keywordObj.score_good_id)options.score_good_id=this.keywordObj.score_good_id
      const result = await this.$request({
        url:'/scoreOrder/list/'+options.page+'/'+options.pageSize,
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

    timeChange(date){
      // let start_time=type==1?'':this.start_time
      // let end_time=type==2?'':this.end_time
      let start_time=new Date(date[0])
      let end_time=new Date(date[1])
      if(start_time){
        start_time=new Date(parseInt(start_time.getTime()/1000)*1000)
      }
      if(end_time){
        end_time=new Date(parseInt(end_time.getTime()/1000)*1000+86399)
      }
      this.keywordObj.start_time=new Date(date[0])
      this.keywordObj.end_time=new Date(date[1])
      this.$refs.pageTable.reload();

    },
    doSearch(keyword){
      this.keywordObj.keyword = keyword;
      this.$refs.pageTable.reload();
    },
    doSelect(state){
      this.keywordObj.state=state
      this.$refs.pageTable.reload();
    },
    weappClick(weapp_id){
      this.keywordObj.weapp_id=weapp_id
      this.$refs.pageTable.reload();
    },
    selectClick(){
      this.$refs.pageTable.reload();
    },
  },
}
</script>

<style scoped="">

</style>
