<template>
  <div>
    <my-header :breadcrumbList="['积分活动']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :industryPackageAuto="true" :industryPackageDefault="true" @industryPackageClick="industryPackageClick" autoType="success" autoButton="活动管理" @autoClick="autoClick" :showSelect="false" :showAdd="true" @searchClick="doSearch">
<!--        <i-button>活动管理</i-button>-->
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
export default {
  name: 'Demo',
  data: function () {
    return {
      keywordObj:{
        keyword: '',
        industry_package_id:null
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
          title: '封面图',
          key: 'avaheadimgurltar',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [

              h('el-image', {
                attrs: {
                  src: params.row.image,
                  previewSrcList:[params.row.image],
                },
                style: {
                  width: '50px'
                },
              }),
            ]);
          }
        },
        {
          title: '跳转类型',
          key: 'name',
          align: 'center',
          minWidth:80,
          render: (h, params) => {
            return h('div',params.row.type==1?'小程序跳转':'H5跳转')
          }
        },
        {
          title: '跳转链接',
          key: 'url',
          align: 'center',
          minWidth:80,
        },
        // {
        //   title: '上下架状态',
        //   key: 'tip',
        //   align: 'center',
        //   minWidth:80,
        //   render: (h, params) => {
        //     return h('div',params.row.shelves==1?'上架':'下架')
        //   }
        // },
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
    autoClick(){
      window.open(`https://silvershop.touchdot.top/luckycms`, '_blank');
    },


    //添加或编辑
    async addOrEditModal(params) {
      let myParams=params?params.row:{}
      if(this.keywordObj.industry_package_id)myParams.industry_package_id=this.keywordObj.industry_package_id;
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: Modal,
        height: 450,
        width: 600,
        extra: myParams,
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
        url: '/scoreTask/scoreTaskActivityEditShelves/' + params.row.id + '/' + shelves,
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
            url:'/scoreTask/scoreTaskActivityDel/'+params.row.id,
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
      if (this.keywordObj.keyword) {
        options.keyword = [
          {name:this.keywordObj.keyword},
        ];
      }
      if(this.keywordObj.industry_package_id){
        options.industry_package_id=this.keywordObj.industry_package_id;
      }
      const result = await this.$request({
        url:'/scoreTask/scoreTaskActivityList/'+options.page+'/'+options.pageSize,
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
    industryPackageClick(industry_package_id){
      this.keywordObj.industry_package_id=industry_package_id
      this.$refs.pageTable.reload();
    },
  },
}
</script>

<style scoped="">

</style>
