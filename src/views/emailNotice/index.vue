<template>
  <div>
    <my-header  :breadcrumbList="['邮件通知管理']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="false" @searchClick="doSearch" @selectClick="doSelect">
        <i-select @on-change="selectClick" placeholder="通知类型" size="large" style="width:200px;margin-right: 10px;" v-model="keywordObj.type">
          <i-option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
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
    name: 'Users',
    data: function () {
      return {
        keywordObj:{
          type:1,
          keyword:''
        },
        state:-1,
        dataList: [],
        typeList:[{label:'订单通知',value:1},{label:'客服通知',value:2}],
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
            title: '邮箱',
            key: 'email',
            minWidth:200,
            align: 'center'
          },
          // {
          //   title: 'LOGO封面',
          //   key: 'images',
          //   align: 'center',
          //   minWidth:100,
          //   render: (h, params) => {
          //     return h('div', [
          //       h('img', {
          //         attrs: {
          //           src: params.row.images
          //         },
          //         style: {
          //           width: '35px'
          //         }
          //       }),
          //     ]);
          //   }
          // },

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
              url:'/emailNotice/del/'+params.row.id,
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
            {email:this.keywordObj.keyword},
          ];
        }
        if(this.keywordObj.type){
          options.type=this.keywordObj.type
        }
        const result = await this.$request({
          url:'/emailNotice/list/'+options.page+'/'+options.pageSize,
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
      selectClick(){
        this.$refs.pageTable.reload();
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
