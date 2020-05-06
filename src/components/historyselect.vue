<template>
  <div class="hs">
           <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        <el-date-picker
      class="date"
      v-model="timetotime"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']">
    </el-date-picker>
    </div>
</template>

<script>
export default {
  data () {
    return {
      timetotime: [],
      options: [],
      value: '',
      startTime:'',
      endTime:''
    }
  },
  watch:{
    timetotime(time){
     this.startTime = time[0]
     this.endTime = time[1]
     var s = new Date(this.startTime);
     var e = new Date(this.endTime);
     var sm = s.getMonth()
     var em = e.getMonth()
     var sd = s.getDate()
     var ed = e.getDate()
     if(sm<10){
       sm = '0'+(sm+1)
     }
     if(em<10){
       em = '0'+(em+1)
     }
     if(sd<10){
       sd = '0'+sd
     }
     if(ed<10){
       ed = '0'+ed
     }
       this.startTime=s.getFullYear() + '' + sm + '' + sd;
       this.endTime=e.getFullYear() + '' + em + '' + ed;
       this.$emit('childstart',this.startTime)
       this.$emit('childend',this.endTime)
    }
  },
  methods:{

  }
}
</script>
<style lang="less">
  .el-input{
    margin-right: 8px;
  }
</style>
