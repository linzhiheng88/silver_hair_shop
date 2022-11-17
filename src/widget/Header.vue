<template>
    <div class="top-nav-bar-main">
        <div class="top-nav">
            <div class="breadcrumb">
                <div class="li">主页</div>
                <template v-for="(item,index) in breadcrumbList">
                    <span class="ivu-breadcrumb-item-separator">/</span>
                    <div class="li" v-if="index==breadcrumbList.length-1" :key="index">{{item}}</div>
                    <div class="li li-link" @click="$router.back()" v-else :key="index">{{item}}</div>
                </template>
            </div>

            <Dropdown @on-click="ItemClick" class="btn-admin">
                <a href="javascript:void(0)">
                    {{$store.state.userInfo.account}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="pwd">修改密码</DropdownItem>
                    <DropdownItem name="logout">退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>

        <div class="tab-box">
            <!--          :closable="t.name !== 'Main'"-->
            <el-tag
                    v-for="(t,index) in includeDataArr"
                    size="medium"
                    :key="t.name"
                    :closable="includeDataArr.length>1"
                    :effect="includeName==t.name?'dark':'plain'"
                    style="margin-left: 10px;cursor: pointer;"
                    @close="removeTab(t)"
                    @click="clickTab(t)"
            >
                {{t.tabname}}
            </el-tag>
        </div>
    </div>
</template>

<script>
    import EditPwdModal from "./EditPwdModal";

    export default {
        components: {EditPwdModal},
        name: 'Header',
        props: {
            breadcrumbList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            title: {
                default: '',
            },
            titleName: {
                default: '',
            },
            secondtitle: {
                default: ''
            }
        },
        computed: {
            includeDataArr: function () {
                return this.$store.state.worktab.list
            },
            includeName:function () {
                return this.$store.state.worktab.current.name
            }
        },
        data() {
            return {
                includeArr: [], // 缓存页面列表
                // includeDataArr: [], // 缓存页面列表详细数据
                // includeIndex: 'Main', // 当前展示页面
            }
        },
        created() {

        },
        methods: {

            clickTab(data) {
                console.log(data)
                this.$router.push(data.path)
            },
            removeTab(data) {
                this.$store.dispatch('worktabRemove', data.name)
            },

            ItemClick(event) {
                if (event === 'pwd') {
                    this.changePwd();
                } else {
                    this.logout();
                }
            },
            logout() {
                sessionStorage.clear();
                window.location.href='/cms'
                // this.$router.push({
                //     name: 'Login'
                // });
            },
            changePwd() {
                let data={
                    account:this.$store.state.userInfo.account
                }
                this.$dialog.open({
                    title: '修改密码',
                    resizable: true,
                    component: EditPwdModal,
                    extra: data,
                    height: 350,
                    width: 500,
                    btn: ['确定', '取消'],
                    onDismiss: (index) => {
                        if (index === 0) {
                            this.logout();
                        }
                    }
                });
            },

        }

    }
</script>
<style lang="scss" scoped>
    .top-nav-bar-main {

        position: relative;
        top: 1px;
        left: 0;
        right: 0;

        .top-nav {
            font-size: 14px;
            text-align: left;
            height: 50px;
            line-height: 50px;
            padding-left: 30px;
            background: white;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
        }

        .tab-box {
            padding-top: 15px;
            overflow-x: auto;
            white-space: nowrap;
            padding-right: 30px;
            &::-webkit-scrollbar {
                width: 5px;
                height: 5px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #c2c2c2;
                background-clip: padding-box;
                min-height: 10px;
            }
            .el-tag--medium{
                height: 32px;
                line-height: 30px;
                font-size: 14px;
            }
        }
    }

    .btn-admin {
        background: none;
        border-radius: 6px;
        border: 0 solid;
        display: inline-block;
        cursor: pointer;
        color: #ffffff;
        font-family: Arial;
        font-size: 14px;
        padding: 0px 25px;
        margin-right: 30px;
        text-decoration: none;
        outline: none;
        float: right;
        color: #666;
    }

    .ivu-breadcrumb {
        display: inline-block;
    }


    .breadcrumb {
        display: inline-flex;

        .li {
            color: #999;
            font-size: 14px;

            &:last-child {
                font-weight: 700;
                color: #515a6e;
            }
        }

        .li-link {
            cursor: pointer;

            &:hover {
                color: #5cadff;
            }
        }

    }

</style>
