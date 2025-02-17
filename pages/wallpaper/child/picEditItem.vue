<template>
	<view class="picedit">
		<view class="left">
			<image :src="item.tempurl" mode="aspectFit"></image>
			<view class="mask">
				<view class="icon">
					<uni-icons type="compose" size="20" color="#fff"></uni-icons>
				</view>
			</view>
		</view>s
		<view class="right">
			<view class="row">
				<view class="label">图片描述</view>
				<uni-easyinput v-model="item.description" type="textarea" placeholder="请输入图片描述"></uni-easyinput>
			</view>
			<view class="row">
				<view class="label">评分</view>
				<uni-rate v-model="item.score" :touchable="false" allow-half="true" :size="30"></uni-rate>
			</view>
			<view class="row">
				<view class="label">标签</view>
				<uni-easyinput @confirm="tabConfirm(index)" v-model="item.iptValue" placeholder="请输入标签名并回车确认"></uni-easyinput>
				<view class="tabGroup">
					<view class="tab" @click="delTab(index,tabidx)" v-for="(tab,tabidx) in item.tabs" :key="tab">{{tab}}</view>
				</view>
			</view>
			<view class="row inline">
				<view class="label">是否展现</view>
				<switch @change="checkedChange($event,index)" v-model="item.checked" :checked="item.checked" style="transform: scale(0.6); transform-origin: left;"></switch>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps(["Item"]);
</script>

<style lang="scss" scoped>

</style>
