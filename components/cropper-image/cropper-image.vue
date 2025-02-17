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
				:maxImgSize="options.maxImgSize"
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
import { computed, nextTick, ref } from 'vue';
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
const props = defineProps(["tempurl"])
const newTempurl = computed(()=>props.tempurl.startsWith('http')?props.tempurl+'?t='+Date.now():props.tempurl);
const emits = defineEmits(["confirm"])
const popup = ref(null);
const cropperRef = ref(null);
const options = ref({
	outputType:"webp",
	autoCrop:true,
	fixed:true,
	fixedNumber:[9,16],
	infoTrue:true,
	full:true,
	maxImgSize:3000,
	fillColor:"#000"
})
const fnConfig = ref([
	{type:"auto",text:"自由裁剪",icon:"icon-expend"},
	{type:"1/1",text:"1 / 1",icon:""},
	{type:"9/16",text:"9 / 16",icon:""},
	{type:"9/20",text:"9 / 20",icon:""},
	{type:"rotate",text:"向右旋转",icon:"icon-rotate-right"},
	{type:"zoomin",text:"放大",icon:"icon-zoomin"},
	{type:"zoomout",text:"缩小",icon:"icon-zoomout"}
])


const open = () =>{
	popup.value.open();
}

const close = () =>{
	popup.value.close();
}

const editImg = (type) =>{
	if(type=="rotate") return cropperRef.value.rotateRight();
	if(type=="zoomin") return cropperRef.value.changeScale();
	if(type=="zoomout") return cropperRef.value.changeScale(-1);
	
	if(type=='auto'){
		options.value.fixed = false;
	}
	if(type=='1/1'){
		options.value.fixed = true;
		options.value.fixedNumber = [1,1];
	}
	if(type=='9/16'){
		options.value.fixed = true;
		options.value.fixedNumber = [9,16];
	}
	if(type=='9/20'){
		options.value.fixed = true;
		options.value.fixedNumber = [9,20];
	}
	nextTick(()=>{
		cropperRef.value.goAutoCrop();
	})
	
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