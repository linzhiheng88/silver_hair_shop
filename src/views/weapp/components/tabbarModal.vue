<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="样式配置">
        <Row :gutter="20">
          <Col span="6">
            <div style="display: flex;align-items: center;">
              <div>字体颜色：</div>
              <ColorPicker alpha format="hex" size="large" v-model="formData.color" />
            </div>
          </Col>
          <Col span="6">
            <div style="display: flex;align-items: center;">
              <div>字体选中颜色：</div>
              <ColorPicker alpha  format="hex" size="large" v-model="formData.selected_color" />
            </div>
          </Col>
          <Col span="6">
            <div style="display: flex;align-items: center;">
              <div>背景颜色：</div>
              <ColorPicker alpha  format="hex" size="large" v-model="formData.background_color" />
            </div>
          </Col>
          <Col span="6">
            <div style="display: flex;align-items: center;">
              <div>上边框颜色：</div>
              <i-select size="large" style="width: 80px" v-model="formData.border_style">
                <i-option value="white">白色</i-option>
                <i-option value="black">黑色</i-option>
              </i-select>
            </div>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="第一">
        <Input v-model="formData.one_text" placeholder="text"/>
        <div style="display: flex;margin-top: 20px;">
          <upload-image :width="70" :height="70" tip="图片路径：建议尺寸为 81px * 81px" :imgLists="formData.one_icon_path?[formData.one_icon_path]:[]" @imageReturnData="imagesFunOne" :count="1"></upload-image>
          <upload-image style="margin-left: 40px" :width="70" :height="70" tip="选中时的图片路径：建议尺寸为 81px * 81px" :imgLists="formData.one_selected_icon_path?[formData.one_selected_icon_path]:[]" @imageReturnData="imagesFunOneSelected" :count="1"></upload-image>
        </div>
      </FormItem>
      <FormItem label="第二">
        <Input v-model="formData.two_text" placeholder="text"/>
        <div style="display: flex;margin-top: 20px;">
          <upload-image :width="70" :height="70" tip="图片路径：建议尺寸为 81px * 81px" :imgLists="formData.two_icon_path?[formData.two_icon_path]:[]" @imageReturnData="imagesFunTwo" :count="1"></upload-image>
          <upload-image style="margin-left: 40px" :width="70" :height="70" tip="选中时的图片路径：建议尺寸为 81px * 81px" :imgLists="formData.two_selected_icon_path?[formData.two_selected_icon_path]:[]" @imageReturnData="imagesFunTwoSelected" :count="1"></upload-image>
        </div>
      </FormItem>
      <FormItem label="第三">
        <Input v-model="formData.three_text" placeholder="text"/>
        <div style="display: flex;margin-top: 20px;">
          <upload-image :width="70" :height="70" tip="图片路径：建议尺寸为 81px * 81px" :imgLists="formData.three_icon_path?[formData.three_icon_path]:[]" @imageReturnData="imagesFunThree" :count="1"></upload-image>
          <upload-image style="margin-left: 40px" :width="70" :height="70" tip="选中时的图片路径：建议尺寸为 81px * 81px" :imgLists="formData.three_selected_icon_path?[formData.three_selected_icon_path]:[]" @imageReturnData="imagesFunThreeSelected" :count="1"></upload-image>
        </div>
      </FormItem>
      <FormItem label="第四">
        <Input v-model="formData.four_text" placeholder="text"/>
        <div style="display: flex;margin-top: 20px;">
          <upload-image :width="70" :height="70" tip="图片路径：建议尺寸为 81px * 81px" :imgLists="formData.four_icon_path?[formData.four_icon_path]:[]" @imageReturnData="imagesFunFour" :count="1"></upload-image>
          <upload-image style="margin-left: 40px" :width="70" :height="70" tip="选中时的图片路径：建议尺寸为 81px * 81px" :imgLists="formData.four_selected_icon_path?[formData.four_selected_icon_path]:[]" @imageReturnData="imagesFunFourSelected" :count="1"></upload-image>
        </div>
      </FormItem>


      <FormItem label="第五">
        <Input v-model="formData.five_text" placeholder="text"/>
        <div style="display: flex;margin-top: 20px;">
          <upload-image :width="70" :height="70" tip="图片路径：建议尺寸为 81px * 81px" :imgLists="formData.five_icon_path?[formData.five_icon_path]:[]" @imageReturnData="imagesFunFive" :count="1"></upload-image>
          <upload-image style="margin-left: 40px" :width="70" :height="70" tip="选中时的图片路径：建议尺寸为 81px * 81px" :imgLists="formData.five_selected_icon_path?[formData.five_selected_icon_path]:[]" @imageReturnData="imagesFunFiveSelected" :count="1"></upload-image>
        </div>
      </FormItem>
    </Form>

  </div>
