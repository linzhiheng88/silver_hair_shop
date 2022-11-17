<template>
  <div>
    <my-header  :breadcrumbList="['商户管理']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :weappDefault="true" :weappAuto="true" :showSelect="false" @weappClick="weappClick" @searchClick="doSearch" @selectClick="doSelect">

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
    name: 'Banner',
    data: function () {
      return {
        keywordObj: {
          keyword: '',
          weapp_id:null,
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
            title: '名称',
            key: 'name',
            minWidth:200,
            align: 'center'
          },
          {
            title: '账号',
            key: 'username',
            minWidth:200,
            align: 'center',
            render:(h,params)=>{
              return h('div',params.row.admin.username)
            }
          },
          {
            title: '创建时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.create_time).dateTime)
            }
          },
          {
            title: '修改时间',
            minWidth:170,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.update_time).dateTime)
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

    async created() {


    },

    methods: {


      //添加或编辑
      async addOrEditModal(params) {

        let data=params?params.row: {}
        data['weapp_id']=this.keywordObj.weapp_id
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: Modal,

          height: 650,
          width: 700,
          extra: data,
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
              url:'/shop/del/'+params.row.id,
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
        if (this.keywordObj.keyword) {
          options.keyword = [
            {name:this.keywordObj.keyword},
          ];
        }
        if(this.keywordObj.type)options.type=this.keywordObj.type;
        if(this.keywordObj.weapp_id)options.weapp_id=this.keywordObj.weapp_id;
        if(this.keywordObj.industry_package_id)options.weapp_id=this.keywordObj.industry_package_id;
        const result = await this.$request({
          url:'/shop/list/'+options.page+'/'+options.pageSize,
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
      weappClick(weapp_id){
        this.keywordObj.weapp_id=weapp_id

        this.$refs.pageTable.reload();
      },
      doSearch(keyword){
        this.keywordObj.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      doSelect(type){
        this.keywordObj.type=type
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
