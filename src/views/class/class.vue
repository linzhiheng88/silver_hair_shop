<template>
  <div>
    <my-header  :breadcrumbList="['商品分类']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" searchPlaceholder="请输入分类名称" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
import classChildModal from "./components/classChildModal";
export default {
  components: {Modal,classChildModal},
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
          minWidth:180,
          tree: true,
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth:200,
        },
        {
          title: '封面图',
          key: 'image',
          align: 'center',
          minWidth: 80,
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
        // {
        //   title: '背景颜色',
        //   key: 'background',
        //   align: 'center',
        //   minWidth:100,
        //   render: (h, params) => {
        //     return h('div',{
        //       style:{
        //         width:'60px',
        //         height:'30px',
        //         margin: 'auto',
        //         background:params.row.background
        //       }
        //     })
        //   }
        // },
        {
          title: '权重',
          key: 'index',
          align: 'center',
          minWidth:100,
        },
        {
          title: '是否违禁',
          align: 'center',
          minWidth:100,
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
          width:210,
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
                  click: () => this.seeChildModal(params)
                }
              }, '子分类'),
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

    async violationChange(params){
      let violation = params.row.violation == 1 ? 0 : 1
      let result = await this.$request({
        url: '/class/violation/' + params.row.id + '/' + violation,
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
        url: '/class/shelves/' + params.row.id + '/' + shelves,
        method: 'get',
      })
      if (result.code == 200) {
        this.dataList[params.index].shelves = shelves
        this.$Message.success('设置成功');
      }
    },
    async seeChildModal(params){
      this.$dialog.open({
        title: params.row.name,
        resizable: true,
        component: classChildModal,
        height: 850,
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

    //添加或编辑
    async addOrEditModal(params) {
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: Modal,
        height: 500,
        width: 500,
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
            url:'/class/del/'+params.row.id,
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
        url:'class/list/'+options.page+'/'+options.pageSize,
        method:'post',
        data:options
      });
      callback(result);
    },

    refreshCurrent: function () {
      this.$refs.pageTable.loadData();
    },

    pushData(items){
      this.dataList = items;
      // for (let i = 0; i < items.length; i++) {
      //   this.dataList.push({
      //     id: items[i].id,
      //     openid: items[i].openid,
      //     nickname:items[i].nickname,
      //     headimgurl:items[i].headimgurl,
      //     qr_scene:items[i].qr_scene,
      //     qr_scene_str:items[i].qr_scene_str,
      //     subscribe_time:items[i].subscribe_time,
      //     getPrize:items[i].getPrize,
      //     getPrizetype:items[i].getPrize==0?'未領取':'已領取',
      //     state:items[i].state,
      //     update_time:items[i].update_time,
      //     create_time:items[i].create_time,
      //   });
      // }
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
