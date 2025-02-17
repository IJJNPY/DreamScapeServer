<template>
	<view class="picedit">
		<view class="left">
			<image :src="item.tempurl" mode="aspectFit"></image>
			<view class="mask">
				<view class="icon">
					<uni-icons type="compose" size="20" color="#fff"></uni-icons>
				</view>
			</view>
		</view>
		<view class="right">
			<view class="row">
				<view class="label">图片描述</view>
				<uni-easyinput :value="item.description" @input="descChange" type="textarea" placeholder="请输入图片描述"></uni-easyinput>
			</view>
			<view class="row">
				<view class="label">评分</view>
				<uni-rate :value="item.score" @change="scoreChange" :touchable="false" allow-half="true" :size="30"></uni-rate>
			</view>
			<view class="row">
				<view class="label">标签</view>
				<uni-easyinput @confirm="tabConfirm" v-model="iptValue" placeholder="请输入标签名并回车确认"></uni-easyinput>
				<view class="tabGroup">
					<view class="tab" @click="delTab(tabidx)" v-for="(tab,tabidx) in item.tabs" :key="tab">{{tab}}</view>
				</view>
			</view>
			<view class="row inline">
				<view class="label">是否展现</view>
				<switch @change="checkedChange($event)" v-model="item.checked" :checked="item.checked" style="transform: scale(0.6); transform-origin: left;"></switch>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(["item"]);
const emits = defineEmits(['update:item'])
const iptValue = ref("")

//是否展现切换开关
const checkedChange = (e) =>{
	emits("update:item",{...props.item,checked:e.detail.value});
}

//评分变化
const scoreChange = (e) =>{
	emits("update:item",{...props.item,score:e.value.toString()})
}

//描述变化
const descChange = (e) =>{
	emits("update:item",{...props.item,description:e})
}

//确认标签
const tabConfirm = (index) =>{
	//先使用扩展运算符 ... 把 props.item.tabs 数组中的所有元素展开到新数组中，再把 iptValue.value 添加到新数组的末尾。
	emits("update:item",{...props.item,tabs:[...props.item.tabs,iptValue.value]});
	iptValue.value = '';
}

//删除标签
const delTab = (tabidx) => {
	let tab = [...props.item.tabs];
	tab.splice(tabidx,1);
	emits("update:item",{...props.item,tabs:tab});
}
</script>

<style lang="scss" scoped>
.picedit{
	min-height: 300px;
	border: 1px solid transparent;
	display: flex;
	align-items: start;
	padding: 20px;
	position: relative;
	.left{
		width: 120px;
		aspect-ratio: 9/20;
		position: relative;
		background: conic-gradient(#ccc 0 25%, #fff 25% 50%, #ccc 50% 75%, #fff 75% 100%);
		background-size: 10px 10px;
		image{
			width: 100%;
			height: 100%;
		}
		.mask{
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 30px;
			background: rgba(0, 0, 0, 0.4);
			display: flex;
			align-items: center;
			justify-content: center;
			.icon{
				flex: 1;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}
		}
	}
	.right{
		flex: 1;
		margin-left: 20px;
		color: #666;
		.row{
			margin-bottom: 20px;
			.label{
				font-size: 14px;
				margin-bottom: 6px;
			}
			.tabGroup{
				display: flex;
				padding: 6px;
				flex-wrap: wrap;
				gap: 6px;
				.tab{
					border: 1px solid #1A73E8;
					border-radius: 100px;
					color: #1A73E8;
					font-size: 12px;
					padding: 2px 6px;
					cursor: pointer;
					margin-right: 6px;
				}
				.tab:hover{
					text-decoration: line-through;
				}
			}
			&.inline{
				display: flex;
				align-items: center;
				gap: 10px;
				.label{
					margin-bottom: 0;
				}
			}
		}
		
	}
}
</style>
