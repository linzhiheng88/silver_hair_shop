<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="50">

      <FormItem label="标签:" prop="sname" v-if="operationType=='add'">
        <div>
          <div>
            <Tag v-for="(item,index) in names" :key="index"  size="large" closable @on-close="closeLabel(index)">
              {{item}}
            </Tag>
          </div>
          <div>
            <Button icon="ios-add" v-if="!isinput" type="dashed" size="large" @click="isinput=true">添加标签</Button>
            <div class="showinput" v-if="isinput">
              <Input v-model="inputvalue"/>
              <Icon class="d" @click="addSpec" type="ios-checkmark"/>
              <Icon class="c" @click="isinput=false" type="ios-close"/>
            </div>
          </div>
        </div>
      </FormItem>

      <FormItem label="名称" prop="name" v-if="operationType!='add'">
        <Input v-model="formData.name"/>
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
          id:null,
          name: '',

        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',

        inputvalue:'',
        isinput:false,
        names:[],

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
      }


    },

    methods: {
      addSpec() {
        var that = this
        var inputvalue = that.inputvalue
        that.names.push(inputvalue)
        that.inputvalue = ''
        that.isinput = false
      },

      closeSpec(index) {
        this.names.splice(index, 1);
      },
      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            let formData={}
            if(this.operationType == 'edit'){
              formData.name=this.formData.name
              formData.id=this.formData.id
            }else {
              formData.names=this.names
            }

            const result = await this.$request({
              url: '/tag/edit',
              method: 'post',
              data:formData
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
  .showinput {
    width:300px;
    position: relative;
    display: inline-block;
    margin-top: 10px;
  }

  .showinput input {
    width: 136px;
    border: none;
  }

  .showinput i {
    font-size: 32px;
    position: absolute;
    top: 0;
    cursor: pointer;
  }

  .showinput i:hover {
    color: #cccccc;
  }

  .showinput .d {
    right: 30px;
  }

  .showinput .c {
    right: 0px;
  }
</style>
