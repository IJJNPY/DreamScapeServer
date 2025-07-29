<template>
	<view class="classify">
		<custom-head-top>
			<template #left>
				分类管理
			</template>
			
			<template #right>
				<button type="primary" size="mini" @click="handleAdd">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增分类
				</button>
				<button v-if="hasPermission('DELETE_PERMISSION')" type="warn" size="mini" @click="batchRemove" 
				:disabled="!ids.length">
					<uni-icons type="trash" size="14" 
					:color="ids.length?'#fff':'rgba(255,255,255,0.5)'"></uni-icons>
					批量删除
				</button>
			</template>
		</custom-head-top>
		
		
		<view class="main">
			<uni-table ref="tableRef" border stripe emptyText="暂无更多数据" type="selection" 
			@selection-change="selectionChange">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="left" width="150">缩略图</uni-th>
					<uni-th align="left">分类名称</uni-th>
					<uni-th align="left" >排序</uni-th>
					<uni-th align="left" >是否推荐</uni-th>
					<uni-th align="left">是否启用</uni-th>
					<uni-th align="right" width="200">操作</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="item in classData" :key="item._id">
					<uni-td>
						<image class="thumb"
						@click="previewImg(item.picurl)"
						:src="getSmallImg(item.picurl)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>
						{{item.name}}
					</uni-td>
					<uni-td>
						{{item.sort}}
					</uni-td>
					<uni-td>
						<uni-tag v-if="item.select" text="推荐" inverted type="error" />
						<uni-tag v-else text="普通" inverted />
						
					</uni-td>
					<uni-td>
						<switch :disabled="!hasPermission('UPDATE_PERMISSION',item.user_id)" :checked="item.enable" style="transform:scale(0.6);transform-origin: left center;" @change="enableChange($event,item._id)"/>
					</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button :disabled="!hasPermission('UPDATE_PERMISSION',item.user_id)" size="mini" type="primary" plain 
							@click="update(item._id)">修改</button>
							<button :disabled="!hasPermission('DELETE_PERMISSION',item.user_id)" size="mini" type="warn" plain 
							@click="remove(item._id)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
				
				
			
			</uni-table>
		</view>
		
	
		
		<view class="paging">
			<!-- <uni-pagination title="标题文字" show-icon="true" total="50" current="2"></uni-pagination> -->
		</view>
		
		
		<classifyPopup ref="classPopRef" :item="item" :type="type" @success="getClassify()"
		:maxSort="classData[classData.length-1]?.sort"
		
		></classifyPopup>
		
		
	</view>
</template>

<script setup>
import { getSmallImg } from '../../utils/tools';	
import { ref } from "vue";
import classifyPopup from "./children/classifyPopup.vue"
import { showModal, showToast,previewImg, hasPermission } from "../../utils/common";
const classifyCloudObj = uniCloud.importObject("admin-bizhi-classify",{customUI:true});
const classPopRef = ref(null);
const classData = ref([]);
const tableRef = ref(null);
const ids = ref([]);
const item = ref(null);
const type = ref("add");



//点击新增分类
const handleAdd = ()=>{
	type.value = 'add';
	classPopRef.value.open();
}


const getClassify = async()=>{
	let {errCode,errMsg,data} = await classifyCloudObj.list();
	if(errCode!==0) return showToast({title:errMsg});
	classData.value = data
	console.log(data);
}


//选择器
const selectionChange =(e)=>{
	ids.value = e.detail.index.map(index=>classData.value[index]._id);
	console.log(ids.value);
}

//批量删除
const batchRemove = async()=>{
	await remove(ids.value);
	
}

//删除一条记录
const remove = async(id)=>{	
	let arrs = Array.isArray(id) ? [...id] : [id];	
	try{
		let feedback = await showModal({content:"是否确实删除？"});
		if(feedback!='confirm') return;
		let {errCode,errMsg} = await classifyCloudObj.remove(arrs);
		if(errCode!==0) showToast({title:errMsg});
		showToast({title:"删除成功"});
		tableRef.value.clearSelection();
		ids.value = [];
		getClassify();
	}catch(err){
		console.log(err);
	}	
}

//修改一条记录
const update = async(id)=>{
	try{
		let {data,errCode,errMsg} = await classifyCloudObj.item(id);
		if(errCode!==0) return showModal({content:errMsg,showCancel:false});
		item.value = data;
		type.value = 'update';
		classPopRef.value.open();
		console.log(data);
	}catch(err){
		console.log(err);
		
	}
	
}


//修改启用状态
const enableChange = async(e,id)=>{	
	try{
		uni.showLoading({mask:true});
		let {errCode,errMsg} = await classifyCloudObj.update({_id:id,enable:e.detail.value});
		if(errCode!=0) return showToast({title:errMsg});
		getClassify();
	}catch(err){
		console.log(err);
		showToast({title:err.errMsg})
	}finally{
		uni.hideLoading();
	}	
}



getClassify();

</script>

<style lang="scss" scoped>

	
.main{
	padding:20px;
	.thumb{
		width: 45px;
		height: 90px;
		border-radius: 3px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
}
</style>
