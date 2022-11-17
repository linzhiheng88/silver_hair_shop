<template>
  <div>
    <my-header :breadcrumbList="['行业商品包']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" @searchClick="doSearch"></condition>
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
import infoModal from "./components/infoModal";
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
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth:200,
        },
        // {
        //   title: '分类',
        //   key: 'classs',
        //   align: 'center',
        //   minWidth:550,
        //   tooltip: true,
        // },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:220,
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
                  click: () => this.showInfoModal(params)
                }
              }, '商品分类'),
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
  async mounted() {
    // const result = await this.$request({
    //   url: '/class/all',
    //   method: 'get',
    // });
  },
  methods: {
    async showInfoModal(params){
      this.$dialog.open({
        title: '商品分类',
        resizable: true,
        component: infoModal,
        height: 1000,
        width: 1000,
        extra: params?params.row:undefined,
        btn: [ "关闭"],
        onDismiss: index => {
          if (index === 0) {

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
        height: 1000,
        width: 1000,
        extra: params?params.row:undefined,
        btn: ["确定", "取消"],
        onDismiss: index => {
          if (index === 0) {
            this.refreshCurrent();
            this.$store.dispatch('getIndustryPackage',true)
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
            url:'/industryPackage/add/'+params.row.id,
            method: 'delete'
          })
          if (result.status == 1) {
            this.$Message.success('刪除成功');
            this.$store.dispatch('getIndustryPackage',true)
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
      const result = await this.$request({
        url:'/industryPackage/list/'+options.page+'/'+options.pageSize,
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
      for(let i in items){
        let classs=''
        let itemClass=items[i].industry_package_classes
        for(let o in items[i].industry_package_classes){
          if(classs!='')classs+='，'
          classs+=items[i].industry_package_classes[o].class.level+':'+items[i].industry_package_classes[o].class.name
          if(items[i].industry_package_classes[o].class.shelves==0)classs+='(已下架)'
        }

        items[i]['classs']=classs
      }
      this.dataList = items
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
