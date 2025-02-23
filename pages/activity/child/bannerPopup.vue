<template>
	<uni-popup ref="popup">
		<view class="popup">
			<uni-forms ref="formRef" :modelValue="formData" :rules="rules" label-align="right" :label-width="100">
				<uni-forms-item label="缩略图" name="tempurl" required>
					<select-one-img :width="220" ratio="16/9" v-model:formData="formData"
					></select-one-img>
				</uni-forms-item>
				
				<uni-forms-item label="url" name="url" required>
					<uni-easyinput type="text" v-model="formData.url" placeholder="请输入跳转地址" />
				</uni-forms-item>
				<uni-forms-item label="排序" name="sort">
					<uni-easyinput type="number" v-model.number="formData.sort" placeholder="请输入排序" />
				</uni-forms-item>
				<uni-forms-item label="是否启用" name="checked">
					<switch v-model="formData.checked" :checked="formData.checked" 
					style="transform: scale(0.7);transform-origin:left center;" @change="checkedChange"/>
				</uni-forms-item>
				<uni-forms-item label="类型" name="target" style="display: flex; align-items: center;">
					<uni-data-checkbox v-model="formData.target" :localdata="targets"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="站外appid" name="appid" v-if="formData.target == 'miniProgram'" 
				:required="formData.target == 'miniProgram'">
					<uni-easyinput type="text" v-model="formData.appid" placeholder="请输入站外appid" />
				</uni-forms-item>
				{{formData}}
				
				<uni-forms-item>
					<view class="group">
						<button size="mini" type="primary" @click="submit">确认</button>
						<button size="mini" type="default" @click="close">取消</button>
					</view>
				</uni-forms-item>
			</uni-forms>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import { showToast, uploadFileItem } from '../../../utils/common';

const activityCloudObj = uniCloud.importObject("admin-activity-common")
const emits = defineEmits(["success"]);
const popup = ref(null)
const formRef = ref(null)
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
	appid:""
})

const rules = ref({
	url:{
		rules:[
			{
				required: true,
				errorMessage: '请填写url地址'
			}
		],
		label:"url地址"
	},
	tempurl:{
		rules:[
			{
				required: true,
				errorMessage: '请选择图片'
			}
		],
		label:"图片选择"
	},
	appid:{
		rules:[
			{
				required: true,
				errorMessage: '请填写appid'
			}
		],
		label:"外站appid"
	}
})

const submit = async() =>{
	try{
		await formRef.value.validate();
		uni.showLoading({mask:true})
		if(formData.value.tempurl && formData.value.tempurl != formData.value.picurl){
			let file = await uploadFileItem(formData.value.tempurl);
			//formData.value.picurl = cloudToHttps(file.fileID) 支付宝云和腾讯云需要进行cloud地址与http地址的转换，阿里云不需要
			formData.value.picurl = file.fileID;
		}
		let params = {...formData.value};
		delete params.tempurl;
		
		let {errCode,errMsg} = await activityCloudObj.bannerAdd(params);
		if(errCode!=0) return showToast({title:"发布失败"});
		showToast({title:"发布成功"})
		close();
		emits("success")
	}finally{
		uni.hideLoading()
	}

}

const checkedChange = (e) =>{
	console.log(e)
}

const open = () =>{
	popup.value.open()
}

const close = () =>{
	popup.value.close()
}

watch(()=>formData.value.target,(nv)=>{
	if(nv == 'self') formData.value.appid = ''
},{deep:true,immediate:true})

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
	padding: 50px 50px 50px 0;
	.picGroup{
		.box{
			width: 200px;
			aspect-ratio: 16/9;
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