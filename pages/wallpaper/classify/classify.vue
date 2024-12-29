<template>
	<view class="layout">		
		<view class="add">
			<input class="ipt" type="text" v-model="classname" placeholder="请输入分类名称" @confirm="onConfirm">			
		</view>
		<view class="list">
			<view class="item" v-for="item in classList" :key="item._id">				
				<view class="name">{{item.name}}</view>
				<view class="status">
					<switch :checked="item.status" style="transform:scale(0.6)" 
					@change="(e)=>switchChange(e,item._id)"/>
				</view>
				<view class="remove">
					<uni-icons type="trash" size="26" @click="handleRemove(item._id)"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
const classname = ref("");
const classList = ref([]);
const db = uniCloud.database();


const getClassify = async()=>{
	let res = await db.collection("dreamscape-classify").orderBy("createTime desc")
	.field("name,status").get();
	console.log(res);
	classList.value = res.result.data
}

const switchChange = async(e,id)=>{
	await db.collection("dreamscape-classify").doc(id).update({
		status:e.detail.value
	})
}

//删除一条分类
const handleRemove = async(id)=>{	
	uni.showLoading({mask:true});	
	let feed = await uni.showModal({
		title:"是否确认删除"		
	})
	if(!feed.confirm) return uni.hideLoading();
	let res = await db.collection("dreamscape-classify").doc(id).remove();	
	uni.showToast({
		title:"删除成功",
		icon:"none"
	})
	getClassify();	
}

const onConfirm = async()=>{
	uni.showLoading();
	let res = await db.collection("dreamscape-classify").add({
		name:classname.value
	})
	classname.value = "";	
	uni.showToast({
		title:"添加成功",
		icon:"none"
	})
	getClassify();
}

getClassify();

</script>

<style lang="scss" scoped>
.layout{
	padding:30rpx;
	.add{
		margin-bottom: 30rpx;
		display: flex;
		gap:20rpx;
		.ipt{
			width: 100%;
			border:1px solid #eee;
			height: 70rpx;
			padding:0 20rpx;
			box-sizing: border-box;
		}		
	}
	.item{
		display: flex;
		padding:10rpx 0;
		align-items: center;
		justify-content: space-between;
		.name{
			color:#007AFF;
			flex:1;
		}
		.status{
			width: 100rpx;			
		}
		.remove{
			width:100rpx;
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
