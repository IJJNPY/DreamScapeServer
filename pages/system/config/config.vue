<template>
	<view class="config">
		<custom-head-top>
			<template #left>
				项目配置
			</template>
			
			<template #right>
				<button type="primary" size="mini" :plain="!btnType" @click="editAndSubmit">
					<template v-if="btnType">
						<uni-icons type="paperplane-filled" size="14" color="#fff"></uni-icons>
						提交
					</template>
					<template v-else>
						<uni-icons type="compose" size="14" color="#007AFF"></uni-icons>
						编辑
					</template>
					
				</button>
				
			</template>
		</custom-head-top>
		
		<view class="main" :class="!btnType?'readonly':''">
			<view class="container">
				<uni-forms ref="formRef" :modelValue="formData"
				label-align="right" :label-width="120">		
				
					<uni-forms-item label="LOGO" name="logo">
						<select-one-img v-model:formData="formData" :width="100" 
						ratio="1 / 1" :maxImgSize="500" 
						@update:formData="(e)=>{if(e.picurl==''){formData.logo=''}}"
						></select-one-img>
					</uni-forms-item>
					
					<uni-forms-item label="项目名称" name="brand">
						<uni-easyinput type="text" v-model="formData.brand"
						placeholder="请输入项目名称" />
					</uni-forms-item>
					
					
					<uni-forms-item label="是否开启广告" name="checkedAd">
						<switch :checked="formData.checkedAd" class="switchStyle" @change="checkedAdChange"/>
					</uni-forms-item>
					
					<uni-forms-item label="激励视频ID" name="rewardedVideo" 
					v-if="formData.checkedAd">
						<uni-easyinput type="text" v-model="formData.rewardedVideo"
						placeholder="请输入激励视频ID" />
					</uni-forms-item>
					
					<uni-forms-item label="视频卡片ID" name="cardVideo" 
					v-if="formData.checkedAd">
						<uni-easyinput type="text" v-model="formData.cardVideo"
						placeholder="请输入视频卡片ID" />
					</uni-forms-item>
					
					<uni-forms-item label="每日领币数" name="dayCoin"
					v-if="formData.checkedAd">
						<uni-easyinput type="text" v-model.number="formData.dayCoin"
						placeholder="请输入每日领币数" />
					</uni-forms-item>
					
					<uni-forms-item label="看广告得币" name="adCoin"
					v-if="formData.checkedAd">
						<uni-easyinput type="text" v-model.number="formData.adCoin"
						placeholder="请输入看广告得币数" />
					</uni-forms-item>
					
					<uni-forms-item label="硬币规则" name="ruleCoin"
					v-if="formData.checkedAd">
						<uni-easyinput type="textarea" v-model="formData.ruleCoin"
						placeholder="请输入硬币使用规则" maxlength="300"/>
					</uni-forms-item>
					
					
					<uni-forms-item label="搜索热词" name="hots">
						<uni-easyinput type="text" v-model="formData.hots"
						placeholder="请输入搜索热词用逗号,隔开" />
					</uni-forms-item>
					
					<uni-forms-item label="版权信息" name="copyright">
						<uni-easyinput type="textarea" v-model="formData.copyright"
						placeholder="请输入版权信息" maxlength="300"/>
					</uni-forms-item>
					
					<uni-forms-item label="服务协议" name="service">
						<uni-easyinput type="textarea" v-model="formData.service"
						placeholder="请输入服务协议" autoHeight maxlength="1000"/>
					</uni-forms-item>
					
					<uni-forms-item label="隐私政策" name="privacy">
						<uni-easyinput type="textarea" v-model="formData.privacy"
						placeholder="请输入隐私政策" autoHeight maxlength="1000"/>
					</uni-forms-item>
					
				</uni-forms>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue';
import { showToast, uploadFileItem } from '../../../utils/common';
import { cloudToHttps } from '../../../utils/tools';
import {useStore} from "vuex";
const store = useStore();
const systemCloudObj = uniCloud.importObject("admin-system");
const btnType = ref(0); //0是编辑  1是提交
const btnName = computed(()=>btnType.value?'提交':'编辑');
const formRef = ref(null);
const formData = ref({
	logo:"",
	brand:"",
	checkedAd:false,
	rewardedVideo:"",//激励视频id
	cardVideo:"",//视频卡片广告
	dayCoin:10, //每日领币
	adCoin:30,  //看广告获得币
	ruleCoin:"", //硬币规则说明
	hots:"",//搜索热词
	copyright:"",
	service:"",
	privacy:""
})

const getData = async()=>{
	let {errCode,data} = await systemCloudObj.getConfig();
	if(errCode!==0) return showToast({title:"查询有误"});
	formData.value = {...formData.value,...data,tempurl:data.logo};
	console.log(formData.value);
}


//是否加入广告开关
const checkedAdChange = (e)=>{
	formData.value.checkedAd = e.detail.value;	
}

const editAndSubmit = async()=>{
	
	
	if(btnType.value){
		try{
			uni.showLoading({mask:true});
			if(formData.value.tempurl && formData.value.tempurl != formData.value.logo){
				let file =await uploadFileItem(formData.value.tempurl)
				formData.value.logo = cloudToHttps(file.fileID);
			}			
			let {_id,tempurl,picurl,...params} = formData.value
			let {errCode} = await systemCloudObj.updateConfig(params);	
			if(errCode!==0) return showToast({title:"更新失败请重试"})
			store.commit("app/SET_APP_NAME",formData.value.brand,{root:true})
			store.commit("app/SET_APP_LOGO",formData.value.logo,{root:true})
			showToast({title:"更新成功"});
		}catch(err){
			console.log(err);
			uni.hideLoading();
			showToast({title:err})
		}
		
	}else{
		console.log("编辑");
	}
	btnType.value = btnType.value ? 0 : 1;
}


getData();
</script>

<style lang="scss" scoped>
.main{
	padding:20px;
	.container{		
		margin:0 auto;
		min-height: 200px;
		max-width: 1000px;
		:deep(.uni-forms-item){
			margin-top: 32px;
		}
		:deep(.uni-forms-item__content){
			display: flex;
			align-items: center;
		}
	}	
}
.readonly{
	pointer-events: none;
	opacity: 0.7;
	user-select: none;
}
</style>
