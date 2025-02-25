<template>
	<uni-drawer ref="showRight" mode="right" :mask-click="false" :width="1000">
		<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="onScrolltolower">
			<view class="layout">
				<view class="head">
					<view class="left">
						<uni-data-select class="select" ref="selectRef" @change="classifyChange" collection="xxm-bizhi-classify"
						field="_id as value, name as text,sort"
						:where="`enable == true`"
						orderby="sort asc"
						v-model="params.classid"
						></uni-data-select>			
						
						<uni-easyinput @clear="onClear" @confirm="onSearch" v-model="params.keyword" type="text" class="search" placeholder="请输入搜索内容"></uni-easyinput>
						
						<view class="total">共{{params.count}}张，已选择
						<text class="big">{{useSelect.length}}</text>张</view>
					</view>
					<view class="right">
						<view class="popupBtnGroup">
							<button class="btn" size="mini" type="default" plain @click="close">关闭</button>
							<button class="btn" size="mini" type="primary" @click="confirm">完成</button>
						</view>
					</view>
				</view>
				<view class="main">
					<view class="item" v-for="(item,index) in picList" :key="item._id">
						<view class="pic">
							<image :src="getSmallImg(item.picurl,120)" mode="aspectFill"></image>
							<view class="select" 
							:class="{active:useSelect.some(s=>s && s._id == item._id)}" 
							@click="clickSelect(index)">
								<checkbox :checked="true"></checkbox>
							</view>
						</view>
						
						<view class="look" @click="onPreview(index)">
							<uni-icons type="eye" size="22" color="#3C9CFF"></uni-icons>
						</view>
					</view>
				</view>
				
				<view class="paging">
					<uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
				</view>
				
			</view>
		</scroll-view>
	</uni-drawer>
</template>

<script setup>
import { getSmallImg } from '../../../utils/tools';
import { ref } from 'vue';
import { showToast } from '../../../utils/common';
const props = defineProps(["useSelect"]);
const emits = defineEmits(['update:useSelect'])
const selectRef = ref(null);
const showRight = ref(null);
const picCloudObj = uniCloud.importObject("admin-wallpaper-piclist",{customUI:true})
const params = ref({
	size:40,
	current:1,
	keyword:"",
	classid:"",
	count:0
})
const noData = ref(false);
const picList = ref([])

const confirm = ()=>{
	close();
}

const classifyChange = ()=>{	
	init();
	getPicture();
}

//触底加载更多
const onScrolltolower = ()=>{
	if(noData.value) return;
	console.log("触底");
	params.value.current++
	getPicture();
}


//搜索实现
const onSearch = ()=>{
	init();
	getPicture();
}

//清空搜索
const onClear = ()=>{
	params.value.keyword = "";
	init();
	getPicture();
}



const onPreview = (index)=>{
	let urls = picList.value.map(item=>item.picurl);
	uni.previewImage({
		urls,
		current:index
	})
}

const open = async()=>{
	init();
	getPicture();
	showRight.value.open();
}

const getPicture= async()=>{
	let {errCode,errMsg,data,count} = await picCloudObj.search(params.value);
	if(errCode!==0) return showToast({"title":"数据有误"})
	picList.value = [...picList.value,...data];
	params.value.count = count
	if(params.value.size > data.length) noData.value = true;
}


const clickSelect = (index)=>{
	let findIndex = props.useSelect.findIndex(find=>find._id ==  picList.value[index]._id);
	let select = [...props.useSelect]
	if(findIndex<0){
		select.push(picList.value[index])
	}else{
		select.splice(findIndex,1)
	}	
	
	emits("update:useSelect",select)	
	
}



const close = ()=>{
	showRight.value.close();
	if(params.value.classid) selectRef.value.clearVal();
	init();
	params.value.keyword = "";
	params.value.classid = '';
}

const init = ()=>{
	picList.value = [];
	params.value.current=1;
	noData.value = false;
	
}

defineExpose({
	open,
	close
})
</script>

<style lang="scss" scoped>
.layout{	
	.head{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding:20px;
		background: #fff;
		border-bottom:1px solid #eee;
		position: sticky;
		top:0;
		left:0;
		width: 100%;
		z-index: 12;
		.left{
			display: flex;
			align-items: center;
			gap: 15px;
			.select{
				width: 150px;
			}
			.search{
				width: 150px;				
				height: 35px;
				box-sizing:border-box;				
				font-size: 14px;
				:deep(.is-input-border){
					height: 100%;
				}
			}
			.total{
				font-size: 14px;
				color:#888;
				.big{
					font-weight: bolder;
					color: #2979FF;
				}
			}
		}
		.right{
			.popupBtnGroup{
				button{
					width: 90px;
				}
			}
		}
	}

	.main{
		padding:20px;
		display: grid;
		grid-template-columns:repeat(auto-fill, minmax(100px, 1fr));
		gap: 20px;
		.item{
			width: 100%;
			aspect-ratio: 9 / 16;
			border-radius: 5px;
			overflow: hidden;
			position: relative;
			.pic{
				width: 100%;
				height: 100%;
				image{
					width: 100%;
					height:100%
				}
				.select{
					position: absolute;
					top:0;
					left:0;
					width: 100%;
					height: 100%;
					border:4px solid rgba(220,220,220,0.6);
					z-index: 10;
					checkbox{
						position: absolute;
						top:8px;
						left:8px;
						display: none;
					}
				}
				.select.active{
					border-color:rgba(60,156,255,1);
					background: rgba(60,156,255,0.3);
					checkbox{
						display: block;
					}					
				}
			}
			.look{
				position: absolute;
				right: 10px;
				top:10px;
				background: #fff;
				width: 30px;
				height: 30px;
				border-radius: 50%;
				display: none;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				z-index: 11;
			}
		}
		.item:hover .look{
			display: flex;
		}
	}
}
</style>