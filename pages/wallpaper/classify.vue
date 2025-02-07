<template>
	<view class="classify">
		<custom-head-top>
			<template #left>
				分类管理
			</template>
			<template #right>
				<button type="primary" size="mini" @click="handleAdd">
					<i class="el-icon-plus"></i>
					新增分类
				</button>
				<button type="warn" size="mini" @click="batchRemove" :disabled="!ids.length">
					<i class="el-icon-delete" :color="ids.length?'#fff':'rgba(255,255,255,0.5)'"></i>
					批量删除
				</button>
			</template>
		</custom-head-top>
		<view class="main">
			<uni-table ref="tableRef" border stripe emptyText="暂无更多数据" type="selection" @selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">缩略图</uni-th>
					<uni-th align="center">分类名称</uni-th>
					<uni-th align="center">排序</uni-th>
					<uni-th align="center">是否推荐</uni-th>
					<uni-th align="center">是否启用</uni-th>
					<uni-th align="center" width="200">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="item in classData" :key="item._id">
					<uni-td>
						<image class="thumb" :src="getSmallImg(item.picurl)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>
						{{item.name}}
					</uni-td>
					<uni-td>
						{{item.sort}}
					</uni-td>
					<uni-td>
						<uni-tag v-if="item.select" text="推荐" inverted type="error"/>
						<uni-tag v-else text="普通" inverted />
					</uni-td>
					<uni-td>
						<switch :checked="item.enable" style="transform: scale(0.7);transform-origin:left center;"/>
					</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button size="mini" type="primary" plain>修改</button>
							<button size="mini" type="warn" plain 
							@click="removeItem(item._id)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view class="paging">
			<uni-pagination title="标题文字" show-icon="true" total="50" current="2"></uni-pagination>
		</view>
		
		<classify-popup-vue ref="classPopRef" @addsuccess="getClassify()"></classify-popup-vue>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import classifyPopupVue from './child/classifyPopup.vue';
import { showModal, showToast } from '../../utils/common';
import { getSmallImg } from '../../utils/tools';
const classPopRef = ref(null);
const classifyCloudObj = uniCloud.importObject("admin-wallpaper-classify");
const classData = ref([]);
const tableRef = ref(null);
const ids = ref([]);
//新增打开弹窗
const handleAdd = () =>{
	classPopRef.value.open();
}

const getClassify = async() =>{
	let {errCode,errMsg,data} = await classifyCloudObj.list();
	if(errCode!==0) return showToast({title:errMsg});
	classData.value = data;
}

//选择器
const selectionChange = (e) =>{
	ids.value = e.detail.index.map(index=>classData.value[index]._id);
	console.log(ids.value);
}

//批量删除
const batchRemove = async() =>{
	removeItem(ids.value);
	
}

//删除一条记录
const removeItem = async(id) =>{
	let arrs = Array.isArray(id) ? [...id] : [id];
	
	try{
		if(id){
			let feedback = await showModal({content:"是否确认删除?"});
			if(feedback!='confirm') return;
			let {errCode,errMsg} = await classifyCloudObj.remove(arrs);
			if(errCode!==0) showToast({title:errMsg});
			showToast({title:"删除成功"});
			tableRef.value.clearSelection();
			ids.value = [];
			getClassify();
		}else{
			showToast({title:"所选项ID不存在"})
		}
	}catch(err){
		console.log(err);
	}
}

getClassify();
</script>

<style lang="scss" scoped>

.main{
	padding: 20px;
	.thumb{
		width: 45px;
		height: 90px;
		border-radius: 3px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>
