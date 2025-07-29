<template>
	<view class="dataindex">
		<custom-head-top>
			<template #left>
				数据概览				
			</template>
			
			<template #right>				
				<uni-datetime-picker style="width: 300px;" 
				:clear-icon="false"
				:start="deftData[0]"
				:end="deftData[1]"
				@change="dataChange"
				v-model="dataRange" type="daterange" />				
			</template>
		</custom-head-top>
		
		<view class="main">
			<view class="grid">
				
				<view class="section">
					<uni-card title="使用量" margin="0" :is-shadow="false">
						<view class="box">
							<view class="icon">
								<uni-icons type="eye-filled" size="40" color="#9A60B4"></uni-icons>
							</view>
							<view class="text">
								<view class="big">{{usageTotal}}<text class="unit">次</text></view>
								<view class="small">请求次数</view>
							</view>
						</view>
					</uni-card>
				</view>
				
				<view class="section">
					<uni-card title="使用人数" margin="0" :is-shadow="false">
						<view class="box">
							<view class="icon">
								<uni-icons type="person-filled" size="40" color="#1890FF"></uni-icons>
							</view>
							<view class="text">
								<view class="big">{{userTotal}}<text class="unit">人</text></view>
								<view class="small">IP用户量统计</view>
							</view>
						</view>
					</uni-card>
				</view>
				
				<view class="section">
					<uni-card title="硬币使用" margin="0" :is-shadow="false">
						<view class="box">
							<view class="icon">
								<uni-icons type="smallcircle" size="40" color="#91CB74"></uni-icons>
							</view>
							<view class="text">
								<view class="big">{{coinTotal}}<text class="unit">人</text></view>
								<view class="small">使用硬币人次</view>
							</view>
						</view>
					</uni-card>
				</view>
				<view class="section">
					<uni-card title="上传量" margin="0" :is-shadow="false">
						<view class="box">
							<view class="icon">
								<uni-icons type="upload-filled" size="40" color="#FC8452"></uni-icons>
							</view>
							<view class="text">
								<view class="big">{{uploadTotal}}<text class="unit">张</text></view>
								<view class="small">上传图片量</view>
							</view>
						</view>
					</uni-card>
				</view>
				
				
				<view class="section">					
					<uni-card title="使用趋势图" margin="0" :is-shadow="false">
						<data-trend :datas="baseDataList"></data-trend>
					</uni-card>					
				</view>
				<view class="section">
					<uni-card title="分类喜好度" margin="0" :is-shadow="false">
						<dataLikeClass :datas="likeClassData"></dataLikeClass>
					</uni-card>
				</view>
				
				<view class="section">
					<uni-card title="下载Top9" margin="0" :is-shadow="false">											
						<dataTopcount :rank='downloadList' :nodata="downloadNodata"></dataTopcount>
					</uni-card>
				</view>
				<view class="section">
					<uni-card title="评分Top9" margin="0" :is-shadow="false">
											
						<dataTopcount :rank="scoreList" :nodata='scoreNodata'></dataTopcount>
					</uni-card>
				</view>
					
			
			
				
				
			</view>
		</view>
	</view>
</template>

<script setup>
import {computed, ref} from "vue";
import dayjs from "dayjs";
import dataTrend  from "./children/data-trend.vue"
import dataLikeClass  from "./children/data-like-class.vue"
import dataTopcount  from "./children/data-topcount.vue"
const overviewCloudObj  = uniCloud.importObject("admin-data-overview",{customUI:true});
const dataRange = ref([
	dayjs().subtract(7,"day").startOf("day").format("YYYY-MM-DD"),
	dayjs().endOf("day").format("YYYY-MM-DD")
]);
const downloadList = ref([])
const scoreList = ref([]);
const downloadNodata = ref(false);
const scoreNodata = ref(false);
const likeClassData = ref([]);
const baseDataList = ref([]);
const usageTotal = ref(0);
const userTotal = ref(0)
const coinTotal = ref(0)
const uploadTotal = ref(0)
const deftData = ref([
	dayjs().subtract(6,"M").startOf("day").valueOf(),
	dayjs().endOf("day").valueOf()
])

const dataChange = (e)=>{
	console.log(e);
	load();
}


const downloadRankOrder = async()=>{
	downloadNodata.value = false;
	let res = await overviewCloudObj.rankOrder({type:"download",dataRange:dataRange.value});
	if(!res.length) downloadNodata.value = true;	
	downloadList.value = res;
}
const scoreRankOrder = async()=>{
	scoreNodata.value = false;
	let res = await overviewCloudObj.rankOrder({type:"score",dataRange:dataRange.value});	
	if(!res.length) scoreNodata.value = true;
	scoreList.value = res;
}

const likeClassify = async()=>{
	let res=await overviewCloudObj.likeClassify({dataRange:dataRange.value})
	likeClassData.value = res;
	console.log(res);
}

//获取基础的统计数据
const baseCount = async()=>{
	let res=await overviewCloudObj.countTotal({dataRange:dataRange.value})	
	baseDataList.value = res 
	
	usageTotal.value = baseDataList.value.reduce((prev,current,index)=>{	
		return prev+current.usageCount
	},0)
	userTotal.value = baseDataList.value.reduce((prev,current,index)=>{	
		return prev+current.userCount
	},0)
	coinTotal.value = baseDataList.value.reduce((prev,current,index)=>{	
		return prev+current.coinCount
	},0)

	uploadTotal.value = baseDataList.value.reduce((prev,current,index)=>{	
		return prev+current.uploadCount
	},0)
	
	console.log(res);
}

const load = ()=>{
	downloadRankOrder();
	scoreRankOrder();
	likeClassify();
	baseCount();
}

load();

</script>

<style lang="scss" scoped>
.dataindex{
	.main{
		padding:20px;
		.grid{
			display: grid;
			grid-template-columns: repeat(24,1fr);
			gap:20px;
			.section{				
				grid-column:span 6;
				min-height: 200px;
				.box{
					display: flex;
					flex-direction: column;
					align-items: center;
					text-align: center;
					padding:30px 0;
					.text{
						.big{
							font-weight: bolder;
							color:#333;
							font-size: 25px;
							padding:10px 0 2px;
							.unit{
								font-size: 14px;
							}
						}
						.small{
							font-size: 12px;
							color:#999;
						}
					}
				}
			}
			.section:nth-child(5){
				grid-column:span 16;
			}
			.section:nth-child(6){
				grid-column:span 8;
			}
			.section:nth-child(7){
				grid-column:span 12;
			}
			.section:nth-child(8){
				grid-column:span 12;
			}
		}
	}
}

@media (max-width:992px){
	.section{
		grid-column:span 24 !important;
	}
}

:deep(.uni-date-range--x){
	right:0;
}
:deep(.uni-popper__arrow){
	left:80%;
}
</style>
