<template>
	<view class="layout">
		<view class="add" @click="handleAdd">
			<button size="mini" type="primary">添加</button>
		</view>
		<view class="list">
			
			<unicloud-db ref="udb" v-slot:default="{hasMore,data,pagination,loading,error,options}" :collection="colList" :page-size="7" getcount 
			field="description,classid.name as classname,picurl.url as url,createTime">							
				<view v-if="error">{{error}}</view>
				<view v-if="loading"><uni-load-more status="loading"></uni-load-more></view>
				<view class="item" v-for="item in data">
					<view class="left">
						<image :src="item.url" mode="aspectFill" @click="preview(item.url)"></image>
					</view>
					<view class="right">
						<view class="desc">{{item.description}}</view>
						<view class="classname">
							<text>
								{{item.classname[0]}} 
							</text>
							<text>
								{{dayjs(item.createTime).format("MM-DD HH:mm")}}
							</text>
						</view>
					</view>
				</view>
				
				<uni-load-more v-if="!hasMore && !loading" status="noMore"></uni-load-more>
			</unicloud-db>

		</view>
	</view>
	
		
	
	<uni-popup ref="popup" border-radius="10px 10px 0 0" :is-mask-click="false">
		<view class="popupOut">	
			<uni-file-picker
			v-model="formData.picurl"
			return-type="object"			
			></uni-file-picker>
			<textarea placeholder="请输入壁纸描述" v-model="formData.description"></textarea>			
			<uni-data-select
			  collection="dreamscape-classify"
			  field="name as text,_id as value"
			  where="status == true"
			  orderby="_id desc"
			  v-model="formData.classid"
			  :clear="true"
			/>
			<view class="group">
				<button type="primary" size="mini" @click="onSubmit" :disabled="disabled">提交</button>
				<button type="default" size="mini" @click="onCancel">取消</button>
			</view>			
			
		</view>
	</uni-popup>
</template>

<script setup>
import { computed, ref } from 'vue';
import {onReachBottom} from "@dcloudio/uni-app"
import dayjs from "dayjs"
const db = uniCloud.database();
const udb = ref(null);
const popup = ref(null);
const formData = ref({
	description:"",
	picurl:{},
	classid:""
});
const listData = ref([]);

const colList = ref([
	db.collection("dreamscape-wallpaper").orderBy("createTime desc").getTemp(),
	db.collection("dreamscape-classify").getTemp()
])

const disabled = computed(()=>{
	if(formData.value.description && 
	formData.value.classid && 
	Object.keys(formData.value.picurl).length>0 
	){
		return false
	}else{
		return true
	}
	
})

const getData = async()=>{
	// let wallTemp = db.collection("dreamscape-wallpaper")
	// .field("description,classid,picurl")
	// .orderBy("createTime desc")
	// .getTemp();
	
	// let classTemp = db.collection("demo-classify")
	// .field("_id,name")
	// .getTemp();
	
	// let {result:{data,errCode}} = await db.collection(wallTemp,classTemp).
	// field("description,picurl.url as url,classid.name as classname,createTime")
	// .get();
	// if(errCode == 0){
	// 	listData.value = data
	// }

}


const handleAdd = ()=>{
	popup.value.open();
}

const onSubmit = async()=>{	
	uni.showLoading();
	let res = await db.collection("dreamscape-wallpaper").add(formData.value);
	uni.showToast({
		title:"发布成功",
		icon:"none"
	})
	onCancel();
	init();
	getData();
	console.log(res);
}

const onCancel = ()=>{
	popup.value.close();
}

const preview = (url)=>{
	uni.previewImage({
		urls:[url]
	})
}

const init = ()=>{
	formData.value = {
		description:"",
		picurl:{},
		classid:""
	}
}


onReachBottom(()=>{
	udb.value.loadMore();
})


getData();

</script>

<style lang="scss" scoped>
.layout{
	padding:30rpx;
	.add{
		margin-bottom:30rpx;
	}
	.list{
		.item{
			padding:15rpx 0;
			border-top:1px solid #eee;
			display: flex;
			.left{
				width: 200rpx;
				height: 200rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 8rpx;
				}
			}
			.right{
				flex:1;
				padding-left:30rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.desc{
					font-size: 30rpx;
					line-height: 1.6em;
				}
				.classname{
					font-size: 28rpx;
					color:#999;
					padding-top:20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}
		.item:last-child{
			border-bottom:1px solid #eee;
		}
	}
}
.popupOut{
	width: 660rpx;
	background: #fff;
	border-radius: 10rpx;
	min-height: 400rpx;
	padding:30rpx;
	box-sizing: border-box;
	textarea{
		border:1px solid #efefef;
		padding:10rpx;
		width: 100%;
		height: 150rpx;
		box-sizing: border-box;
		margin:30rpx 0;
	}
	.group{
		padding-top:60rpx;
		padding-bottom:30rpx;
		gap:30rpx;
		display: flex;
		button{
			width: 100%;
		}
	}
}
</style>
