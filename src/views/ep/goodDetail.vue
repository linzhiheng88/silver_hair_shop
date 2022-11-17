<template>
    <div>
        <my-header :breadcrumbList="['选品管理','阿里巴巴商品详情']"></my-header>
        <div class="page-body-main">
            <Card>
                <div slot="title" @click="handleCopy(productInfo.intelligentInfo.title)">{{productInfo.intelligentInfo.title}}</div>
                <div class="good-div">
                    <div class="cover-box">
                        <div class="cover">
                            <video controls="controls" autoplay="autoplay" v-if="showImgData.type=='video'"
                                   class="video" :src="showImgData.url"></video>
                            <el-image style="width: 100%;height: 100%;" fit="cover" v-else :src="showImgData.url" :previewSrcList="productInfo.image.images"></el-image>
                        </div>
                        <div class="cover-list">
                            <div class="li" v-if="productInfo.mainVedio" @click="imgIndex=-1" :class="{'cur':imgIndex==-1}">
                                <div class="icon" :style="'background-image: url('+productInfoImages[0]+')'">
                                    <Icon type="logo-youtube"/>
                                </div>
                                <!--                                <video class="video" :src="productInfo.mainVedio"></video>-->
                            </div>
                            <div class="li" v-for="(item,index) in productInfoImages"
                                 :class="{'cur':imgIndex==index}" @click="imgIndex=index">
                                <img :src="item">
                            </div>
                        </div>
                    </div>
                    <div class="info-box">
                        <div class="right-button">

                            <div class="addXp no-select" @click="goAlibabaUrl" style="background:#ff7300">
                                <Icon type="md-link" />
                                在阿里巴巴平台查看
                            </div>
                        </div>
                        <div class="info-list">
                            <div class="li">
                                <div class="label">价格</div>
                                <div class="value-box">
                                    <div class=""> ¥ {{priceScope}}</div>
                                </div>
                            </div>
                            <div class="li" v-if="productInfo.bookedCount">
                                <div class="label">成交</div>
                                <div class="value-box">
                                    <div class="">{{productInfo.bookedCount}}</div>
                                </div>
                            </div>
                          <div class="li">
                            <div class="label">商家名称</div>
                            <div class="value-box" style="display: flex;align-items: center;">
                              <div class="" style="cursor: pointer" @click="$utils.copy(productInfo.supplierLoginId)">{{productInfo.supplierLoginId}}</div>
                              <template v-if="weapp==0">
                                <i-button v-if="blackShop" type="error" style="margin-left: 20px;">该商家已在黑名单</i-button>
                                <i-button v-else @click="addBlack(productInfo.supplierLoginId)" type="info" style="margin-left: 20px;">添加黑名单</i-button>
                              </template>

                            </div>
                          </div>


                            <div class="li shipping-li">
                                <div class="label">物流</div>
                                <div class="value-box" style="position: relative;">
                                    <div>{{productInfo.shippingInfo.sendGoodsAddressText}} ｜ {{shippingPrice}}</div>
                                    <div class="shipping-div"
                                         v-if="productInfo.shippingInfo.freightTemplateID!=1&&productInfo.shippingInfo.freightTemplate">
                                        <div class="address-box">
                                            <div class="lis"
                                                 v-for="item in productInfo.shippingInfo.freightTemplate[0].expressSubTemplate.rateList">
                                                {{item.toAreaCodeText||'其他'}}：<span :style="item.rateDTO.firstUnitFee>=600?'color: #f00000':''">¥{{(item.rateDTO.firstUnitFee/100).toFixed(2)}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="li">
                                <div class="label">型号</div>
                                <div class="value-box">
                                    <div class="sku-list">
                                        <div class="item" style="font-weight: bold;background: #f9f9f9">
                                            <div class="sku-img" v-if="productInfo.saleInfo.quoteType!=0">图片</div>
                                            <div class="sku-name">型号名称</div>
                                            <div class="sku-price">价格</div>
                                            <div class="sku-price">建议零售价</div>
                                            <div class="sku-inventory">库存</div>
                                        </div>
                                        <div class="item" v-if="productInfo.saleInfo.quoteType==0">
                                            <div class="sku-name">
                                                <span>{{productInfo.saleInfo.unit}}</span>
                                            </div>
                                            <div class="sku-price">{{productInfo.saleInfo.consignPrice}}元</div>
                                            <div class="sku-price">
                                                {{productInfo.saleInfo.retailPrice?productInfo.saleInfo.retailPrice+'元':'-'}}
                                            </div>
                                            <div class="sku-inventory">{{productInfo.saleInfo.amountOnSale}}</div>
                                        </div>
                                        <template v-else>

                                            <div class="item" v-for="item in productInfo.skuInfos" :key="item.skuId">
<!--                                                <template v-for="sit in item.attributes">-->
<!--                                                    <div class="sku-img" v-if="sit.skuImageUrl">-->
<!--                                                        <img :src="sit.skuImageUrl">-->
<!--                                                    </div>-->
<!--                                                </template>-->
                                                <div class="sku-img">
<!--                                                    <img v-if="getSkuImageUrl(item.attributes)" :src="getSkuImageUrl(item.attributes)">-->
                                                    <el-image v-if="getSkuImageUrl(item.attributes)" style="width: 100%;height: 100%;" fit="cover"  :src="getSkuImageUrl(item.attributes)" :previewSrcList="[getSkuImageUrl(item.attributes)]"></el-image>
                                                </div>

                                                <div class="sku-name">
                                                    <span v-for="(sit,idx) in item.attributes" :key="idx">{{sit.attributeValue}}</span>
                                                </div>
                                                <div class="sku-price">{{item.consignPrice}}元</div>
                                                <div class="sku-price">{{item.retailPrice?Number(item.retailPrice).toFixed(2)+'元':'-'}}</div>
                                                <div class="sku-inventory">{{item.amountOnSale}}</div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </Card>

            <Card style="margin-top: 15px">
                <p slot="title">{{productInfo.intelligentInfo?'图片详情':'富文本'}}</p>
                <div class="detail" v-if="productInfo.intelligentInfo">
                    <img v-for="(item,index) in productInfo.intelligentInfo.descriptionImages" :key="index" :src="item">
                </div>
                <div class="detail" v-else v-html="productInfo.description"></div>
            </Card>


            <div class="addXp-button no-select" @click="addCar" v-if="weapp==0">
                <Icon type="ios-list-box"/>
                <div>加入选品</div>
            </div>

            <xuan-pin-ku-modal :itemList="itemList"></xuan-pin-ku-modal>

        </div>
    </div>
</template>
<script>
    import xuanPinKuModal from "./components/xuanPinKuModal";

    export default {
        name: 'goodDetail',
        components: {xuanPinKuModal},
        data: function () {
            return {
                imgIndex: 0,
                productInfo: {
                  intelligentInfo:{},
                    shippingInfo: {},
                    saleInfo: {
                        quoteType: 0
                    },
                    image: {
                        images: []
                    }
                },
              blackShop:false
            }
        },
        computed: {
          weapp:function (){
            return this.$store.state.userInfo.weapp
          },
            showImgData: function () {
                if (this.imgIndex == -1) {
                    return {
                        type: 'video',
                        url: this.productInfo.mainVedio
                    }
                } else {
                    return {
                        type: 'img',
                        url: this.productInfoImages?this.productInfoImages[this.imgIndex]:null
                    }
                }
            },
            productInfoImages:function(){
              return this.productInfo.intelligentInfo?this.productInfo.intelligentInfo.images:this.productInfo.image
            },
            priceScope: function () {
                let min = 0, max = 0
                if (this.productInfo.saleInfo.quoteType == 0) {
                    min = this.productInfo.saleInfo.consignPrice;
                } else {
                    min = this.productInfo.skuInfos[0].consignPrice;
                    for (let i in this.productInfo.skuInfos) {
                        let price = this.productInfo.skuInfos[i].consignPrice
                        if (price < min) min = price
                        if (price > max) max = price
                    }
                }
                return min == max ? min : min + '-' + max;
            },
            shippingPrice: function () {
                let text = '';
                let shippingInfo = this.productInfo.shippingInfo
                if (shippingInfo.freightTemplateID == 1) {
                    text = "卖家承担运费"
                } else {
                    if (shippingInfo.freightTemplate) {
                        text = "首件快递 ¥" + shippingInfo.freightTemplate[0].expressSubTemplate.rateList[0].rateDTO.firstUnitFee / 100
                    }

                }
                return text;
            },

            itemList:function () {
                return [{
                    offerId: this.$route.params.id,
                    title: this.productInfo.subject,
                    imgUrl: this.productInfo.image.images[0],
                }]
            }
        },
        async mounted() {
            let result = await this.$request({
                url: `/alibaba/goodDetail/${this.$route.params.id}`,
                method: 'get',
            })
            this.productInfo = result.data.productInfo
          this.checkBlack();

        },
        methods: {
          async checkBlack(){
            const result = await this.$request({
              url: '/alibabaShopBlacklist/check',
              method: 'post',
              data:{
                name:this.productInfo.supplierLoginId
              }
            })
            this.blackShop=result.data
          },
          async addBlack(name){

            this.$dialog.confirm({
              message: `是否将 <span style="color: red;font-weight: bold;">${name}</span> 添加为黑名单？`,
              width: 500,
              height:230,
              onBtn: async index => {
                if (index !== 0) return true;
                const result = await this.$request({
                  url: '/alibabaShopBlacklist/edit',
                  method: 'post',
                  data:{
                    name:name
                  }
                })
                if (result.code == 200) {
                  this.$Message.success('添加成功');
                  this.blackShop=true
                  return true;
                }
              }
            });
          },
            getSkuImageUrl:function(attributes){
                let url='';
                for(let i in attributes){
                    if(attributes[i].skuImageUrl)url=attributes[i].skuImageUrl;
                }
                return url;
            },
            handleCopy(title) {
                this.$utils.copy(title)
            },
            goAlibabaUrl(){
               window.open(`https://detail.1688.com/offer/${this.$route.params.id}.html`, '_blank');
            },
            async addCar() {

            let that=this
            if(this.blackShop){
              this.$dialog.confirm({
                message: `该商家已在黑名单中，是否继续将该商品加入选品库？<br> 继续加入后商品会设为下架状态！`,
                width: 440,
                height:240,
                onBtn: async index => {
                  if (index !== 0) return true;


                  this.$store.commit('setAlibabaCar', {
                    type: 'add',
                    good: {
                      offerId: this.$route.params.id,
                      title: this.productInfo.subject,
                      imgUrl: this.productInfo.image.images[0],
                    }
                  })
                  this.$Message.success('添加成功')
                  return true;

                }
              });
            }else {
              this.$store.commit('setAlibabaCar', {
                type: 'add',
                good: {
                  offerId: this.$route.params.id,
                  title: this.productInfo.subject,
                  imgUrl: this.productInfo.image.images[0],
                }
              })
              this.$Message.success('添加成功')
            }

            },

        },
    }
</script>

<style scoped lang="scss">
    .good-div {
        display: flex;
        justify-content: space-between;

        .cover-box {
            width: 360px;

            .cover {
                width: 360px;
                height: 360px;

                img {
                    width: 100%;
                    height: 100%;
                }

                .video {
                    width: 100%;
                    height: 100%;
                }
            }

            .cover-list {
                width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                white-space: nowrap;
                margin-top: 10px;

                .li.cur {
                    border-color: #2d8cf0;
                }

                .li {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    margin-right: 10px;
                    position: relative;
                    vertical-align: top;
                    border: 2px solid transparent;

                    img {
                        width: 100%;
                        height: 100%;
                    }

                    .video {
                        width: 100%;
                        height: 100%;
                    }

                    .icon {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-size: cover;

                        i {
                            font-size: 30px;
                        }
                    }
                }
            }
        }

        .info-box {
            flex: 1;
            margin-left: 30px;
            position: relative;

            .right-button{
                position: absolute;
                right: 0;
                top: 0;
                display: flex;
                align-items: center;
            }

            .addXp {
                width: 230px;
                height: 36px;
                background: #999999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFFFFF;
                border-radius: 100px;
                font-size: 16px;
                cursor: pointer;
                &:nth-of-type(2){
                    margin-left: 30px;
                }

                i {
                    color: #FFFFFF;
                    font-size: 20px;
                }

                div {
                    margin-left: 5px;
                }
            }

            .info-list {
                .li {
                    display: flex;
                    /*height: 40px;*/
                    line-height: 50px;

                    .label {
                        width: 75px;
                    }

                    .value-box {
                        flex: 1;

                        .sku-list {
                            .item {
                                display: flex;
                                align-items: center;
                                margin-bottom: 5px;

                                .sku-img {
                                    width: 40px;
                                    height: 40px;
                                    margin: 0 10px;
                                    line-height: 20px;
                                    display: flex;
                                    align-items: center;
                                    img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                .sku-name {
                                    width: 260px;
                                    line-height: 16px;
                                    display: flex;
                                    align-items: flex-start;
                                    word-wrap: break-word;
                                    flex-wrap: wrap;
                                    box-sizing:border-box;
                                    padding-right: 10px;
                                    span{
                                        max-width: 100%;
                                        word-wrap: break-word;
                                    }
                                }

                                .sku-price {
                                    width: 100px;
                                }

                                .sku-inventory {
                                    width: 90px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .detail {
        width: 800px;

        img {
            width: 100%;
        }
    }

    .shipping-li {
        &:hover {
            .shipping-div {
                display: block;
            }
        }
    }

    .shipping-div {
        width: 640px;
        height: 300px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        border: 1px solid #eee;
        position: absolute;
        left: 0;
        top: 100%;
        background: #FFFFFF;
        padding: 15px;
        overflow-y: auto;
        display: none;
        z-index: 999;
        border-radius: 4px;

        .address-box {
            display: flex;
            flex-wrap: wrap;

            .lis {
                width: 50%;
                line-height: 20px;
                padding: 5px 10px;
                box-sizing: border-box;
            }
        }
    }

    .addXp-button{
        position: fixed;
        right: 50px;
        bottom: 120px;
        box-shadow: 0 1px 6px rgba(0,0,0,0.2);
        border:1px solid #eee;
        z-index: 10;

        width: 100px;
        height: 100px;
        background: #999999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        border-radius: 100px;
        font-size: 16px;
        cursor: pointer;
        flex-wrap: wrap;
        align-content: center;
        div{
            width: 100%;
            text-align: center;
        }
        i {
            color: #FFFFFF;
            font-size: 30px;
            margin-right: 0!important;
        }
    }
</style>
