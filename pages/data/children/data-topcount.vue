<template>
	<view class="layout">
	<view style="padding:30px 0" v-if="!rank.length">
		<uni-load-more v-if="nodata" status="noMore" :contentText="{contentnomore:'没有排行榜数据'}"></uni-load-more>
		<uni-load-more v-else status="loading" :showText="false"></uni-load-more>
	</view>	
	
	<view class="topcount" v-else>
		<view class="item" v-for="(item,index) in rank" :key="index">
			<view class="order" 
			:style="{color:index<3?colors[index]:colors[colors.length-1]}"
			>No.<text>{{index+1}}</text></view>
			<view class="pic">
				<image :src="getSmallImg(item.picurl,80)" class="img" mode="aspectFill" @click="preview(index)"></image>
			</view>
			<view class="progress">
				<progress :percent="prgFormat(item.countTotal)" stroke-width="5"
				:active-color="index<3?colors[index]:colors[colors.length-1]"
				></progress>
			</view>
			<view class="num">{{item.countTotal}}</view>
		</view>
	</view>
	</view>
</template>

<script setup>
import {getSmallImg} from "@/utils/tools.js";
import { ref } from 'vue';
const props = defineProps(['rank','nodata'])
const colors = ref(["#EE6666","#FC8452","#FAC858","#b1b5b3"])
const prgFormat = (curt)=>{
	let max= props.rank[0].countTotal;
	let value  = curt * 100 / max
	return value;
}
const preview = (index)=>{
	let pics = props.rank.map(item=>item.picurl);
	uni.previewImage({
		urls:pics,
		current:index
	})
}
</script>

<style lang="scss" scoped>
.layout{
	min-height: 200px;
}
.topcount{
	.item{
		display: flex;
		align-items: center;
		padding:5px 0;
		.order{
			width: 40px;
			font-size: 12px;
			font-weight: bolder;
			line-height: 1em;
			text{
				font-size: 16px;
			}			
		}
		.pic{
			.img{
				width: 30px;
				height: 50px;
				display: block;
			}
		}
		.progress{
			flex:1;
			padding:0 20px;
		}
		.num{
			width: 40px;
			font-size: 14px;
			color:#666;
		}
	}
}
</style>