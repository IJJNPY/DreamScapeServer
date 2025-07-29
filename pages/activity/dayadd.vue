<template>
	<view class="dayadd">
		<custom-head-top>
			<template #left>
				{{typename}}
			</template>					
		</custom-head-top>
		
		<view class="main">
			<view class="left">
				<scroll-view scroll-y class="scroll">
					<uni-forms ref="formRef" :modelValue="formData" :rules="rules" 
					label-align="left" :label-width="200">
						<uni-forms-item label="日期" name="day" required>
							<uni-datetime-picker type="date" :clear-icon="false" 
							v-model="formData.day"/>
						</uni-forms-item>
						
						<uni-forms-item label="专题" name="theme" required>
							<uni-easyinput type="text" v-model="formData.theme"
							placeholder="请输入跳转地址" />
						</uni-forms-item>
						
						<uni-forms-item label="描述" name="description">
							<uni-easyinput type="textarea" v-model="formData.description"
							placeholder="请输入跳转地址" />
						</uni-forms-item>
						
						<uni-forms-item label="是否可见" name="checked">
							<switch :checked="formData.checked" style="transform:scale(0.6);transform-origin: left center;" @change="checkedChange"/>
						</uni-forms-item>
						
						
						<uni-forms-item 
						:label="`关联图片（${formData.picList.length}P）`" 
						name="picList" required>
							
							<VueDraggableNext 
							v-model="formData.picList"  
							class="content"
							filter=".add"
							animation="300"
							>
								<view class="item" @click="previewImg(index)"  v-for="(item,index) in formData.picList" 
								:key="item._id">
									<image :src="getSmallImg(item.picurl,120)" mode="aspectFill"></image>
									<view class="close" @click.stop="removePic(index)">
										<uni-icons type="closeempty" size="22" color="#fff"></uni-icons> 
									</view>
								</view>
								
								<view class="item add" @click="handelAssociation">
									<uni-icons type="link" size="40" color="#666"></uni-icons>
								</view>
								
								
							</VueDraggableNext>
						</uni-forms-item>
						
												
						
						<uni-forms-item >
							<view class="popupBtnGroup">
								<button size="mini" type="primary" @click="submit">确认{{typename}}</button>
								<button size="mini" type="default" @click="goback">返回</button>
							</view>					
						</uni-forms-item>
						
					</uni-forms>
				</scroll-view>
			</view>
			<view class="right">
				<view class="box">
					<DayItem :operate="false" :item="formData"></DayItem>
				</view>				
			</view>
		</view>
	</view>
	
	<DayDrawer ref="drawerRef" v-model:useSelect="formData.picList"></DayDrawer>
</template>

<script setup>
import {computed, ref} from "vue";
import { VueDraggableNext } from 'vue-draggable-next'
import DayItem from "./children/DayItem.vue"
import DayDrawer from "./children/DayDrawer.vue"
import { getSmallImg } from "../../utils/tools";
import {onLoad} from "@dcloudio/uni-app"
import { showToast } from "../../utils/common";
const dayCloudObj = uniCloud.importObject("admin-activity-everyday");
const formRef = ref(null);
const drawerRef = ref(null);
let id = "";

onLoad((options)=>{
	id = options.id;
	if(id) getDayItem();	
	console.log(id);
})

const typename = computed(()=>id?'修改':'新增')

const formData = ref({
	day:"",
	theme:"",
	description:"",
	checked:true,
	picList:[]
})

const rules = ref({
	day:{
		rules:[
			{
				required: true,
				errorMessage: '请选择日期',
			}			
		]
	},
	theme:{
		rules:[
			{
				required: true,
				errorMessage: '请输入专题',
			}			
		]
	},
	picList:{
		rules:[
			{
				required: true,
				errorMessage: '请选择关联图片',
			}			
		]
	}
})


const handelAssociation = ()=>{	
	drawerRef.value.open();
}

const checkedChange= (e)=>{
	formData.value.checked = e.detail.value	
}

const previewImg = (index)=>{
	let urls = formData.value.picList.map(item=>item.picurl);
	uni.previewImage({
		urls,
		current:index
	})
}


const removePic = (index)=>{
	formData.value.picList.splice(index,1);
}


const submit = async()=>{
	await formRef.value.validate();
	let params = {...formData.value};
	params.picList = params.picList.map(item=>item._id);
	
	let {errCode} = id ? await dayCloudObj.update(params) : await dayCloudObj.add(params);
	if(errCode!==0) return showToast({title:"请重试"})
	showToast({title:`${typename.value}成功`})
	setTimeout(()=>{goback()},1000)	
	uni.$emit("daySuceess")
}

const goback = ()=>{
	uni.navigateBack()
}

const getDayItem = async()=>{
   let {data,errCode} = await dayCloudObj.item(id);
   if(errCode!==0) return showToast({title:"请刷新重试"})
   formData.value = data[0];
   console.log(data);
}

</script>

<style lang="scss" scoped>
.main{
	display: flex;
	justify-content: space-between;
	height: calc(100vh - var(--top-window-height) - 100px);
	.scroll{		
		height: 100%;
	}
	.left{
		padding:20px;
		flex:1;			
		.uni-forms-item{
			display: block;
			margin-bottom: 32px;
		}
		:deep(.uni-forms-item__label){
			font-size: 16px;
			font-weight: bolder;
			color:#888;
		}
		.content{
			display: grid;
			grid-template-columns:repeat(auto-fill, minmax(100px, 1fr));
			gap:20px;
			.item{
				cursor: pointer;
				width: 100%;
				aspect-ratio: 9 / 16;
				border:1px solid #eee;
				border-radius: 5px;
				overflow: hidden;
				position: relative;
				image{
					width: 100%;
					height: 100%;
				}
				.close{
					position: absolute;
					right:10px;
					top:10px;
					width: 32px;
					height: 32px;
					background: rgba(0,0,0,0.6);
					border:1px solid rgba(255,255,255,0.7);
					border-radius: 50%;					
					align-items: center;
					justify-content: center;
					display: none;
				}
			}
			.item:hover .close{
				display: flex;
			}
			.item.add{
				background: #f8f8f8;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.popupBtnGroup{
			padding-bottom:50px;
		}
		
	}
	.right{
		border-left: 1px solid #e4e4e4;
		height: 100%;
		padding:10px;
		.box{
			width: 320px;
			border:1px solid #e4e4e4;
			border-radius: 8px;
			overflow: hidden;
		}
	}
}
</style>
