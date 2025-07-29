<template>
	<uni-popup ref="popup" :is-mask-click="false">
		<view class="popup">
			<view class="main">
				<PicEditItem :showClassid="true" :item="item" @update:item="itemChange"></PicEditItem>
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
import PicEditItem from "./PicEditItem.vue"
import { showToast ,uploadFileItem} from '../../../utils/common';
import { cloudToHttps } from '../../../utils/tools';
const props = defineProps(["item"])
const emits = defineEmits(["update:item","success"])
const popup =ref(null);
const picCloudObj = uniCloud.importObject("admin-bizhi-picture")
const imageCloudObj = uniCloud.importObject("handle-image");

const itemChange = (e)=>{
	emits("update:item",e)
}

const open = ()=>{
	popup.value.open();
}

const close = ()=>{
	popup.value.close()
}


const submit = async()=>{
	let picurl = props.item.picurl
	let file
	if(props.item.tempurl && props.item.tempurl != props.item.picurl){
		file =await uploadFileItem(props.item.tempurl);		
		picurl = cloudToHttps(file.fileID);		
	}
	let {tempurl,...params} = props.item
	let {errCode,errMsg} = await picCloudObj.update({...params,picurl})
	if(errCode!==0) return showToast({title:errMsg});
	
	if(file) imageCloudObj.remove(props.item.picurl);	
	
	close();
	emits("success")
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
	padding:50px;
}
</style>