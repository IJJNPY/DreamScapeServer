<template>
	<view class="usageRecord">
		<custom-head-top>
			<template #left>
				使用记录				
			</template>		
				
			<template #right>				
				<uni-datetime-picker  style="width: 200px;" 
				:start="deftData[0]"
				:end="deftData[1]"
				type="date" 
				:clear-icon="false"
				@change="dataChange"
				v-model="params.single"/>
			</template>
		</custom-head-top>
		
				
		<view class="main">
			<uni-table class="table"  ref="tableRef" border stripe emptyText="暂无更多数据" >
				<uni-tr>					
					<uni-th align="left" >IP</uni-th>
					<uni-th align="left" >次数</uni-th>
				</uni-tr>
				
				<uni-tr v-for="item,index in listData" :key="item._id">					
					<uni-td>{{item.ip || '-'}}</uni-td>
					<uni-td><view class="link" @click="handleLink(index)">{{item.countTotal}}条记录</view></uni-td>					
				</uni-tr>
			</uni-table>
		</view>
			
		<view class="paging">
			<uni-pagination :current="params.current" :total="params.total" 
			:page-size="params.size"  :show-icon="true" @change="pageChange" />
		</view>		
	</view>	
	
	
	
	
	<uni-popup ref="popup" @maskClick="popClose">
		<view class="recordPop">
			<scroll-view scroll-y style="max-height: 600px;" @scrolltolower="onScrolltolower">
				<uni-list border-full>
					<uni-list-item 
					:title="item.functionName" 
					:note="
					`对象名：${item.methodName}					
					参数值：${item.params}
					平台：${item.uniPlatform}
					ip：${item.ip}
					`" 
					:rightText="dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')" 
					v-for="item,index in usageList" :key="index"/>
				</uni-list>
			</scroll-view>			
		</view>
	</uni-popup>
	
</template>

<script setup>
import { ref } from 'vue';
import dayjs from "dayjs"
const dataCloudObj = uniCloud.importObject("admin-data-record",{customUI:true});
const deftData = ref([
	dayjs().subtract(2,"d").startOf("d").valueOf(),
	dayjs().endOf("day").valueOf()
])
const popup = ref(null);
const listData = ref([]);
const usageList = ref([]);
const params = ref({
	current:1,
	total:0,
	size:20,
	single:dayjs().format("YYYY-MM-DD HH:mm:ss")
})

const ipParams = ref({
	current:1,	
	size:50,
	index:-1,
	noData:false
})

const getData = async()=>{
	let {errCode,data=[],count=0} = await dataCloudObj.usageRecord(params.value);
	listData.value = data
	console.log(data);
	params.value.total = count	
}


const pageChange = (e)=>{
	params.value.current = e.current;
	getData();
}

const handleLink = async(index)=>{	
	ipParams.value.index = index
	await getIpList();	
	popup.value.open();
}


const getIpList = async()=>{	
	try{
		uni.showLoading()
		let {data,errCode} = await dataCloudObj.usageIpList({...ipParams.value,single:params.value.single,ip:listData.value[ipParams.value.index].ip});
		if(data.length<ipParams.value.size) ipParams.value.noData = true;
		usageList.value = [...usageList.value,...data];
		console.log(data);
	}finally{
		uni.hideLoading();
	}	
}


const dataChange = ()=>{
	getData();
}

const popClose = ()=>{
	ipInit();
}

const ipInit = ()=>{
	usageList.value = [];
	ipParams.value = {
		current:1,	
		size:30,
		index:-1,
		noData:false
	}
};

const onScrolltolower = ()=>{	
	if(ipParams.value.noData) return;
	ipParams.value.current++;
	getIpList();
}


getData();
</script>

<style lang="scss" scoped>
.main{
	padding:20px;
	.table{
		.link{
			text-decoration: underline;
			color:var(--primary-color);
			cursor: pointer;
		}
	}
}
.recordPop{
	width: 600px;
	min-height: 400px;	
	background: #fff;
	border-radius: 10px;
	background: #fff;
	padding:30px;
}

:deep(.uni-date-range--x){
	right:0;
}
:deep(.uni-popper__arrow){
	left:80%;
}
:deep(.uni-list-item__extra-text){
	color:#666;
}
</style>
