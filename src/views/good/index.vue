<template>
  <div>
    <my-header :breadcrumbList="['普通商品']"></my-header>
    <div class="page-body-main">
      <condition @addClick="addOrEditModal" :industryPackageAuto="true" @industryPackageClick="industryPackageClick" selectPlaceholder="进货平台" searchPlaceholder="ID、名称、标签" :showSelect="true" :selectList="platformList" @searchClick="doSearch"
                 @selectClick="doSelect">
        <Cascader v-model="keywordObj.class_ids" @on-visible-change="classVisibleClick" style="margin-bottom: 15px;width:300px;margin-right: 10px;" :data="classList" size="large" placeholder="分类" change-on-select></Cascader>
        <i-select @on-change="selectClick" clearable placeholder="是否置顶" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.placed_top">
          <i-option v-for="item in placedTopList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
        <i-select @on-change="selectClick" clearable placeholder="是否上架" size="large" style="width:180px;margin-bottom: 15px;margin-right: 10px;" v-model="keywordObj.shelves">
          <i-option v-for="item in shelvesList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
        <i-select @on-change="selectClick" clearable placeholder="是否参与秒杀" size="large" style="width:180px;margin-bottom: 15px;margin-right: 10px;" v-model="keywordObj.seconds_kill">
          <i-option v-for="item in secondsKillList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
        <i-select @on-change="selectClick" clearable placeholder="是否参与拼团" size="large" style="width:180px;margin-bottom: 15px;margin-right: 10px;" v-model="keywordObj.spell_group">
          <i-option v-for="item in spellGroupList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
        <i-select @on-change="selectClick" clearable placeholder="是否分销" size="large" style="width:180px;margin-bottom: 15px;margin-right: 10px;" v-model="keywordObj.distribution">
          <i-option v-for="item in distributionList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
        <i-select @on-change="selectClick('shop_id')" :disabled="$store.state.userInfo.shop_id>0" clearable placeholder="商户" size="large" style="width:180px;margin-right: 10px;" v-model="keywordObj.shop_id">
          <i-option v-for="item in shopList" :value="item.value" :key="item.value">{{item.label}}</i-option>
        </i-select>
        <div style="margin-right:10px ">
          <i-input size="large" clearable v-model="keywordObj.priceMin" prefix="logo-usd" placeholder="价格 min" style="width: 120px" /> -
          <i-input size="large" clearable v-model="keywordObj.priceMax" prefix="logo-usd" placeholder="价格 max" style="width: 120px" />
        </div>

        <i-button type="warning" size="large" ghost  class="button" @click="editPricingProfitsClick">批量修改定价利润</i-button>

        <div class="sort-div">
          <div class="li" v-for="item in [{label:'默认',value:0},{label:'价格',value:1},{label:'销量',value:2}]" @click="sortClick(item.value)">
            <div class="name no-select" :style="(keywordObj.valueSort==2*item.value-1||keywordObj.valueSort==2*item.value)?'color:#2d8cf0':''">{{item.label}}</div>
            <div class="jt-box" v-if="item.value>0">
              <div class="t-jt" :style="keywordObj.valueSort==2*item.value-1?'border-bottom-color:#2d8cf0':''"></div>
              <div class="b-jt" :style="keywordObj.valueSort==2*item.value?'border-top-color:#2d8cf0':''"></div>
            </div>
          </div>
        </div>

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
  import spellGroupEditModal from "./components/spellGroupEditModal";

  import pricingProfitsModal from "./components/pricingProfitsModal";

  export default {
    components: {Modal},
    name: 'good',
    data: function () {
      return {
        keywordObj: {
          keyword: '',
          industry_package_id:null,
          platform_id: null,
          shop_id: null,
          seconds_kill:null,
          spell_group:null,
          placed_top: null,
          shelves: null,
          distribution:null,
          priceMin:'',
          priceMax:'',
          valueSort:-1,
          class_ids:[]
        },
        searchOptions:{},
        platformList:[],
        classList:[],
        placedTopList:[
          {
            value:1,
            label:'置顶'
          },
          {
            value:0,
            label:'非置顶'
          }
        ],
        shelvesList:[
          {
            value:1,
            label:'上架'
          },
          {
            value:0,
            label:'下架'
          }
        ],
        secondsKillList:[
          {
            value:1,
            label:'秒杀'
          },
          {
            value:0,
            label:'不秒杀'
          }
        ],
        spellGroupList:[
          {
            value:1,
            label:'拼团'
          },
          {
            value:0,
            label:'不拼团'
          }
        ],
        distributionList:[
          {
            value:1,
            label:'分销'
          },
          {
            value:0,
            label:'不分销'
          }
        ],
        shopList:[],
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
            minWidth: 80,
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
            title: '分类',
            align: 'center',
            minWidth: 220,
            tooltip: true,
            render: (h, params) => {
              let name='';
              if(params.row.good_classes){
                for (let i in params.row.good_classes){
                  if(name!='')name+='-';
                  name+=(params.row.good_classes[i].class.name)
                }
              }
              return h('div',name)
            }
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
            title: '阿里巴巴ID',
            key: 'index',
            align: 'center',
            minWidth: 130,
            render: (h, params) => {
              return h('div',[
                h('div', {
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer',
                  },
                  on: {
                    click: () => this.goAlibabaUrl(params.row)
                  }
                }, params.row.alibaba_good_id||'-'),
              ])
            }
          },

          {
            title: '销售价格(Min)',
            key: 'price',
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
            title: '定价利润',
            key: 'pricing_profits',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h('div',params.row.pricing_profits+' %')
            }
          },
          {
            title: '运费',
            key: 'pricing_freight',
            align: 'center',
            minWidth: 80,
          },
          {
            title: '限购数量',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h('div',params.row.limit_number>0?params.row.limit_number:'不限购')
            }
          },
          {
            title: '权重',
            key: 'index',
            align: 'center',
            minWidth: 100,
          },

          {
            title: '商户',
            key: 'shop',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h('div',params.row.shop.name||'-')
            }
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
            align: 'center',
            minWidth: 100,
            render:(h,params)=>{
              return h('div',params.row.cash_on_delivery == 1 ? '支持' : '-')
            }
          },
          {
            title: '价格锁定',
            align: 'center',
            minWidth: 70,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    // size: 'large',
                    trueColor:"#97b9ff",
                    value: params.row.price_lock == 1 ? true : false
                  },
                  on: {
                    'on-change': (value) => this.priceLockTop(params)
                  }
                }),
              ])
            }
          },
          {
            title: '置顶状态',
            align: 'center',
            minWidth: 70,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    // size: 'large',
                    trueColor:"#13ce66",
                    value: params.row.placed_top == 1 ? true : false
                  },
                  on: {
                    'on-change': (value) => this.placedTop(params)
                  }
                }),
              ])
            }
          },
          {
            title: '参与秒杀',
            align: 'center',
            minWidth: 70,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    // size: 'large',
                    trueColor:"#ff4949",
                    value: params.row.seconds_kill == 1 ? true : false
                  },
                  on: {
                    'on-change': (value) => this.secondsKillChange(params)
                  }
                }),
              ])
            }
          },
          {
            title: '参与拼团',
            align: 'center',
            minWidth: 120,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    trueColor:"#D89C3D",
                    value: params.row.spell_group == 1 ? true : false
                  },
                  on: {
                    'on-change': (value) => this.spellGroupChange(params)
                  }
                }),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'warning',
                  },
                  style: {
                    marginLeft: '10px',
                  },
                  on: {
                    click: () => this.spellGroupEditModal(params)
                  }
                }, '价格'),
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
            width: 190,
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
                    click: () => this.addOrEditModal(params)
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'primary',
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => this.goComment(params)
                  }
                }, '评价'),
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
    async created() {
      const platformResult = await this.$request({
        url: '/platform/list/1/999',
        method: 'POST',
      });
      this.platformList=platformResult.data.rows.map(item=>{
        return {
          value:item.id,
          label:item.name
        }
      })

      let shopResult=await this.$store.dispatch('getShop',this.$store.state.userInfo.weapp)
      this.shopList=shopResult.map(item=>{
        return {
          label:item.name,
          value:item.id
        }
      })

      const result = await this.$request({
        url: '/class/all',
        method: 'get',
      });
      this.classList = result.data.map(item=>{
        let children=item.children.map(s_item=>{
          let s_children=s_item.children.map(ss_item=>{
            return {
              value: ss_item.id,
              label: ss_item.name,
            }
          })
          return {
            value: s_item.id,
            label: s_item.name,
            children: s_children
          }
        })
        return {
          value: item.id,
          label: item.name,
          children: children
        }
      })
      console.log(this.classList)



    },
    methods: {
      editPricingProfitsClick(){
        this.$dialog.open({
          title:'批量修改定价利润',
          resizable: true,
          component: pricingProfitsModal,
          height: 250,
          width: 400,
          extra:this.searchOptions,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },
      sortClick(sort){
        if(sort==1){
          this.keywordObj.valueSort=this.keywordObj.valueSort==1?2:1
        }else if(sort==2){
          this.keywordObj.valueSort=this.keywordObj.valueSort==3?4:3
        }else {
          this.keywordObj.valueSort=-1
        }
        this.$refs.pageTable.reload();
      },


      goAlibabaUrl(item){
        if(item.alibaba_good_id){
          // window.open(`https://detail.1688.com/offer/${item.alibaba_good_id}.html`, '_blank');
          this.$router.push('/epShop/goodDetail/'+item.alibaba_good_id)
        }

      },

      selectClick(){
        this.$refs.pageTable.reload();
      },
      classVisibleClick(data){
        let that=this
        console.log("data,"+data)
        if(data==false){
          setTimeout(function () {
            console.log(that.keywordObj.class_ids)
            that.$refs.pageTable.reload();
          },200)
        }

      },
      handleCopy(params) {
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
      //价格锁定
      async priceLockTop(params){
        let price_lock = params.row.price_lock == 1 ? 0 : 1
        let result = await this.$request({
          url: '/good/priceLock/' + params.row.id + '/' + price_lock,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].price_lock = price_lock
          this.$Message.success('设置成功');
        }
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
      //秒杀
      async secondsKillChange(params){
        let seconds_kill = params.row.seconds_kill == 1 ? 0 : 1
        let result = await this.$request({
          url: '/good/secondsKill/' + params.row.id + '/' + seconds_kill,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].seconds_kill = seconds_kill
          this.$Message.success('设置成功');
        }
      },
      //拼团
      async spellGroupChange(params){
        let spell_group = params.row.spell_group == 1 ? 0 : 1
        let result = await this.$request({
          url: '/good/spellGroup/' + params.row.id + '/' + spell_group,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].spell_group = spell_group
          this.dataList[params.index].spell_group_good = result.data
          this.$Message.success('设置成功');
        }
      },
      //置顶
      async placedTop(params) {
        let placed_top = params.row.placed_top == 1 ? 0 : 1
        let result = await this.$request({
          url: '/good/placedTop/' + params.row.id + '/' + placed_top,
          method: 'get',
        })
        if (result.code == 200) {
          this.dataList[params.index].placed_top = placed_top
          this.$Message.success('设置成功');
        }
      },

      goComment(params){
        this.$router.push({
          path: 'comments?good_id='+params.row.id,
        })
      },
      async spellGroupEditModal(params){
        let item=params.row
        console.log(item)
        let extra={
          good_id:item.id,
          name:item.name,
          preferential_price:item.spell_group_good?item.spell_group_good.preferential_price:0
        }
        this.$dialog.open({
          title:'修改拼团价格',
          resizable: true,
          component: spellGroupEditModal,
          height: 300,
          width: 600,
          extra:extra,
          btn: ["确定", "取消"],
          onDismiss: index => {
            if (index === 0) {
              this.refreshCurrent();
              return true;
            }
          }
        });
      },

      //添加或编辑
      async addOrEditModal(params) {
        console.log(params)
        let url = 'add'
        let query={
          type:1
        }
        if (params) {
          query.id=params.row.id
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

        if(this.keywordObj.priceMin)options.priceMin=this.keywordObj.priceMin;
        if(this.keywordObj.priceMax)options.priceMax=this.keywordObj.priceMax;
        if(this.keywordObj.valueSort>0)options.valueSort=this.keywordObj.valueSort;
        if(this.keywordObj.platform_id)options.platform_id=this.keywordObj.platform_id;
        if(this.keywordObj.shop_id)options.shop_id=this.keywordObj.shop_id;
        if(this.keywordObj.industry_package_id)options.industry_package_id=this.keywordObj.industry_package_id;
        if(this.keywordObj.shelves!=null)options.shelves=this.keywordObj.shelves;
        if(this.keywordObj.placed_top!=null)options.placed_top=this.keywordObj.placed_top;
        if(this.keywordObj.seconds_kill!=null)options.seconds_kill=this.keywordObj.seconds_kill;
        if(this.keywordObj.spell_group!=null)options.spell_group=this.keywordObj.spell_group;
        if(this.keywordObj.distribution!=null)options.distribution=this.keywordObj.distribution;
        options.class_ids=this.keywordObj.class_ids
        this.searchOptions=options
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
        this.dataList = items;
      },
      doSearch(keyword) {
        this.keywordObj.keyword = keyword;
        this.$refs.pageTable.reload();
      },
      doSelect(state) {
        this.keywordObj.platform_id = state
        this.$refs.pageTable.reload();
      },
      industryPackageClick(value){
        this.keywordObj.industry_package_id = value
        this.$refs.pageTable.reload();
      }
    },
  }
</script>

<style scoped lang="scss">
.sort-div{
  display: flex;
  align-items: center;
  width: 200px;
  border: 1px solid #dcdee2;
  height: 40px;
  box-sizing:border-box;
  border-radius: 4px;
  margin-right: 10px;
  .li{
    width: 50%;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-right: 1px solid #dcdee2;
    &:last-child{
      border-right: none;
    }
    .name{
      cursor: pointer;
      font-size: 16px;
    }
    .jt-box{
      width: 8px;
      height: 30px;
      position: relative;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      flex-wrap: wrap;
      margin-left: 6px;
      cursor: pointer;
      .t-jt{
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid #CCCCCC;
        margin-bottom: 3px;
      }
      .b-jt{
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid #CCCCCC;
      }
    }
  }
}


</style>
