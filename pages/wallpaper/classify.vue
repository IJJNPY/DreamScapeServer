<template>
	<view class="classify">
		<custom-head-top>
			<template #left>
				分类管理
			</template>
			<template #right>
				<button type="primary" size="mini" @click="handleAdd">
					<i class="el-icon-plus"></i>
					新增分类
				</button>
				<button type="warn" size="mini">
					<i class="el-icon-delete"></i>
					批量删除
				</button>
			</template>
		</custom-head-top>
		<view class="main">
			<uni-table border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center">缩略图</uni-th>
					<uni-th align="center">分类名称</uni-th>
					<uni-th align="center">排序</uni-th>
					<uni-th align="center">是否推荐</uni-th>
					<uni-th align="center">是否启用</uni-th>
					<uni-th align="center" width="200">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="item in classData" :key="item._id">
					<uni-td>
						<image class="thumb" :src="item.picurl || '/static/logo.png'" mode="aspectFill"></image>
					</uni-td>
					<uni-td>
						{{item.name}}
					</uni-td>
					<uni-td>
						{{item.sort}}
					</uni-td>
					<uni-td>
						<uni-tag v-if="item.select" text="推荐" inverted type="error"/>
						<uni-tag v-else text="普通" inverted />
					</uni-td>
					<uni-td>
						<switch :checked="item.enable" style="transform: scale(0.7);transform-origin:left center;"/>
					</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button size="mini" type="primary" plain>修改</button>
							<button size="mini" type="warn" plain>删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view class="paging">
			<uni-pagination title="标题文字" show-icon="true" total="50" current="2"></uni-pagination>
		</view>
		
		<classify-popup-vue ref="classPopRef" @success="getClassify()"></classify-popup-vue>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import classifyPopupVue from './child/classifyPopup.vue';
import { showToast } from '../../utils/common';
const emits = defineEmits(["success"]);
const classPopRef = ref(null);
const classifyCloudObj = uniCloud.importObject("admin-wallpaper-classify");
const classData = ref([]);

//新增打开弹窗
const handleAdd = () =>{
	classPopRef.value.open();
}

const getClassify = async() =>{
	let {errCode,errMsg,data} = await classifyCloudObj.list();
	if(errCode!==0) return showToast({title:errMsg});
	classData.value = data;
}

getClassify();
</script>

<style lang="scss" scoped>

.main{
	padding: 20px;
	.thumb{
		width: 45px;
		height: 90px;
		border-radius: 3px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>
