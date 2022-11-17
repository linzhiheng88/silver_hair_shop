<template>
  <div>
    <my-header :breadcrumbList="['demo']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="true" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
  name: 'Demo',
  data: function () {
    return {
      keywordObj:{
        keyword: '',
      },
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
          key: 'avaheadimgurltar',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.headimgurl
                },
                style: {
                  width: '35px'
                }
              }),
            ]);
          }
        },
        {
          title: '暱稱',
          key: 'nickname',
          align: 'center',
          minWidth:200,
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

  mounted() {
    let aa=[
      ["BeiMei_project_000ddb06-fca8-bcb4-5d0e-447e4b8bbed7","1992609","FuyMqRcKi_ZeIgsasnVQ3YfUErtA","16103288616193043","image/png"],
      ["BeiMei_project_00165ad7-ff8c-c4ad-4bc5-40802981bdcd",344940,"FnDq_p9XMQxq-y26NkVIW_7PsEY3",15838237783542580,"image/jpeg"],
      ["BeiMei_project_002530a0-7f9c-fead-5fb2-57a5b623516d",47725,"Fi-xEziq1GTmf8NAfyZpm9wRgGRk",15780177665477804,"image/jpeg"],
      ["BeiMei_project_00557bfc-80e1-26c3-fdcb-1c9078da1198",82445,"FlXmVvYtAu4KrDzcipVtJc2aJKru",15826909603503548,"image/png"]
    ]
  },



  methods: {



    //添加或编辑
    async addOrEditModal(params) {
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: Modal,
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
        height:200,
        onBtn: async index => {
          if (index !== 0) return true;
          let result = await this.$request({
            url:'/good/add/'+params.row.id,
            method: 'delete'
          })
          if (result.status == 1) {
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
      if (this.keywordObj.keyword) {
        options.keyword = [
          {openid:this.keywordObj.keyword},
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
      console.log(items);
      // this.dataList = items
    },
    doSearch(keyword){
      this.keywordObj.keyword = keyword;
      this.$refs.pageTable.reload();
    },
    doSelect(state){
      this.keywordObj.state=state
      this.$refs.pageTable.reload();
    },
  },
}
</script>

<style scoped="">

</style>
