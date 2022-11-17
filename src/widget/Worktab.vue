<template>
    <div class="cp-worktab">
<!--        <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="clickTab">-->
            <el-tag
                    style="margin-right: 10px"
                    v-for="(t,index) in worktabs"
                    :key="t.name"
                    :label="t.tabname"
                    :name="t.name"
                    :closable="t.name !== 'Index'"
                    :effect="activeTab==t.name?'dark':'plain'"
                    @close="removeTab(t.name, 'notCheck')"
                    @click="clickTab(t,index)"
            >
              {{t.tabname}}
            </el-tag>

<!--        <Tag-->
<!--                type="dot"-->
<!--                v-for="(item, index) in list"-->
<!--                ref="tagsPageOpened"-->
<!--                :key="`tag-nav-${index}`"-->
<!--                :name="item.name"-->
<!--                :data-route-item="item"-->
<!--                @on-close="handleClose(item)"-->
<!--                @click.native="handleClick(item)"-->
<!--                :closable="item.name !== $config.homeName"-->
<!--                :color="isCurrentTag(item) ? 'primary' : 'default'"-->
<!--                @contextmenu.prevent.native="contextMenu(item, $event)"-->
<!--        >{{ showTitleInside(item) }}</Tag>-->

<!--        </el-tabs>-->


<!--        <el-tag-->
<!--                v-for="(t,index) in worktabs"-->
<!--                :key="t.name"-->
<!--                :closable="worktabs.length>1"-->
<!--                :effect="includeIndex==t.name?'dark':'plain'"-->
<!--                style="margin-left: 10px;cursor: pointer;"-->
<!--                @close="removeTab(t.name, 'notCheck')"-->
<!--                @click="clickTab(t)"-->
<!--        >-->
<!--            {{t.meta.title}}-->
<!--        </el-tag>-->

<!--        <div style="display: inline-block;" v-for="t in worktabs" :key="t.name" @click="clickTab">-->
<!--            <Tag @on-close="removeTab(t.name)" :closable="t.name !== 'my'">{{t.tabname}}</Tag>-->
<!--        </div>-->


    </div>
</template>
<script>
    export default {
        created () {
            // 进来不是主页时等list加载后再更新一次current
            setTimeout(() => {
                this.activeTab = this.$store.state.worktab.current.name
            }, 500)
        },
        watch: {
            '$store.state.worktab.current' (tab) {
                this.activeTab = tab.name
            }
        },
        computed: {
            worktabs () {
                return this.$store.state.worktab.list
            }
        },
        data () {
            return {
                activeTab: 'name'
            }
        },
        methods: {
            clickTab (tab,index) {
                console.log("clickTab",tab)
                // this.$router.push(this.worktabs[1 * tab.index].path)
                this.$router.push(tab.path)
            },
            removeTab (name) {
                console.log("removeTab",name)
                this.$store.dispatch('worktabRemove', name)
            }
        }
    }
</script>

<style scoped lang="scss">
    .cp-worktab{
        padding-left: 300px;
        background: #cccccc;
    }
</style>
