<template>
  <div>
    <my-header :breadcrumbList="['商品','添加商品']"></my-header>
    <div class="page-body-main">
      <div class="page-body-main-content">
        <Form ref="form" :model="formData" :rules="rules" :label-width="120">
          <Divider orientation="left">复制商品</Divider>
          <Form-item label="选择复制商品">
            <Select
              style="width: 500px"
              v-model="searchGoodId"
              filterable
              :remote-method="searchFunc"
              :loading="searchLoading">
              <Option v-for="(item, index) in searchResultList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
            <Button style="width: 100px;margin-left: 20px" type="info" @click="copyGood">复制</Button>
            <Button v-if="formData.alibaba_good_id" style="width: 160px;margin-left: 20px" type="warning" @click="syncAll">重新同步阿里巴巴</Button>
          </Form-item>
          <Divider orientation="left">表单数据</Divider>
          <Form-item label="行业包" prop="industry_package_id" v-if="$route.query.type==2">
            <Select v-model="formData.industry_package_id"  style="width:500px">
              <Option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="名称" prop="name">
            <Input v-model="formData.name" style="width: 500px"/>
          </Form-item>

          <FormItem label="商品标签">
            <Tag v-for="(item,index) in tags"  size="large" :key="index" closable @on-close="closeTag(index)">
              {{item}}
            </Tag>
            <Button icon="ios-add" v-if="!tagIsinput" type="dashed" size="large" @click="tagIsinput=true">添加标签</Button>
            <div class="showinput" v-if="tagIsinput">
              <Input v-model="tagInputvalue"/>
              <Icon class="d" @click="addTag" type="ios-checkmark"/>
              <Icon class="c" @click="tagIsinput=false" type="ios-close"/>
            </div>
          </FormItem>
          <FormItem label="展示标签">
            <Tag v-for="(item,index) in labels"  size="large" :key="index" closable @on-close="closeShowLabel(index)">
              {{item}}
            </Tag>
            <Button icon="ios-add" v-if="!labelIsinput" type="dashed" size="large" @click="labelIsinput=true">添加标签</Button>
            <div class="showinput" v-if="labelIsinput">
              <Input v-model="labelInputvalue"/>
              <Icon class="d" @click="addShowLabel" type="ios-checkmark"/>
              <Icon class="c" @click="labelIsinput=false" type="ios-close"/>
            </div>
          </FormItem>

          <Form-item label="限购数量" prop="limit_number">
            <Input v-model="formData.limit_number" type="number" number style="width: 500px"/> （不填或填 0 代表不限购）
          </Form-item>

          <Form-item label="权重" prop="index">
            <InputNumber :max="9999999999" :min="0" style="width: 300px" v-model="formData.index"></InputNumber>（越大越靠前）
          </Form-item>

          <Form-item label="展示销量" prop="sales_show">
            <Input v-model="formData.sales_show" type="number" number style="width: 500px"/>
          </Form-item>
          <Form-item label="划线价">
            <Input v-model="formData.old_price" type="number" number style="width: 500px"/>
          </Form-item>

          <Form-item label="提示语" prop="label_tip">
            <Input v-model="formData.label_tip" style="width: 500px"/>
          </Form-item>
          <Form-item label="商品平台" prop="platform_id">
            <Select :disabled="$store.state.userInfo.weapp>0" v-model="formData.platform_id"  style="width:500px">
              <Option v-for="item in platformList" :disabled="($store.state.userInfo.weapp==0&&item.value==8)?true:false" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="商户" prop="shop_id" v-if="$store.state.userInfo.weapp!=0">
            <Select v-model="formData.shop_id"  style="width:500px">
              <Option v-for="item in shopList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
