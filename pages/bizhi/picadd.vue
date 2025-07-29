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
					<view class="close" @click="handleClose(index)">×</view>					
					<PicEditItem v-model:item="piclist[index]"></PicEditItem>
				</view>
				
				<view class="itemBox add" @click="handleSelect" v-if="piclist.length<9">
					<view class="icon">+</view>
					<view class="text">点击选择图片</view>
				</view>
								
			</view>
			
			
			<view class="setClassify" v-if="piclist.length">
				<uni-data-select ref="selectRef" @change="classifyChange" collection="xxm-bizhi-classify"
				field="_id as value, name as text,sort"
				:where="`enable == true`"
				orderby="sort asc"
				v-model="selectValue"
				></uni-data-select>
			</view>
			
			<view class="btnGroup" v-if="piclist.length">
				<button class="btn" type="primary" @click="submit">发布</button>
				<button class="btn" type="warn" plain @click="handleReset">清空</button>
			</view>
			
		</view>
		
		
		
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {routerTo, showModal, showToast} from "@/utils/common.js"
import { cloudToHttps, compressAndConvertToWebP } from '../../utils/tools';
import PicEditItem from "./children/PicEditItem.vue"
import dayjs from "dayjs";
const piclist = ref([]);
const selectRef = ref(null);
const selectValue = ref("");
const picCloudObj = uniCloud.importObject("admin-bizhi-picture");
//选择图片
const handleSelect = async()=>{
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
	piclist.value =[...piclist.value,...imgs.tempFilePaths.map(item=>({...obj,tempurl:item}))] 
	
	console.log(piclist.value);
}


//选择分类
const classifyChange =(e)=>{	
	piclist.value.forEach(item=>{
		item.classid = e
	})
}


//移除选择
const handleClose = async(index)=>{	
	let feedback = await showModal({content:"是否确认移除"});
	if(feedback == "confirm") piclist.value.splice(index,1);	
}

//清空所有
const handleReset = async()=>{
	let feedback = await showModal({content:"是否确认移除"});
	if(feedback == "confirm") piclist.value = [];
	selectRef.value.clearVal();
}


//发布提交
const submit = async()=>{
	if(!checkClassify()) return;
	if(!checkDescription()) return;
	try{
		uni.showLoading({mask:true});
		let uploadTasks = piclist.value.map((item,index)=>uploadFile(item,index));
		let cloudFiles = await Promise.all(uploadTasks);	
		let params = piclist.value.map((item,index)=>{
			let {tempurl,...rest} = item
			return {
				...rest,				
				classid:selectValue.value,
				picurl:cloudToHttps(cloudFiles[index].fileID)
			}
		})
		let {errCode,errMsg} = await picCloudObj.add(params);
		if(errCode!==0) return showToast({title:errMsg});
		showToast({title:"发布成功"});
		setTimeout(()=>routerTo("/pages/bizhi/piclist","redirect"),1500);	
		selectRef.value.clearVal();
	}catch(err){
		console.log(err);
		showToast({title:err});
		uni.hideLoading();
	}
	
	
}


//上传方法
const uploadFile = async(item,index)=>{	
	let tempurl = await compressAndConvertToWebP(item.tempurl);
	return uniCloud.uploadFile({
		filePath:tempurl,
		cloudPath:`wallpaper/${dayjs().format("YYYYMMDD")}/${Date.now()}_${index}.webp`		
	})	
}



//校验是否选择分类
const checkClassify = ()=>{
	if(!selectValue.value){
		showToast({title:"分类必须选择"});	
		return false
	} 
	return true; 
}
//校验图片描述是否填写
const checkDescription = ()=>{
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
		gap: 20px;   
		.itemBox{
			background: #f8f8f8;
			width: 100%;
			min-height: 300px;
			border:1px solid transparent;			
			padding:20px;
			position: relative;
			.close{
				position: absolute;
				right: 0;
				top:0;
				width: 30px;
				height: 30px;
				background: #E43D33;
				cursor: pointer;
				color:#fff;
				display: none;
				align-items: center;
				justify-content: center;
			}
			
		}
				
		.itemBox.add{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color:#999;
			cursor: pointer;
			.icon{
				font-size: 50px;				
			}
			.text{
				font-size: 20px;
				padding-top:20px;
			}
		}
		
		.itemBox:hover{
			border-color:#e4e4e4;
			.close{
				display: flex;
			}
		}
	}

	.setClassify{
		padding:30px 0;
		width: 430px;
	}
	
	.btnGroup{
		display: flex;
		margin:0;
		gap:30px;
		padding:50px 0;
		width: 430px;
		button{
			width: 100%;
		}
	}

}
</style>
