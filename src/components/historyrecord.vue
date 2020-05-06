<template>
    <div class="ht">
    <el-select v-model="model" placeholder="全部设备" >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select v-model="kind" placeholder="全部类型" class="sel">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    <el-date-picker
      class="time"
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
  created(){
  },
  data () {
    return {
      timetotime: [],
      options: [],
      model: '',
      table: '',
      kind: ''

    }
  },
  methods: {
    exportData () {
      console.log(this.$refs.tablesMain)

      // this.$refs.tablesMain.exportCsv({
      //   filename: 'the'
      // })
    },
    
  }
}
</script>
<style lang="less" scoped>
     .sel {
            .el-input {
            width: 200px!important;
            height: 30px!important;
        }
    }
    .time {
      margin-right: 8px;
    }
</style>
