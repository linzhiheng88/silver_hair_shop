<template>
  <div>
    <my-header :breadcrumbList="['秒杀专区','查看商品']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :showSelect="false" @searchClick="doSearch"
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
  import addSecondsKillGoodModal from "./components/addSecondsKillGoodModal";
  import Modal from "../tag/components/Modal";

  export default {
    components: {addSecondsKillGoodModal},
    name: 'newZone',
    data: function () {
      return {
        keyword: '',
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
            title: '封面图',
            key: 'images',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.good.images[0],
                    previewSrcList:params.row.good.images
                  },
                  style: {
                    width: '35px'
                  },
                }),
              ]);
            }
          },
          {
            title: '名称',
            align: 'center',
            minWidth: 200,
            render: (h, params) => {
              return h('div',params.row.good.name)
            }
          },
          {
            title: '优惠金额',
            key: 'preferential_price',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '秒杀库存',
            key: 'stock',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '销量',
            key: 'sales',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '权重',
            key: 'index',
            align: 'center',
            minWidth: 100,
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


      //添加或编辑
      async addOrEditModal(params) {
        console.log(params)

        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: addSecondsKillGoodModal,
          height: 880,
          width: 900,
          extra: params?params.row:{seconds_kill_id:this.$route.params.secondsKillId},
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
      async deleteModal(params) {
        this.$dialog.confirm({
          message: '是否删除此数据？',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url: '/secondsKill/gooddel/' + params.row.id,
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
            {name: this.keyword},
          ];
        }
        options.secondsKillId=this.$route.params.secondsKillId
        const result = await this.$request({
          url: '/secondsKill/good/' + options.page + '/' + options.pageSize,
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
      doSearch(keyword) {
        this.keyword = keyword;
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
