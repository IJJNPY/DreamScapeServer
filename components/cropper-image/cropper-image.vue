<template>
	<uni-popup ref="popup" :is-mask-click="false">
		<view class="popup">
			<view class="cropper">
				<VueCropper
				ref="cropperRef"
				:img="newTempurl"
				:outputType="options.outputType"
				:autoCrop="options.autoCrop"
				:fixed="options.fixed"
				:fixedNumber="options.fixedNumber"
				:infoTrue="options.infoTrue"
				:full="options.full"
				:maxImgSize="maxImgSize"
				:fillColor="options.fillColor"
				></VueCropper>
			</view>
			<view class="function">
				<view @click="editImg(item.type)" class="item" v-for="item in fnConfig" :key="item.type">
					<text class="iconfont" :class="item.icon" v-if="item.icon"></text>
					<text v-else>{{item.text}}</text>
				</view>
			</view>
			
			<view class="popupBtnGroup">
				<button size="mini" type="primary" @click="confirm">确认</button>
				<button size="mini" type="default" @click="close">取消</button>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
import { computed, ref } from 'vue';
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import { useCropper } from './hooks';

const props = defineProps({
	tempurl:String,
	maxImgSize:{
		type:Number,
		default:3000
	}
})
const newTempurl = computed(()=>props.tempurl.startsWith('http')?props.tempurl+'?t='+Date.now():props.tempurl);
const emits = defineEmits(["confirm"])
const popup = ref(null);
const cropperRef = ref(null);
const { options,fnConfig,editImg } = useCropper(cropperRef);

const open = () =>{
	popup.value.open();
}

const close = () =>{
	popup.value.close();
}

const confirm = () =>{
	cropperRef.value.getCropBlob(data=>{
		emits("confirm",URL.createObjectURL(data))
		close();
	})
}

defineExpose({
	open,
	close
})
</script>

<style lang="scss" scoped>
.popup{
	width: 500px;
	background: #fff;
	border-radius: 10px;
	min-height: 300px;
	padding: 20px;
	.cropper{
		width: 100%;
		aspect-ratio: 1 / 1;
	}
	.function{
		padding: 20px 0;
		display: flex;
		gap: 10px;
		.item{
			border: 1px solid #2979ff;
			color: #2979ff;
			padding: 5px 10px;
			font-size: 14px;
			cursor: pointer;
			user-select: none;
		}
		.item:active{
			transform: scale(0.96);
		}
	}
}
</style>