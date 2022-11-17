<template>
  <div>
    <my-header :breadcrumbList="['配置']"></my-header>
    <div class="page-body-main">

      <div class="page-body-main-content">
        <Button style="width: 200px;margin: 40px 0;" type="primary" @click="clearSys">清除缓存</Button>
      </div>
<!--      <condition @addClick="addOrEditModal" :showSelect="true" @searchClick="doSearch" @selectClick="doSelect"></condition>-->
<!--      <page-table-->
<!--        ref="pageTable"-->
<!--        @onDataLoad="onDataLoad"-->
<!--        @pushData="pushData"-->
<!--        :columns="columns"-->
<!--        :dataList="dataList"-->
<!--      >-->
<!--      </page-table>-->
    </div>
  </div>
</template>
<script>
import Modal from "./components/Modal";
export default {
  name: 'Demo',
  data: function () {
    return {

    }
  },
  methods: {

    clearSys(){
      this.$dialog.confirm({
        message: '是否清除系统缓存？',
        width: 300,
        height:200,
        onBtn: async index => {
          if (index !== 0) return true;
          let result = await this.$request({
            url:'/clearSys',
            method: 'GET'
          })
          if (result.code == 200) {
            this.$Message.success('清除成功');
            return true;
          } else {
            this.$Message.info('清除失败');
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

<style scoped lang="scss">
  .page-body-main-content {
    padding: 15px;
    background: #ffffff;
  }
</style>
