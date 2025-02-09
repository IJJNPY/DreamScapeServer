<template>
	<view class="picadd">
		<custom-head-top>
			<template #left>
				新增壁纸
			</template>
		</custom-head-top>
		
		<view class="main">
			<view class="grid">
				<view class="itemBox pic" v-for="(item,index) in piclist" :key="index">
					<view class="close" @click="handleClose(index)">x</view>
					<view class="left">
						<image :src="item.tempurl" mode="aspectFit"></image>
						<view class="mask">
							<view class="icon">
								<uni-icons type="compose" size="20" color="#fff"></uni-icons>
							</view>
						</view>
					</view>
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
				<view class="itemBox add" @click="handleSelect" v-if="piclist.length<9">
					<view class="icon">+</view>
					<view class="text">点击选择图片</view>
				</view>
				
				<view class="setClassify" v-if="piclist.length">
					<uni-data-select ref="selectRef" @change="classifyChange" collection="wallpaper-classify" 
					field = "_id as value, name as text, sort"
					:where="`enable == true`"
					orderby="sort asc"
					clear
					placement="top"
					v-model="selectValue"
					></uni-data-select>
				</view>
				
				<view class="btnGroup" v-if="piclist.length">
					<button class="btn" type="primary" @click="submit">发布</button>
					<button class="btn" type="warn" plain @click="handleReset">清空</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { routerTo, showModal, showToast } from '../../utils/common';
import { compressImage } from "@/utils/tools.js"
import dayjs from 'dayjs';
const piclist = ref([]);
const selectValue = ref("");
const selectRef = ref(null);
const picCloudObj = uniCloud.importObject("admin-wallpaper-piclist");


const handleSelect = async() =>{
	let imgs = await uni.chooseImage({
		count:9
	})
	let obj = {
		description:"",
		score:"4.5",
		tabs:[],
		checked:true,
		picurl:"",
		tempurl:""
	}
	piclist.value = [...piclist.value, ...imgs.tempFilePaths.map(item => ({
			...obj,
			tempurl:item
		})
	)] 
	console.log(piclist.value)
}

const checkedChange = (e,index) =>{
	piclist.value[index].checked = e.detail.value;
}

//移除选择
const handleClose = async(index) => {
	let feedback = await showModal({
		content:"是否确认移除"
	})
	if(feedback == "confirm"){
		piclist.value.splice(index,1);
	}
	
}

//清空所有
const handleReset = async() =>{
	let feedback = await showModal({
		content:"是否确认移除"
	})
	if(feedback == "confirm"){
		piclist.value = [];
	}
}
 
//确认标签
const tabConfirm = (index) =>{
	piclist.value[index].tabs = [...piclist.value[index].tabs, piclist.value[index].iptValue];
	delete piclist.value[index].iptValue;
}

//删除标签
const delTab = (index, tabidx) => {
	piclist.value[index].tabs.splice(tabidx,1);
}

//选择分类
const classifyChange = (e) =>{
	piclist.value.forEach(item=>{
		item.classid = e;
	})
}

const submit = async() =>{
	if(!checkClassify()) return;
	if(!checkDescription()) return;	
	try{
		uni.showLoading({
			mask:true
		});
		let uploadTasks = piclist.value.map((item,index)=>{
			return uploadFile(item,index)
		})
		
		let cloudFiles = await Promise.all(uploadTasks);
		
		let params = piclist.value.map((item,index)=>{
			let {tempurl, ...rest} = item;
			return {
				...rest,
				score:rest.score.toString(),
				picurl:cloudFiles[index].fileID
			}
		})
		
		let {errCode, errMsg} = await picCloudObj.add(params)
		if(errCode!==0) return showToast({title:errMsg});
		showToast({title:"发布成功"});
		setTimeout(()=>{
			routerTo("/pages/wallpaper/piclist", "redirect");
		})
		selectRef.value.clearVal();
	}catch(err){
		console.log(err);
		showToast({title:err})
		uni.hideLoading();
	}
	
	
}

const uploadFile = async(item,index) =>{
	let tempurl = await compressImage(item.tempurl)
	return uniCloud.uploadFile({
		filePath: tempurl,
		cloudPath: "wallpaper/"+dayjs().format("YYYYMMDD")+"/"+Date.now()+"_"+index+".webp",
		//阿里云必须要设置，腾讯云和支付宝云不需要
		cloudPathAsRealPath: true
	})
}

//校验是否选择分类
const checkClassify = () =>{
	if(!selectValue.value){
		showToast({title:"分类必须选择"});
		return false;
	}
	return true;
}

//校验图片描述是否填写
const checkDescription = () =>{
	let desIndex = piclist.value.map((item,index)=>item.description?null:index+1)
	.filter(item=>item!=null).join(",");
	if(desIndex){
		showToast({title:`第${desIndex}的描述不能为空`})
		return false;
	} 
	return true;
}

</script>

<style lang="scss" scoped>
.main{
	padding:20px;
	.grid{
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 30px;
		.itemBox{
			background: #f8f8f8;
			width: 100%;
			min-height: 300px;
			border: 1px solid transparent;
			display: flex;
			align-items: start;
			padding: 20px;
			position: relative;
			.close{
				position: absolute;
				right: 0;
				top: 0;
				width: 30px;
				height: 30px;
				background: #e43d33;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}
			.left{
				width: 120px;
				aspect-ratio: 9/20;
				position: relative;
				background: conic-gradient(#ccc 0 25%, #fff 25% 50%, #ccc 50% 75%, #fff 75% 100%);
				background-size: 10px 10px;
				image{
					width: 100%;
					height: 100%;
				}
				.mask{
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 30px;
					background: rgba(0, 0, 0, 0.4);
					display: flex;
					align-items: center;
					justify-content: center;
					.icon{
						flex: 1;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
					}
				}
			}
			.right{
				flex: 1;
				margin-left: 20px;
				color: #666;
				.row{
					margin-bottom: 20px;
					.label{
						font-size: 14px;
						margin-bottom: 6px;
					}
					.tabGroup{
						display: flex;
						padding: 6px;
						flex-wrap: wrap;
						gap: 6px;
						.tab{
							border: 1px solid #1A73E8;
							border-radius: 100px;
							color: #1A73E8;
							font-size: 12px;
							padding: 2px 6px;
							cursor: pointer;
							margin-right: 6px;
						}
						.tab:hover{
							text-decoration: line-through;
						}
					}
					&.inline{
						display: flex;
						align-items: center;
						gap: 10px;
						.label{
							margin-bottom: 0;
						}
					}
				}
				
			}
		}
		
		.itemBox.add{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: #999;
			cursor: pointer;
			.icon{
				font-size: 50px;
			}
			.text{
				font-size: 20px;
				padding-top: 20px;
			}
		}
		
		.itemBox:hover{
			border-color: #cfcfcf;
			.close{
				display: flex;
			}
		}
	}
	
	.setClassify{
		padding: 30px 0;
		width: 430px;
	}
	
	.btnGroup{
		display: flex;
		margin: 0;
		gap: 30px;
		padding: 50px 0;
		button{
			width: 200px;
		}
	}
}
</style>