</template>

<script>

  export default {
    name: "EditPointsDialog",
    props: ["extra"],
    data: function() {
      return {
        formData: {
          weapp_id:null,
          id:null,
          one_text: '',
          one_icon_path:'',
          one_selected_icon_path:'',
          two_text: '',
          two_icon_path:'',
          two_selected_icon_path:'',
          three_text: '',
          three_icon_path:'',
          three_selected_icon_path:'',
          four_text: '',
          four_icon_path:'',
          four_selected_icon_path:'',

          five_text: '',
          five_icon_path:'',
          five_selected_icon_path:'',

          color:'',
          selected_color:'',
          background_color:'',
          border_style:'',

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          commission_no: [
            {required: true, message: '待结算佣金不能为空', trigger: 'blur'},
          ],
          commission_yes: [
            {required: true, message: '已结算佣金不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.weapp_id = this.extra.id;
        if(this.extra.weapp_tabbar){
          this.formData.id = this.extra.weapp_tabbar.id;
          this.formData.one_text = this.extra.weapp_tabbar.one_text;
          this.formData.one_icon_path = this.extra.weapp_tabbar.one_icon_path;
          this.formData.one_selected_icon_path = this.extra.weapp_tabbar.one_selected_icon_path;
          this.formData.two_text = this.extra.weapp_tabbar.two_text;
          this.formData.two_icon_path = this.extra.weapp_tabbar.two_icon_path;
          this.formData.two_selected_icon_path = this.extra.weapp_tabbar.two_selected_icon_path;
          this.formData.three_text = this.extra.weapp_tabbar.three_text;
          this.formData.three_icon_path = this.extra.weapp_tabbar.three_icon_path;
          this.formData.three_selected_icon_path = this.extra.weapp_tabbar.three_selected_icon_path;
          this.formData.four_text = this.extra.weapp_tabbar.four_text;
          this.formData.four_icon_path = this.extra.weapp_tabbar.four_icon_path;
          this.formData.four_selected_icon_path = this.extra.weapp_tabbar.four_selected_icon_path;

          this.formData.five_text = this.extra.weapp_tabbar.five_text;
          this.formData.five_icon_path = this.extra.weapp_tabbar.five_icon_path;
          this.formData.five_selected_icon_path = this.extra.weapp_tabbar.five_selected_icon_path;


          this.formData.color = this.extra.weapp_tabbar.color;
          this.formData.selected_color = this.extra.weapp_tabbar.selected_color;
          this.formData.background_color = this.extra.weapp_tabbar.background_color;
          this.formData.border_style = this.extra.weapp_tabbar.border_style;

        }

      }

    },

    methods: {
      imagesFunOne(data) {
        this.formData.one_icon_path = data[0]
      },
      imagesFunOneSelected(data){
        this.formData.one_selected_icon_path = data[0]
      },
      imagesFunTwo(data) {
        this.formData.two_icon_path = data[0]
      },
      imagesFunTwoSelected(data){
        this.formData.two_selected_icon_path = data[0]
      },
      imagesFunThree(data) {
        this.formData.three_icon_path = data[0]
      },
      imagesFunThreeSelected(data){
        this.formData.three_selected_icon_path = data[0]
      },
      imagesFunFour(data) {
        this.formData.four_icon_path = data[0]
      },
      imagesFunFourSelected(data){
        this.formData.four_selected_icon_path = data[0]
      },

      imagesFunFive(data) {
        this.formData.five_icon_path = data[0]
      },
      imagesFunFiveSelected(data){
        this.formData.five_selected_icon_path = data[0]
      },


      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            const result = await this.$request({
              url: '/weapp/tabbar',
              method: 'post',
              data:this.formData
            })
            console.log(result);
            if (result.code == 200) {
              this.$Message.success("操作成功");
              return true;
            }

            return false;

          } catch (e) {
            this.$Message.error("操作失敗");
            return false;
          }
        } else {
          return false;
        }
        return flag;
      }
    }
  };
</script>

<style scoped="">
  .container {
    margin: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
