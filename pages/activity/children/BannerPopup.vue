<template>
	<uni-popup ref="popup">
		<view class="popup">
			<uni-forms ref="formRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
				<uni-forms-item label="缩略图" name="tempurl" required>
					<select-one-img :width="220" v-model:formData="formData"></select-one-img>
				</uni-forms-item>
				
				<uni-forms-item label="url" name="url" required>
					<uni-easyinput type="text" v-model="formData.url" 
					placeholder="请输入跳转地址" />
				</uni-forms-item>
				
				<uni-forms-item label="排序" name="sort" required>
					<uni-easyinput type="number" v-model.number="formData.sort" 
					placeholder="请输入排序" />
				</uni-forms-item>
				
				<uni-forms-item label="是否启用" name="checked" style="display: flex; align-items: center;">
					<switch :checked="formData.checked" style="transform:scale(0.6);transform-origin: left center;" @change="checkedChange"/>
				</uni-forms-item>	
				
				
				<uni-forms-item label="类型" name="target" style="display: flex; align-items: center;">
					<uni-data-checkbox v-model="formData.target" :localdata="targets" />
				</uni-forms-item>
				
				<uni-forms-item label="站外appid" name="appid" 
				v-if="formData.target == 'miniProgram'" :required="formData.target == 'miniProgram'">
					<uni-easyinput type="text" v-model="formData.appid"
					placeholder="请输入站外appid" />
				</uni-forms-item>
				
				
				<uni-forms-item >
					<view class="popupBtnGroup">
						<button size="mini" type="primary" @click="submit">确认</button>
						<button size="mini" type="default" @click="close">取消</button>
					</view>					
				</uni-forms-item>
				
				
			</uni-forms>
		</view>
		
	</uni-popup>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { showToast, uploadFileItem } from '../../../utils/common';
import { cloudToHttps } from '../../../utils/tools';
const activityCloudObj = uniCloud.importObject("admin-activity-banner")
const props = defineProps(['item',"maxSort"]);
const emits = defineEmits(["success"]);
const popup = ref(null);
const formRef = ref(null);
const targets = ref([{
	text: '站内',
	value: "self"
},{
	text: '站外',
	value: "miniProgram"
}])
const formData = ref({
	picurl:"",
	url:"",
	sort:0,
	checked:true,
	target:"self",
	appid:"",
	tempurl:""
})
watch(()=>props.item,(nv)=>{	
	formData.value = {
		...nv,
		tempurl:nv.picurl
	}
})

watch(()=>formData.value.target,(nv)=>{
	if(nv == 'self') formData.value.appid = ''
},{deep:true,immediate:true})


const rules = ref({
	url:{
		rules:[
			{
				required: true,
				errorMessage: '请填写url地址',
			}			
		],
		label:"url地址"
	},
	tempurl:{
		rules:[
			{
				required: true,
				errorMessage: '请选择图片',
			}			
		],
		label:"图片选择"
	},
	appid:{
		rules:[
			{
				required: true,
				errorMessage: '请填写appid',
			}			
		],
		label:"外站appid"
	}
})







const submit = async()=>{
	try{		
		await formRef.value.validate();
		uni.showLoading({mask:true});
		if(formData.value.tempurl && formData.value.tempurl != formData.value.picurl){
			let file =await uploadFileItem(formData.value.tempurl)
			formData.value.picurl = cloudToHttps(file.fileID);
		}		
		let {tempurl,...params} = formData.value;	
		
		let {errCode,errMsg} = 
		props.item ? 
		await activityCloudObj.update(params) :
		await activityCloudObj.add(params);
		
		if(errCode!==0) return showToast({title:"发布失败"}); 
		showToast({title:"发布成功"});
		close();
		emits("success")
	}finally{
		uni.hideLoading()
	}
	
}


const checkedChange = (e)=>{
	formData.value.checked = e.detail.value;	
}



const open =()=>{	
	nextTick(()=>{
		if(!props.item) formData.value.sort = props.maxSort+1
	})	
	popup.value.open();
}
const close = ()=>{
	popup.value.close();
	init();
}


const init = ()=>{
	formData.value = {
		picurl:"",
		url:"",
		sort:0,
		checked:true,
		target:"self",
		appid:"",
		tempurl:""
	}	
}


defineExpose({
	close,
	open
})



</script>

<style lang="scss" scoped>
.popup{
	background: #fff;
	width: 600px;
	min-height: 200px;
	padding:50px 50px 50px 20px;	
}

</style>