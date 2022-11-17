<template>
  <div>
    <my-header  :breadcrumbList="['打标签']"></my-header>
    <div class="page-body-main">
      <div class="condtion-body-main">
        <div class="search-wrapper">
          <i-select
            style="width: 600px"
            v-model="searchGoodId"
            filterable
            :remote-method="searchFunc"
            :loading="searchLoading">
            <Option v-for="(item, index) in searchResultList" :value="item.id" :key="index">{{item.name}}</Option>
          </i-select>
          <Button style="width: 100px;margin-left: 20px" type="info" @click="addTag">添加</Button>
        </div>

      </div>


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
    name: 'Users',
    data: function () {
      return {
        keyword: '',
        searchGoodId:null,
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
            title: '封面图',
            key: 'images',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.images[0]
                  },
                  style: {
                    width: '35px'
                  }
                }),
              ]);
            }
          },
          {
            title: '最低价格',
            key: 'price',
            align: 'center',
            minWidth:100,
          },
          {
            title: '标签',
            key: 'tagName',
            align: 'center',
            minWidth:150,
            tooltip:true
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
            width:200,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'error',
                  },
                  on: {
                    click: () => this.deleteModal(params)
                  }
                }, '删除标签')
              ])
            },
          },
        ],

        searchLoading:false,
        searchResultList:[],
      }
    },
    methods: {

      async addTag(){
        if(!this.searchGoodId){
          this.$Message.warning('请选择商品');
          return false;
        }
        const result = await this.$request({
          url: '/tag/addGoodTag/'+this.searchGoodId+'/1',
          method: 'post',
          data:{
            tag:this.$route.query.name
          }
        });
        if(result.code==200){
          this.$Message.success('添加成功');
          this.searchGoodId=null;
          this.refreshCurrent();
        }
      },

      async searchFunc(data){
        console.log(data)
        if(data==''){return false}
        this.searchLoading = true;
        const result = await this.$request({
          url: '/good/search',
          method: 'post',
          data:{
            keyword:[
              {
                name:data
              },
              {
                tag:data
              }
            ]
          }
        });
        this.searchResultList=result.data.map(item=>{
          return {
            id:item.id,
            name:item.name+' （ ¥'+item.price+'）'
          }
        })
        this.searchLoading = false;
      },

      //删除
      async deleteModal(params){
        this.$dialog.confirm({
          message: '是否删该商品的标签？',
          width: 300,
          height: 180,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url:'/tag/addGoodTag/'+params.row.id+'/2',
              method: 'POST',
              data:{
                tag:this.$route.query.name
              }
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
            {tag:this.keyword},
          ];
        }else {
          options.keyword=[]
        }
        options.keyword.push({name:this.$route.query.name},{tag:this.$route.query.name})
        const result = await this.$request({
          url:'/good/list/'+options.page+'/'+options.pageSize,
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
          items[i]['tagName']=items[i].tag.replace(/<@>/g, '，')
        }
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
