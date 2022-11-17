<template>
  <div class="page-wrap">
    <my-header :breadcrumbList="['活动格子']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="false" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
  import boxModal from "./components/boxModal";
  export default {
    components: {},
    name: 'Users',
    data: function () {
      return {
        keyword: '',
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
            title: '类型',
            key: 'index',
            minWidth:100,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.type==1?'关键字搜索':params.row.type==2?'小程序跳转':params.row.type==3?'H5跳转':params.row.type==4?'优惠券':'展示')
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
            title: '优惠券ID',
            key: 'coupon_id',
            minWidth:100,
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
                h('img', {
                  attrs: {
                    src: params.row.images
                  },
                  style: {
                    width: '35px'
                  }
                }),
              ]);
            }
          },
          {
            title: '封面图2',
            key: 'images',
            align: 'center',
            minWidth:100,
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.images_two
                  },
                  style: {
                    width: '35px'
                  }
                }),
              ]);
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
        let extra= params?params.row:{}
        extra.activity_id=this.$route.params.activity_id
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: boxModal,
          height: 680,
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
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/activity/boxDel/'+params.row.id,
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
          ];
        }
        this.page=options.page;

        options.activity_id=this.$route.params.activity_id
        const result = await this.$request({
          url:'/activity/boxList/'+options.page+'/'+options.pageSize,
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
