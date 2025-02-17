<template>
	<uni-popup ref="popup" :is-mask-click="false">
		<view class="popup">
			<view class="main">
				<picEditItem :item="item" @update:item="itemChange"></picEditItem>
			</view>
				<view class="popupBtnGroup">
						<button size="mini" type="primary" @click="submit">确认</button>
						<button size="mini" type="default" @click="close">取消</button>
				</view>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue';
import picEditItem from './picEditItem.vue';
import { showToast, uploadFileItem } from '../../../utils/common';
const emits = defineEmits(["update:item","success"]);
const props = defineProps(["item"]);
const popup = ref(null);
const picCloudObj = uniCloud.importObject('admin-wallpaper-piclist');

const open = () =>{
	popup.value.open();
}

const close = () =>{
	popup.value.close();
}

const itemChange = (e) =>{
	emits("update:item",e);
}

const submit = async() =>{
	let picurl = props.item.picurl
	if(props.item.tempurl && props.item.tempurl != props.item.picurl){
		let file = await uploadFileItem(props.item.tempurl);
		//formData.value.picurl = cloudToHttps(file.fileID) 支付宝云和腾讯云需要进行cloud地址与http地址的转换，阿里云不需要
		picurl = file.fileID;
	}
	let {tempurl,...params} = props.item;
	let {errCode,errMsg} = await picCloudObj.update({...params,picurl});
	if(errCode!==0) return showToast({title:errMsg});
	close();
	emits("success");
}

defineExpose({
	open,
	close
})
</script>

<style lang="scss" scoped>
.popup{
	width: 600px;
	min-height: 300px;
	background: #fff;
	padding: 50px;
}
</style>
