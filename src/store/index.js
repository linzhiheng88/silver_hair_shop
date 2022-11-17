import Vue from 'vue'
import Vuex from 'vuex'

var jwt = require('jsonwebtoken');
Vue.use(Vuex)
import router from '@/router'

const userInfoString = sessionStorage.getItem("userInfo")
const alibabaCarString = localStorage.getItem("alibabaCar")
const weappListString = sessionStorage.getItem("weappList")
const industryPackageListString = sessionStorage.getItem("industryPackageList")

const jdCarString = localStorage.getItem("jdCar")


import axios from 'axios'

let baseUrl='';
if(process.env.NODE_ENV === 'development'){
    // baseUrl='http://192.168.0.104:5009'
    // baseUrl='http://192.168.1.11:5009'
    baseUrl='https://silvershop.touchdot.top'
}else if(process.env.NODE_ENV === 'production'){
    baseUrl='https://silvershop.touchdot.top'
}

export default new Vuex.Store({
    state: {
        baseUrl:baseUrl,
        userInfo: userInfoString ? JSON.parse(userInfoString) : {
            account: null,
            accessToken: null,
        },

        jdImageUrl:'https://img13.360buyimg.com/n0/s750x750_',

        menuActiveName: localStorage.getItem("menuActiveName") || 'index',
        // navRecordList:localStorage.getItem("navRecordList")||[{
        //   name:'good',
        //   title:'商品'
        // }],
        orderStateList: [
            {
                state: 0,
                label: '未付款'
            },
            {
                state: 1,
                label: '待发货'
            },
            {
                state: 2,
                label: '待收货'
            },
            {
                state: 3,
                label: '已完成'
            },
            {
                state: 4,
                label: '已取消'
            },
            {
                state: 5,
                label: '用户已拒收'
            }
        ],
        orderAfterStateList: [
            {
                state: 1,
                label: '处理中'
            },
            {
                state: 2,
                label: '用户寄回中'
            },
            {
                state: 3,
                label: '配送中'
            },
            {
                state: 4,
                label: '已完成'
            },
            {
                state: 5,
                label: '已取消'
            },
            {
                state: 6,
                label: '已拒绝'
            },
        ],

        worktab: {
            list: [
                // {
                //     name: 'Index',
                //     tabname: '数据统计',
                //     path: '/index'
                // }
            ],
            current: {
                name: 'Index',
                tabname: '数据统计',
                path: '/index'
            }
        },
        closingPage: '',

        alibabaCar: alibabaCarString ? JSON.parse(alibabaCarString) : [],
        alibabaAfferSearchResult: {
            load:true
        },
        alibabaKeywordObj:{},
        weappList:weappListString?JSON.parse(weappListString) : [],
        industryPackageList:industryPackageListString?JSON.parse(industryPackageListString) : [],

        jdSearchResult: {
            load:true
        },
        jdCar: jdCarString ? JSON.parse(jdCarString) : [],
        jdKeywordObj:{},


    },
    mutations: {
        setUserInfo(state, userInfo) {
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
            state.userInfo = userInfo;
        },
        // setAccessToken(state, accessToken){
        //   sessionStorage.setItem("accessToken", accessToken);
        //   state.accessToken = accessToken;
        // },
        setMenuActiveName(state, menuActiveName) {
            localStorage.setItem('menuActiveName', menuActiveName)
            state.menuActiveName = menuActiveName
        },


        worktabRemove(state, p) {
            // 关闭标签
            let ind = state.worktab.list.findIndex(s => s.name === p)
            if (ind > -1) {
                // 清理 keep alive - start
                state.closingPage = state.worktab.list[ind].name
                // 清理 keep alive - end
                state.worktab.list.splice(ind, 1)
            }
            if (p === state.worktab.current.name) {
                // 是当前页，返回上一页

                if (state.worktab.list.length == 0) {
                    router.replace('/index')
                } else {
                    router.replace(state.worktab.list[state.worktab.list.length - 1].path)
                    // router.back()
                }

            }
        },
        worktabRoute(state, p) {
            let ind = state.worktab.list.findIndex(s => s.name === p.to.name)
            if (ind > -1) {
                // 标签已存在
                state.worktab.current = state.worktab.list[ind]
                state.worktab.list[ind]=p.to
            } else {
                // 标签不存在，现在新建
                state.worktab.list.push(p.to)
                state.worktab.current = p.to

            }
            state.closingPage = ''
        },


        //阿里相关
        setAlibabaCar(state, data) {
            let alibabaCar = state.alibabaCar
            if (data.type == 'add') {
                let add = true
                for (let i in alibabaCar) {
                    if (alibabaCar[i].offerId == data.good.offerId) {
                        add = false;
                        break;
                    }
                }
                if (add) alibabaCar.push(data.good);
            } else if (data.type == 'del') {
                alibabaCar.splice(data.index, 1)
            } else if (data.type == 'delAll') {
                alibabaCar = []
            }
            localStorage.setItem('alibabaCar', JSON.stringify(alibabaCar))
            state.alibabaCar = alibabaCar
        },
        setAlibabaAfferSearchResult(state,data){
            let alibabaAfferSearchResult=state.alibabaAfferSearchResult
            alibabaAfferSearchResult.count=-1
            alibabaAfferSearchResult.rows=[]
            state.alibabaAfferSearchResult = alibabaAfferSearchResult
        },
        setAlibabaKeywordObj(state,alibabaKeywordObj){
            state.alibabaKeywordObj = alibabaKeywordObj
        },

        //京东相关
        setJdCar(state, data) {
            let jdCar = state.jdCar
            if (data.type == 'add') {
                let add = true
                for (let i in jdCar) {
                    if (jdCar[i].warePId == data.good.warePId) {
                        add = false;
                        break;
                    }
                }
                if (add) jdCar.push(data.good);
            } else if (data.type == 'del') {
                jdCar.splice(data.index, 1)
            } else if (data.type == 'delAll') {
                jdCar = []
            }
            localStorage.setItem('jdCar', JSON.stringify(jdCar))
            state.jdCar = jdCar
        },
        setJdSearchResult(state,data){
            let jdSearchResult=state.jdSearchResult
            jdSearchResult.count=-1
            jdSearchResult.rows=[]
            state.jdSearchResult = jdSearchResult
        },
        setJdKeywordObj(state,jdKeywordObj){
            state.jdKeywordObj = jdKeywordObj
        },

        setWeappList(state, weappList){
          sessionStorage.setItem("weappList", JSON.stringify(weappList));
          state.weappList = weappList;
        },
        setIndustryPackageList(state, industryPackageList){
            sessionStorage.setItem("industryPackageList", JSON.stringify(industryPackageList));
            state.industryPackageList = industryPackageList;
        },
    },
    actions: {
        getUserInfo: async ({state}) => {
            var userData = jwt.decode(state.userInfo.accessToken);
            if (userData) {
                state.userInfo.weapp = userData.weapp
                state.userInfo.shop_id = userData.shop_id
                state.userInfo.industry_package_id = userData.industry_package_id
                state.userInfo.permission = userData.permission
            }
            return Promise.resolve(userData)
        },
        logout: async ({commit, dispatch}) => {
            await commit('setUserInfo', {
                account: null,
                accessToken: null,
            })
            await commit('setAccessToken', '')
            router.replace('/')
        },

        getAlibabaAfferSearchResult: async ({dispatch, state}, data) => {
            if (!data.page) data.page = 1;
            if (!data.pageSize) data.pageSize = 20;

            let result=await dispatch('_requestFunc',{
                method:'post',
                url:`/alibaba/searchCybOffers/${data.page}/${data.pageSize}`,
                data:data
            })
            state.alibabaAfferSearchResult = result.data
            return Promise.resolve(result)
        },

        getJdSearchResult: async ({dispatch, state}, datasss) => {
            let data=state.jdKeywordObj
            if (!data.pageIndex) data.pageIndex = 1;
            if (!data.pageSize) data.pageSize = 25;
            // delete data.oneCatName;
            // delete data.threeCatName;
            let result=await dispatch('_requestFunc',{
                method:'post',
                url:`/jd/goodSearch/${data.pageIndex}/${data.pageSize}`,
                data:data
            })
            state.jdSearchResult = result.data
            return Promise.resolve(result)
        },

        getWeapp: async ({dispatch,commit,state},auto) => {
            if(state.weappList.length==0||auto){
                let result=await dispatch('_requestFunc',{
                    method:'post',
                    url:`/weapp/list/1/100`
                })
                if(result.code==200){
                    commit('setWeappList',result.data.rows)
                }
            }
            return true;
        },

        getIndustryPackage: async ({dispatch,commit,state},auto) => {
            if(state.industryPackageList.length==0||auto){
                let result=await dispatch('_requestFunc',{
                    method:'post',
                    url:`/industryPackage/list/1/100`
                })
                if(result.code==200){
                    commit('setIndustryPackageList',result.data.rows)
                    return Promise.resolve(result.data.rows)
                }
            }
            return true;
        },

        getShop: async ({dispatch,commit,state},weapp_id) => {
            let result=await dispatch('_requestFunc',{
                method:'post',
                url:`/shop/list/1/100`,
                data:{
                    weapp_id:weapp_id
                }
            })
            if(result.code==200){
                return Promise.resolve(result.data.rows)
            }
        },

        // alibabaSyncProgress:async ({dispatch}) => {
        //   const result = await this.$request({
        //     url: '/alibaba/syncProgress',
        //     method: 'get',
        //   })
        //   return Promise.resolve(result)
        // }

        worktabRemove({commit}, p) {
            commit('worktabRemove', p)
        },
        worktabRoute({commit}, p) {
            commit('worktabRoute', p)
        },

        _requestFunc({commit,state}, data) {
            return new Promise((resolve, reject) => {
                axios({
                    method:data.method||'get',
                    url: state.baseUrl+'/api/admins'+data.url,
                    data: data.data,
                    headers:{
                        accesstoken:state.userInfo.accessToken
                    }
                }).then(function (response) {
                    resolve(response.data)
                });
            })
        }


    },

})
