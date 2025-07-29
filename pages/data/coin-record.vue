<template>
	<view class="coin">
		<custom-head-top>
			<template #left>
				硬币记录				
			</template>
			
			<template #right>				
				<uni-datetime-picker style="width: 300px;" 
				:start="deftData[0]"
				:end="deftData[1]"
				@change="dataChange"
				v-model="params.dataRange" type="daterange" />				
			</template>
		</custom-head-top>
		<view class="main">
			<uni-table class="table"  ref="tableRef" border stripe emptyText="暂无更多数据" >
				<uni-tr>
					<uni-th align="left" >用户名</uni-th>
					<uni-th align="left" >积分</uni-th>
					<uni-th align="left" >每日领币</uni-th>
					<uni-th align="left" >操作记录</uni-th>
					<uni-th align="left" >IP</uni-th>
					<uni-th align="left" >创建时间</uni-th>
				</uni-tr>
				
				<uni-tr v-for="item,index in listData" :key="item._id">
					<uni-td>{{item.nickname}}</uni-td>
					<uni-td>{{item.total}}</uni-td>
					<uni-td>
						<uni-tag v-if="item.dayGet" text="已领取" type="primary" size="mini"/>
						<uni-tag v-else text="未领取" type="default" size="mini" inverted/>	
					</uni-td>
					<uni-td><view class="link" @click="handleLink(index)">{{item.record.length}}条记录</view></uni-td>
					<uni-td>{{item.ip || '-'}}</uni-td>
					<uni-td>{{dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		
		<view class="paging">
			<uni-pagination :current="params.current" :total="params.total" 
			:page-size="params.size"  :show-icon="true" @change="pageChange" />
		</view>
		
	</view>
	
	
	<uni-popup ref="popup">
		<view class="recordPop">
			<scroll-view scroll-y style="max-height: 600px;">
				<uni-list border-full>
					<uni-list-item :title="item.desc" 
					:note="dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')" 
					:rightText="item.score+''" 
					v-for="item,index in recordList" :key="index"/>
				</uni-list>
			</scroll-view>			
		</view>
	</uni-popup>
	
</template>

<script setup>
import { ref } from 'vue';
import dayjs from "dayjs"
const dataCloudObj = uniCloud.importObject("admin-data-record",{customUI:true});
const popup = ref(null);
const listData = ref([]);
const recordList = ref([]);
const params = ref({
	current:1,
	total:0,
	size:20,
	dataRange:[]
})
const deftData = ref([
	dayjs().subtract(6,"M").startOf("day").valueOf(),
	dayjs().endOf("day").valueOf()
])


const getData = async()=>{
	let {errCode,data=[],count=0} = await dataCloudObj.coinRecord(params.value);
	listData.value = data
	params.value.total = count	
}
const handleLink = (index)=>{	
	recordList.value = listData.value[index].record
	popup.value.open();
}

const pageChange = (e)=>{
	params.value.current = e.current;
	getData();
}

const dataChange = ()=>{
	getData();
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
</style>
