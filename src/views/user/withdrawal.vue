<template>
  <div class="page-wrap">
    <my-header  :breadcrumbList="['分销提现']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showAdd="false" :showSelect="false" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
  import withdrawalModal from "./components/withdrawalModal";
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
          // {
          //   title: '头像',
          //   key: 'images',
          //   align: 'center',
          //   minWidth:100,
          //   render: (h, params) => {
          //     return h('div', [
          //       h('img', {
          //         attrs: {
          //           src: params.row.headimgurl
          //         },
          //         style: {
          //           width: '35px'
          //         }
          //       }),
          //     ]);
          //   }
          // },
          {
            title: '用户ID',
            key: 'user_id',
            align: 'center',
            minWidth:150,
          },
          {
            title: '订单号',
            key: 'order_no',
            minWidth:200,
            align: 'center'
          },
          {
            title: '金额',
            key: 'value',
            minWidth:120,
            align: 'center'
          },
          {
            title: '状态',
            key: 'state',
            minWidth:120,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.state==1?'已打款':params.row.state==2?'不通过':'待审核')
            }
          },
          {
            title: '申请时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
            }
          },
          {
            title: '备注',
            key: 'note',
            minWidth:200,
            align: 'center'
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
    methods: {



      //添加或编辑
      async addOrEditModal(params) {
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: withdrawalModal,
          height: 380,
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
            {nickname:this.keyword},
            {openid:this.keyword},
            {unionid:this.keyword},
            {phone:this.keyword},
          ];
        }
        const result = await this.$request({
          url:'/distribution/withdrawalApplicationRecord/'+options.page+'/'+options.pageSize,
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
