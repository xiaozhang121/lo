<template>
    <div>
  <!-- 面包屑部分 -->
  <div class="crumbs">
    <el-breadcrumb separator="-">
       <el-breadcrumb-item :to="{path:'/main'}">操作中台</el-breadcrumb-item>
       <el-breadcrumb-item>Lora监测</el-breadcrumb-item>
       <el-breadcrumb-item>温湿度传感器</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <p class="title">温湿度传感器</p>
  <!-- 历史数据筛选 -->
    <div class="history">
        <div class="his-text">历史数据</div>
        <div class="his-select">
            <history-select></history-select>
        </div>
    </div>
  <!-- echarts图表 -->
    <div class="ech-intro">
      <p>{{title}}</p>
      <div class="echarts">
    <div class="echartsone">
    <duno-charts
    :legendOption='legend'
    :isChange=show
    :isItemEchart="true"
    :titleOption="{}"
    :xAxisOption="xAxis"
    :yAxisOption="yAxis"
    :seriesOption="series"></duno-charts>
    </div>
    <div class="echartstwo">
    <duno-charts
    :legendOption='legendtwo'
    :isChange=show
    :isItemEchart="true"
    :titleOption="{}"
    :xAxisOption="xAxistwo"
    :yAxisOption="yAxistwo"
    :seriesOption="seriestwo"></duno-charts>
    </div>
    </div>
    </div>
    <!-- 历史信息记录筛选 -->
    <div class="history">
        <div class="his-text">历史信息记录</div>
        <div class="his-select">
            <history-record></history-record>
        </div>
    </div>
    <!-- table表格 -->
  <duno-tables-tep
    :border= false
    :columns="columns"
    :data="dataList"
    :stripe="stripe"
    :isShowPage = false
    :highlight-row = false

  />
    <!-- 表格点击弹框 -->
    <ele-modal :show='showdia' @change = childvalue></ele-modal>
    </div>
