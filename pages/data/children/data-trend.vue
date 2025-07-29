<template>
  <view class="charts-box">
    <qiun-data-charts	  
      type="area"
      :opts="opts"
      :chartData="chartData"
	  :ontouch="true"
    />
  </view>
</template>

<script>
import dayjs from 'dayjs';
export default {
  data() {
    return {
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['area'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],		
        padding: [15,15,0,15],
        enableScroll: true,		
        legend: {},
        xAxis: {
          disableGrid: true,
		  scrollShow: true,
		  itemCount: 8
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.2,
            addLine: true,
            width: 2,
            gradient: true,
            activeType: "hollow"
          }
        }
      }
    };
  },
  props:{
	  datas:{
		  type:Array,
		  default(){
			  return []
		  }
	  }
  },  
  watch:{
  	 datas:{
  		 handler(nv,ov){
  			 this.$nextTick(()=>{
  			 	this.getServerData();
  			 })
  		 },
  		 deep:true,
  		 immediate:true
  	 }	 
  },
  methods: {
    getServerData() {
		let categories = this.datas.map(item=>dayjs(item.day).format("MM/DD"))
		let uageList = this.datas.map(item=>item.usageCount)
		let downloadList = this.datas.map(item=>item.downloadCount);
		let scoreList = this.datas.map(item=>item.scoreCount);		
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
            categories,
            series: [
              {
                name: "使用量",
                data: uageList
              },
              {
                name: "下载量",
                data: downloadList
              },
              {
                name: "评分量",
                data: scoreList
              }
            ]
          };
        this.chartData = JSON.parse(JSON.stringify(res));
      
    },
  }
};
</script>

<style scoped>
  /* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
  .charts-box {
    width: 100%;
    height: 300px;
  }
</style>