<!--          <Form-item label="分账比例" v-if="$store.state.userInfo.weapp!=0" prop="fashionable_proportion">-->
<!--            <InputNumber :max="100" :min="0" v-model="formData.fashionable_proportion" style="width: 500px"></InputNumber> %-->
<!--          </Form-item>-->

          <Form-item label="分销" prop="distribution">
            <i-switch  size="large" v-model="formData.distribution">
              <span slot="open">支持</span>
              <span slot="close">不</span>
            </i-switch>
          </Form-item>
          <Form-item label="分销佣金" prop="distribution_money" v-if="formData.distribution">
            <Input v-model="formData.distribution_money" type="number" number style="width: 500px"/>
          </Form-item>

          <Form-item label="第三方平台链接" prop="third_party_url">
            <Input v-model="formData.third_party_url" style="width: 500px"/>
          </Form-item>

          <Form-item label="货到付款" prop="cash_on_delivery">
            <i-switch  size="large" v-model="formData.cash_on_delivery">
              <span slot="open">支持</span>
              <span slot="close">不</span>
            </i-switch>
          </Form-item>

          <Form-item label="类目" prop="class">
            <div class="class-div">
              <div class="item">
                <div class="search">
                  <Input v-model="searchValue.one" @input="searchChange('one')" size="large" search placeholder="一级类目"/>
                </div>
                <div class="categoryGroup">
                  <div class="li" :class="{'cur':selectClass.oneId==item.id}"
                       v-for="item in oneClassListShow"
                       @click="selectClassClick('one',item.id,item.name)"
                  >
                    {{item.name}}
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="search">
                  <Input v-model="searchValue.two" @input="searchChange('two')" size="large" search placeholder="二级类目"/>
                </div>
                <div class="categoryGroup">
                  <div class="li" :class="{'cur':selectClass.twoId==item.id}"
                       v-for="item in twoClassListShow"
                       @click="selectClassClick('two',item.id,item.name)"
                  >
                    {{item.name}}
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="search">
                  <Input v-model="searchValue.three" @input="searchChange('three')" size="large" search placeholder="三级类目"/>
                </div>
                <div class="categoryGroup">
                  <div class="li" :class="{'cur':selectClass.threeId==item.id}"
                       v-for="item in threeClassListShow"
                       @click="selectClassClick('three',item.id,item.name)"
                  >
                    {{item.name}}
                  </div>
                </div>
              </div>
            </div>
          </Form-item>

          <FormItem label="评分" prop="score">
            <Rate v-model="formData.score" />
          </FormItem>

          <Form-item label="推荐内容">
            <Input v-model="formData.recommended" type="textarea" :rows="3" style="width: 500px"/>
          </Form-item>
          <Form-item label="评论标签">
            <Input v-model="formData.comment_tags" type="textarea" :rows="3" style="width: 500px"/>
          </Form-item>
          <FormItem label="使用说明" prop="use_images">
            <upload-image :imgLists="formData.use_images" @imageReturnData="useImagesFun" :count="20"></upload-image>
          </FormItem>

          <FormItem label="封面图" prop="images">
            <upload-image :imgLists="formData.images" @imageReturnData="coverImagesFun" :count="20"></upload-image>
          </FormItem>
          <FormItem label="详情图" prop="content">
            <upload-image :imgLists="formData.content" tip="建议上传尺寸：宽750，高度不规定" @imageReturnData="contentImagesFun" :count="20"></upload-image>
          </FormItem>
          <FormItem label="视频" prop="video">
            <upload-image type="video" :imgLists="formData.video?[formData.video]:[]" @imageReturnData="videoFun" :count="1"></upload-image>
          </FormItem>

          <Form-item label="运费" prop="pricing_freight">
            <Input v-model="formData.pricing_freight" type="number" number style="width: 500px"/>{{formData.platform_id==100?'（为同步第三方商品时自动增加到商品定价里面，非单独向用户收取的运费）':'（为运费陈本，非单独向用户收取的运费）'}}
          </Form-item>
          <Form-item label="定价利润" prop="pricing_profits" v-if="formData.platform_id==100||formData.platform_id==200">
            <InputNumber :max="100000" :min="0" style="width: 500px" v-model="formData.pricing_profits"></InputNumber> %（为同步第三方商品时，商品定价 = 商品成本价 × (1+定价利润)  ）
          </Form-item>

          <FormItem label="规格">
            <Button icon="ios-add" v-if="!isinput" type="dashed" size="large" @click="isinput=true">添加规格</Button>
            <div class="showinput" v-if="isinput">
              <Input v-model="inputvalue"/>
              <Icon class="d" @click="addSpec" type="ios-checkmark"/>
              <Icon class="c" @click="isinput=false" type="ios-close"/>
            </div>
            <div class="biglist" v-for="(itema,ida) in goods_spec" :key="ida">
              <div class="le">
                <div class="tag-input-box">
                  <Input v-model="itema.name"/>
<!--                  <i-Switch @on-change="imageAutoChange(ida)" size="large" style="width: 75px;margin: 0 5px;" v-model="itema.imageAuto">-->
<!--                    <span slot="open">配图</span>-->
<!--                    <span slot="close">不配</span>-->
<!--                  </i-Switch>-->
                  <div class="tag-close" @click="closeSpec(ida)">
                    <Icon class="c" type="ios-close"/>
                  </div>
                </div>
<!--                <Tag closable size="large" @on-close="closeSpec(ida)">-->
<!--                  -->
<!--                  {{ itema.name}}-->
<!--                </Tag>-->
              </div>
              <div class="ri">
