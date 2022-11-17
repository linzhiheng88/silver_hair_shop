<template>
  <div>
    <my-header  :breadcrumbList="['活动管理']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" selectPlaceholder="选择分类" :industryPackageAuto="true" :industryPackageDefault="true" @industryPackageClick="industryPackageClick" :showSelect="true" :selectList="classActivityList" @searchClick="doSearch" @selectClick="doSelect"></condition>
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
  import Modal from "./components/themeModal";
  export default {
    components: {},
    name: 'Users',
    data: function () {
      return {
        keywordObj: {
          keyword: '',
          class_activity_id: null,
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
            title: '分类',
            key: 'name',
            align: 'center',
            minWidth:200,
            render: (h, params) => {
              return h('div',params.row.class_activity?params.row.class_activity.name:'-')
            }
          },
          {
            title: '权重',
            key: 'index',
            align: 'center',
            minWidth:100,
          },
          {
            title: '描述',
            key: 'describe',
            align: 'center',
            tooltip:true,
            minWidth:200,
          },
          {
            title: '推荐链接（点击复制）',
            key: 'name',
            align: 'center',
            minWidth:320,
            render: (h, params) => {
              let url=`/activityPages/pages/activity/theme?activity_id=${params.row.id}`
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
                    click: () => this.handleCopy(url)
                  }
                },url),
              ])
            }
          },
          {
            title: '上下架状态',
            key: 'shelves',
            align: 'center',
            minWidth: 85,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    // size: 'large',
                    value: params.row.shelves == 1 ? true : false
                  },
                  on: {
                    'on-change': (value) => this.shelves(params)
                  }
                }),
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width:260,
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
        classActivityList:[]
      }
    },
    async mounted() {

      // this.getClassList()

    },
    methods: {
      async getClassList(){
        const result = await this.$request({
          url:'/activity/classlist/1/999',
          method:'post',
          data:{
            industry_package_id:this.keywordObj.industry_package_id
          }
        });
        this.classActivityList=result.data.rows.map(item=>{
          return {
            value:item.id,
            label:item.name,
          }
        })
      },
      handleCopy(url) {
        // alert(1);
        this.copyData = url
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
      seeGood(params){
        this.$router.push('activity/good/'+params.row.id)
      },
      seeBox(params){
        this.$router.push('activity/box/'+params.row.id)
      },

      //添加或编辑
      async addOrEditModal(params) {
        let extra=params?params.row:{}
        extra.classActivityList=this.classActivityList
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: Modal,
          height: 600,
          width: 700,
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
      //上下架
      async shelves(params) {
        console.log(params);
        let shelves = params.row.shelves == 1 ? 0 : 1
        let result = await this.$request({
          url: '/activity/shelves/' + params.row.id + '/' + shelves,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].shelves = shelves
          this.$Message.success('设置成功');
        }
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
        if (this.keywordObj.keyword) {
          options.keyword = [
            {name:this.keyword},
          ];
        }
        if(this.keywordObj.class_activity_id){
          options.class_activity_id=this.keywordObj.class_activity_id
        }
        if(this.keywordObj.industry_package_id){
          options.industry_package_id=this.keywordObj.industry_package_id
        }
        options.type='theme';
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
        this.keywordObj.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      doSelect(state){
        this.keywordObj.class_activity_id=state
        this.$refs.pageTable.reload();
      },
      industryPackageClick(industry_package_id){
        this.keywordObj.industry_package_id=industry_package_id
        this.getClassList();
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
