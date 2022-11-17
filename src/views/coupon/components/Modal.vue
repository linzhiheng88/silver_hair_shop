<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="100">
      <FormItem label="使用类型" prop="use_type">
        <Select v-model="formData.use_type" >
          <Option v-for="item in useTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="关联商品" prop="good_id" v-if="formData.use_type==2">
        <Select
          style="width:100%"
          v-model="formData.good_id"
          filterable
          :remote-method="goodSearchFunc"
          :loading="goodSearchLoading">
          <Option v-for="(item, index) in goodSearchResultList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="关联活动" prop="activity_id" v-if="formData.use_type==3">
        <Select
          style="width:100%"
          v-model="formData.activity_id"
          filterable
          :remote-method="activitySearchFunc"
          :loading="activitySearchLoading">
          <Option v-for="(item, index) in activitySearchResultList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <FormItem label="有效时间" prop="start_time">
        <DatePicker type="daterange" size="large" v-model="formData.dateArr" split-panels placeholder="时间范围" @on-change="timeChange" style="width: 300px"></DatePicker>
      </FormItem>
      <Form-item label="类型" prop="type">
        <Select v-model="formData.type" >
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <FormItem label="代金券金额" prop="amount" v-if="formData.type==1">
        <Input type="number" number v-model="formData.amount"/>
      </FormItem>
      <FormItem label="折扣" prop="discount" v-if="formData.type==2">
        <Input type="number" number style="width: 60%" v-model="formData.discount"/>  <span style="color: red">(取值范围：0~1，0.5表示打5折)</span>
      </FormItem>
      <FormItem label="优惠券门槛" prop="conditions">
        <Input type="number" number v-model="formData.conditions"/>
      </FormItem>
      <FormItem label="领券背景" prop="images">
        <upload-image :imgLists="formData.bg_image?[formData.bg_image]:[]" :height="200" tip="建议上传尺寸：750*height（height大于1700）" @imageReturnData="imagesFun" :count="1"></upload-image>
      </FormItem>
      <FormItem label="规则说明">
        <Input type="textarea" :rows="3" v-model="formData.rules"/>
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
          use_type: null,
          type: null,
          name: '',
          amount:null,
          discount:null,
          conditions:null,
          start_time:'',
          end_time:'',
          good_id:null,
          activity_id:null,
          bg_image:'',
          rules:'',
          dateArr:[],

        },
        rules: {
          use_type: [
            {required: true,type:'number', message: '类型不能为空', trigger: 'change'},
          ],
          type: [
            {required: true,type:'number', message: '类型不能为空', trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          amount: [
            {required: true,type:'number', message: '代金券金额不能为空', trigger: 'blur'},
          ],
          discount: [
            {required: true,type:'number', message: '折扣不能为空', trigger: 'blur'},
          ],
          conditions: [
            {required: true,type:'number', message: '优惠券门槛不能为空', trigger: 'blur'},
          ],
          good_id: [
            {required: true,type:'number', message: '请选择关联商品', trigger: 'change'},
          ],
          activity_id: [
            {required: true,type:'number', message: '请选择关联活动', trigger: 'change'},
          ],
          // start_time: [
          //   {required: true, type:'date', message: '请选择有效期', trigger: 'blur'},
          // ],
          // dateArr:[
          //   {required: true, type:'array',min: 2, message: '请选择有效期', trigger: 'change'},
          //   { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
          // ]
        },
        typeList:[
          {
            label:'代金券',
            value:1
          },
          {
            label:'折扣券',
            value:2
          }
        ],
        useTypeList:[
          {
            label:'全场通用',
            value:1
          },
          {
            label:'单商品使用',
            value:2
          },
          {
            label:'活动使用',
            value:3
          }
        ],
        operationType:'add',


        goodSearchLoading:true,
        goodSearchResultList:[],

        activitySearchLoading:true,
        activitySearchResultList:[],

      };
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.use_type = this.extra.use_type;
        this.formData.type = this.extra.type;
        this.formData.name = this.extra.name;
        this.formData.amount = Number(this.extra.amount);
        this.formData.discount = Number(this.extra.discount);
        this.formData.conditions = Number(this.extra.conditions);
        this.formData.start_time = this.extra.start_time;
        this.formData.good_id = this.extra.good_id;
        this.formData.activity_id = this.extra.activity_id;
        this.formData.bg_image = this.extra.bg_image;
        this.formData.rules = this.extra.rules;
        this.formData.end_time = this.extra.end_time;
        this.formData.dateArr = [new Date(this.extra.start_time),new Date(this.extra.end_time)];
      }


    },

    methods: {
      async goodSearchFunc(data){
        if(data==''){return false}
        this.goodSearchLoading = true;
        const result = await this.$request({
          url: '/good/search',
          method: 'post',
          data:{
            keyword:[
              {
                name:data
              },
              {
                tag:data
              }
            ]
          }
        });
        this.goodSearchResultList=result.data.map(item=>{
          return {
            id:item.id,
            name:`（${item.id}）${item.name}`
          }
        })
        if(this.extra&&this.extra.use_type==2){
          this.goodSearchResultList.push({
            id:this.extra.good_id,
            name:`（${this.extra.good_id}）${this.extra.good.name}`
          })
        }
        this.goodSearchLoading = false;
      },
      async activitySearchFunc(data){
        if(data==''){return false}
        this.activitySearchLoading = true;
        const result = await this.$request({
          url: '/activity/search',
          method: 'post',
          data:{
            keyword:[
              {
                name:data
              }
            ]
          }
        });
        this.activitySearchResultList=result.data.map(item=>{
          return {
            id:item.id,
            name:`（${item.id}）${item.name}`
          }
        })
        if(this.extra&&this.extra.use_type==3){
          this.activitySearchResultList.push({
            id:this.extra.activity_id,
            name:`（${this.extra.activity_id}）${this.extra.activity.name}`
          })
        }
        this.activitySearchLoading = false;
      },


      timeChange(date){
        // if(date.length<2)return false;
        let start_time=date[0]?new Date(date[0]):null
        let end_time=date[0]?new Date(date[1]):null

        if(start_time){
          start_time.setHours(0)
          start_time.setMinutes(0)
          start_time.setSeconds(0)
        }
        if(end_time){
          end_time.setHours(23)
          end_time.setMinutes(59)
          end_time.setSeconds(59)
        }


        this.formData.start_time=start_time
        this.formData.end_time=end_time

        console.log(this.formData)
      },

      imagesFun(data) {
        this.formData.bg_image = data[0]
      },
      onBtn: async function (index) {
        if (index !== 0) return true;
        let valid = await this.$refs['form'].validate();
        let that = this;
        let flag = false;
        if (valid) {
          try {
            console.log(this.formData)

            delete this.formData.dateArr;
            if(this.operationType == 'add'){
              delete this.formData.id
            }

            if(this.formData.type==1)this.formData.discount=1;
            if(this.formData.type==2)this.formData.amount=0;

            const result = await this.$request({
              url: '/coupon/edit',
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
