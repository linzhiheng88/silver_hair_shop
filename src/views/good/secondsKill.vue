<template>
  <div>
    <my-header :breadcrumbList="['秒杀专区']"></my-header>
    <div class="page-body-main">
      <condition :industryPackageAuto="true" :industryPackageDefault="true" :showSearch="false" @industryPackageClick="industryPackageClick" @addClick="addOrEditModal" :showAdd="false" :showSelect="false" @searchClick="doSearch"
                 @selectClick="doSelect"></condition>
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
    name: 'secondsKill',
    data: function () {
      return {
        keywordObj:{
          keyword: '',
          industry_package_id:null
        },
        state: -1,
        dataList: [],
        columns: [
          {
            title: '#ID',
            key: 'id',
            align: 'center',
            fixed: 'left',
            minWidth: 80,
          },
          {
            title: '日期',
            minWidth:270,
            align: 'center',
            render: (h, params) => {
              return h('div',this.$utils.changeTimeDate(params.row.start_time).dateTime+'～'+this.$utils.changeTimeDate(params.row.end_time).dateTime)
            }
          },
          {
            title: '商品数量',
            minWidth:150,
            align: 'center',

            key:'secondsKillGoodCount',
            // render: (h, params) => {
            //   return h('div',params.row.seconds_kill_goods.length)
            // }
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
            title: '操作',
            key: 'action',
            align: 'center',
            width: 160,
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
      }
    },
    mounted() {
    },
    methods: {
      handleCopy(params) {
        // alert(1);
        this.copyData = params.row.third_party_url
        this.copy(this.copyData)
      },
      copy(data) {
        let url = data;
        let oInput = document.createElement('input');
        oInput.value = url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        console.log(oInput.value)
        document.execCommand("Copy"); // 执行浏览器复制命令
        this.$Message.success('复制成功');
        oInput.remove()
      },

      //上下架
      async shelves(params) {
        console.log(params);
        let shelves = params.row.shelves == 1 ? 0 : 1
        let result = await this.$request({
          url: '/good/shelves/' + params.row.id + '/' + shelves,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].shelves = shelves
          this.$Message.success('设置成功');
        }

      },

      //添加或编辑
      async addOrEditModal(params) {
        let url = 'secondsKill/secondsKillGood/'+params.row.id
        this.$router.push({
          path: url,
        })
      },
      //删除
      async deleteModal(params) {
        this.$dialog.confirm({
          message: '是否删除此数据？',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url: '/good/del/' + params.row.id,
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
        // if (this.keywordObj.keyword) {
        //   options.keyword = [
        //     {name: this.keywordObj.keyword},
        //     {tag: this.keywordObj.keyword},
        //   ];
        // }
        options.type=2
        // const result = await this.$request({
        //   url:'/good/phone/brand/list',
        //   method:'get',
        //   params:options
        // });
        if(this.keywordObj.industry_package_id)options.industry_package_id=this.keywordObj.industry_package_id
        const result = await this.$request({
          url: 'secondsKill/list/' + options.page + '/' + options.pageSize,
          method: 'post',
          data: options
        });
        callback(result);
      },

      refreshCurrent: function () {
        this.$refs.pageTable.loadData();
      },

      pushData(items) {
        console.log(items);
        this.dataList = items;
      },
      industryPackageClick(industry_package_id){
        this.keywordObj.industry_package_id=industry_package_id
        this.$refs.pageTable.reload();
      },
      doSearch(keyword) {
        this.keywordObj.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      doSelect(state) {
        this.state = state
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
