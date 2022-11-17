<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="70">
      <Form-item label="行业包" prop="industry_package_id">
        <Select v-model="formData.industry_package_id"  style="width:100%">
          <Option v-for="item in industryPackageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <Form-item label="类型" prop="type">
        <Select v-model="formData.type" >
          <Option v-for="item in [{label:'搜全部',value:1},{label:'搜关键字',value:2},{label:'搜分类',value:3}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>


      <FormItem label="关键字" v-if="formData.type==2" prop="keyword">
        <Input v-model="formData.keyword"/>
      </FormItem>


      <FormItem label="分类ID" v-if="formData.type==3" prop="class_id">
        <Input number type="number" v-model="formData.class_id"/>
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
          industry_package_id:null,
          type:null,
          name: '',
          keyword: '',
          class_id:''

        },
        rules: {
          industry_package_id: [
            {required: true,type:'number', message: '行业包不能为空', trigger: 'change'},
          ],
          type: [
            {required: true,type:'number', message: '类型不能为空', trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
        },
        operationType:'add',
        industryPackageList:[]
      };
    },
    watch:{
      'formData.type':{
        handler (data) {
          delete this.rules.keyword;
          delete this.rules.class_id;
          if(data==2){
            this.rules['keyword']= [
              {required: true,message: '关键字不能为空', trigger: 'blur'},,
            ]
          }else if(data==3){
            this.rules['class_id']= [
              {required: true,type:'number', message: '分类ID不能为空', trigger: 'blur'},,
            ]
          }
        },
        immediate:true
      },
    },
    async mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.name = this.extra.name;
        this.formData.type = this.extra.type;
        this.formData.keyword = this.extra.keyword;
        this.formData.class_id = this.extra.class_id;
        this.formData.industry_package_id = this.extra.industry_package_id;
      }
      const result = await this.$request({
        url: '/industryPackage/list/1/100',
        method: 'post',
      })
      this.industryPackageList=result.data.rows.map(item=>{
        return {
          label:item.name,
          value:item.id
        }
      })

    },

    methods: {

      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {

            const result = await this.$request({
              url: '/indexClassTag/edit',
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
