<template>
	<view class="noticeEdit">		
		<view class="main">
			<view class="container">
				<uni-forms ref="formRef" :modelValue="formData" :rules="rules"
				label-align="left" :label-width="120">	
				
					<uni-forms-item label="公告标题" name="title" required>
						<uni-easyinput type="text" v-model="formData.title"
						placeholder="请输入公告标题"/>
					</uni-forms-item>
					
					<uni-forms-item label="公告内容" name="content">
						<custom-editor v-model:content="formData.content"></custom-editor>
					</uni-forms-item>
					
					<uni-forms-item label="是否展示" name="checked">
						<switch :checked="formData.checked" class="switchStyle" 
						@change="checkedChange"/>
					</uni-forms-item>
					
					<uni-forms-item label="是否推荐" name="select">
						<switch :checked="formData.select" class="switchStyle" 
						@change="selectChange"/>
					</uni-forms-item>
					
										
					<uni-forms-item>
						<view class="popupBtnGroup">
							<button class="btn" type="primary" @click="submit">{{typename}}</button>
							<button class="btn" plain @click="reset">重置</button>
						</view>
					</uni-forms-item>
					
				</uni-forms>
			</view>
		</view>		
	</view>
</template>

<script setup>
import { ref,computed } from 'vue';
import {onLoad} from "@dcloudio/uni-app"
import { showToast } from '../../utils/common';
const noticeCloudObj = uniCloud.importObject("admin-notice-data",{customUI:true})
const formRef = ref(null);
const formData = ref({
	title:"",
	content:"",
	checked:true,
	select:false
})
const rules = ref({
	title:{
		rules:[
			{
				required: true,
				errorMessage: '请输入公告标题',
			}			
		]
	}
})
let id = "";
const typename = ref("新增");
onLoad((options)=>{
	id = options.id;
	if(id){
		getItem();
		typename.value="修改"		
	}	
	uni.setNavigationBarTitle({
		title:typename.value+"公告"
	})
})


//是否启动开关
const checkedChange = (e)=>{
	formData.value.checked = e.detail.value
	
}
//是否推荐开关
const selectChange = (e)=>{
	formData.value.select = e.detail.value
}

//提交表单
const submit = async()=>{
	try{
		await formRef.value.validate();		
		let {errCode} = id ? await noticeCloudObj.update(formData.value) : await noticeCloudObj.add(formData.value)
		if(errCode!==0) return showToast({title:"请重试"})
		showToast({title:`${typename.value}成功`})
		setTimeout(()=>{goback()},1000)	
		uni.$emit("noticeSuceess")
	}catch(err){
		showToast({title:JSON.stringify(err)})
	}	
}
const goback = ()=>{
	uni.navigateBack()
}
//重置表单
const reset = ()=>{
	
}

const getItem = async()=>{
	let {data,errCode} = await noticeCloudObj.item(id)	
	if(errCode!==0) return showToast({title:"请刷新重试"})	
	formData.value = data;
	console.log(formData.value);	
}

</script>

<style lang="scss" scoped>
.noticeEdit{
	.main{
		padding:40px 20px;
		.container{
			margin:0 auto;
			min-height: 200px;
			max-width: 1000px;
			.uni-forms-item{
				display: block;
				margin-bottom: 32px;
			}
			:deep(.uni-forms-item__label){
				font-size: 16px;
				font-weight: bolder;
				color:#888;
			}			
			:deep(.uni-forms-item__content){
				display: flex;
				align-items: center;
			}
		}
	}
	
}
</style>
