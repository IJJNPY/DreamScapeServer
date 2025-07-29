<template>
	<view class="download">
		<custom-head-top>
			<template #left>
				评分记录
			</template>
			
			<template #right>				
				<uni-data-select style="width: 200px;" ref="selectRef" @change="classifyChange" collection="xxm-bizhi-classify"
				field="_id as value, name as text,sort"
				:where="`enable == true`"
				orderby="sort asc"
				v-model="params.classid"
				></uni-data-select>
			</template>
		</custom-head-top>
		
		
		<view class="main">
			<uni-table class="table"  ref="tableRef" border stripe emptyText="暂无更多数据" >
				<uni-tr>
					<uni-th align="left" >缩略图</uni-th>
					<uni-th align="left" >分类</uni-th>
					<uni-th align="left" >用户评分</uni-th>
					<uni-th align="left" >下载人</uni-th>
					<uni-th align="left" >IP地址</uni-th>
					<uni-th align="left" >下载时间</uni-th>
				</uni-tr>
				
				<uni-tr v-for="item in listData" :key="item._id">
					<uni-td class="thumb">
						<image @click="previewImg(item.picurl)" :src="getSmallImg(item.picurl)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>{{item.classname}}</uni-td>				
					<uni-td class="score">
						<uni-rate class="uni-rate" :disabled="true" 
						disabledColor="#F7E7CE" size="16" :value="item.userScore" />
						<text class="text">{{item.userScore}}</text> 
					</uni-td>				
					<uni-td>{{item.nickname}} </uni-td>
					<uni-td>
						{{item.ip}}
					</uni-td>
					<uni-td>
						{{dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss")}}
					</uni-td>					
				</uni-tr>
			</uni-table>
		</view>
		
		
		<view class="paging">
			<uni-pagination :current="params.current" :total="params.total" 
			:page-size="params.size"  :show-icon="true" @change="pageChange" />
		</view>
		
		
		
	</view>
</template>

<script setup>
import {onMounted, ref} from "vue";
import dayjs from "dayjs"
import { getSmallImg } from '@/utils/tools';
import { routerTo, showModal, showToast,previewImg } from '@/utils/common';
const dataCloudObj = uniCloud.importObject("admin-data-record");
const listData = ref([]);
const selectValue = ref("");
const selectRef = ref(null);
const params = ref({
	current:1,
	total:0,
	size:10,	
	classid:"",
	type:"score"
})

//切换分类
const classifyChange = (e)=>{
	params.value.classid = e
	params.value.current = 1
	getData();
}

//切换分页
const pageChange = (e)=>{	
	params.value.current = e.current;
	getData();
}

//获取数据
const getData = async()=>{
	try{
		let {data,errCode,count} = await dataCloudObj.recordList(params.value);		
		listData.value = data
		params.value.total = count
		console.log(data);
	}catch(err){
		console.log(err);
	}
	
}

//删除分类选择的缓存
onMounted(()=>{
	selectRef.value.clearVal();
})
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