<!--                <Tag v-for="(itemb,idb) in itema.good_spec_art" :key="idb" closable @on-close="closeLabel(ida,idb)">-->
<!--                  {{itemb.name}}-->
<!--                </Tag>-->
                <div style="display: flex;flex-wrap: wrap;">
                  <div class="tag-input-box" style="min-width:200px;margin-right: 5px;margin-bottom: 5px" v-for="(itemb,idb) in itema.good_spec_art" :key="idb">
                    <Input style="width: 200px;" v-model="itemb.name"/>
                    <upload-image v-if="itema.imageAuto" :imgLists="itemb.images?[itemb.images]:[]" :params="idb" style="justify-content: center;margin: 0 5px;" @imageReturnData="itemImagesFun" :width="40" :height="40" tip="" :count="1"></upload-image>
                    <div class="tag-close" @click="closeLabel(ida,idb)">
                      <Icon class="c" type="ios-close"/>
                    </div>
                  </div>
                </div>

                <Button icon="ios-add" type="dashed" size="small" v-if="!itema.show" @click="showLabelinput(ida)">新增标签
                </Button>
                <div class="showinput" v-if="itema.show">
                  <Input v-model="inputvalue"/>
                  <Icon class="d" @click="addLabel(ida)" type="ios-checkmark"/>
                  <Icon class="c" @click="hideLabelinput(ida)" type="ios-close"/>
                </div>
              </div>
            </div>

            <table class="tableaaa" v-if="good_spec_price.length>0">
              <tr>
                <th v-for="(itema,ida) in goods_spec" :key="ida">{{itema.title}}</th>
                <th style="width: 180px">商品编码：<Input style="width: 60%;" number @input="goodNoChange"/></th>
                <th style="width: 80px">封面图</th>
                <th style="width: 155px;">价格：<Input style="width: 70%;" number @input="priceChange"/></th>
                <th style="width: 155px;">成本价：<Input style="width: 60%;" number @input="priceCostChange"/></th>
                <th style="width: 155px;">库存：<Input style="width: 70%;" number @input="stockChange"/></th>
                <th>提示</th>
              </tr>
              <tr v-for="(itemb,idb) in good_spec_price" :key="idb">
                <td v-for="(itemc,idc) in itemb.keyname">{{itemc}}</td>
                <td><Input v-model="itemb.good_no" style="width: 100%"/></td>
                <td>
                  <upload-image :imgLists="itemb.images?[itemb.images]:[]" :params="idb" style="justify-content: center" @imageReturnData="itemImagesFun" :width="50" :height="50" tip="" :count="1"></upload-image>
                </td>
                <td><Input number v-model="itemb.spec_price"/></td>
                <td><Input number v-model="itemb.cost_price"/></td>
                <td>
                  <InputNumber style="width: 100%" :min="0" v-model="itemb.spec_stock"></InputNumber>
                </td>
                <td><Input v-model="itemb.label_tip" style="width: 100%"/></td>
              </tr>
            </table>
          </FormItem>
        </Form>

        <div class="button-div" style="padding-left: 80px">
          <Button style="width: 120px" @click="$router.back()">取消</Button>
          <Button style="width: 200px;margin-left: 20px" type="primary" :loading="buttonLoading" @click="submit">提交</Button>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
  import Modal from "./components/Modal";

  export default {
    components: {Modal},
    name: 'GoodDetail',
    data: function () {
      return {

        buttonLoading:false,
        searchGoodId:null,
        searchResultList:[],
        searchLoading:false,

        shopList:[],
        platformList:[],

        industryPackageList:[],

        isinput: false,
        inputvalue: '',

        categories: [{value: '11'}, {value: '2342'}],
        id: null,
        zhuanprice: false,
        formData: {
          type:null,
          name: '',
          sales_show:0,
          price:null,
          old_price:null,
          shop_id:null,

          industry_package_id:null,
          platform_id:null,
          third_party_url:'',
          label_tip:'',
          cash_on_delivery:false,
          content:[],
          images: [],
          video: '',
          recommended: '',
          score: 5,
          use_images: [],
          comment_tags: '',
          fashionable_proportion:0,
          distribution:false,
          distribution_money:null,
          pricing_profits:null,
          pricing_freight:null,
          label:'',
          limit_number:null
        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          sales_show: [
            {required: true,type:'number', message: '展示销量不能为空', trigger: 'blur'},
          ],
          old_price: [
            {required: true, message: '划线价不能为空', trigger: 'blur'},
          ],
          platform_id: [
            {required: true,type:'number', message: '请选择平台', trigger: 'change'},
          ],
          shop_id: [
            {required: true,type:'number', message: '请选择商户', trigger: 'change'},
            { type: 'number', min: 1, message: '请选择商户', trigger: 'change' }
          ],
          images:[
            {required: true,type:'array', message: '请上传封面图', trigger: 'change'},
            { type: 'array', max: 20,min:1, message: '请上传1～20张图片', trigger: 'change' }
          ],
          fashionable_proportion: [
            {required: true,type:'number', message: '分账比例不能为空', trigger: 'blur'},
          ],
          industry_package_id: [
            {required: true,type:'number', message: '行业包不能为空', trigger: 'change'},
          ],
          // pricing_profits: [
          //   {required: true,type:'number', message: '定价利润不能为空', trigger: 'blur'},
          // ],
          pricing_freight: [
            {required: true,type:'number', message: '运费不能为空', trigger: 'blur'},
          ],
        },
        good_spec_price: [],
        goods_spec: [],
        old_goods_spec: [],

        classList: [],
        oneClassListShow: [],
        twoClassListShow: [],
        threeClassListShow: [],

        selectClass:{
          oneId:null,
          oneName:'',
          twoId:null,
          twoName:'',
          threeId:null,
          threeName:'',
        },
        searchValue:{
          one:'',
          two:'',
          three:'',
        },

        tags:[],
        tagInputvalue:'',
        tagIsinput: false,

        labels:[],
        labelInputvalue:'',
        labelIsinput: false,
      }
    },
    watch: {
      'formData.distribution':{
        handler (data) {
          if(data){
            this.rules['distribution_money']= [
              {required: true,type:'number', message: '分账佣金不能为空', trigger: 'blur'},,
            ]
          }else {
            delete this.rules.distribution_money;
          }
        },
        immediate:true
      },
      'formData.platform_id':{
        handler (data) {
          if(data==100){
            this.rules['pricing_profits']= [
              {required: true,type:'number', message: '定价利润不能为空', trigger: 'blur'},
            ]
            // this.rules['pricing_freight']= [
            //   {required: true,type:'number', message: '运费不能为空', trigger: 'blur'},
            // ]
          }else {
            delete this.rules.pricing_profits;
            // delete this.rules.pricing_freight;
          }
        },
        immediate:true
      },
      goods_spec: {
        handler (data) {
          console.log(data.length)
          let bigAuto=true
          if(data.length==this.old_goods_spec.length){
            let auto=true
            for(let i in data){
              if(data[i].good_spec_art.length!=this.old_goods_spec[i].good_spec_art.length){
                auto=false
              }
            }
            console.log("auto",auto)
            if(auto){
              this.zhuanprice=false;
              bigAuto=false
            }
          }

          this.old_goods_spec=this.$utils.deepClone(data)

          let arr = []
          var goods_spec = data
          for (let i in goods_spec) {
            let good_spec_art = goods_spec[i].good_spec_art.map(sit => {
              return sit.name
            })
            arr.push(good_spec_art)
          }

          console.log("arr>",arr)
          let good_spec_price_arr = arr.length > 0 ? this.cartesianFunc(arr, ',') : []
          console.log("good_spec_price_arr>",good_spec_price_arr)
          console.log("this.good_spec_price>",this.good_spec_price)
          if (this.zhuanprice == true) {
            let show_goods_spec = good_spec_price_arr.map(item => {
              return {
                spec_price: '',
                cost_price: '',
                spec_stock: null,
                images: '',
                label_tip: '',
                good_no: '',
                key_names: item,
                keyname: item.split(",")
              }
            })
            this.good_spec_price = show_goods_spec
          }else if(bigAuto==false){
            for(let i in this.good_spec_price){
              this.good_spec_price[i].key_names=good_spec_price_arr[i]
              this.good_spec_price[i].keyname=good_spec_price_arr[i].split(',')
            }
          }
          this.zhuanprice = true
        },
        // immediate:true,
        deep: true
      },
    },
    async mounted() {
      var that = this
      if(that.$store.state.userInfo.weapp==0)delete this.rules.shop_id;
      if(this.$route.query.type)this.formData.type = this.$route.query.type;
      if(that.$store.state.userInfo.weapp>0)this.formData.platform_id=8;
      const result = await this.$request({
        url: '/class/all',
        method: 'get',
      });
      this.classList = result.data
      this.oneClassListShow = result.data
      console.log(that.goods_spec);
      console.log(this.$route.query.id)
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.getInfo(this.$route.query.id)
      }
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
      console.log(shopResult)
      this.shopList=shopResult.map(item=>{
        return {
          label:item.name,
          value:item.id
        }
      })


      if(this.$route.query.industry_package_id){
        this.formData.industry_package_id=Number(this.$route.query.industry_package_id);
      }
      if(this.formData.type==2){
        const industryPackageResult = await this.$request({
          url: '/industryPackage/list/1/100',
          method: 'post',
        })
        this.industryPackageList=industryPackageResult.data.rows.map(item=>{
          return {
            label:item.name,
            value:item.id
          }
        })
      }else {
        delete this.rules.industry_package_id;
      }


      // that.setspec(that.goods_spec);
    },
    methods: {

      syncAll(){
        this.$dialog.confirm({
          message: '是否重新同步此数据？',
          width: 300,
          height: 200,
          onBtn: async index => {
            if (index !== 0) return true;
            let result = await this.$request({
              url: '/alibaba/syncAll?id=' + this.id,
              method: 'get'
            })
            if (result.code == 200) {
              this.$Message.success('同步成功');
              this.getInfo(this.id)
              return true;
            } else {
              this.$Message.info('删除失败');
            }
          }
        });
      },

      imageAutoChange(index){
        console.log("imageAutoChange",index)
        let auto=this.goods_spec[index].imageAuto==true?true:false
        for(let i in this.goods_spec){
          this.goods_spec[i].imageAuto=false
        }
        if(auto==true)this.goods_spec[index].imageAuto=true;
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
        this.searchResultList=result.data
        this.searchLoading = false;
      },
      copyGood(){
        if(!this.searchGoodId){
          this.$Message.warning('请选择需要复制的商品')
          return false;
        }
        this.zhuanprice=false;
        // this.id = this.searchGoodId
        this.getInfo(this.searchGoodId)
      },

      closeTag(index){
        this.tags.splice(index, 1);
      },
      addTag(){
        if(this.tagInputvalue==''){
          this.$Message.warning('请输入标签名称')
          return false;
        }
        this.tags.push(this.tagInputvalue)
        this.tagInputvalue=''
        this.tagIsinput=false
      },

      closeShowLabel(index){
        this.labels.splice(index, 1);
      },
      addShowLabel(){
        if(this.labelInputvalue==''){
          this.$Message.warning('请输入标签名称')
          return false;
        }
        this.labels.push(this.labelInputvalue)
        this.labelInputvalue=''
        this.labelIsinput=false
      },


      searchChange(type){
        console.log(type);
        console.log(this.searchValue);
        if(type=='one'){
          let classListShow=this.fuzzQuery(this.classList,this.searchValue.one)
          if(this.selectClass.oneId!=null&&this.searchValue.one){
            let curData=this.classList.filter(item=>{
              return item.id==this.selectClass.oneId
            })
            classListShow.unshift(curData[0])
          }
          this.oneClassListShow=classListShow
        }else if(type=='two'){
          let oneCurData=this.classList.filter(item=>{
            return item.id==this.selectClass.oneId
          })
          let twoClassListShow=this.fuzzQuery(oneCurData[0].children,this.searchValue.two)
          if(this.selectClass.twoId!=null&&this.searchValue.two){
            let curData=oneCurData[0].children.filter(item=>{
              return item.id==this.selectClass.twoId
            })
            twoClassListShow.unshift(curData[0])
          }
          this.twoClassListShow=twoClassListShow
        }else {
          let twoCurData=this.twoClassListShow.filter(item=>{
            return item.id==this.selectClass.twoId
          })
          let threeClassListShow=this.fuzzQuery(twoCurData[0].children,this.searchValue.three)
          if(this.selectClass.threeId!=null&&this.searchValue.three){
            let curData=twoCurData[0].children.filter(item=>{
              return item.id==this.selectClass.threeId
            })
            threeClassListShow.unshift(curData[0])
          }
          this.threeClassListShow=threeClassListShow
        }



      },
      selectClassClick(type,classId,className){
        if(type=='one'){
          this.selectClass.oneId=classId
          this.selectClass.oneName=className
          this.selectClass.twoId=null
          this.selectClass.threeId=null

          let curData=this.classList.filter(item=>{
            return item.id==classId
          })
          this.twoClassListShow=curData[0].children
          this.threeClassListShow=[]
          this.searchChange('two')
        }else if(type=='two'){
          this.selectClass.twoId=classId
          this.selectClass.twoName=className
          this.selectClass.threeId=null
          let curData=this.twoClassListShow.filter(item=>{
            return item.id==classId
          })
          this.threeClassListShow=curData[0].children
          this.searchChange('three')
        }else {
          this.selectClass.threeId=classId
          this.selectClass.threeName=className
        }

      },

      fuzzQuery(list,keyword){
        var reg=new RegExp(keyword),arr=[]
        for(let i=0;i<list.length;i++){
          if(reg.test(list[i].name)){
            arr.push(list[i])
          }
        }
        return arr;
      },

      videoFun(data){
        this.formData.video = data[0]||''
      },
      useImagesFun(data) {
        this.formData.use_images = data
      },
      coverImagesFun(data) {
        this.formData.images = data
      },
      contentImagesFun(data){
        this.formData.content = data
      },
      itemImagesFun(data){
        this.good_spec_price[data.params].images=data.imgList[0]
      },
      async getInfo(id) {
        const result = await this.$request({
          url: 'good/get/' + id,
          method: 'get',
        });
        // this.formData.type = result.data.type
        this.formData.name = result.data.name
        this.formData.sales_show = result.data.sales_show
        this.formData.old_price = result.data.old_price
        this.formData.price = result.data.price
        this.formData.label_tip = result.data.label_tip
        this.formData.shop_id = result.data.shop_id
        if(result.data.industry_package_id)this.formData.industry_package_id = result.data.industry_package_id;
        this.formData.platform_id = result.data.platform_id
        if(this.$store.state.userInfo.weapp>0)this.formData.platform_id=8;
        this.formData.third_party_url = result.data.third_party_url
        this.formData.alibaba_good_id = result.data.alibaba_good_id
        this.formData.cash_on_delivery = result.data.cash_on_delivery==1?true:false
        this.formData.content = result.data.content
        this.formData.images = result.data.images
        this.formData.video = result.data.video
        this.formData.recommended = result.data.recommended
        this.formData.score = result.data.score
        this.formData.use_images =result.data.use_images
        this.formData.comment_tags = result.data.comment_tags
        this.formData.fashionable_proportion = result.data.fashionable_proportion*100
        this.formData.distribution = result.data.distribution==1?true:false
        this.formData.distribution_money = result.data.distribution_money?Number(result.data.distribution_money):null
        this.formData.index = result.data.index
        this.formData.pricing_profits = result.data.pricing_profits
        this.formData.limit_number = result.data.limit_number
        this.formData.pricing_freight = result.data.pricing_freight?Number(result.data.pricing_freight):0


        this.tags = result.data.tag?result.data.tag.split('<@>'):[];
        this.labels = result.data.label?result.data.label.split('<@>'):[];


        let sorcFunc=function (a,b) {
          return a.id-b.id;
        }
        // let goodSpec=result.data.goodSpec.sort(sorcFunc)
        // console.log("goodSpec>",goodSpec)

        this.goods_spec =result.data.goodSpec.map(item => {
          return {
            name: item.name,
            show: false,
            good_spec_art: item.good_spec_arts.sort(sorcFunc)
          }
        })
        this.good_spec_price = result.data.goodSkuList.map(item => {
          return {
            spec_price: item.price,
            cost_price: item.cost_price,
            spec_stock: item.stock,
            images: item.images,
            label_tip: item.label_tip,
            good_no: item.good_no,
            alibaba_skuid: item.alibaba_skuid,
            jd_skuid: item.jd_skuid,
            key_names: item.art_names,
            keyname: item.art_names.split(",")
          }
        })
        if(result.data.good_classes.length==3){
          this.selectClassClick('one', result.data.good_classes[0].class_id, result.data.good_classes[0].class.name)
          this.selectClassClick('two', result.data.good_classes[1].class_id,result.data.good_classes[1].class.name)
          this.selectClassClick('three', result.data.good_classes[2].class_id,result.data.good_classes[2].class.name)
        }

      },
      async submit() {
        let that = this
        if(this.buttonLoading==true)return false;
        let valid = await this.$refs['form'].validate();
        if(!valid){
          this.$Message.warning('请补充完资料')
          return false;
        }
        if(this.$store.state.userInfo.weapp>0&&!this.formData.shop_id){
          this.$Message.warning('请选择商户')
          return false;
        }

        let good_spec_auto = true, good_spec_price_auto = true
        let good_spec = that.goods_spec.map(item => {
          if (item.name == '') good_spec_auto = false
          for (let i in item.good_spec_art) {
            if (item.good_spec_art[i].name == '') good_spec_auto = false
          }
          return {
            name: item.name,
            good_spec_art: item.good_spec_art
          }
        })
        console.log(good_spec)
        this.formData.price=999999999
        let good_spec_price = that.good_spec_price.map(item => {
          console.log("spec_stock:"+item.spec_stock)
          if (item.spec_price === '' || item.spec_stock === ''){
            console.log("spec_stockssss:"+item.spec_stock)
            console.log("spec_price:"+item.spec_price)
            good_spec_price_auto = false
          }
          console.log("spec_price:"+item.spec_price)
          if(Number(item.spec_price)<Number(that.formData.price))that.formData.price=item.spec_price
          return {
            key_names: item.key_names,
            spec_price: item.spec_price,
            cost_price: item.cost_price,
            spec_stock: item.spec_stock,
            images:item.images,
            label_tip: item.label_tip,
            good_no: item.good_no,
            alibaba_skuid: item.alibaba_skuid,
            jd_skuid: item.jd_skuid,
          }
        })
        console.log(good_spec_price)
        if(!this.selectClass.threeId){
          this.$Message.warning('请选择商品类目')
          return false;
        }
        if (good_spec_auto == false||good_spec_price.length==0) {
          this.$Message.warning('请补充完规格资料')
          return false;
        }
        if (good_spec_price_auto == false) {
          this.$Message.warning('请补充完价格库存资料')
          return false;
        }

        this.buttonLoading=true

        let good_class=[
          {
            level:1,
            class_id:this.selectClass.oneId
          },
          {
            level:2,
            class_id:this.selectClass.twoId
          },
          {
            level:3,
            class_id:this.selectClass.threeId
          }
        ]
        let tag=''
        this.tags.push(this.selectClass.oneName)
        this.tags.push(this.selectClass.twoName)
        this.tags.push(this.selectClass.threeName)
        this.tags=this.$utils.unique(this.tags);
        for(let i in this.tags){
          if(tag!='')tag+='<@>'
          tag+=this.tags[i]
        }

        let label=''
        for(let i in this.labels){
          if(label!='')label+='<@>'
          label+=this.labels[i]
        }

        let fromData = {
          type: this.formData.type,
          name: this.formData.name,
          sales_show: this.formData.sales_show,
          price: this.formData.price,
          old_price: this.formData.old_price,
          label_tip: this.formData.label_tip,
          shop_id: this.formData.shop_id,

          industry_package_id: this.formData.industry_package_id,
          platform_id: this.formData.platform_id,
          third_party_url: this.formData.third_party_url,
          cash_on_delivery: this.formData.cash_on_delivery?1:0,
          alibaba_good_id: this.formData.alibaba_good_id,
          content: this.formData.content,
          images: this.formData.images,
          video: this.formData.video,
          recommended: this.formData.recommended,
          score: this.formData.score,
          use_images: this.formData.use_images,
          comment_tags: this.formData.comment_tags,
          fashionable_proportion: this.formData.fashionable_proportion/100,
          tag:tag,
          label:label,
          good_spec: good_spec,
          good_spec_price: good_spec_price,
          good_class:good_class,
          distribution:this.formData.distribution,
          distribution_money:this.formData.distribution_money||0,

          index:this.formData.index||0,
          limit_number:this.formData.limit_number||0,
          pricing_profits:this.formData.pricing_profits,
          pricing_freight:this.formData.pricing_freight,


        }
        console.log("fromData",fromData)
        if (this.id) fromData.id = this.id
        const result = await this.$request({
          url: '/good/add',
          method: 'post',
          data: fromData
        })
        this.buttonLoading=false
        if (result.code == 200) {
          this.$Message.success('提交成功')
          this.$router.back()
        }
      },
      goodNoChange(good_no){
        this.good_spec_price = this.good_spec_price.map(item => {
          return {
            spec_price: item.spec_price,
            spec_stock: item.spec_stock,
            key_names: item.key_names,
            images:item.images,
            label_tip: item.label_tip,
            alibaba_skuid: item.alibaba_skuid,
            jd_skuid: item.jd_skuid,
            good_no: good_no,
            keyname: item.key_names.split(",")
          }
        })
      },

      priceChange(spec_price) {
        this.good_spec_price = this.good_spec_price.map(item => {
          return {
            spec_price: spec_price,
            cost_price: item.cost_price,
            spec_stock: item.spec_stock,
            key_names: item.key_names,
            images:item.images,
            label_tip: item.label_tip,
            alibaba_skuid: item.alibaba_skuid,

            jd_skuid: item.jd_skuid,
            good_no: item.good_no,
            keyname: item.key_names.split(",")
          }
        })
      },
      priceCostChange(cost_price){
        this.good_spec_price = this.good_spec_price.map(item => {
          return {
            spec_price: item.spec_price,
            cost_price: cost_price,
            spec_stock: item.spec_stock,
            key_names: item.key_names,
            images:item.images,
            label_tip: item.label_tip,
            alibaba_skuid: item.alibaba_skuid,
            jd_skuid: item.jd_skuid,
            good_no: item.good_no,
            keyname: item.key_names.split(",")
          }
        })
      },
      stockChange(spec_stock) {
        this.good_spec_price = this.good_spec_price.map(item => {
          return {
            spec_price: item.spec_price,
            cost_price: item.cost_price,
            spec_stock: spec_stock,
            key_names: item.key_names,
            images:item.images,
            label_tip: item.label_tip,
            alibaba_skuid: item.alibaba_skuid,
            jd_skuid: item.jd_skuid,
            good_no: item.good_no,
            keyname: item.key_names.split(",")
          }
        })
      },

      //
      cartesianFunc(arrayData, fuhao = '_') {
        var result = arrayData.reduce((last, current) => {
          const array = [];
          last.forEach(par1 => {
            current.forEach(par2 => {
              array.push(par1 + fuhao + par2);
            });
          });
          return array;
        });
        return result;
      },

      showLabelinput(idxa) {
        var that = this
        console.log(idxa);
        that.zhuanprice = false
        that.goods_spec[idxa].show = true
      },
      hideLabelinput(idxa) {
        var that = this
        this.zhuanprice = false
        that.goods_spec[idxa].show = false
      },
      addSpec() {
        var that = this
        if(this.formData.platform_id==100||this.formData.platform_id==200){
          this.$Message.warning('该类型商品不允许修改sku')
          return false;
        }
        var inputvalue = that.inputvalue
        that.goods_spec.push({
          name: inputvalue,
          show: false,
          imageAuto:false,
          good_spec_art: []
        })
        that.inputvalue = ''
        that.isinput = false
        // that.setspec(that.goods_spec);
      },
      addLabel(idxa) {
        var that = this

        if(this.formData.platform_id==100||this.formData.platform_id==200){
          this.$Message.warning('该类型商品不允许修改sku')
          return false;
        }
        var inputvalue = that.inputvalue
        for (let i in that.goods_spec) {
          for (let o in that.goods_spec[i].good_spec_art) {
            if (that.goods_spec[i].good_spec_art[o].name == inputvalue) {
              this.$Message.warning('已存在该属性名称')
              return false;
            }
          }
        }

        that.goods_spec[idxa].good_spec_art.push({
          name: inputvalue,
          imgae:''
        })
        that.goods_spec[idxa].show = false
        that.inputvalue = ''
        // that.setspec(that.goods_spec);
      },
      closeSpec(event) {
        console.log(event);
        var that = this

        if(this.formData.platform_id==100||this.formData.platform_id==200){
          this.$Message.warning('该类型商品不允许修改sku')
          return false;
        }

        that.goods_spec.splice(event, 1);
        // that.setspec(that.goods_spec);
      },
      closeLabel(idxa, idxb) {
        console.log(idxa + "," + idxb)
        var that = this

        if(this.formData.platform_id==100||this.formData.platform_id==200){
          this.$Message.warning('该类型商品不允许修改sku')
          return false;
        }

        that.goods_spec[idxa].good_spec_art.splice(idxb, 1);
        // that.setspec(that.goods_spec);
      },

    },
  }
