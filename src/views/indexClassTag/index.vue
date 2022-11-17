<template>
  <div>
    <my-header  :breadcrumbList="['首页分类标签']"></my-header>
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
  import Modal from "./components/Modal";
  export default {
    components: {Modal},
    name: 'Users',
    data: function () {
      return {
        keywordObj: {
          keyword:'',
          industry_package_id:null
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
            title: '类型',
            key: 'type',
            align: 'center',
            minWidth:200,
            render: (h, params) => {
              return h('div',params.row.type==1?'搜全部':params.row.type==2?'搜关键字':'搜分类ID')
            }
          },

          {
            title: '关键字',
            align: 'center',
            minWidth:150,
            render: (h, params) => {
              return h('div',params.row.keyword||'-')
            }
          },
          {
            title: '分类ID',
            key: 'class_id',
            align: 'center',
            minWidth:150,
            render: (h, params) => {
              return h('div',params.row.class_id||'-')
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

      seeGood(params){
        this.$router.push('tag/good?name='+params.row.name)
      },

      async violationChange(params){
        let violation = params.row.violation == 1 ? 0 : 1
        let result = await this.$request({
          url: '/indexClassTag/violation/' + params.row.id + '/' + violation,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].violation = violation
          this.$Message.success('设置成功');
        }
      },


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
              url:'/indexClassTag/del/'+params.row.id,
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
            {name:this.keywordObj.keyword}, {class_id:this.keywordObj.keyword}, {keyword:this.keywordObj.keyword},
          ];
        }
        if(this.keywordObj.industry_package_id)options.industry_package_id=this.keywordObj.industry_package_id;
        const result = await this.$request({
          url:'/indexClassTag/list/'+options.page+'/'+options.pageSize,
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
