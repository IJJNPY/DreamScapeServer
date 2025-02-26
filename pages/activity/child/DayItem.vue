<template>
	<view class="dayitem" :class="{disable:!item.checked}">
		<view class="pic">
			<view class="group">
				<view class="box" v-for="pic in item.picList.slice(0,5)">
					<image mode="aspectFill" :src="getSmallImg(pic.picurl,140)"></image>
				</view>				
			</view>
			<view class="count">
				{{item.view_count}}人看过
			</view>
			
			<view class="operate" v-if="operate">
				<view class="btn remove" @click="remove(item._id)">
					<uni-icons type="trash" size="22" color="#666"></uni-icons>
				</view>
				<view class="btn update" @click="goEdit(item._id)">
					<uni-icons type="compose" size="22" color="#666"></uni-icons>
				</view>
			</view>
			
		</view>
		<view class="text">
			<view class="title">{{item.theme || "专题名称"}} </view>
			<view class="desc">
				<view class="time">{{item.day || '1970-01-01'}}推送</view>
				<view class="num">
					<uni-icons type="image" size="23" color="#999"></uni-icons>
					<text>{{item.size || item.picList.length}}P</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { routerTo, showModal, showToast } from '../../../utils/common';
import { getSmallImg } from '../../../utils/tools';
const emits = defineEmits(['removeSuccess'])
const dayCloudObj = uniCloud.importObject("admin-activity-everyday")
const props = defineProps({
	item:Object,
	operate:{
		type:Boolean,
		default:true
	}
})
	
const remove = async(id)=>{
	let feedback = await showModal({content:"是否确认删除"});
	if(feedback!='confirm') return;
	let {errCode} = await dayCloudObj.remove(id)
	if(errCode!==0) return showToast({title:"请刷新重试"})
	showToast({title:"删除成功"})
	emits("removeSuccess")
}

const goEdit = (id)=>{
	routerTo("/pages/activity/dayadd?id="+id)
}

</script>

<style lang="scss" scoped>
.dayitem{
	width: 100%;
	height: 100%;
	.pic{
		width: 100%;
		aspect-ratio: 1.618 / 1;		
		position: relative;
		overflow: hidden;
		background: #eee;
		.group{
			width: 600px;
			height: 600px;			
			position: absolute;
			top:50%;
			left:50%;
			transform: translate(-50%,-50%) rotate(15deg) scale(0.7);			
			.box{
				width: 192px;
				aspect-ratio: 9 / 20;
				position: absolute;
				border-radius: 10px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
					display: block;
				}
			}
			.box:nth-child(1){
				left:50%;
				top:50%;
				transform: translate(-50%,-50%);				
			}
			.box:nth-child(2){
				left:0%;
				bottom:calc(50% + 10px);				
			}
			.box:nth-child(3){
				left:0%;
				top:50%;							
			}
			.box:nth-child(4){
				right:0%;
				bottom:calc(50% + 10px);							
			}
			.box:nth-child(5){
				right:0%;
				top:50%;							
			}
		}
		.count{
			position: absolute;
			right:10px;
			top:10px;
			background: rgba(0,0,0,0.2);
			color:rgba(255,255,255,0.8);
			border:1px solid rgba(255,255,255,0.8);
			font-size: 10px;
			border-radius: 20px;
			padding:5px 10px;
			backdrop-filter: blur(10px);
		}
		.operate{
			position: absolute;
			left:10px;
			top:10px;
			z-index: 9;
			display: none;
			.btn{
				cursor: pointer;
				width: 40px;
				height: 40px;
				background: #fff;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left:10px;
				box-shadow: 0 0 15px rgba(0,0,0,0.8);
			}
			.btn:hover{
				background: #f4f4f4;
			}
		}
	}
	
	.text{
		border-top:1px solid #efefef;
		padding:15px;
		.title{
			font-size: 23px;
			font-weight: bold;
			margin-bottom: 7px;
		}
		.desc{
			display: flex;
			align-items: center;
			justify-content: space-between;
			color:#999;
			.num{
				color:#999;
				font-size: 15px;
				display: flex;
				align-items: center;
			}
		}
	}
}
.dayitem:hover{
	.operate{
		display: flex;
	}
}
.disable{
	filter: grayscale(90%);
	opacity: 0.8;
}
</style>