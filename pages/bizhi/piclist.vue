<template>
	<view class="piclist">
		<custom-head-top>
			<template #left>
				壁纸列表
			</template>
			
			<template #right>				
				<uni-data-select style="width: 200px;" ref="selectRef" @change="classifyChange" collection="xxm-bizhi-classify"
				field="_id as value, name as text,sort"
				:where="`enable == true`"
				orderby="sort asc"
				v-model="selectValue"
				></uni-data-select>
				
				<button type="primary" size="mini" @click="handleAdd">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增壁纸
				</button>
				
			</template>
		</custom-head-top>
		
		<view class="main">
			<uni-table class="table"  ref="tableRef" border stripe emptyText="暂无更多数据" >
				<uni-tr>
					<uni-th align="left" >缩略图</uni-th>
					<uni-th align="left" >分类</uni-th>					
					<uni-th align="left" sortable @sortChange="scoreSortChange">评分</uni-th>
					<uni-th align="left" >评分数</uni-th>
					<uni-th align="left" >下载数</uni-th>
					<uni-th align="left" sortable @sortChange="viewSortChange">阅读数</uni-th>
					<uni-th align="left" >是否可见</uni-th>
					<uni-th align="left" >发布人</uni-th>
					<uni-th align="left" >发布时间</uni-th>					
					<uni-th align="right" width="200">操作</uni-th>
				</uni-tr>
				
				<uni-tr v-for="item in picList" :key="item._id">
					<uni-td class="thumb">
						<image @click="previewImg(item.picurl)" :src="getSmallImg(item.picurl)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>{{item.classname[0]}}</uni-td>
					<uni-td class="score">
						<uni-rate class="uni-rate" :disabled="true" disabledColor="#F7E7CE" size="16" :value="item.score" />
						<text class="text">{{item.score}}</text>
					</uni-td>
					<uni-td>{{item.score_count || 0 }} </uni-td>
					<uni-td>{{item.download_count || 0 }}</uni-td>
					<uni-td>{{item.view_count}}</uni-td>
					<uni-td>
						<switch  :disabled="!hasPermission('UPDATE_PERMISSION',item.user_id)" :checked="item.checked" class="switchStyle" @change="checkedChange($event,item._id)"/>
					</uni-td>
					<uni-td>
						{{item.nickname[0]}}
					</uni-td>
					<uni-td>
						{{dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss")}}
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
			<uni-pagination :current="params.current" :total="params.total" 
			:page-size="params.size"  :show-icon="true" @change="pageChange" />
		</view>
		
		
		<PiclistPopup ref="picPopRef" v-model:item="picItem" @success="getData()"></PiclistPopup>
	</view>
</template>

<script setup>
import { routerTo, showModal, showToast,previewImg, hasPermission } from '../../utils/common';
import {onMounted, ref} from "vue";
import dayjs from "dayjs"
import { getSmallImg } from '../../utils/tools';
import PiclistPopup  from "./children/PiclistPopup.vue"
const picItem = ref({})
const picPopRef = ref(null);
const picCloudObj  = uniCloud.importObject("admin-bizhi-picture");
const selectValue = ref("");
const selectRef = ref(null);
const picList = ref([]);
const params = ref({
	current:1,
	total:0,
	size:15,
	viewSort:"",
	scoreSort:"",
	classid:""
})

onMounted(()=>{
	selectRef.value.clearVal();
})

const handleAdd = ()=>{	
	routerTo("/pages/bizhi/picadd");
}


//切换分页
const pageChange = (e)=>{	
	params.value.current = e.current;
	getData();
}

//获取数据
const getData = async()=>{
	let {errCode,errMsg,data,count} = await picCloudObj.list(params.value);	
	picList.value = data
	params.value.total = count
	console.log(data);
}

const update = async(id)=>{
	try{
		let {errCode,errMsg,data} = await picCloudObj.item(id)
		if(errCode!==0) return showToast({title:errMsg});
		picItem.value = {...data,tempurl:data.picurl}
		picPopRef.value.open();
	}catch(err){
		console.log(err);
	}
	
}


//修改是否可见
const checkedChange = async(e,id)=>{
	console.log(e.detail.value);
	console.log(id);
	try{
		uni.showLoading({mask:true});
		let {errCode,errMsg} = await picCloudObj.update({_id:id,checked:e.detail.value});
		if(errCode!=0) return showToast({title:errMsg});
		getData();
	}catch(err){
		console.log(err);
	}finally{
		uni.hideLoading();
	}	
}



const remove = async(id)=>{	
	try{		
		let feedback = await showModal({content:"是否确认删除？"})
		if(feedback!=='confirm') return;
		uni.showLoading({mask:true})
		let {errCode,errMsg} =await picCloudObj.remove([id])
		if(errCode!==0) return showToast({"title":errMsg})
		showToast({"title":"删除成功"})
		getData();
	}catch(err){	
		console.log(err);
		showToast({"title":err})
	}
	
}
//根据阅读数排序
const viewSortChange = (e)=>{
	let {order} = e;
	params.value.viewSort = order == 'ascending' ? 'asc' : order == 'descending' ? 'desc' : ''
	getData();
}
//根据评分排序
const scoreSortChange = (e)=>{
	let {order} = e;
	params.value.scoreSort = order == 'ascending' ? 'asc' : order == 'descending' ? 'desc' : ''
	getData();
}

//分类选择
const classifyChange = (e)=>{	
	params.value.classid = e
	params.value.current = 1
	getData();
}


</script>

<style lang="scss" scoped>
.main{
	padding:20px;
	.table{
		.thumb{			
			image{
				width: 45px;
				height: 100px;
			}			
		}
		.score{
			.uni-rate{ display: inline-block;}			
			.text{padding-left:5px;}
		}
	}
	
}
</style>
