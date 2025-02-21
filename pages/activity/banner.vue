<template>
	<view class="banner">
		<custom-head-top>
			<template #left>
				首页海报
			</template>
			<template #right>
				<button type="primary" size="mini" @click="handleAdd">
					<i class="el-icon-plus"></i>
					新增海报
				</button>
			</template>
		</custom-head-top>
		
		<view class="main">
			<uni-table ref="tableRef" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="left" width="150">缩略图</uni-th>
					<uni-th align="left">排序</uni-th>
					<uni-th align="left">跳转地址</uni-th>
					<uni-th align="left">跳转方式</uni-th>
					<uni-th align="left">appid</uni-th>
					<uni-th align="left">是否启用</uni-th>
					<uni-th align="left">发布者</uni-th>
					<uni-th align="left">发布时间</uni-th>
					<uni-th align="left" width="200">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="item in 3" :key="item._id">
					<uni-td>
						<image class="thumb" @click="previewImg(item.picurl)" :src="getSmallImg(item.picurl)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>1</uni-td>
					<uni-td>2</uni-td>
					<uni-td>3</uni-td>
					<uni-td>4</uni-td>
					<uni-td>5</uni-td>
					<uni-td>6</uni-td>
					<uni-td>7</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button size="mini" type="primary" plain @click="update(item._id)">修改</button>
							<button size="mini" type="warn" plain 
							@click="removeItem(item._id)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { previewImg } from '../../utils/common';
import { getSmallImg } from '../../utils/tools';
const bannerData = ref([]);

const update = (id) =>{
	
}

const remove = (id) =>{
	
}

</script>

<style lang="scss" scoped>
.main{
	padding: 20px;
}
</style>
