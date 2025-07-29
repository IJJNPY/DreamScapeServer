<template>
	<view class="daylist">
		<custom-head-top>
			<template #left>
				每日推荐
			</template>
			
			
			<template #right>
				<view class="isChecked">
					<text>全部{{dayChecked?'启用':'禁用'}}</text>
					<switch :disabled="!hasPermission('UPDATE_PERMISSION')" :checked="dayChecked" class="switchStyle" @change="dayChange"/>
				</view>
			</template>
		</custom-head-top>
		
		<view class="grid">
			<view class="item add" @click="routerTo('/pages/activity/dayadd')">
				+
			</view>
			<view class="item" v-for="item in dayList" :key="item._id">
				<DayItem :item="item" @removeSuccess="getDays()"></DayItem>
			</view>
		</view>
		
		
		<view class="paging">
			<uni-pagination :current="params.current" :total="params.total"
			:page-size="params.size"  :show-icon="true" @change="pageChange" />
		</view>
		
		
	</view>
</template>

<script setup>
import { ref } from "vue";
import { routerTo, showToast,hasPermission } from "../../utils/common";
import DayItem from "./children/DayItem.vue"

const params = ref({
	current:1,
	total:0,
	size:10
})
const dayList = ref([]);
const dayChecked = ref(true);
const dayCloudObj = uniCloud.importObject("admin-activity-everyday")

uni.$on("daySuceess",()=>{
	getDays();
})


const getDays = async()=>{
	let res = await dayCloudObj.list(params.value)
	dayList.value  = res.data;
	params.value.total = res.count;
	dayChecked.value = dayList.value.some(item=>item && item.checked)
	console.log(res);
}

const pageChange = (e)=>{
	params.value.current = e.current;
	getDays()
}

const dayChange =async (e)=>{	
	let {errCode} = await dayCloudObj.updateCheck(e.detail.value)
	if(errCode!==0) return showToast({title:"请重试"})
	showToast({title:"修改成功"})
	getDays()
}


getDays()


</script>

<style lang="scss" scoped>	
.isChecked{
	display: flex;
	align-items: center;
	text{
		font-size: 14px;
		color:#888;
		margin-right: 10px;
	}
}
.grid{
	padding:20px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 30px;
	.item{
		border:1px solid #efefef;
		background: #fff;
		border-radius: 8px;
		min-height: 200px;
	}
	.item.add{
		background: #F8F8F8;
		font-size: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		color:#999;
		cursor: pointer;
	}
	.item:hover{
		border-color:#e0e0e0;
	}
}
</style>
