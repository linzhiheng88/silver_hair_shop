<template>
  <div class="left-menu-div">
    <i-menu ref="side_menu" theme="dark" style="width: 100%"
            :open-names="openNames"
            :active-name="$store.state.menuActiveName"
            @on-select="select">
      <MenuGroup title="触点商城管理后台">
        <template v-for="(item,index) in menuList" >
          <Submenu :name="item.name" v-if="item.children">
            <template slot="title">
              <Icon :type="item.meta.icon||'md-play'" />
              {{item.meta.title}}
            </template>
            <router-link :to="item.path+'/'+sit.path" v-for="(sit,idx) in item.children" :key="idx">
              <MenuItem :name="sit.name">
                <Icon :type="sit.meta.icon||'md-arrow-dropright'" />
                {{sit.meta.title}}
              </MenuItem>
            </router-link>
          </Submenu>
          <router-link :to="item.path" v-else>
            <MenuItem :name="item.name">
              <Icon :type="item.meta.icon||'md-play'" />
              {{item.meta.title}}
            </MenuItem>
          </router-link>
        </template>

<!--        <template v-for="(item,index) in menuList" >-->
<!--          <Submenu :name="item.name" v-if="item.children">-->
<!--            <template slot="title">-->
<!--              <Icon :type="item.icon" />-->
<!--              {{item.title}}-->
<!--            </template>-->
<!--            <router-link :to="'/home/'+sit.name" v-for="(sit,idx) in item.children" :key="idx">-->
<!--              <MenuItem :name="sit.name">-->
<!--                <Icon :type="sit.icon" />-->
<!--                {{sit.title}}-->
<!--              </MenuItem>-->
<!--            </router-link>-->
<!--          </Submenu>-->
<!--          <router-link :to="'/home/'+item.name" v-else>-->
<!--            <MenuItem :name="item.name">-->
<!--              <Icon :type="item.icon" />-->
<!--              {{item.title}}-->
<!--            </MenuItem>-->
<!--          </router-link>-->
<!--        </template>-->



<!--        <router-link to="/home/demo">-->
<!--          <MenuItem name="demo">-->
<!--            <Icon type="ios-briefcase-outline" />-->
<!--            demo-->
<!--          </MenuItem>-->
<!--        </router-link>-->

<!--        <router-link to="/home/clients">-->
<!--          <MenuItem name="clients">-->
<!--            <Icon type="ios-people" />-->
<!--            客户管理-->
<!--          </MenuItem>-->
<!--        </router-link>-->
      </MenuGroup>
    </i-menu>
    <br>
  </div>
</template>
<script>

  export default {
    name: "LeftSideMenu",
    data() {
      return {
        menuList:[],
      };
    },
    computed:{
      openNames(){
        let arr=[]
        for(let i in this.menuList){
          if(this.menuList[i].children){
            for(let o in this.menuList[i].children){
              if(this.menuList[i].children[o].name==this.$store.state.menuActiveName){
                arr.push(this.menuList[i].name)
                break;
              }
            }
          }
        }
        return arr;
      },
    },
    created() {
      let routerArr=JSON.parse(localStorage.getItem('routerArr'))
      let menuLists=[]
      for(let i in routerArr){
        if(!routerArr[i].meta.notShowMenu){
          let children=[]
          if(routerArr[i].children){
            for(let t in routerArr[i].children){
              if(!routerArr[i].children[t].meta.notShowMenu){
                children.push(routerArr[i].children[t])
              }
            }
            routerArr[i].children=children
          }
          menuLists.push(routerArr[i])
        }
      }
      this.menuList=menuLists
    },

    mounted() {

    },
    methods: {
      select(name) {
        // for(let i in this.menuList){
        //   if(this.menuList[i].name==name){
        //     this.$store.commit('setNavRecordList','')
        //     break;
        //   }
        // }

        // this.$router.push({name: name});
      }
    },
  };
</script>
<style scoped lang="scss">
  .left-menu-div {
    position: fixed;
    width: 240px;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 10;
    overflow-y: auto;
    background: #001529;

    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
      border-radius: 25px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c2c2c2;
      background-clip: padding-box;
      min-height: 28px;
    }
  }

  .ivu-menu-dark {
    background: #001529;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background: #000c17;
  }

</style>
