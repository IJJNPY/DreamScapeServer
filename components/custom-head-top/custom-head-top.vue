<template>
	<view class='custom-head-top'>
		<view class="left">
			<slot name="left"></slot>
		</view>
		<view class="right">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.custom-head-top{
	height: 70px;
	padding: 0 20px;
	border-bottom: 1px solid #eee;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.left{
		font-size: 18px;
		font-weight: bold;
	}
	.right{
		display: flex;
		gap: 10px;
	}
}
</style>