<template>
	<view class="noticeList">
		<custom-head-top>
			<template #left>
				通知公告
			</template>
			
			<template #right>
				<button type="primary" size="mini" @click="handleAdd">
					<uni-icons type="plusempty" size="14" color="#fff"></uni-icons>
					新增公告
				</button>				
			</template>
		</custom-head-top>
		
		<view class="main">
			<uni-table ref="tableRef" border stripe emptyText="暂无更多数据">
				<uni-tr>					
					<uni-th align="left">标题</uni-th>
					<uni-th align="left">发布者</uni-th>
					<uni-th align="left">阅读量</uni-th>
					<uni-th align="left">是否推荐</uni-th>
					<uni-th align="left">是否启用</uni-th>
					<uni-th align="left">发布时间</uni-th>
					<uni-th align="right" width="200">操作</uni-th>
				</uni-tr>
				
				<uni-tr v-for="(item,index) in listData" :key="item._id">
					<uni-td>{{truncateString(item.title,15)}}</uni-td>
					<uni-td>{{item.nickname}}</uni-td>
					<uni-td>{{item.view_count}}</uni-td>
					<uni-td>						
						<uni-tag v-if="item.select" text="推荐" type="error" size="mini"/>
						<uni-tag v-else text="普通" type="default" size="mini" inverted/>	
					</uni-td>
					<uni-td>
						<text v-if="item.checked">✔️</text>
						<text v-else>🚫</text>
					</uni-td>
					<uni-td>{{dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}}</uni-td>					
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
		
	</view>
</template>

<script setup>
import {ref} from "vue";
import { routerTo, showModal, showToast,hasPermission } from "../../utils/common";
import { truncateString } from "../../utils/tools";
import dayjs from "dayjs"
const noticeCloudObj = uniCloud.importObject("admin-notice-data",{customUI:true})
const listData = ref([]);
const params = ref({
	current:1,
	total:0,
	size:15
})

//新增操作
const handleAdd = ()=>{
	routerTo("/pages/activity/noticeEdit");
}

//修改操作
const update = (id)=>{
	routerTo("/pages/activity/noticeEdit?id="+id);
}

//删除列表
const remove = async(id)=>{
	let feedback = await showModal({content:"是否确认删除？"});
	if(feedback!=='confirm') return;
	let {errCode} = await noticeCloudObj.remove(id)
	if(errCode!==0) return showToast({title:"请刷新重试"})
	showToast({title:"删除成功"})
	getData();
}

const getData = async()=>{
	try{
		let {errCode,data,count} = await noticeCloudObj.list(params.value);
		if(errCode!=0) return showToast({title:"操作有误"})	
		listData.value = data;
		params.value.total = count
		console.log(data);
	}catch(err){
		showToast({title:err})
	}	
}


//切换分页
const pageChange = (e)=>{	
	params.value.current = e.current;	
	getData();
}

uni.$on("noticeSuceess",()=>{
	params.value.current = 1;
	getData();
})


getData();
</script>

<style lang="scss" scoped>
.main{
	padding:20px;
}
</style>
