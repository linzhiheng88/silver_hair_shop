<template>
    <div class="page-wrap">
        <my-header :breadcrumbList="['数据统计']"></my-header>
        <div class="page-body-main">
            <!--      <Divider orientation="left">订单信息</Divider>-->
            <Row :gutter="20">
                <Col span="6">
                    <Card>
                        <p slot="title">访客数</p>
                        <h1>今日：<span class="number-one">{{dataItem.fwUserDay||0}}</span></h1>
                        <h2>累计：{{dataItem.fwUser||0}}</h2>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">订单数</p>
                        <h1>今日：<span class="number-one">{{dataItem.orderDay||0}}</span></h1>
                        <h2>累计：{{dataItem.order||0}}</h2>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">销售额</p>
                        <h1>今日：<span class="number-one">{{dataItem.moneyDay||0}}</span> 元</h1>
                        <h2>累计：{{dataItem.money||0}} 元</h2>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">退款金额</p>
                        <h1>今日：<span class="number-one">{{dataItem.afterMoneyDay||0}}</span> 元</h1>
                        <h2>累计：{{dataItem.afterMoney||0}} 元</h2>
                    </Card>
                </Col>
            </Row>

            <Row :gutter="20" style="margin-top: 15px;">
                <Col span="6">
                    <Card>
                        <p slot="title">利润</p>
                        <h1>今日：<span class="number-one">{{dataItem.profitsMoneyDay||0}}</span> 元</h1>
                        <h2>累计：{{dataItem.profitsMoney||0}} 元</h2>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">待处理售后订单</p>
                        <h1>今日：<span class="number-one">{{dataItem.afterDay||0}}</span> </h1>
                        <h2>累计：{{dataItem.after||0}} </h2>
                    </Card>
                </Col>
                <Col span="12" v-if="$store.state.userInfo.weapp!=0">
                    <Card>
                        <p slot="title">佣金</p>
                        <h1>已结算：<span class="number-one">{{dataItem.weappData.commission_yes||0}}</span> 元   <span style="font-size: 14px;color: #999999">更新时间：{{$utils.changeTimeDate(dataItem.weappData.commission_yes_update).dateTime}}</span></h1>
                        <h2>待结算：<span class="number-one">{{dataItem.weappData.commission_no||0}}</span> 元   <span style="font-size: 14px;color: #999999">更新时间：{{$utils.changeTimeDate(dataItem.weappData.commission_no_update).dateTime}}</span></h2>
                    </Card>
                </Col>
            </Row>

<!--            <Row :gutter="20" style="margin-top: 15px">-->
<!--                <Col span="24">-->
<!--                    <div id="traffic" style="width: 100%;height: 300px"></div>-->
<!--                </Col>-->
<!--            </Row>-->

            <Row :gutter="20" style="margin-top: 15px" v-if="$store.state.userInfo.weapp==0">
                <Col span="16">
                    <Card>
                        <div slot="title">
                            <div style="display: flex;align-items: center;justify-content: space-between;">
                                <div>商品浏览量</div>
                                <div style="display: flex;">
                                    <div style="margin-left: 20px;cursor: pointer;" :style="goodOrder==2?'color:#1e88e5':''" @click="changeOrder(2)">日浏览量</div>
                                    <div style="margin-left: 20px;cursor: pointer;" :style="goodOrder==3?'color:#1e88e5':''" @click="changeOrder(3)">月浏览量</div>
                                    <div style="margin-left: 20px;cursor: pointer;" :style="goodOrder==1?'color:#1e88e5':''" @click="changeOrder(1)">总浏览量</div>
                                </div>
                            </div>
                        </div>
<!--                        <Table border :height="520" :columns="goodColumns" :data="dataItem.goodList" :loading="pageLoading"></Table>-->
                        <Table border :height="520" :columns="goodColumns" :data="goodList" :loading="goodLoading"></Table>

                    </Card>
                </Col>
                <Col span="8">
                    <Card>
                        <p slot="title">搜索关键词</p>
                        <Table border :height="520" :columns="tagColumns" :data="dataItem.tagList" :loading="pageLoading"></Table>
                    </Card>
                </Col>
            </Row>



        </div>
    </div>
</template>
<script>
    // const echarts = require('echarts/lib/echarts');
    // require('echarts/lib/component/grid');
    // require('echarts/lib/chart/bar');

    export default {
        name: 'Index',
        data: function () {
            return {
                pageLoading:true,
                goodColumns: [
                    {
                        title: '排名',
                        key: 'name',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            return h('div',params.row._index+1)
                        }
                    },
                    {
                        title: '商品ID',
                        key: 'id',
                        width:100,
                        align: 'center',
                    },
                    {
                        title: '商品名称',
                        key: 'name',
                        tooltip:true,
                        render: (h, params) => {
                            return h('div',[
                                h('div', {
                                    style: {
                                        color: '#2d8cf0',
                                        cursor: 'pointer',
                                    },
                                    on: {
                                        click: () => this.$router.push(`/good/add?type=${params.row.type}&id=${params.row.id}`)
                                    }
                                }, params.row.name||'-'),
                            ])
                        }
                    },

                    {
                        title: '日浏览次数',
                        key: 'browse_number_day',
                        width:100,
                        align: 'center',
                    },
                    {
                        title: '月浏览次数',
                        key: 'browse_number_month',
                        width:100,
                        align: 'center',
                    },
                    {
                        title: '总浏览次数',
                        key: 'browse_number',
                        width:100,
                        align: 'center',
                    }
                ],
                tagColumns: [
                    {
                        title: '排名',
                        key: 'name',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            return h('div',params.row._index+1)
                        }
                    },
                    {
                        title: '搜索关键词',
                        key: 'name',
                        tooltip:true
                    },
                    {
                        title: '搜索次数',
                        key: 'search',
                        width:100,
                        align: 'center',
                    }
                ],

                dataItem:{
                    weappData:{},
                    goodList:[],
                    tagList:[],
                },

                goodLoading:true,
                goodList:[],
                goodOrder:2
            }
        },
        async mounted() {
            let result = await this.$request({
                url: '/data/index',
            })

            this.dataItem=result.data
            this.pageLoading=false;

            // var jwt = require('jsonwebtoken');
            // var decoded = jwt.decode(this.$store.state.accessToken);
            // console.log(decoded)

            // this.drawTraffic()

            this.getBrowseNumber()
        },
        methods: {

            changeOrder(order){
                this.goodOrder=order;
                this.goodLoading=true;
                this.getBrowseNumber();
            },
            async getBrowseNumber(){
                let result = await this.$request({
                    url: '/data/goodBrowseNumber?order='+this.goodOrder,
                })
                this.goodList=result.data
                this.goodLoading=false
            },

            //生成图表
            async drawTraffic() {
                const result = await this.$request({
                    url:'/bill/list/1/10',
                    method:'post',
                    data: {
                        type:1
                    }
                });

                var myChart = echarts.init(document.getElementById('traffic'));
                // 绘制图表
                let option = {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar'
                    }]
                };
                myChart.setOption(option);
            },

        },
    }
</script>

<style scoped>
    .number-one{
        color: #1e88e5;
    }
</style>
