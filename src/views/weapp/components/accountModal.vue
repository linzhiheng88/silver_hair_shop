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
import addAccountModal from "./addAccountModal";
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
          title: '账号',
          key: 'username',
          align: 'center',
          minWidth:150,
        },
        {
          title: '创建时间',
          minWidth:160,
          align: 'center',
          render: (h, params) => {
            return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
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
    //添加或编辑
    async addOrEditModal(params) {
      console.log(params)
      let that=this
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: addAccountModal,
        height: 400,
        width: 500,
        extra: params?params.row:{
          weapp_id:that.extra.id
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
            url:'/weapp/accountDel/'+params.row.id,
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
      options.weapp_id=this.extra.id
      const result = await this.$request({
        url:'/weapp/accountList/'+options.page+'/'+options.pageSize,
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
