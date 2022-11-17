<template>
  <div class="editor">
    <div id="editorElem"></div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  // var E = require('../libs/editor/wangEditor.min')  // 使用下载的源码

  // import E from '../libs/editor/wangEditor.js'

  export default {
    name: 'editor',
    data () {
      return {
        editor:null
      }
    },
    props:{
      content:{
        type:String
      },
      config:{
        type:Object
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.initWangEditor();
      })
    },
    methods:{
      initWangEditor(){
        // var editor = new E('#editor')
        // editor.create()


        this.editor = new E('#editorElem')
        this.editor.customConfig.onchange = (html) => {
          this.$emit('getContent',html)
        }
        this.editor.customConfig.debug = true;
        // this.editor.customConfig.pasteFilterStyle = true;
        // this.editor.customConfig.withCredentials = true;
        // this.editor.customConfig.uploadImgServer ='http://wxopen.wechattips.com/upload/file';
        // this.editor.customConfig.uploadImgServer ='http://dev.digitalbaygroup.com/upload/textfile';
        this.editor.customConfig.uploadImgServer ='https://upload.wechattips.com/qn/upload';
        this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名


        this.editor.customConfig.uploadImgHooks = {
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = result.url
            insertImg(url)

            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        }

        // this.editor.customConfig.uploadImgHeaders = {
        //   // 'authorization': 'Bearer '+localStorage.token,
        //   'enctype':'multipart/form-data'
        // }
        // this.editor.customConfig.uploadImgHeaders = {
        //   'authorization': 'Bearer '+"localStoragetoken",
        //   'enctype':'multipart/form-data'
        // }
        // this.editor.customConfig.uploadImgTimeout = 60000;
        // // this.editor.customConfig.uploadImgParams = {
        // //   domain:1
        // // };
        // this.editor.customConfig.uploadImgMaxLength = 5;
        // this.editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
        // for (let i in this.config){
        //   this.editor.customConfig[i] = this.config[i];
        // }
        this.editor.create();
        this.editor.txt.html(this.content)
      }
    },
    watch:{
      content(val){
        this.editor.txt.html(val)
      },
    }
  }
</script>
<style scoped>
  #editorElem{
    position: relative;
    z-index: 10;
  }
</style>
