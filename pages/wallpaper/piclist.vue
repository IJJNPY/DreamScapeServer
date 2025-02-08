<template>
	<view class="piclist">
		<custom-head-top>
			<template #left>
				壁纸列表
			</template>
			<template #right>
				<uni-data-select style="width: 200px;" placeholder="选择分类"></uni-data-select>
				<button type="primary" size="mini" @click="handleAdd">
					<i class="el-icon-plus"></i>
					新增壁纸
				</button>
			</template>
		</custom-head-top>
		
		<view class="main">
			<el-table>
				<uni-tr>
					<uni-th align="center">缩略图</uni-th>
					<uni-th align="center">分类名称</uni-th>
					<uni-th align="center">排序</uni-th>
					<uni-th align="center">是否推荐</uni-th>
					<uni-th align="center">是否启用</uni-th>
					<uni-th align="center" width="200">操作</uni-th>
				</uni-tr>
			</el-table>
		</view>
	</view>
</template>

<script setup>
import { routerTo } from '../../utils/common';

const handleAdd = () =>{
	routerTo("/pages/wallpaper/picadd");
}
</script>

<style lang="scss" scoped>

</style>
