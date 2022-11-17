<template>
  <div>
    <my-header  :breadcrumbList="['推荐分类']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :industryPackageAuto="true" :industryPackageDefault="true" @industryPackageClick="industryPackageClick" @searchClick="doSearch"></condition>
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
  import classModal from "./components/classModal";
  export default {
    components: {},
    name: 'Users',
    data: function () {
      return {
        keywordObj:{
          industry_package_id:null,
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
            title: '名称',
            key: 'name',
            align: 'center',
            minWidth:200,
          },
          {
            title: '权重',
            key: 'index',
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
        let myParams=params?params.row:{}
        if(this.keywordObj.industry_package_id)myParams.industry_package_id=this.keywordObj.industry_package_id
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: classModal,
          height: 380,
          width: 600,
          extra: myParams,
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
              url:'/activity/classdel/'+params.row.id,
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
        if(this.keywordObj.industry_package_id){
          options.industry_package_id=this.keywordObj.industry_package_id
        }
        const result = await this.$request({
          url:'/activity/classlist/'+options.page+'/'+options.pageSize,
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
        this.keywordObj.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      industryPackageClick(industry_package_id){
        this.keywordObj.industry_package_id=industry_package_id
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
