<template>
	<uni-popup ref="classifyPopup" type="center" :is-mask-click="true">
		<view class="classifyPopup">
			<uni-forms ref="formRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
				<uni-forms-item label="名称" name="name" required>
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入分类名称" />
				</uni-forms-item>
				<uni-forms-item label="排序" name="sort">
					<uni-easyinput type="number" v-model.number="formData.sort" placeholder="请输入排序" />
				</uni-forms-item>
				<uni-forms-item label="缩略图">
					<select-one-img :width="100" ratio="9/16" v-model:formData="formData"
					></select-one-img>
				</uni-forms-item>
				<uni-forms-item label="是否推荐" name="select">
					<switch v-model="formData.select" :checked="formData.select" style="transform: scale(0.7);transform-origin:left center;" @change="selectChange"/>
				</uni-forms-item>
				<uni-forms-item label="是否启用" name="enable">
					<switch v-model="formData.enable" :checked="formData.enable" style="transform: scale(0.7);transform-origin:left center;" @change="enableChange"/>
				</uni-forms-item>
				<uni-forms-item>
					<view class="group">
						<button size="mini" type="primary" @click="submit">{{typename}}</button>
						<button size="mini" type="default" @click="classifyCancel">取消</button>
					</view>
				</uni-forms-item>
			</uni-forms>
		</view>
	</uni-popup>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import dayjs from "dayjs";
import { cloudToHttps, compressImage } from "@/utils/tools.js"
import { showToast, uploadFileItem } from '../../../utils/common';

const emits = defineEmits(["addsuccess"]);
const props = defineProps(["item","type","maxsort"]);
const classifyCloudObj = uniCloud.importObject("admin-wallpaper-classify",{customUI:true});
const formRef = ref(null);
const classifyPopup = ref(null);
const typename = computed(()=>props.type=='add'?'新增':'修改');
const formData = ref({
	name:"",
	sort:0,
	picurl:"",
	select:false,
	enable:false,
	tempurl:""
})

watch(()=>props.item,(nv)=>{
	formData.value = {
		...nv,
		tempurl:nv.picurl
	}
	console.log(formData.value);
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
		await formRef.value.validate()
		if(formData.value.tempurl && formData.value.tempurl != formData.value.picurl){
			let file = await uploadFile();
			//formData.value.picurl = cloudToHttps(file.fileID) 支付宝云和腾讯云需要进行cloud地址与http地址的转换，阿里云不需要
			formData.value.picurl = file.fileID;
		}
		let params = {...formData.value};
		delete params.tempurl;
		
		let {errCode,errMsg} = props.type == 'add' ?
		await classifyCloudObj.add(params) :
		await classifyCloudObj.update(params);
		
		if(errCode!=0){
			return showToast({title:errMsg});
		}
		showToast({title:typename.value+"成功"});
		classifyCancel();
		init();
		emits("addsuccess",{msg:typename.value+"成功~~"})
	} catch (err) {
		console.log(err)
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

//打开弹窗
const open = () =>{
	//等待DOM层全部完成操作后再赋值，父组件向子组件传递值时由于DOM加载顺序的原因可能会导致props值更新不及时
	nextTick(()=>{
		if(props.type == 'add'){
			formData.value.sort = props.maxsort+1;
			console.log(formData.value);
		}
	})
	classifyPopup.value.open();
}

//取消新增打开弹窗
const classifyCancel = () =>{
	classifyPopup.value.close();
	init();
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

//初始化表单
const init = () =>{
	formData.value = {
		name:"",
		sort:0,
		picurl:"",
		select:false,
		enable:false,
		tempurl:""
	}
}

//对父级暴露接口
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
}
</style>
