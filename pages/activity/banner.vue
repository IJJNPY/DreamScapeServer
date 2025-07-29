<template>
	<view class="banner">
		<custom-head-top>
			<template #left>
				首页海报
			</template>
			
			<template #right>
				<button type="primary" size="mini" @click="handleAdd">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
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
					<uni-th align="right" width="200">操作</uni-th>
				</uni-tr>
				
				<uni-tr v-for="(item,index) in bannerData" :key="item._id">
					<uni-td>
						<image class="thumb"
						@click="previewImg(item.picurl)"
						:src="getSmallImg(item.picurl,200)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>{{item.sort}}</uni-td>
					<uni-td>{{item.url}}</uni-td>
					<uni-td>
						<uni-tag v-if="item.target == 'self'" inverted size="mini" text="站内" type="success" />
						<uni-tag v-if="item.target == 'miniProgram'" inverted size="mini" text="站外" type="warning" />					
					</uni-td>
					<uni-td>{{item.appid}}</uni-td>
					<uni-td>
						<switch :disabled="!hasPermission('UPDATE_PERMISSION',item.user_id)" :checked="item.checked" style="transform:scale(0.6);transform-origin: left center;" @change="checkedChange($event,item._id)"/>
					</uni-td>
					<uni-td>{{item.nickname}}</uni-td>
					<uni-td>{{dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}}</uni-td>
					
					<uni-td>
						<view class="operate-btn-group">
							<button :disabled="!hasPermission('UPDATE_PERMISSION',item.user_id)" size="mini" type="primary" plain 
							@click="update(item._id)">修改</button>
							<button 
							:disabled="!hasPermission('DELETE_PERMISSION',item.user_id)" size="mini" type="warn" plain 
							@click="remove(item._id)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			
			</uni-table>
		</view>
		
		<BannerPopup ref="popupRef" 
		:maxSort="bannerData[bannerData.length-1]?.sort"
		@success="getData()" :item="item"></BannerPopup>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { previewImg, showModal, showToast ,hasPermission} from '../../utils/common';
import { getSmallImg } from '../../utils/tools';
import BannerPopup from "./children/BannerPopup.vue"
import dayjs from "dayjs"
const bannerData = ref([]);
const popupRef = ref(null);
const activityCloudObj = uniCloud.importObject("admin-activity-banner")
const item = ref(null);

const getData = async()=>{
	let {errCode,data} = await activityCloudObj.list();
	bannerData.value = data;
	console.log(data);
}

const handleAdd = ()=>{
	popupRef.value.open();
}

const checkedChange = async(e,id)=>{
	try{
		uni.showLoading({mask:true});
		let {errCode,errMsg} = await activityCloudObj.update({_id:id,checked:e.detail.value});
		if(errCode!=0) return showToast({title:errMsg});
		getData();
	}catch(err){
		console.log(err);
	}finally{
		uni.hideLoading();
	}
}

const update = async(id)=>{
	let {errCode,errMsg,data} = await activityCloudObj.item(id);	
	if(errCode!==0) return showToast({title:errMsg});	
	item.value = data;
	popupRef.value.open();	
}

const remove = async(id)=>{	
	try{		
		let feedback = await showModal({content:"是否确认删除？"})
		if(feedback!=='confirm') return;
		uni.showLoading({mask:true})
		let {errCode,errMsg} =await activityCloudObj.remove([id])
		if(errCode!==0) return showToast({"title":errMsg})
		showToast({"title":"删除成功"})
		getData();
	}catch(err){	
		console.log(err);
		showToast({"title":err})
	}	
} 

getData();
</script>

<style lang="scss" scoped>
.main{
	padding:20px;
	.thumb{
		width: 150px;
		height: 80px;
		
	}
}
</style>