</template>
<script>
import DunoCharts from '@/components/duno-charts/charts.vue'
import HistorySelect from '@/components/historyselect'
import HistoryRecord from '@/components/historyrecord'
import { DunoTablesTep } from '@/components/duno-tables-tep'
import EleModal from '@/components/element-modal/index.vue'
import { postAxiosData } from '@/api/axiosType'
export default {
  created(){
    this.postem()
  },
  methods: {
    childvalue (val) { // 关闭弹窗 父接收子组件传过来的值
      this.showdia = val
    },
    postem () {
      postAxiosData('lenovo-lora/api/loraPlatform/equipment/lineChartData', 
      {
      deviceId:'1',
      startDate: '20200401',//this.startTime,
      endDate:'20200408',
      equipmentType:'oil'
      }).then(res => {
        console.log(res)
         this.change = true
       this.title = res.data.title
      //  //温度
      res.data.oilTemData.map((item,index)=>{
       item.collectTime = item.collectTime.slice(8,10)
        this.xAxis.data.push(item.collectTime);
        this.series[0].data.push(item.oilTemperature)
        // this.series[1].data.push(item.envTemperature)
      })
      // //湿度
      //  res.data.wetData.map((item,index)=>{
      //  item.collectTime = item.collectTime.slice(8,10)
      //   this.xAxistwo.data.push(item.collectTime);
      //   this.seriestwo[0].data.push(item.humidity)
      //   this.seriestwo[1].data.push(item.envHumidity)
      // })

        })  
    },
  },
  components: {
    HistorySelect,
    DunoCharts,
    HistoryRecord,
    DunoTablesTep,
    EleModal
  },
  data () {
    return {
      title:'',//标题
      show:false,
      stripe: true, // 表格隔行变色
      showdia: false, // 弹框显示
      dialogId: 0,
      legend: {
        data: ['油温','环境温度'],
        textStyle: {
          color: 'rgb(226, 230, 232)'
        }
      },
      legendtwo: {
        data: ['油位'],
        textStyle: {
          color: 'rgb(226, 230, 232)'
        }
      },
      xAxis: { // x轴坐标
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: 'rgb(141, 150, 155)'
          }
        },
        axisTick: {
          show: false
        }
      },
      xAxistwo: { // x轴坐标
        type: 'category',
        boundaryGap: false,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        axisLine: {
          lineStyle: {
            color: 'rgb(141, 150, 155)'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: { // y轴坐标
        type: 'value',
        name: '(℃)',
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgb(141, 150, 155)'
          }
        }
      },
      yAxistwo: { // y轴坐标
        type: 'value',
        name: '(℃)',
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgb(141, 150, 155)'
          }
        }
      },
      series: [
        {
          name: '油温',
          type: 'line',
          symbol:'none',
          data: [120, 132, 101, 134, 90, 230, 210, 500, 120, 132, 180, 134, 90, 230, 210, 230, 120, 132, 101, 134, 90, 400, 210, 230],
          color: ['rgb(6, 147, 208)'],
          markLine: {
            symbol: 'none', // 去掉警戒线最后面的箭头
            label: {
              position: 'end', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
              formatter: '',
              color: 'red'
            },
            data: [{
              silent: false, // 鼠标悬停事件  true没有，false有
              lineStyle: { // 警戒线的样式  ，虚实  颜色
                type: 'dashed',
                color: 'red'
              },
              name: '',
              yAxis: 400
            }]
          }
        },
        {
          name: '环境温度',
           symbol:'none',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210, 500, 120, 132, 101, 134, 90, 230, 210, 230, 120, 132, 101, 134, 90, 400, 210, 230],
          color: ['rgb(167, 154, 50)'],
          markLine: {
            symbol: 'none', // 去掉警戒线最后面的箭头
            label: {
              position: 'end', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
              formatter: '',
              color: 'red'
            },
            data: [{
              silent: false, // 鼠标悬停事件  true没有，false有
              lineStyle: { // 警戒线的样式  ，虚实  颜色
                type: 'dashed',
                color: 'red'
              },
              name: '',
              yAxis: 400
            }]
          }
        }
      ],
      seriestwo: [
        {
          name: '油位',
          type: 'line',
          symbol:'none',
          data: [120, 132, 101, 134, 90, 230, 210, 500, 120, 132, 101, 134, 90, 230, 210, 230, 120, 132, 101, 134, 90, 400, 210, 230],
          color: ['rgb(7, 177, 184)'],
          markLine: {
            symbol: 'none', // 去掉警戒线最后面的箭头
            label: {
              position: 'end', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
              formatter: '',
              color: 'red'
            },
            data: [{
              silent: false, // 鼠标悬停事件  true没有，false有
              lineStyle: { // 警戒线的样式  ，虚实  颜色
                type: 'dashed',
                color: 'red'
              },
              name: '',
              yAxis: 400
            }]
          }
        }
      ],
      columns: [
        { // 表头内容
          title: 'Name',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.name)
            ])
          }
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: ' ',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showdia = true
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      dataList: [
        { // 表格内容
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park'
        }
      ]
    }
  }
}
</script>
<style lang="less" scope>
   .el-main {
     color: rgb(208, 210, 211);
     position: relative;
     .dialog {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
     }
      .ech-intro{
        background-color: rgb(23, 52, 70);
        padding-top: 20px;
        font-size: 18px;
        width: 100%;
        p {
          color: rgb(226, 230, 232);
          text-align: center;
          margin-bottom:  20px;
        }
        .echarts {
         width: 100%;
         height: 100%;
        display: flex;
        justify-content: space-between;
        background-color: rgb(23, 52, 70);
        .echartsone,.echartstwo{
            flex: 1;
        }
    }
      }
    .title {
        margin: 20px 0;
    }
    .history {
        margin: 10px 0;
        overflow: hidden;
        position: relative;
        .his-text {
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .el-select-dropdown__empty {
      background-color: rgb(25, 47, 65);
    }
    .el-input__inner {
      background-color: rgb(25, 47, 65);
      border-radius: 0;
      border: 0;
    }

    .his-select {
        float: right;
          .el-range-editor {
          width: 260px;
          height: 35px;
          position: relative;
          top: 3px;
        }
    }
    .el-select {
      .el-input__inner{
        width: 150px;
        height: 35px;
        line-height: 35px;
      }
    }
    .el-input__icon{
      line-height: 35px;
    }
    .el-range-editor .el-range-input {
      background-color: rgb(25, 47, 65);
    }
    }
    .tablesTep{
      .ivu-page li,.ivu-select-selection{
        background-color: rgb(25, 47, 65);
        border: 0;
      }
       div.ivu-table-wrapper {
      border: none;
    }
     .ivu-table:before{content:'';width:100%;height:0px;position:absolute;left:0;bottom:0;z-index:1}
      .ivu-table th {
        background-color: rgb(50, 94, 130);
        color: rgb(215, 224, 231);
        border: 0;
      }
     .ivu-table-wrapper {
    border:none
  }
/*底色*/
.ivu-table td{
  background-color: rgb(18, 39, 54);
  color: #fff;
}
/*每行的基本样式*/
  .ivu-table-row td {
    color: #fff;
    border:none
  }
    .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td {
            background-color: rgb(32, 62, 82)!important;
          }
      .ivu-table-stripe .ivu-table-body tr:nth-child(2n-1) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n-1) td {
            background-color: rgb(18, 38, 54)!important;
          }
  .tablesTep-page {
     background-color: rgb(18, 39, 54);
  }
    }
    .ivu-btn span{
        color: rgb(63, 119, 172);
      }
   }
   .ivu-modal{
      top: 40%!important;
      .ivu-modal-confirm{
        padding: 0;
        .ivu-modal-confirm-body{
          padding-left: 0;
          >div {
            font-size: 18px;
            color: black;
          }
            .sp {
          float: right;
      }
        }
      }
    }
</style>
