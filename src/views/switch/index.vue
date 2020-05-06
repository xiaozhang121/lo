<template>
    <div>
       <div class="crumbs">
   <el-breadcrumb separator="-">
       <el-breadcrumb-item :to="{path:'/main'}">操作中台</el-breadcrumb-item>
       <el-breadcrumb-item>Lora监测</el-breadcrumb-item>
       <el-breadcrumb-item>温湿度传感器</el-breadcrumb-item>
   </el-breadcrumb>
    </div>
    <p class="title">温湿度传感器</p>
    <div class="history">
        <div class="his-text">历史数据</div>
        <div class="his-select">
            <history-select @childstart = 'childstart' @childend = 'childend'></history-select>
        </div>
    </div>
    <div class="ech-intro">
      <p>4号主变A相汇控柜 2020年4月10日 - 11日温湿度变化</p>
      <div class="echa">
    <div class="echartsone">
    <duno-charts
    class="box"
    :legendOption='legend'
    :isChange= change
    :isItemEchart="true/false"
    :titleOption="{}"
    :xAxisOption="xAxis"
    :yAxisOption="yAxis"
    :seriesOption="series"></duno-charts>
    </div>
    </div>
    </div>

    <div class="history">
        <div class="his-text">历史信息记录</div>
        <div class="his-select">
            <history-record></history-record>
        </div>
    </div>
   <!-- table表格 -->
  <duno-tables-tep
    :border = border
    :columns="columns"
    :data="dataList"
    :totalNum="totalNum"
    :pageSize="pageRows"
    :current="pageIndex"
    :isShowPage = false
    @on-selection-change="dataListSelectionChangeHandle"
    @clickPage="pageCurrentChangeHandle"
    @on-page-size-change="pageSizeChangeHandle"
  />
    <!-- 表格点击弹框 -->
    <ele-modal :show='showdia' @change = 'childvalue'></ele-modal>
    </div>
</template>
<script>
import DunoCharts from '@/components/duno-charts/charts.vue'
import HistorySelect from '@/components/historyselect'
import HistoryRecord from '@/components/historyrecord'
import { DunoTablesTep } from '@/components/duno-tables-tep'
import EleModal from '@/components/element-modal/index.vue'

import { postAxiosData } from '@/api/axiosType'
import { getAxiosData } from '@/api/axiosType'
export default {
  created () {
    this.pos();
    this.getall()
  },
  methods: {
    childvalue (val) { // 关闭弹窗 父接收子组件传过来的值
      this.showdia = val
    },
    pos () {
      postAxiosData('lenovo-lora/api/loraPlatform/equipment/lineChartData', 
      {
      deviceId:'1',
      startDate: '20200401',//this.startTime,
      endDate:'20200408',//this.endTime,
      equipmentType:'switch'
      }).then(res => {
        console.log(res.data.lineChartData)
        this.change = true
        this.lineChartData = res.data.lineChartData
        this.lineChartData.map((item,index)=>{
          item.collectTime = item.collectTime.slice(8,10)
          this.xAxis.data.push(item.collectTime);
          this.series[0].data.push(item.newSwitchA);
          this.series[1].data.push(item.newSwitchB);
          this.series[2].data.push(item.newSwitchC)
        })   
      })
    },
    childstart(e){
      this.startTime = e
      console.log(e);
      
    },
    childend(e){
     this.endTime = e
     this.pos()
    }
  },
  components: {
    HistorySelect,
    DunoCharts,
    HistoryRecord,
    EleModal,
    DunoTablesTep
  },
  data () {
    return {
      change:false,
      lineChartData:[],//折线图的所有信息
      collectTime:[],//x轴时间
      startTime:'',//子组件的开始时间
      endTime:'',//子组件的结束时间
      showdia: false,
      legend: {
        data: ['A相','B相','C相'],
        textStyle: {
          color: 'rgb(226, 230, 232)'
        }
      },
      xAxis: {
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
      yAxis: {
        type: 'value',
        name: '次',
        // nameLocation: 'middle',
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgb(141, 150, 155)'
          }
        }
      },
      series: [
        {
          name: 'A相',
          type: 'line',
          // stack: '总量',
          data: [],
          color: ['rgb(0, 178, 253)'],
          symbol:'none',
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
          name: 'B相',
          type: 'line',
          // stack: '总量',
          data: [],
          symbol:'none',
          color: ['rgb(71, 213, 167)'],
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
          name: 'C相',
          type: 'line',
          // stack: '总量',
          data: [],
          symbol:'none',
          color: ['rgb(117, 106, 217)'],
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
      dataList: [
        // {
        //   name: 'John Brown',
        //   age: 18,
        //   address: 'New York No. 1 Lake Park'
        // },
        // {
        //   name: 'Jim Green',
        //   age: 24,
        //   address: 'London No. 1 Lake Park'
        // },
        // {
        //   name: 'Joe Black',
        //   age: 30,
        //   address: 'Sydney No. 1 Lake Park'
        // },
        // {
        //   name: 'Jon Snow',
        //   age: 26,
        //   address: 'Ottawa No. 2 Lake Park'
        // }
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
      ]
    }
  }
}
</script>
<style lang="less" >
    .echa {
        height: 416px;
    }
    .box canvas {
        height: 416px!important;
        width: 100%!important;
    }
    // .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td {
    //         background-color: rgb(32, 62, 82)!important;
    //       }
    //   .ivu-table-stripe .ivu-table-body tr:nth-child(2n-1) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n-1) td {
    //         background-color: rgb(18, 38, 54)!important;
    //       }
   .el-main {
     color: rgb(208, 210, 211);
      .ech-intro{
        background-color: rgb(23, 52, 70);
        padding-top: 20px;
        font-size: 18px;
        p {
          color: rgb(226, 230, 232);
          text-align: center;
          margin-bottom:  20px;
        }
        .echarts {
        background-color: rgb(23, 52, 70);
        .charts {
            height: 100%;
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
          top: 4px;
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
    .tablesTep .ivu-table-body tr:nth-child(2n) td{
    background-color: rgb(32, 62, 82)!important;
  }
   }
</style>
