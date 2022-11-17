<template>
  <div class="page-wrap">
    <my-header  :breadcrumbList="['投诉建议']"></my-header>
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
            title: '用户ID',
            key: 'user_id',
            align: 'center',
            minWidth:100,
            fixed: 'left',
          },
          {
            title: '截图',
            key: 'images',
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
            title: '类型',
            key: 'title',
            align: 'center',
            minWidth:200,
          },
          {
            title: '内容',
            key: 'content',
            minWidth:260,
            align: 'center'
          },
          {
            title: '联系方式',
            key: 'contact',
            minWidth:260,
            align: 'center'
          },
          {
            title: '是否允许联系',
            key: 'allow_contact',
            minWidth:260,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.allow_contact==1?'允许':'NO')
            }
          },
          {
            title: '提交时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
            }
          },
          {
            title: '处理时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',(params.row.state==1?this.$utils.changeTimeDate(params.row.update_time).dateTime:'-'))
            }
          },
          {
            title: '状态',
            key: 'action',
            align: 'center',
            width:140,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                    type:params.row.state==0 ?'primary':'success',
                  },
                  style: {
                    padding:'0 20px'
                    // marginRight: '10px',
                  },
                  on: {
                    click: () => this.addOrEditModal(params.row)
                  }
                }, params.row.state==0?'处理':'已处理'),
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
        this.$dialog.confirm({
          message:params.state==0?"改为已处理":'改为待处理',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/report/edit',
              method: 'post',
              data:{
                id:params.id,
                state:params.state==0?1:0
              }
            })
            if (result.code == 200) {
              this.$Message.success('操作成功');
              this.refreshCurrent();
              return true;
            } else {
              this.$Message.info('操作失败');
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
              url:'/report/del/'+params.row.id,
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
            {title:this.keyword},
            {content:this.keyword},
          ];
        }
        const result = await this.$request({
          url:'/report/list/'+options.page+'/'+options.pageSize,
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
