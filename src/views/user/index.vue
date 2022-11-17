<template>
  <div>
    <my-header  :breadcrumbList="['用户管理']"></my-header>
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
  import Modal from "./components/Modal";
  export default {
    components: {Modal},
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
            title: '头像',
            key: 'images',
            align: 'center',
            minWidth:100,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.headimgurl,
                    previewSrcList:[params.row.headimgurl]
                  },
                  style: {
                    width: '35px'
                  },
                }),
              ]);
            }
          },
          {
            title: '微信昵称',
            key: 'nickname',
            align: 'center',
            minWidth:200,
          },
          {
            title: '菜豆',
            key: 'user_score',
            minWidth:100,
            align: 'center'
          },
          {
            title: 'openid',
            key: 'openid',
            minWidth:260,
            align: 'center'
          },
          {
            title: 'unionid',
            key: 'unionid',
            minWidth:260,
            align: 'center'
          },
          {
            title: '手机',
            key: 'phone',
            minWidth:180,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.phone||'-')
            }
          },
          {
            title: '注册时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
            }
          },
          {
            title: '最后登陆时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.login_time?this.$utils.changeTimeDate(params.row.login_time).dateTime:'-')
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
                  // style: {
                  //   marginRight: '10px',
                  // },
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
          component: Modal,
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
            {id:this.keyword},
            {nickname:this.keyword},
            {openid:this.keyword},
            {unionid:this.keyword},
            {phone:this.keyword},
          ];
        }
        const result = await this.$request({
          url:'/user/list/'+options.page+'/'+options.pageSize,
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
