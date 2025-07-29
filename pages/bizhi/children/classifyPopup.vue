<template>
	<uni-popup ref="classifyPopup" type="center" :is-mask-click="false">
		<view class="classifyPopup">
			<uni-forms ref="formRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
				<uni-forms-item label="名称" name="name" required>
					<uni-easyinput type="text" v-model="formData.name" 
					placeholder="请输入分类名称" />
				</uni-forms-item>
				<uni-forms-item label="排序" name="sort">
					<uni-easyinput type="number" v-model.number="formData.sort" 
					placeholder="请输入排序" />
				</uni-forms-item>
				<uni-forms-item label="缩略图">
					<select-one-img v-model:formData="formData" :width="100" ratio="9 / 16"></select-one-img>
				</uni-forms-item>	
				<uni-forms-item label="是否推荐" name="select">
					<switch v-model="formData.select" :checked="formData.select" style="transform:scale(0.6);transform-origin: left center;" @change="selectChange"/>
				</uni-forms-item>
				<uni-forms-item label="是否启用" name="enable">
					<switch v-model="formData.enable" :checked="formData.enable" style="transform:scale(0.6);transform-origin: left center;" @change="enableChange"/>
				</uni-forms-item>
								
				<uni-forms-item >
					<view class="popupBtnGroup">
						<button size="mini" type="primary" @click="submit">{{typename}}</button>
						<button size="mini" type="default" @click="close">取消</button>
					</view>
					
				</uni-forms-item>
			</uni-forms>
		</view>
	</uni-popup>
	
	
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import {cloudToHttps,compressAndConvertToWebP} from "@/utils/tools.js"
import dayjs from "dayjs"
import { showToast } from '../../../utils/common';

const emits = defineEmits(["success"])
const props = defineProps(["item","type","maxSort"]);
const classifyCloudObj = uniCloud.importObject("admin-bizhi-classify",{customUI:true});
const formRef = ref(null);
const classifyPopup = ref(null);
const typename = computed(()=>props.type=='add'?'新增':'修改')
const formData = ref({
	name:"",
	sort:0,
	select:false,
	enable:false,
	picurl:"",
	tempurl:""
})


watch(()=>props.item,(nv)=>{
	formData.value = {
		...nv,
		tempurl:nv.picurl
	}
})



const rules = ref({
	name:{
		rules:[			
			{
				required: true,
				errorMessage: '请填写分类名称',
			},
			{
				minLength: 2,
				maxLength: 8,
				errorMessage: '{label}长度 {minLength} 到 {maxLength} 个字符',
			}
		],
		label:"分类名称"
	}
})





const submit = async()=>{
	try{
		uni.showLoading({mask:true});
		await formRef.value.validate();
		if(formData.value.tempurl && formData.value.tempurl != formData.value.picurl){
			let file =await uploadFile();
			formData.value.picurl = cloudToHttps(file.fileID);
		}
		let {tempurl,...params} = formData.value;		
		
		let {errCode,errMsg} = 
		props.type=='add' ? 
		await classifyCloudObj.add(params) : 
		await classifyCloudObj.update(params)
		
		
		if(errCode!==0) return showToast({title:errMsg});
		showToast({title:typename.value+"成功"});
		close();
		init();
		emits("success",{msg:typename.value+"成功~~"})
	}catch(err){
		console.log(err);
		showToast({title:err});
	}finally{
		uni.hideLoading()
	}
	
}


//上传图片到云存储
const uploadFile = async()=>{
	let tempurl = await compressAndConvertToWebP(formData.value.tempurl);	
	return await uniCloud.uploadFile({
		filePath:tempurl,
		cloudPath:"wallpaper/"+dayjs().format("YYYYMMDD")+"/"+Date.now()+".webp"
	})
}


const selectChange = (e)=>{	
	formData.value.select = e.detail.value
}

//启用切换
const enableChange = (e)=>{	
	formData.value.enable = e.detail.value
}



//打开弹窗
const open = ()=>{
	nextTick(()=>{
		if(props.type == 'add') formData.value.sort = props.maxSort+1
	})	
	classifyPopup.value.open();
}

//取消新增
const close = ()=>{
	classifyPopup.value.close();
	init();
}

const init = ()=>{
	formData.value = {
		name:"",
		sort:0,
		select:false,
		enable:false,
		picurl:"",
		tempurl:""
	}
}


defineExpose({
	open,
	close
})

</script>

<style lang="scss" scoped>
.classifyPopup{
	background: #fff;
	width: 600px;
	min-height: 200px;
	padding:50px 50px 50px 0;
	
	
	.picGroup{
		.box{
			width: 100px;
			aspect-ratio: 9 / 16;
			border:1px solid #e4e4e4;
			border-radius: 5px;
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
			background: conic-gradient(#ccc 0 25%,#fff 25% 50%,#ccc 50% 75%,#fff 75%);
			background-size: 10px 10px;
			image{
				width: 100%;
				height: 100%;
			}
			.mask{
				position: absolute;
				bottom:0;
				left:0;
				width: 100%;
				height: 30px;
				background: rgba(0,0,0,0.4);
				display: flex;
				align-items: center;
				justify-content: center;
				.icon{					
					flex:1;
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
