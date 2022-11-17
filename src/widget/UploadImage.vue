<template>
  <div class="upload-image-div">
    <template v-if="count==1">
      <div class="demo-upload-list" :style="imgSiteStyle" v-show="imgList.length>=count">
        <img v-if="type=='img'" :src="imgList[0]">
        <video class="video" v-else :src="imgList[0]"></video>
        <div class="cover" style="height: 100%;cursor: pointer;display: flex;">
          <div class="cover-li">
            <Icon type="md-cloud-upload" size="20"/>
            <input type="file" class="input-file" @change="addUploadFile(2)" ref="uploadFile2"/>
          </div>
          <div class="cover-li">
            <div style="width: 100%;height: 50%;position: relative;overflow: hidden;" @click="goUrl(imgList[0])">
              <Icon type="md-link" />
            </div>
            <div style="width: 100%;height: 50%;position: relative;overflow: hidden;">
              <Icon type="ios-trash-outline" @click.native="deleteAllUploadFilea"></Icon>
            </div>
          </div>
        </div>
      </div>
      <div class="imgClass" :style="imgSiteStyle" v-show="imgList.length<count">
        <Icon type="md-cloud-upload" size="20"/>
        <input type="file" class="input-file" @change="addUploadFile(1)" ref="uploadFile1"/>
      </div>
      <div class="tip" v-if="tip">{{tip}}</div>
    </template>
    <template v-else>
      <div class="demo-upload-list" :style="imgSiteStyle" v-for="(item, index) in imgList">
        <img :src="item">
        <div class="cover">
          <Icon type="ios-trash-outline" @click.native="deleteUploadFilea(index)"></Icon>
        </div>
        <div class="index-edit">
          <div class="but" @click="indexEdit(index,false)">
            <Icon type="ios-arrow-back" />
          </div>
          <div class="but" @click="indexEdit(index,true)">
            <Icon type="ios-arrow-forward" />
          </div>
        </div>
      </div>
      <div class="imgClass" :style="imgSiteStyle" v-if="imgList.length<count">
        <Icon type="md-cloud-upload" size="20"/>
        <input type="file" class="input-file" @change="addUploadFile(3)" multiple="multiple" ref="uploadFile3"/>
      </div>
      <div class="tip" v-if="tip">{{tip}}</div>
    </template>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'UploadImage',
    props: {
      count: {
        default: 1,
      },
      imgLists: {
        type: Array,
        default: function () {
          return []
        }
      },
      type:{
        type:String,
        default:'img'
      },
      width: {
        default: 100,
      },
      height: {
        default: 100,
      },
      tip: {
        default: '建议上传尺寸：750*750',
      },
      params: {
        default: null
      }
    },
    watch: {
      imgLists(data) {
        this.imgList = data;
      },
    },
    data() {
      return {
        imgList: [],
        baseURL: '',
      }
    },
    computed: {
      imgSiteStyle: function () {
        return `width:${this.width || 100}px;height:${this.height || 100}px;`;
      }
    },
    created() {
      this.imgList = this.imgLists;
      console.log(this.imgLists);
    },
    methods: {
      goUrl(url){
        console.log(url)
        // let routeUrl = this.$router.resolve({
        // path: url,
        // });
        window.open(url, '_blank');
      },
      async addUploadFile(index) {
        var that = this
        var files = index == 1 ? that.$refs.uploadFile1.files : index == 2 ? that.$refs.uploadFile2.files : that.$refs.uploadFile3.files
        if (!files) {
          return false
        }
        const tokenResult = await this.$request({
          url: '/qiniu/getFileToken',
          method: 'GET',
        })
        console.log(tokenResult)
        for (let i in files) {
          if (files[i].size)await this.uploadFileFun(files[i], tokenResult.data.clientUrl, tokenResult.data.fileToken,tokenResult.data.fileUrls)
        }
        // this.pushData('http://macaowatertest2.wechattips.com/static/img/activity.13256e2f.png');
        // return false;
      },
      async uploadFileFun(file, clientUrl, fileToken,fileUrls) {
        const that = this
        let fileNameArr=file.name.split('.')
        let hz=fileNameArr[fileNameArr.length-1]
        let nowDate=this.$utils.changeTimeDate()
        return new Promise((resolve, reject) => {
          const axiosInstance = axios.create({withCredentials: false});    //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
          let data = new FormData();
          data.append('token', fileToken);     //七牛需要的token，叫后台给，是七牛账号密码等组成的hash
          data.append('file', file);
          data.append('key', 'silvershop/'+nowDate.year+'/'+nowDate.dateNumber+'.'+hz);
          axiosInstance({
            method: 'POST',
            url: clientUrl,  //上传地址
            data: data,
            timeout: 30000,      //超时时间，因为图片上传有可能需要很久
            onUploadProgress: (progressEvent) => {
              //imgLoadPercent 是上传进度，可以用来添加进度条
              let imgLoadPercent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            },
          }).then(data => {
            console.log(data)      //上传成功，把input的value设置为空，不然 无法两次选择同一张图片
            // that.pushData(`${fileUrls}/${data.data.key}`);
            that.pushData(`https://qiniu.touchdot.top/${data.data.key}`);
            resolve(true)
          }).catch(function (err) {
            reject();
            this.$Message.error("操作失败，请重试");
          });
        })
      },

      pushData(item) {
        let imgList = this.count == 1 ? [] : this.imgList
        imgList.push(item)
        this.imgList = imgList
        if (this.params || this.params == 0) {
          this.$emit('imageReturnData', {
            params: this.params,
            imgList: this.imgList
          })
        } else {
          this.$emit('imageReturnData', this.imgList)
        }
      },
      indexEdit(index,type){
        function swapArray(arr, index1, index2) {
          arr[index1] = arr.splice(index2, 1, arr[index1])[0];
          return arr;
        }
        console.log(index,type)
        if(type==true){
          if(index+1 != this.imgList.length){
            this.imgList=swapArray(this.imgList, index, index+1);
          }else{
            this.$Message.warning('已经处于最后，无法后移')
          }
        }else {
          if(index!= 0){
            this.imgList=swapArray(this.imgList, index, index-1);
          }else{
            this.$Message.warning('已经处于第一，无法前移')
          }
        }

      },

      deleteUploadFilea(index) {
        this.imgList.splice(index, 1);
        this.$emit('imageReturnData', this.imgList)
      },
      deleteAllUploadFilea(){
        this.imgList=[]
        this.$emit('imageReturnData', [])
      },

    }

  }
