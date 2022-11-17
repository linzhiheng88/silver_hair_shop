<template>
  <div class="container">
    <i-button type="success" class="button" @click="addOrEditModal()">添加</i-button>
    <page-table
            ref="pageTable"
            @onDataLoad="onDataLoad"
            @pushData="pushData"
            :columns="columns"
            :dataList="dataList"
    >
    </page-table>

  </div>
</template>

<script>
  import Modal from "./Modal";
  import classChildModal from "./classChildModal";
export default {
  name: "EditPointsDialog",
  props: ["extra"],
  data: function() {
    return {
      dataList: [],
      columns: [
        {
          title: '#ID',
          key: 'id',
          align: 'center',
          fixed: 'left',
          minWidth:80,
          tree: true,
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth:150,
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
            let arr=[
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
            ]
            if(params.row.level==3)arr.splice(0,1)
            return h('div', arr)
          },
        },
      ],

    };
  },
  mounted() {
    console.log(this.extra)
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
      let that=this
      this.$dialog.open({
        title:that.extra.name+' 》 '+params.row.name,
        resizable: true,
        component: classChildModal,
        height: 760,
        width: 900,
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
      console.log(params)
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: Modal,
        height: 500,
        width: 500,
        extra: params?params.row:{
          level:this.extra.level+1,
          f_calss_id:this.extra.id
        },
        btn: ["确定", "取消"],
        onDismiss: index => {
          if (index === 0) {
            this.refreshCurrent();
            return true;
          }
        }
      });
    },
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
      options.level=this.extra.level+1
      options.f_calss_id=this.extra.id
      console.log(this.extra)
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
    }
  }
};
</script>

<style scoped="">
.container {
  margin: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.page-table{
  padding: 15px 0;
}
</style>
