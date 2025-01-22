<template>
	<uni-popup ref="classifyPopup" type="center" :is-mask-click="true">
		<view class="classifyPopup">
			<uni-forms ref="fromRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
				<uni-forms-item label="名称" name="name" required>
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入分类名称" />
				</uni-forms-item>
				<uni-forms-item label="排序" name="sort">
					<uni-easyinput type="number" v-model.number="formData.sort" placeholder="请输入排序" />
				</uni-forms-item>
				<uni-forms-item label="缩略图">
					<view class="picGroup">
						<view class="box add" v-if="!formData.tempurl" @click="selectPicurl">
							<uni-icons type="plusempty" size="30" color="#999"></uni-icons>
						</view>
						<view class="box pic" v-else>
							<image :src="formData.tempurl" mode="aspectFit"></image>
							<view class="mask">
								<view class="icon">
									<uni-icons type="compose" size="20" color="#fff"></uni-icons>
								</view>
								<view class="icon" @click="delImg">
									<uni-icons type="trash" size="20" color="#fff"></uni-icons>
								</view>
							</view>
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item label="是否推荐" name="select">
					<switch v-model="formData.select" style="transform: scale(0.7);transform-origin:left center;" @change="selectChange"/>
				</uni-forms-item>
				<uni-forms-item label="是否启用" name="enable">
					<switch v-model="formData.enable" style="transform: scale(0.7);transform-origin:left center;" @change="enableChange"/>
				</uni-forms-item>
				<uni-forms-item>
					<view class="group">
						<button size="mini" type="primary" @click="submit">确认</button>
						<button size="mini" type="default" @click="classifyCancel">取消</button>
					</view>
				</uni-forms-item>
			</uni-forms>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from "dayjs";
import { cloudToHttps, compressImage } from "@/utils/tools.js"
import { showToast } from '../../../utils/common';

const classifyCloudObj = uniCloud.importObject("admin-wallpaper-classify",{customUI:true});
const fromRef = ref(null);
const classifyPopup = ref(null);
const formData = ref({
	name:"",
	sort:0,
	picurl:"",
	select:false,
	enable:false,
	tempurl:""
})
const rules = ref({
	name:{
		rules:[
			{
				required: true,
				errorMessage: '请填写姓名'
			},
			{
				minLength: 2,
				maxLength: 8,
				errorMessage: '{label}长度在{minLength}到{maxLength}个字符'
			}
		],
		label:"分类名称"
	}
})

const submit = async() =>{
	try {
		uni.showLoading({mask:true})
		await fromRef.value.validate()
		if(formData.value.tempurl){
			let file = await uploadFile();
			//formData.value.picurl = cloudToHttps(file.fileID) 支付宝云和腾讯云需要进行cloud地址与http地址的转换，阿里云不需要
			formData.value.picurl = file.fileID;
		}
		let params = {...formData.value};
		delete params.tempurl;
		
		let res = await classifyCloudObj.add(params);
		let {errCode,errMsg} = await classifyCloudObj.add(params);
		if(errCode!=0){
			return showToast({title:errMsg});
		}
		showToast({title:"添加成功"});
		close();
		init();
		emits("success",{msg:"添加成功~~"})
	} catch (err) {
		console.log(err);
		showToast({title:err});
	} finally{
		uni.hideLoading()
	}
	
}

//上传图片到云端
const uploadFile = async() =>{
	let tempurl = await compressImage(formData.value.tempurl)
	return await uniCloud.uploadFile({
		filePath: tempurl,
		cloudPath: "wallpaper/"+dayjs().format("YYYYMMDD")+"/"+Date.now()+".webp",
		//阿里云必须要设置，腾讯云和支付宝云不需要
		cloudPathAsRealPath: true
	})
}

const open = () =>{
	classifyPopup.value.open();
}

//取消新增打开弹窗
const classifyCancel = () =>{
	classifyPopup.value.close();
}

const selectChange = (e) =>{
	formData.value.select = e.detail.value;
}

const enableChange = (e) =>{
	formData.value.enable = e.detail.value;
}

const selectPicurl = (e) =>{
	uni.chooseImage({
		count:1,
		success:res=>{
			formData.value.tempurl = res.tempFilePaths[0];
		}
	})
}

const delImg = (e) =>{
	formData.picurl = "";
}

const init = () =>{
	formData = ref({
		name:"",
		sort:0,
		picurl:"",
		select:false,
		enable:false,
		tempurl:""
	})
}

defineExpose({
	open
})
</script>

<style lang="scss" scoped>
.classifyPopup{
	background: #fff;
	width: 600px;
	min-height: 200px;
	padding: 50px 50px 50px 0;
	.group{
		display: flex;
		justify-content: start;
		button{
			margin: 0 20px 0 0;
			width: 130px;
		}
	}
	
	.picGroup{
		.box{
			width: 100px;
			aspect-ratio: 9/16;
			border: 1px solid #e4e4e4;
			overflow: hidden;
		}
		.add{
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}
		.pic{
			position: relative;
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
				background: rgba(0, 0, 0, 4);
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
	}
}
</style>
