<template>
  <div>
    <my-header :breadcrumbList="['新人专区']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" searchPlaceholder="ID、名称、标签" :industryPackageAuto="true" :industryPackageDefault="true" @industryPackageClick="industryPackageClick" @searchClick="doSearch"
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
    name: 'newZone',
    data: function () {
      return {
        keywordObj: {
          industry_package_id:null,
          keyword: '',
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
            title: '封面图',
            key: 'images',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('el-image', {
                  attrs: {
                    src: params.row.images[0],
                    previewSrcList:params.row.images
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
            key: 'name',
            align: 'center',
            minWidth: 200,
            tooltip: true
          },
          {
            title: '原价',
            key: 'old_price',
            align: 'center',
            minWidth: 100,
          },

          // {
          //   title: '展示销量',
          //   key: 'sales_show',
          //   align: 'center',
          //   minWidth: 100,
          // },
          {
            title: '实际销量',
            key: 'sales',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '平台',
            key: 'platform',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h('div',params.row.platform.name)
            }
          },
          {
            title: '权重',
            key: 'index',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '第三方URL',
            key: 'third_party_url',
            align: 'center',
            minWidth: 200,
            tooltip: true,
            render: (h, params) => {
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    overflow:'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  },
                  on: {
                    click: () => this.handleCopy(params)
                  }
                }, params.row.third_party_url),
              ])
            }
          },
          {
            title: '货到付款',
            key: 'cash_on_delivery',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '上下架状态',
            key: 'shelves',
            align: 'center',
            minWidth: 100,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    size: 'large',
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
        console.log(params)
        let url = 'add'
        let query={
          type:2
        }
        if(this.keywordObj.industry_package_id)query.industry_package_id=this.keywordObj.industry_package_id
        if (params) {
          query.id=params.row.id
          query.industry_package_id=params.row.industry_package_id
        }
        url+=''
        this.$router.push({
          path: url,
          query:query
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
        if (this.keywordObj.keyword) {
          options.keyword = [
            {id: this.keywordObj.keyword},
            {name: this.keywordObj.keyword},
            {tag: this.keywordObj.keyword},
          ];
        }
        options.type=2
        if(this.keywordObj.industry_package_id)options.industry_package_id=this.keywordObj.industry_package_id;
        // const result = await this.$request({
        //   url:'/good/phone/brand/list',
        //   method:'get',
        //   params:options
        // });
        const result = await this.$request({
          url: 'good/list/' + options.page + '/' + options.pageSize,
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
        for (let i in items) {
          items[i].platform_name = items[i].platform_id == 1 ? '自营' : items[i].platform_id == 2 ? '淘宝' : '京东'
          items[i].cash_on_delivery = items[i].cash_on_delivery == 1 ? '支持' : '-'

        }
        this.dataList = items;
      },
      doSearch(keyword) {
        this.keywordObj.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      doSelect(state) {
        this.state = state
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
