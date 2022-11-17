<template>
  <div>
    <my-header :breadcrumbList="['积分商城Banner管理']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="false" :showSearch="false" :weappAuto="true" :weappDefault="true" @searchClick="doSearch" @selectClick="doSelect" @weappClick="weappClick"></condition>
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
import bannerModal from "./components/bannerModal";
export default {
  name: 'Demo',
  data: function () {
    return {
      keywordObj: {
        keyword: '',
        weapp_id:null,
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
          title: '图片',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [
              h('el-image', {
                attrs: {
                  src: params.row.image,
                  previewSrcList:[params.row.image]
                },
                style: {
                  width: '35px'
                },
              }),
            ]);
          }
        },
        {
          title: '跳转商品',
          key: 'nickname',
          align: 'center',
          minWidth:200,
          render: (h, params) => {
            return h('div',{
              style: {
                color: !params.row.score_good?'red':''
              },
            }, params.row.score_good?params.row.score_good.name:'商品ID错误');
          }
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
                  value: params.row.shelves == 1 ? true : false
                },
                on: {
                  'on-change': (value) => this.shelves(params)
                }
              }),
            ])
          }
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
        component: bannerModal,
        height: 400,
        width: 600,
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
            url:'/scoreGood/bannerDel/'+params.row.id,
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

      let shelves = params.row.shelves == 1 ? 0 : 1
      let result = await this.$request({
        url: '/scoreGood/bannerShelves/' + params.row.id + '/' + shelves,
        method: 'get',
      })
      if (result.code == 200) {
        this.dataList[params.index].shelves = shelves
        this.$Message.success('设置成功');
      }
    },
    onDataLoad: async function (options, callback) {
      if (this.keywordObj.keyword) {
        options.keyword = [
          {openid:this.keywordObj.keyword},
        ];
      }
      if(this.keywordObj.weapp_id)options.weapp_id=this.keywordObj.weapp_id
      const result = await this.$request({
        url:'/scoreGood/bannerList/'+options.page+'/'+options.pageSize,
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
  },
}
</script>

<style scoped="">

</style>
