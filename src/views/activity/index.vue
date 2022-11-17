<template>
  <div>
    <my-header  :breadcrumbList="['活动管理']"></my-header>
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
  import Modal from "./components/Modal";
  import utils from "@/utils/utils";
  export default {
    components: {Modal},
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
            minWidth:80,
          },
          {
            title: '名称',
            key: 'name',
            align: 'center',
            minWidth:200,
          },
          {
            title: '封面',
            key: 'images',
            align: 'center',
            minWidth:80,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.images,
                    previewSrcList:[params.row.images]
                  },
                  style: {
                    width: '35px'
                  },
                }),
              ]);
            }
          },
          {
            title: '背景颜色',
            key: 'background',
            align: 'center',
            minWidth:80,
            render: (h, params) => {
              return h('div',{
                style:{
                  width:'60px',
                  height:'30px',
                  margin: 'auto',
                  background:params.row.background
                }
              })
            }
          },
          {
            title: '活动链接（点击复制）',
            key: 'name',
            align: 'center',
            minWidth:320,
            render: (h, params) => {
              let url='/activityPages/pages/activity/index?activity_id='+params.row.id
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    overflow:'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color:'#2d8cf0'
                  },
                  on: {
                    click: () => this.$utils.copy(url)
                  }
                },url),
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width:280,
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
                    click: () => this.seeGood(params)
                  }
                }, '查看商品'),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'warning',
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => this.seeBox(params)
                  }
                }, '活动格子'),
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
      // handleCopy(url) {
      //   this.copyData = url
      //   this.copy(this.copyData)
      // },
      // copy(data) {
      //   let url = data;
      //   let oInput = document.createElement('input');
      //   oInput.value = url;
      //   document.body.appendChild(oInput);
      //   oInput.select(); // 选择对象;
      //   console.log(oInput.value)
      //   document.execCommand("Copy"); // 执行浏览器复制命令
      //   this.$Message.success('复制成功');
      //   oInput.remove()
      // },
      seeGood(params){
        this.$router.push('activity/good/'+params.row.id)
      },
      seeBox(params){
        this.$router.push('activity/box/'+params.row.id)
      },

      //添加或编辑
      async addOrEditModal(params) {
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: Modal,
          height: 600,
          width: 700,
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
              url:'/activity/del/'+params.row.id,
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
        options.type='activity';
        const result = await this.$request({
          url:'/activity/list/'+options.page+'/'+options.pageSize,
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
