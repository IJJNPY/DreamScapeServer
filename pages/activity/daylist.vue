<template>
	<view class="">
		<custom-head-top>
			<template #left>
				每日推荐
			</template>
		</custom-head-top>
		
		<view class="grid">
			<view class="item add" @click="routerTo('/pages/activity/dayadd')">
				+
			</view>
			<view class="item" v-for="item in 10">
				<DayItem></DayItem>
			</view>
		</view>
		
		<view class="paging">
			分页器
		</view>
	</view>
</template>

<script setup>
import DayItem from './child/DayItem.vue';
import { routerTo, showToast } from "../../utils/common";


</script>

<style lang="scss" scoped>
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