</script>
<style scoped lang="scss">
  .upload-image-div {
    display: flex;
    flex-wrap: wrap;
  }

  .input-file {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .imgClass {
    position: relative;
    border: 1px solid #f1f1f1;
    width: 100px;
    height: 100px;
    position: relative;
    text-align: center;
    display: inline-block;

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    i {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      display: block;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  .demo-upload-list {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 5px;
    margin-bottom: 5px;
    img {
      width: 100%;
      height: 100%;
    }
    .video{
      width: 100%;
      height: 100%;
    }

    .cover {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 70%;
      background: rgba(0, 0, 0, .4);
      &:hover{
        background: rgba(0, 0, 0, .8);
        i{
          transform: scale(1.3,1.3);
        }
      }
      i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        position: absolute;
        align-items: center;
        justify-content: center;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        line-height: 80px;
        margin: auto;
      }
      .cover-li{
        width: 50%;
        position: relative;
        &:hover{
          background: rgba(0, 0, 0, .8);
          i{
            transform: scale(1.4,1.4);
          }
        }
      }
    }
    .index-edit{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30%;
      background: rgba(0, 0, 0, .4);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .but{
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &:hover{
          background: rgba(0, 0, 0, .6);
          i{
            transform: scale(1.3,1.3);
          }
        }
        i{
          color: #fff;
          font-size: 20px;
        }
      }
    }

    &:hover {
      .cover {
        display: block;
      }
    }
  }


  .tip {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }


</style>
