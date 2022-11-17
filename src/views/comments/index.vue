<template>
  <div>
    <my-header  :breadcrumbList="['商品分类']"></my-header>
    <div class="page-body-main">
      <condition
        @addClick="addOrEditModal"
        :showSearch="false"
        :show-add="$route.query.good_id?true:false"
        searchPlaceholder="请输入分类名称"
        @searchClick="doSearch"
        selectPlaceholder="类型" :showSelect="true" :selectList="typeList"
        @selectClick="doSelect">

      </condition>
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
  name: 'comments',
  data: function () {
    return {
      keyword: '',
      type:null,
      typeList:[
        {
          label:'用户评价',
          value:1
        },
        {
          label:'机器人评价',
          value:2
        }
      ],
      dataList: [],
      columns: [
        {
          title: '#ID',
          key: 'id',
          align: 'center',
          fixed: 'left',
          minWidth:100,
          tree: true,
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
           return  h('div',params.row.type==1?'用户评价':'机器人评价')
          }
        },
        {
          title: '用户ID',
          key: 'user_id',
          align: 'center',
          minWidth:100,
        },
        {
          title: '机器人ID',
          key: 'system_user_id',
          align: 'center',
          minWidth:100,
        },
        {
          title: '商品ID',
          key: 'good_id',
          align: 'center',
          minWidth:100,
        },
        {
          title: '评论内容',
          key: 'content',
          align: 'center',
          minWidth:200,
        },
        {
          title: '分数',
          key: 'score',
          align: 'center',
          minWidth:100,
        },

        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:160,
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
      let extra=params?params.row:{}
      extra.good_id=this.$route.query.good_id
      this.$dialog.open({
        title: params?"修改":'添加',
        resizable: true,
        component: Modal,
        height: 500,
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
            url:'/comments/del/'+params.row.id,
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
      if(this.type)options.type=this.type;
      if(this.$route.query.good_id)options.good_id=Number(this.$route.query.good_id);

      const result = await this.$request({
        url:'/comments/list/'+options.page+'/'+options.pageSize,
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
    },
    doSearch(keyword){
      this.keyword = keyword;
      this.$refs.pageTable.reload();
    },
    doSelect(type){
      this.type=type
      this.$refs.pageTable.reload();
    },
  },
}
</script>

<style scoped="">

</style>
