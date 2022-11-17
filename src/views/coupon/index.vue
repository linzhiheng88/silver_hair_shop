<template>
  <div class="page-wrap">
    <my-header  :breadcrumbList="['优惠券管理']"></my-header>
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
  import Modal from "./components/Modal";
  export default {
    components: {Modal},
    name: 'conpon',
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
            title: '使用场景',
            key: 'use_type',
            minWidth:100,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.use_type==1?'全场通用':params.row.use_type==2?'单商品使用':'活动使用')
            }
          },
          {
            title: '关联商品',
            key: 'type',
            minWidth:180,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.good?params.row.good.name:'-')
            }
          },
          {
            title: '关联活动',
            key: 'type',
            minWidth:180,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.activity?params.row.activity.name:'-')
            }
          },
          {
            title: '类型',
            key: 'type',
            minWidth:100,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.type==1?'代金券':params.row.type==2?'折扣券':params.row.type)
            }
          },
          {
            title: '代金券金额',
            key: 'amount',
            align: 'center',
            minWidth:100,
          },
          {
            title: '折扣',
            key: 'discount',
            align: 'center',
            minWidth:100,
          },
          {
            title: '优惠券门槛',
            key: 'conditions',
            align: 'center',
            minWidth:100,
          },
          {
            title: '使用有效期',
            minWidth:200,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.start_time).date+' ~ '+this.$utils.changeTimeDate(params.row.end_time).date)
            }
          },

          {
            title: '已领取数量',
            key: 'getCount',
            align: 'center',
            fixed: 'right',
            minWidth:100,
          },

          {
            title: '领券链接（点击复制）',
            key: 'name',
            align: 'center',
            fixed: 'right',
            minWidth:200,
            render: (h, params) => {
              let url='/toolPages/pages/coupons/get?coupon_id='+params.row.id+'&type=coupon'
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    overflow:'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color:'#2d8cf0'
                  },
                  on: {
                    click: () => this.$utils.copy(url)
                  }
                },url),
              ])
            }
          },
          {
            title: '领券背景',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.bg_image,
                    previewSrcList:[params.row.bg_image]
                  },
                  style: {
                    width: '50'
                  },
                }),
              ]);
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
                    type: 'info',
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => this.copyModal(params)
                  }
                }, '克隆'),
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

      copyModal(params){
        let itemData=params.row
        delete itemData.id;
        this.$dialog.confirm({
          message: '是否克隆【'+params.row.name+'】数据？',
          width: 400,
          height: 240,
          onBtn: async index => {
            if (index !== 0) return true;
            itemData.name=itemData.name+'-副本'
            let result = await this.$request({
              url: '/coupon/edit',
              method: 'post',
              data:itemData
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


      //添加或编辑
      async addOrEditModal(params) {
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: Modal,
          height: 800,
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
      //删除
      async deleteModal(params){
        this.$dialog.confirm({
          message: '是否删除此数据？',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/coupon/del/'+params.row.id,
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
        const result = await this.$request({
          url:'/coupon/list/'+options.page+'/'+options.pageSize,
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
