<template>
  <div class="container">

    <condition @addClick="addOrEditModal" :showSelect="false" @searchClick="doSearch" @selectClick="doSelect">
      <Select v-model="keywordObj.verification"  @on-change="selectClick" size="large" clearable style="width:200px;margin-right: 10px;"  placeholder="状态">
        <Option v-for="item in [{label:'已使用',value:1},{label:'未使用',value:0}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
</template>
<script>
import goodCodeModal from "./goodCodeModal";

export default {
  name: "EditDialog",
  props: ["extra","$store"],
  data: function() {
    return {
      keywordObj:{
        keyword:'',
        verification:null
      },
      dataList:[],
      columns: [
        {
          title: '#ID',
          key: 'id',
          align: 'center',
          fixed: 'left',
          minWidth:80,
        },
        {
          title: '兑换码',
          key: 'code',
          align: 'center',
          minWidth:200,
        },
        {
          title: '添加时间',
          align: 'center',
          minWidth:140,
          render: (h, params) => {
            return h('div', this.$utils.changeTimeDate(params.row.create_time).dateTime);
          }
        },
        {
          title: '状态',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div',params.row.verification==1?'已使用':'未使用');
          }
        },
        {
          title: '使用时间',
          key: 'price',
          align: 'center',
          minWidth:140,
          render: (h, params) => {
            return h('div', params.row.verification==1?this.$utils.changeTimeDate(params.row.verification_time).dateTime:'-');
          }
        },
        {
          title: '订单ID',
          key: 'price',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', params.row.score_order_id||'-');
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:100,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     size: 'small',
              //     type: 'primary',
              //   },
              //   style: {
              //     marginRight: '10px',
              //   },
              //   on: {
              //     click: () => this.addOrEditModal(params)
              //   }
              // }, '编辑'),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'error',
                  disabled:params.row.verification==1?true:false
                },
                on: {
                  click: () => this.deleteModal(params)
                }
              }, '删除')
            ])
          },
        },
      ],
    };
  },
  mounted() {

  },
  methods: {

    //添加或编辑
    async addOrEditModal(params) {
      console.log(this.extra)
      let that=this
      let extra=params?params.row:{score_good_id:this.extra.id}
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: goodCodeModal,
        height: 800,
        width: 1000,
        extra:extra,
        // store:that.$store,
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
    async deleteModal(params){
      this.$dialog.confirm({
        message: '是否删除此数据？',
        width: 300,
        height:200,
        onBtn: async index => {
          if (index !== 0) return true;
          let result = await this.$request({
            url:'/scoreGood/goodCodeDel/'+params.row.id,
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
      if (this.keywordObj.keyword) {
        options.keyword = [
          {code:this.keywordObj.keyword},
        ];
      }
      if(this.keywordObj.verification||this.keywordObj.verification==0)options.verification=this.keywordObj.verification

      options.score_good_id=this.extra.id
      const result = await this.$request({
        url:'/scoreOrder/goodCodeList/'+options.page+'/'+options.pageSize,
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
    doSearch(keyword){
      this.keywordObj.keyword = keyword;
      this.$refs.pageTable.reload();
    },
    doSelect(state){
      this.keywordObj.state=state
      this.$refs.pageTable.reload();
    },
    selectClick(){
      this.$refs.pageTable.reload();
    },
  }
};
</script>
<style lang="scss" scoped>

</style>
