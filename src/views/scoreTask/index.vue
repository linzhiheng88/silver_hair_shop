<template>
  <div>
    <my-header :breadcrumbList="['任务列表']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="false" :showAdd="false" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
export default {
  name: 'Demo',
  data: function () {
    return {
      keywordObj:{
        keyword: '',
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
          key: 'index',
          minWidth:150,
          align: 'center',
          render: (h, params) => {
            return h('div',params.row.weapp?params.row.weapp.name:'全平台通用')
          }
        },
        {
          title: '任务名称',
          key: 'name',
          align: 'center',
          minWidth:80,
        },
        {
          title: 'ICON',
          key: 'avaheadimgurltar',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [

              h('el-image', {
                attrs: {
                  src: params.row.icon_url,
                  previewSrcList:[params.row.icon_url],
                },
                style: {
                  width: '50px'
                },
              }),
            ]);
          }
        },

        {
          title: '积分',
          key: 'value',
          align: 'center',
          minWidth:80,
        },
        {
          title: '提示语',
          key: 'tip',
          align: 'center',
          minWidth:80,
        },
        {
          title: '更新时间',
          minWidth:160,
          align: 'center',
          render: (h, params) => {
            return h('div',this.$utils.changeTimeDate(params.row.update_time).dateTime)
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
          width:100,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [

              h('Button', {
                props: {
                  size: 'small',
                  type: 'primary',
                },
                style: {
                  // marginRight: '10px',
                },
                on: {
                  click: () => this.addOrEditModal(params)
                }
              }, '编辑'),
              // h('Button', {
              //   props: {
              //     size: 'small',
              //     type: 'error',
              //   },
              //   on: {
              //     click: () => this.deleteModal(params)
              //   }
              // }, '删除')
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
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: Modal,
        height: 550,
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
    //上下架
    async shelves(params) {
      console.log(params);
      let shelves = params.row.shelves == 1 ? 0 : 1
      let result = await this.$request({
        url: '/scoreTask/scoreTaskShelves/' + params.row.id + '/' + shelves,
        method: 'get',
      })
      if (result.code == 200) {
        this.dataList[params.index].shelves = shelves
        this.$Message.success('设置成功');
      }
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
            url:'/good/add/'+params.row.id,
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
      if (this.keywordObj.keyword) {
        options.keyword = [
          {name:this.keywordObj.keyword},
        ];
      }
      const result = await this.$request({
        url:'/scoreTask/scoreTaskList/'+options.page+'/'+options.pageSize,
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
  },
}
</script>

<style scoped="">

</style>
