<template>
  <div class="container">
    <Form ref="form" :model="formData" :rules="rules" :label-width="120">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name"/>
      </FormItem>
      <Row :gutter="20">
        <Col span="12">
          <FormItem label="获取途径" prop="score_type">
            <Select v-model="formData.score_type" >
              <Option v-for="item in scoreTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="使用类型" prop="use_type">
            <Select v-model="formData.use_type" >
              <Option v-for="item in useTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="所需积分" prop="score_value" v-if="formData.score_type==1">
        <Input type="number" number v-model="formData.score_value"/>
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

      <Row :gutter="20">
        <Col span="12">
          <FormItem label="库存" prop="stock">
            <Input type="number" number v-model="formData.stock"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="每人限领数量" prop="user_number">
            <Input type="number" number v-model="formData.user_number"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="20">
        <Col span="12">
          <FormItem label="领取时间" prop="get_start_time">
            <DatePicker type="daterange" size="large" v-model="formData.getDateArr" split-panels placeholder="时间范围" @on-change="getTimeChange" style="width:100%"></DatePicker>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="有效时间" prop="start_time">
            <DatePicker type="daterange" size="large" v-model="formData.dateArr" split-panels placeholder="时间范围" @on-change="timeChange" style="width:100%"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="20">
        <Col span="12">
          <FormItem label="金额" prop="amount">
            <Input type="number" number v-model="formData.amount"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="使用门槛" prop="conditions">
            <Input type="number" number v-model="formData.conditions"/>
          </FormItem>
        </Col>
      </Row>

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
          score_type: null,
          score_value: null,
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

          stock:null,
          user_number:null,
          get_start_time:'',
          get_end_time:'',


          dateArr:[],
          getDateArr:[],

        },
        rules: {
          score_type:[
            {required: true,type:'number', message: '获取途径不能为空', trigger: 'change'},
          ],
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

          stock: [
            {required: true,type:'number', message: '库存不能为空', trigger: 'blur'},
          ],
          user_number: [
            {required: true,type:'number', message: '每人限领数量不能为空', trigger: 'blur'},
            {min: 1,type:'number', message: '每人限领数量最小为1', trigger: 'blur'},
          ],
          get_start_time: [
            {required: true,  message: '请选择领取日期', trigger: 'change'},
          ],
          start_time: [
            {required: true,  message: '请选择有效期', trigger: 'change'},
          ],
          // start_time: [
          //   {required: true, type:'date', message: '请选择有效期', trigger: 'change'},
          // ],

          // start_time: [
          //   {required: true, type:'date', message: '请选择有效期', trigger: 'blur'},
          // ],
          // dateArr:[
          //   {required: true, type:'array',min: 2, message: '请选择有效期', trigger: 'change'},
          //   { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
          // ]
        },
        scoreTypeList:[
          {
            label:'普通领取',
            value:0
          },
          {
            label:'积分兑换',
            value:1
          },
          {
            label: '抽奖赠送',
            value:3
          }
        ],
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
          },
          {
            label:'新人专区使用',
            value:4
          }
        ],
        operationType:'add',


        goodSearchLoading:true,
        goodSearchResultList:[],

        activitySearchLoading:true,
        activitySearchResultList:[],

      };
    },
    watch:{
     'formData.score_type':{
       handler(data){

         if(data==1){
           this.rules['score_value']= [
             {required: true,type:'number', message: '所需积分不能为空', trigger: 'blur'},
           ]
         }else {
           delete this.rules.password;
         }
         console.log("111")
       },
       deep:true,
       immediate:true

      },
    },
    mounted() {
      if (this.extra) {
        this.operationType = 'edit';
        this.formData.id = this.extra.id;
        this.formData.use_type = this.extra.use_type;
        this.formData.score_type = this.extra.score_type;
        this.formData.score_value = this.extra.score_value;
        this.formData.name = this.extra.name;
        this.formData.amount = Number(this.extra.amount);
        this.formData.conditions = Number(this.extra.conditions);
        this.formData.start_time = this.extra.start_time;
        this.formData.good_id = this.extra.good_id;
        this.formData.activity_id = this.extra.activity_id;
        this.formData.bg_image = this.extra.bg_image;
        this.formData.rules = this.extra.rules;

        this.formData.stock = this.extra.stock;
        this.formData.user_number = this.extra.user_number;
        this.formData.get_start_time = this.extra.get_start_time;
        this.formData.get_end_time = this.extra.get_end_time;
        this.formData.getDateArr = [new Date(this.extra.get_start_time),new Date(this.extra.get_end_time)];


        this.formData.start_time = this.extra.start_time;
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
      getTimeChange(date){
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
        this.formData.get_start_time=this.$utils.changeTimeDate(start_time).dateTime
        this.formData.get_end_time=this.$utils.changeTimeDate(end_time).dateTime
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


        this.formData.start_time=this.$utils.changeTimeDate(start_time).dateTime
        this.formData.end_time=this.$utils.changeTimeDate(end_time).dateTime

        console.log(this.formData)
      },

      imagesFun(data) {
        this.formData.bg_image = data[0]
      },
      onBtn: async function (index) {
        console.log(index)
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

            const result = await this.$request({
              url: '/returnCashCoupon/edit',
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
