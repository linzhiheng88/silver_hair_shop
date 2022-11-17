<template>
  <div>
    <my-header :breadcrumbList="['首页格子']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal"  :industryPackageAuto="true" :industryPackageDefault="true" @industryPackageClick="industryPackageClick" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
    components: {Modal},
    name: 'Users',
    data: function () {
      return {
        keywordObj:{
          industry_package_id:null,
          keyword: '',
        },
        page:1,
        dataList: [],
        columns: [
          {
            title: '位置',
            key: 'id',
            align: 'center',
            fixed: 'left',
            minWidth:80,
            render: (h, params) => {
              return h('div','格子'+(params.index+1)*this.page)
            }
          },
          {
            title: '行业包',
            key: 'index',
            minWidth:150,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.industry_package?params.row.industry_package.name:'-')
            }
          },
          {
            title: '类型',
            key: 'index',
            minWidth:100,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.type==1?'关键字搜索':params.row.type==2?'小程序跳转':'H5跳转')
            }
          },
          {
            title: '关键字',
            key: 'name',
            align: 'center',
            minWidth:100,
          },
          {
            title: '跳转链接',
            key: 'url',
            minWidth:200,
            align: 'center'
          },
          {
            title: '权重',
            key: 'index',
            minWidth:100,
            align: 'center'
          },
          {
            title: '封面图',
            key: 'images',
            align: 'center',
            minWidth:100,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.images,
                    previewSrcList:[params.row.images]
                  },
                  style: {
                    width: '40px'
                  },
                }),

              ]);
            }
          },
          {
            title: '是否违禁',
            key: 'violation',
            align: 'center',
            minWidth: 85,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    trueColor:'#f90',
                    value: params.row.violation == 1 ? true : false
                  },
                  on: {
                    'on-change': (value) => this.violationChange(params)
                  }
                }),
              ])
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
            width:140,
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
    methods: {

      //添加或编辑
      async addOrEditModal(params) {
        let myParams=params?params.row:{}
        if(this.keywordObj.industry_package_id)myParams.industry_package_id=this.keywordObj.industry_package_id;
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: Modal,
          height: 550,
          width: 700,
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
      async violationChange(params){
        let violation = params.row.violation == 1 ? 0 : 1
        let result = await this.$request({
          url: '/indexBox/violation/' + params.row.id + '/' + violation,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].violation = violation
          this.$Message.success('设置成功');
        }
      },
      //上下架
      async shelves(params) {
        console.log(params);
        let shelves = params.row.shelves == 1 ? 0 : 1
        let result = await this.$request({
          url: '/indexBox/shelves/' + params.row.id + '/' + shelves,
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
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/indexBox/del/'+params.row.id,
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
          options.keyword = [
            {name:this.keyword},
            {url:this.keyword},
          ];
        }
        this.page=options.page;
        if(this.keywordObj.industry_package_id)options.industry_package_id=this.keywordObj.industry_package_id;
        const result = await this.$request({
          url:'/indexBox/list/'+options.page+'/'+options.pageSize,
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
        this.state=state
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
