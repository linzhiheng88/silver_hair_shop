<template>
  <div>
    <my-header  :breadcrumbList="['Banner管理']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :industryPackageAuto="true" :weappAuto="true" :selectList="[{label:'首页进入广告',value:1},{label:'首页背景图片',value:2},{label:'首页Banner图片',value:3}]" :showSelect="false" @industryPackageClick="industryPackageClick" @weappClick="weappClick" @searchClick="doSearch" @selectClick="doSelect">

        <i-select @on-change="selectClick('pay_type')" clearable placeholder="类型" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.type">
          <i-option v-for="item in [{label:'首页进入广告',value:1},{label:'首页背景图片',value:2},{label:'首页Banner图片',value:3},{label:'首页浮窗icon',value:4}]" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>

      </condition>
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
    name: 'Banner',
    data: function () {
      return {
        keywordObj: {
          keyword: '',
          type: 1,
          weapp_id:null,
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
            title: '行业包',
            key: 'index',
            minWidth:150,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.industry_package?params.row.industry_package.name:'-')
            }
          },
          {
            title: '平台',
            key: 'index',
            minWidth:150,
            align: 'center',
            render: (h, params) => {
              return h('div',params.row.weapp?params.row.weapp.name:'-')
            }
          },
          {
            title: '类型',
            key: 'type',
            align: 'center',
            minWidth:150,
            render: (h, params) => {
              return h('div',params.row.type==1?'首页进入广告':params.row.type==2?'首页背景图片':params.row.type==3?'首页Banner图片':'首页浮窗icon')
            }
          },
          {
            title: '权重',
            key: 'index',
            minWidth:100,
            align: 'center'
          },
          {
            title: '跳转链接',
            key: 'url',
            minWidth:200,
            align: 'center'
          },
          {
            title: '图片',
            key: 'images',
            align: 'center',
            minWidth:100,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.images,
                    previewSrcList:[params.row.images]
                  },
                  style: {
                    width: '40px'
                  },
                }),
              ]);
            }
          },
          {
            title: '是否违禁',
            key: 'violation',
            align: 'center',
            minWidth: 85,
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
                    value: params.row.is_show == 1 ? true : false
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
    computed:{
      industryPackageList:function () {
        return this.$store.state.industryPackageList.map(item=>{
          return {
            label:item.name,
            value:item.id
          }
        })
      }
    },
    async created() {


    },

    methods: {


      //添加或编辑
      async addOrEditModal(params) {
        let data=params?params.row: {}
        data['industryPackageList']=this.industryPackageList
        data['admin_weapp_id']=this.$store.state.userInfo.weapp
        this.$dialog.open({
          title: params?"修改":'添加',
          resizable: true,
          component: Modal,
          height: 600,
          width: 700,
          extra: data,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },
      async violationChange(params){
        let violation = params.row.violation == 1 ? 0 : 1
        let result = await this.$request({
          url: '/banner/violation/' + params.row.id + '/' + violation,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].violation = violation
          this.$Message.success('设置成功');
        }
      },
      //上下架
      async shelves(params) {
        console.log(params);
        let is_show = params.row.is_show == 1 ? 0 : 1
        let result = await this.$request({
          url: '/banner/isShow/' + params.row.id + '/' + is_show,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].is_show = is_show
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
              url:'/banner/del/'+params.row.id,
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
        if(this.keywordObj.type)options.type=this.keywordObj.type;
        if(this.keywordObj.weapp_id)options.weapp_id=this.keywordObj.weapp_id;
        if(this.keywordObj.industry_package_id)options.industry_package_id=this.keywordObj.industry_package_id;
        const result = await this.$request({
          url:'/banner/list/'+options.page+'/'+options.pageSize,
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

      selectClick(){
        this.$refs.pageTable.reload();
      },
      industryPackageClick(industry_package_id){
        this.keywordObj.industry_package_id=industry_package_id
        this.$refs.pageTable.reload();
      },
      weappClick(weapp_id){
        this.keywordObj.weapp_id=weapp_id
        this.$refs.pageTable.reload();
      },
      doSearch(keyword){
        this.keywordObj.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      doSelect(type){
        this.keywordObj.type=type
        this.$refs.pageTable.reload();
      },
    },
  }
</script>

<style scoped="">

</style>
