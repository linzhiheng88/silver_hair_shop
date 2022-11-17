<template>
  <div>
    <my-header  :breadcrumbList="['活动商品']"></my-header>
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
  import addActivityGoodModal from "./components/addActivityGoodModal";
  export default {
    components: {},
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
            width:100,
            render: (h, params) => {
              return h('div',params.row.activity_good.id)
            }
          },
          {
            title: '商品图片',
            key: 'images',
            align: 'center',
            width:100,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.images[0],
                    previewSrcList:params.row.images
                  },
                  style: {
                    width: '35px'
                  }
                }),
              ]);
            }
          },
          {
            title: '商品名称',
            key: 'name',
            align: 'center',
            minWidth:300,
            tooltip: true
          },
          {
            title: '适用行业包',
            key: 'industryPackage',
            align: 'center',
            minWidth:400,
            render: (h, params) => {
              let str=''
              for(let i in params.row.industryPackage){
                if(str!='')str+='，'
                str+=params.row.industryPackage[i]
              }
              return h('div',{
              },str)
            }
          },

          {
            title: '上下架状态',
            key: 'name',
            align: 'center',
            minWidth:150,
            render: (h, params) => {
              return h('div',{
                style: {
                  color: params.row.shelves==0?'red':'green',
                },
              },params.row.shelves==1?'上架':'已下架')
            }
          },
          {
            title: '是否删除',
            key: 'name',
            align: 'center',
            minWidth:150,
            render: (h, params) => {
              return h('div',{
                style: {
                  color: params.row.enable==1?'red':'green',
                },
              },params.row.enable==0?'正常':'已删除')
            }
          },
          {
            title: '权重',
            key: 'index',
            align: 'center',
            width:120,
            render: (h, params) => {
              return h('div',params.row.activity_good.index)
            }
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
        extra.activity_id=this.$route.params.activity_id
        this.$dialog.open({
          title: '添加活动商品',
          resizable: true,
          component: addActivityGoodModal,
          height: 600,
          width: 800,
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
              url:'/activity/delGood/'+params.row.activity_good.id,
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
        options.activity_id=this.$route.params.activity_id
        const result = await this.$request({
          url:'/activity/goodList/'+options.page+'/'+options.pageSize,
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
