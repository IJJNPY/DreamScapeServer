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
import { showToast } from '../../../utils/common';
const emits = defineEmits(["update:item"]);
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
	let {tempurl,...params} = props.item;
	let {errCode,errMsg} = await picCloudObj.update(params);
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
