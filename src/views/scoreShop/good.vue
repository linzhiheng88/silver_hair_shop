<template>
  <div>
    <my-header :breadcrumbList="['积分商品']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="false" :weappAuto="true" :weappDefault="true" @searchClick="doSearch" @selectClick="doSelect" @weappClick="weappClick">
        <Select v-model="keywordObj.type"  @on-change="selectClick" size="large" clearable style="width:200px;margin-right: 10px;"  placeholder="领取方式">
          <Option v-for="item in [{label:'表单',value:1},{label:'兑换码',value:2}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
import goodModal from "./components/goodModal";
import goodCodeListModal from "./components/goodCodeListModal";
import goodFormModal from "./components/goodFormModal";
export default {
  name: 'Demo',
  data: function () {
    return {
      keywordObj: {
        keyword: '',
        weapp_id:null,
        type:null,
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
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth:200,
        },
        {
          title: '图片',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [
              h('el-image', {
                attrs: {
                  src: params.row.images[0],
                  previewSrcList:params.row.images
                },
                style: {
                  width: '35px'
                },
              }),
            ]);
          }
        },
        {
          title: '兑换方式',
          key: 'price',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', params.row.type==1?'表单':'兑换码');
          }
        },
        {
          title: '价格',
          key: 'price',
          align: 'center',
          minWidth:100,
        },
        {
          title: '销量',
          key: 'sales',
          align: 'center',
          minWidth:100,
        },
        {
          title: '库存',
          key: 'stock',
          align: 'center',
          minWidth:100,
        },
        {
          title: '限制兑换数量/用户',
          key: 'stock',
          align: 'center',
          minWidth:120,
          render: (h, params) => {
            return h('div',{
              style: {
                color: params.row.limit_number==0?'green':'red'
              },
            }, params.row.limit_number==0?'不限制':params.row.limit_number);
          }
        },
        {
          title: '权重',
          key: 'index',
          align: 'center',
          minWidth:100,
        },
        {
          title: '上下架状态',
          key: 'shelves',
          align: 'center',
          minWidth: 85,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  // size: 'large',
                  value: params.row.shelves == 1 ? true : false,
                  beforeChange: (value) => this.shelves(params)
                },

                // on: {
                //   'on-change': (value) => this.shelves(params)
                // }
              }),
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:220,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  type: params.row.type==1?'warning':'info',
                },
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => this.setDataModal(params)
                }
              },params.row.type==1?'表单设置':'兑换码'),
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
              }, '编辑'),
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

  mounted() {

  },



  methods: {


    async setDataModal(params){
      this.$dialog.open({
        title: params.row.type==1?"表单设置":'兑换码',
        resizable: true,
        component: params.row.type==1?goodFormModal:goodCodeListModal,
        height: params.row.type==1?600:1000,
        width:params.row.type==1?800: 1200,
        extra: params.row,
        btn: params.row.type==1?["确定", "取消"]:[],
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
      let extra=params?params.row:{weapp_id:this.keywordObj.weapp_id}
      if(!extra.weapp_id){
        this.$Message.warning('请先选择平台')
        return false;
      }
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: goodModal,
        height: 800,
        width: 1000,
        extra: extra,
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
            url:'/scoreGood/goodDel/'+params.row.id,
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

   //上下架
    async shelves(params) {
      let that=this
      console.log(params.row.shelves)
      return new Promise(async (resolve) => {
        let shelves = params.row.shelves == 1 ? 0 : 1
        let result = await that.$request({
          url: '/scoreGood/goodShelves/' + params.row.id + '/' + shelves,
          method: 'get',
        })
        if (result.code == 200) {
          resolve();
          // that.dataList[params.index].shelves = shelves
          setTimeout(function (){
            that.dataList[params.index].shelves = shelves
          },100)
          that.$Message.success('设置成功');
        }

        //
        // let shelves = params.row.shelves == 1 ? 0 : 1
        // console.log(params.row.shelves)
        // this.$Modal.confirm({
        //   title: '切换确认',
        //   content: '您确认要切换开关状态吗？',
        //   onOk: () => {
        //     resolve();
        //     console.log(params.row.shelves)
        //     that.dataList[params.index].shelves = shelves
        //   }
        // });


      });

    },
    onDataLoad: async function (options, callback) {
      if (this.keywordObj.keyword) {
        options.keyword = [
          {name:this.keywordObj.keyword},
        ];
      }
      if(this.keywordObj.weapp_id)options.weapp_id=this.keywordObj.weapp_id
      if(this.keywordObj.type)options.type=this.keywordObj.type
      const result = await this.$request({
        url:'/scoreGood/goodList/'+options.page+'/'+options.pageSize,
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
