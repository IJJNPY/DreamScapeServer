<template>
	<view class="picGroup">
		<view :style="{width:width+'rpx', aspectRatio:ratio}" class="box add" v-if="!formData.tempurl" @click="selectPicurl">
			<uni-icons type="plusempty" size="30" color="#999"></uni-icons>
		</view>
		<view :style="{width:width+'px', aspectRatio:ratio}" class="box pic" v-else>
			<image :src="formData.tempurl" mode="aspectFit"></image>
			<view class="mask">
				<view class="icon" @click="editImg">
					<uni-icons type="compose" size="20" color="#fff"></uni-icons>
				</view>
				<view class="icon" @click="delImg">
					<uni-icons type="trash" size="20" color="#fff"></uni-icons>
				</view>
			</view>
		</view>
		
		<cropper-image ref="cropperRef" :maxImgSize="1200" :tempurl="formData.tempurl" 
		@confirm="cropperChange"
		></cropper-image>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	formData:Object,
	width:{
		type:Number,
		default:200
	},
	ratio:{
		type:String,
		default:"16/9"
	}
})
const emits = defineEmits(["update:formData"])
const cropperRef = ref(null);

const selectPicurl = (e) =>{
	uni.chooseImage({
		count:1,
		success:res=>{
			emits("update:formData",{...props.formData,tempurl:res.tempFilePaths[0]})
		}
	})
}

const cropperChange = (e) =>{
	emits("update:formData",{...props.formData,tempurl:e})
}

const delImg = (e) =>{
	emits("update:formData",{...props.formData,tempurl:"",picurl:""})
}

const editImg = () =>{
	cropperRef.value.open();
}
</script>

<style lang="scss" scoped>
.picGroup{
	.box{
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
</style>