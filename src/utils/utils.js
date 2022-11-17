

/**
 * [Notcn 时间转换]
 * @param {string} date
 * @returns {Object}
 */
import Vue from 'vue'

const utils={}

utils.changeTimeDate=function (data) {
  let now=data?new Date(data):new Date()
  var year=now.getFullYear();
  var month=now.getMonth()+1<10?'0'+(now.getMonth()+1):now.getMonth()+1;
  var date=now.getDate()<10?'0'+now.getDate():now.getDate();
  var hour=now.getHours()<10?'0'+now.getHours():now.getHours();
  var minute=now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();
  var second=now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds();
  var millisecond=now.getMilliseconds()<10?'00'+now.getMilliseconds():now.getMilliseconds()<100?'0'+now.getMilliseconds():now.getMilliseconds();

  return {
    date:year+"-"+month+"-"+date,
    time:hour+":"+minute+":"+second,
    dateTime:year+"-"+month+"-"+date+' '+hour+":"+minute+":"+second,
    year:year,
    month:month,
    day:date,
    numDate:year+""+month+""+date,
    timestamp:parseInt(now.getTime()/1000),
    dateTimestamp:parseInt(new Date(now.toLocaleDateString()).getTime()/1000),

    dateNumber:year+''+month+date+hour+minute+second+millisecond
  }
}

utils.unique=function(arr){
  for(var i=0; i<arr.length; i++){
    for(var j=i+1; j<arr.length; j++){
      if(arr[i]==arr[j]){
        arr.splice(j,1);
        j--;
      }
    }
  }
  return arr;
}


// 可深复制所有类型
utils.deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  const cpObj = obj instanceof Array ? [] : {};
  for (const key in obj) cpObj[key] = utils.deepClone(obj[key]);
  return cpObj;
};


utils.copy=(data)=> {
  let url = data;
  let oInput = document.createElement('input');
  oInput.value = url;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  console.log(oInput.value)
  document.execCommand("Copy"); // 执行浏览器复制命令
  Vue.prototype.$Message.success('复制成功');
  oInput.remove()
}

export default utils
