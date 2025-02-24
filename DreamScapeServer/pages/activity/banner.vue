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
					<uni-th align="left" width="180">缩略图</uni-th>
					<uni-th align="left">排序</uni-th>
					<uni-th align="left">跳转地址</uni-th>
					<uni-th align="left">跳转方式</uni-th>
					<uni-th align="left">appid</uni-th>
					<uni-th align="left">是否启用</uni-th>
					<uni-th align="left">发布者</uni-th>
					<uni-th align="left">发布时间</uni-th>
					<uni-th align="left" width="200">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="item in bannerData" :key="item._id">
					<uni-td>
						<image class="thumb" @click="previewImg(item.picurl)" :src="getSmallImg(item.picurl,200)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>{{item.sort}}</uni-td>
					<uni-td>{{item.url}}</uni-td>
					<uni-td>
						<uni-tag v-if="item.target =='self'" inverted size="mini" text="站内" type="success"></uni-tag>
						<uni-tag v-if="item.target =='miniProgram'" inverted size="mini" text="站外" type="warning"></uni-tag>
					</uni-td>
					<uni-td>{{item.appid}}</uni-td>
					<uni-td>
						<switch :checked="item.checked" style="transform: scale(0.7);transform-origin:left center;" @change="checkedChange($event,item._id)"/>
					</uni-td>
					<uni-td>{{item.nickname}}</uni-td>
					<uni-td>{{dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}}</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button size="mini" type="primary" plain @click="update(item._id)">修改</button>
							<button size="mini" type="warn" plain 
							@click="removeItem(item._id)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			{{item}}
		</view>
		
		<bannerPopupVue ref="popupRef" @success=""></bannerPopupVue>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { previewImg } from '../../utils/common';
import { getSmallImg } from '../../utils/tools';
import bannerPopupVue from './child/bannerPopup.vue';
import dayjs from 'dayjs';

const bannerData = ref([]);
const popupRef = ref(null);
const activityCloudObj = uniCloud.importObject("admin-activity-common");

const getData = async() =>{
	let {errCode,data} = await activityCloudObj.bannerList();
	bannerData.value = data;
	console.log(data)
}

const handleAdd = () =>{
	popupRef.value.open();
}

const checkedChange = (e,id) =>{
	
}

const update = (id) =>{
	
}

const remove = (id) =>{
	
}
getData()
</script>

<style lang="scss" scoped>
.main{
	padding: 20px;
	.thumb{
		width: 150px;
		height: 80px;
	}
}
</style>
