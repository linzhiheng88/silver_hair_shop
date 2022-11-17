<template>
  <div>
    <my-header :breadcrumbList="['阿里巴巴商品管理']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :addString="addString" :showSelect="false"  @searchClick="doSearch" @selectClick="doSelect"></condition>
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
import alibabaGoogInfoModal from "./components/alibabaGoogInfoModal";
export default {
  name: 'Alibaba',
  data: function () {
    return {
      keyword: '',
      state:-1,
      dataList: [],
      columns: [
        {
          title: '#id',
          key: 'id',
          align: 'center',
          fixed: 'left',
          minWidth:80,
        },
        {
          title: '商品库名称',
          key: 'title',
          align: 'center',
          minWidth:80,
        },
        {
          title: '商品数量',
          key: 'feedCount',
          align: 'center',
          minWidth:200,
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          minWidth:100,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:100,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  type: 'primary',
                },
                style: {
                  // marginRight: '10px',
                },
                on: {
                  click: () => this.addOrEditModal(params)
                }
              }, '查看商品'),
            ])
          },
        },
      ],

      addString:'同步',
    }
  },

  async mounted() {
    this.syncProgress()
  },
  methods: {
    //获取同步进度
    async syncProgress(){
      const that=this
      const result = await this.$request({
        url: '/alibaba/syncProgress',
        method: 'get',
      })
      if(result.code&&result.data.status==1){
        this.addString='正在同步'+result.data.progress
        setTimeout(function () {
          that.syncProgress()
        },3000)
      }else {
        this.addString='同步'
      }
    },

    //添加或编辑
    async addOrEditModal(params) {
      if(params){
        this.$router.push({
          path:`alibabaGood/${params.row.id}?title=`+params.row.title,
        })
      }else {
        // this.$Message.warning('功能完善中...')
        this.$dialog.confirm({
          message: '是否确定同步商品？',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/alibaba/syncGood',
              method: 'post',
              data:{}
            })
            if (result.code == 200) {
              this.$Message.success('开始同步');
              this.syncProgress();

              this.refreshCurrent();
              return true;
            } else if(result.code == 516){
              this.$Message.warning('正在同步中');
            }else {
              this.$Message.warning('同步失败');
            }
          }
        });
      }

      // this.$dialog.open({
      //   title: '商品详情',
      //   resizable: true,
      //   component: alibabaGoogInfoModal,
      //   height: 1000,
      //   width: 1200,
      //   extra: params?params.row:undefined,
      //   btn: ["确定", "取消"],
      //   onDismiss: index => {
      //     if (index === 0) {
      //       this.refreshCurrent();
      //       return true;
      //     }
      //   }
      // });
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
            url:'/newZoneGood/del/'+params.row.id,
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
        options.keyword = this.keyword;
      }
      const result = await this.$request({
        url:'/alibaba/groupList/'+options.page+'/'+options.pageSize,
        method:'post',
        data:options
      });
      callback(result);
    },

    refreshCurrent: function () {
      this.$refs.pageTable.loadData();
    },

    pushData(items){
      this.dataList =items;

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
