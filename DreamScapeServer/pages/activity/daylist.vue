<template>
	<view class="">
		<custom-head-top>
			<template #left>
				每日推荐
			</template>
		</custom-head-top>
		
		<view class="grid">
			<view class="item add">
				+
			</view>
			<view class="item" v-for="item in 10">
				自定义组件
			</view>
		</view>
		
		<view class="paging">
			分页器
		</view>
	</view>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
