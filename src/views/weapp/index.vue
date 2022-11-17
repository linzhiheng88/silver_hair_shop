<template>
  <div>
    <my-header  :breadcrumbList="['商城平台']"></my-header>
    <div class="page-body-main">
      <condition :showAdd="true" @addClick="addOrEditModal" :showSelect="false" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
  import commissionModal from "./components/commissionModal";
  import topupModal from "./components/topupModal";
  import tabbarModal from "./components/tabbarModal";

  import accountModal from "./components/accountModal";
  export default {
    components: {},
    name: 'Users',
    data: function () {
      return {
        keyword: '',
        state:-1,
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
            title: '名称',
            key: 'name',
            align: 'center',
            minWidth:200,
          },
          {
            title: '行业商品包',
            align: 'center',
            minWidth:150,
            render: (h, params) => {
              return h('div',params.row.industry_package?params.row.industry_package.name:'-')
            }
          },
          {
            title: '余额',
            key: 'balance',
            align: 'center',
            minWidth:150,
          },

          {
            title: '待结算佣金',
            key: 'commission_no',
            minWidth:120,
            align: 'center'
          },
          {
            title: '待结算佣金更新时间',
            minWidth:200,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.commission_no_update).dateTime)
            }
          },
          {
            title: '已结算佣金',
            key: 'commission_yes',
            minWidth:120,
            align: 'center'
          },
          {
            title: '已结算佣金更新时间',
            key: 'commission_no',
            minWidth:200,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.commission_yes_update).dateTime)
            }
          },
          {
            title: '审核状态',
            align: 'center',
            minWidth:100,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    trueColor:'#f90',
                    value: params.row.audit == 1 ? true : false
                  },
                  on: {
                    'on-change': (value) => this.auditChange(params)
                  }
                }),
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width:310,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'warning',
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => this.addCountModal(params)
                  }
                }, '子账号'),
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
                    type: 'success',
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => this.tabBarEditModal(params)
                  }
                }, 'tabBar'),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'info',
                  },
                  style: {
                    // marginRight: '10px',
                  },
                  on: {
                    click: () => this.commissionEditModal(params)
                  }
                }, '编辑佣金'),
                // h('Button', {
                //   props: {
                //     size: 'small',
                //     type: 'error',
                //   },
                //   on: {
                //     click: () => this.topupModal(params)
                //   }
                // }, '充值')
              ])
            },
          },
        ],
      }
    },
    computed:{
      industryPackageList:function () {
        return  this.$store.state.industryPackageList.map(item=>{
          return {
            label:item.name,
            value:item.id
          }
        })
      }
    },
    methods: {
      async addCountModal(params){
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: accountModal,
          height: 800,
          width: 1000,
          extra: params.row,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              this.$store.dispatch('getWeapp',true)
              return true;
            }
          }
        });
      },

      async auditChange(params){
        let audit = params.row.audit == 1 ? 0 : 1
        let result = await this.$request({
          url: '/weapp/audit/' + params.row.id + '/' + audit,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].audit = audit
          this.$Message.success('设置成功');
        }
      },

      //添加或编辑
      async addOrEditModal(params) {
        let data=params?params.row: {}
        data['industryPackageList']=this.industryPackageList
        console.log(this.industryPackageList)
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: Modal,
          height: 600,
          width: 650,
          extra: data,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              this.$store.dispatch('getWeapp',true)
              return true;
            }
          }
        });
      },
      async tabBarEditModal(params){
        this.$dialog.open({
          title:'编辑小程序tabBar',
          resizable: true,
          component: tabbarModal,
          height: 700,
          width: 1000,
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

      //编辑佣金
      async commissionEditModal(params) {
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: commissionModal,
          height: 300,
          width: 600,
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

      async topupModal(params){
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: topupModal,
          height: 300,
          width: 600,
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
      //删除
      async deleteModal(params){
        this.$dialog.confirm({
          message: '是否删除此数据？',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/platform/del/'+params.row.id,
              method: 'delete'
            })
            if (result.code == 200) {
              this.$Message.success('刪除成功');
              this.refreshCurrent();
              this.$store.dispatch('getWeapp',true)
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
          ];
        }
        const result = await this.$request({
          url:'/weapp/list/'+options.page+'/'+options.pageSize,
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
        this.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      doSelect(state){
        this.state=state
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
