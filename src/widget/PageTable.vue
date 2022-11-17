<template>
  <div class="page-table">
    <i-table row-key="id" :data="dataList" @on-selection-change="selectionChange" ref="table" width="100%" border :columns="columns" :loading="loading"></i-table>
    <Page v-if="bottomPage" style="margin-top: 10px" :total="total" @on-change="changePage" @on-page-size-change="pageSizeChange"
          placement="top"
          :show-total="true"
          :show-sizer="true"
          :show-elevator="true"
          :current="page"
          :transfer="true"
          :disabled="disabled"
          :page-size="pagePageSize">
    </Page>
  </div>
</template>
<!--:show-sizer="true"-->
<script>
export default {
  name: 'PageTable',
  props: {columns:{}, onDataLoad:{}, pushData:{}, dataList:{}, bottomPage:{default:true},pageSize:{default:10},disabled:{default:false}},
  data: function () {
    return {
      loading: false,
      page: 1,
      total: 0,
      tableHeight:200,

      pagePageSize:10,
    }
  },
  methods: {
    pageSizeChange(data){
      console.log(data)
      this.pagePageSize=data
      this.loadData();

    },
    selectionChange(aa){
      console.log(aa);
      console.log("sssss");
    },
    loadData: function () {
      this.loading = true;
      let that = this;
      // this.page=1;
      this.$emit('onDataLoad', {page: this.page,pageSize:this.pagePageSize}, function (results) {
        console.log(results);
        if (results.data.count||results.data.count==0) {
          that.total = results.data.count;
        }
        if (results.code == 200) {
          that.$emit('pushData', results.data.rows)
        }
        that.loading = false;
      });
    },
    changePage: function (page) {
      console.log(page);
      this.page = page;
      this.loading = true;
      let that = this;
      this.$emit('onDataLoad', {page: this.page,pageSize:this.pagePageSize}, function (results) {
        if (results.data.count||results.data.count==0) {
          that.total = results.data.count;
        }
        if (results.code == 200) {
          that.$emit('pushData', results.data.rows)
        }
        // if (count) {
        //   that.total = count;
        // }
        // that.$emit('pushData', results.data.data||results.data);
        that.loading = false;
      });
    },
    reload: function () {
      this.page = 1;
      this.loadData();
    }
  },

  mounted(){
    this.loadData();
    var that=this

    that.pagePageSize=this.pageSize

    setTimeout(function () {
      console.log(that.$refs.table.$el.offsetTop);

      let tableHeight=window.innerHeight - that.$refs.table.$el.offsetTop - 125
      that.tableHeight = tableHeight//tableHeight<150?150:tableHeight
      window.onresize = () => {
        return (() => {
          let tableHeights=window.innerHeight - that.$refs.table.$el.offsetTop - 125
          that.tableHeight = tableHeights<150?150:tableHeights
        })();
      };
    },1)

  }
}
</script>

<style scoped lang="scss">

  .page-table{
    background: #ffffff;
    /*margin: 15px 15px 0;*/
    padding: 15px 30px;

  }



</style>
