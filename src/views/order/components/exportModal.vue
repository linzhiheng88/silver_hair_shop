<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">


      <template v-if="type=='export'">
        <FormItem label="状态：">
          {{formData.stateName}}
          <div style="display: inline-block;color: #f00000"></div>
        </FormItem>
        <FormItem label="兑换时间范围：" v-if="formData.start_time||formData.end_time">
          {{formData.start_time?$utils.changeTimeDate(formData.start_time).dateTime:'/'}} ~
          {{formData.end_time?$utils.changeTimeDate(formData.end_time).dateTime:'/'}}
        </FormItem>
        <FormItem label="关键字：" v-if="formData.keyword">
          {{formData.keyword}}
        </FormItem>
        <FormItem label="手机号码：" v-if="formData.phone">
          {{formData.phone}}
        </FormItem>
        <FormItem label="上传记录ID：" v-if="formData.record_id">
          {{formData.record_id}}
        </FormItem>
      </template>

      <template v-else>
        <FormItem label="上传文件" prop="file">
          <div class="file-name">
            <Icon size="20" type="ios-cloud-upload"/>
            <div class="name">
              {{file?file.name:'选择文件'}}
              <input type="file" class="input-file" accept=".xls,.xlsx" @change="addUploadFile()"
                     ref="uploadFileCell"/>
            </div>
          </div>
        </FormItem>

        <FormItem  label="提示">
          <div style="color: #f00000">请上传导出的数据模版</div>

        </FormItem>

      </template>


    </Form>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function () {
      return {
        operationType: 'add',
        type: '',
        formData: {
          keyword: '',
          state: '',
          record_id: null,
          phone: '',
          start_time: null,
          end_time: null,


          stateName: '',


          file:'',
        },
        file:null,

        rules: {
          gift_id: [
            {required: true,type:'number', message: '请选择礼品', trigger: 'change'},
          ],
          file: [
            {required: true, message: '请上传文件', trigger: 'change'},
          ],
        },


      };
    },

    mounted() {
      if (this.extra) {
        this.type = this.extra.type
        if (this.extra.type == 'export') {
          this.formData.keyword = this.extra.keyword;
          this.formData.state = this.extra.state;
          this.formData.stateName = this.extra.stateName;
          this.formData.record_id = this.extra.record_id;
          this.formData.phone = this.extra.phone;
          this.formData.start_time = this.extra.start_time;
          this.formData.end_time = this.extra.end_time;
        }

      }
    },

    methods: {
       //上傳文件
      async addUploadFile() {
        var that = this

        try {
          var file = that.$refs.uploadFileCell.files[0]
          this.file = file
          this.formData.file = "ssss"
          if (!file) {
            return false
          }
        } catch (e) {
          return false;
        }

      },


      onBtn: async function (index) {

        if (index !== 0) return true;
        let valid = true
        if(this.type=='upload'){
          valid = await this.$refs['form'].validate();
        }
        let flag = false;

        if (valid) {

          try {

            if(this.type=='export'){
              let options = {}
              if (this.formData.state && this.formData.state != -1) {
                options.state = this.formData.state;
              }
              if (this.formData.keyword) {
                options.keyword = [
                  {name: this.formData.keyword}, {phone: this.formData.keyword}
                ];
              }
              if (this.formData.record_id) {
                options.record_id = this.formData.record_id
              }
              if (this.formData.phone) {
                options.phone = this.formData.phone
              }
              if (this.formData.start_time) {
                options.start_time = this.formData.start_time
              }
              if (this.formData.end_time) {
                options.end_time = this.formData.end_time
              }

              const result = await this.$request({
                url: '/admin/exportVolume',
                method: 'post',
                data: options
              })
              if (result.code == 200) {
                this.$Message.success("导出成功");
                window.location.href = this.$store.state.baseUrl + result.data
                return true;
              } else {
                this.$Message.error("导出失败");
                return false;
              }
            }else {

              let data = new FormData();
              data.append("file", this.file,this.file.name);
              const result = await this.$request({
                url: '/upload/logisticsData',
                method: 'post',
                data
              })
              console.log(result);
              if(result.code==200){
                // this.$Message.success("上传成功");
                this.$Modal.success({
                  title: '上传成功',
                  content: "<div>更新 "+result.data+" 条数据</div>"
                });
                return true;
              }else {
                this.$Message.error("操作失败");
                return false;
              }

            }




          } catch (e) {
            this.$Message.error("操作失败");
            return false;
          }
        } else {
          console.log("111");
          return false;
        }
        return flag;
      }
    }
  };
</script>

<style lang="scss">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .file-name {
    font-size: 14px;
    display: flex;
    align-items: center;
    border: 1px solid #cccccc;
    padding: 0 20px;
    height: 35px;
    min-width: 200px;
    justify-content: center;
    position: relative;
    border-radius: 5px;


  }

  .ivu-icon {
    margin-right: 10px;
  }


  .input-file {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

</style>