</script>

<style lang="scss" scoped>
  .page-body-main-content {
    padding: 15px;
    background: #ffffff;
  }


  .biglist {
    display: flex;
    margin-top: 10px;
  }

  .biglist .le {
    min-width: 240px;
    border: 1px solid #ffffff;
    padding: 5px;
  }

  .biglist .ri {
    /*width: 543px;*/
    border: 1px solid #cccccc;
    padding: 5px;
    flex: 1;
  }

  .showinput {
    width: 200px;
    position: relative;
    border: 1px solid #000;
    display: inline-block;
  }

  .showinput input {
    width: 136px;
    border: none;
  }

  .showinput i {
    font-size: 32px;
    position: absolute;
    top: 0;
    cursor: pointer;
  }

  .showinput i:hover {
    color: #cccccc;
  }

  .showinput .d {
    right: 30px;
  }

  .showinput .c {
    right: 0px;
  }


  .tableaaa {
    border: 1px solid #000;
    width: 100%;
    text-align: center;
    margin-top: 10px;

  }

  .tableaaa td {
    border: 1px solid #cccccc;
  }

  .specTable {
    border: 1px solid #000;
  }

  .specTable .tr {
    display: flex;
  }

  .specTable .lie {
    border: 1px solid #fff;
  }

  .specTable .tit {
    background-color: #ccc;
    color: #fff;
    padding: 0 10px;
  }


  .class-div {
    display: flex;
    background: #f9f9f9;
    max-width: 1000px;
    border-radius: 5px;

    .item {
      flex-grow: 1;
      padding: 15px 15px;
      border-right: 1px solid #dddddd;
      &:last-child{
        border-right: none;
      }

      .search {
        margin-bottom: 20px;
      }

      .categoryGroup {
        height: 150px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #c2c2c2;
          background-clip: padding-box;
          min-height: 28px;
        }

        .li {
          height: 35px;
          padding: 0 16px;
          border-radius: 4px;
          line-height: 35px;
          box-sizing: border-box;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
        }

        .li.cur {
          color: #ff6146;
          position: relative;
        }
      }
    }

  }

  .tag-input-box{
    background: #f7f7f7;
    display: flex;
    align-items: center;
    padding: 4px 0;
    padding-left: 4px;
    padding-right: 30px;
    position: relative;
    border-radius: 4px;
    .tag-close{
      width: 30px;
      height: 100%;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      &:hover{
        opacity: 0.5;
      }
    }
  }




</style>
