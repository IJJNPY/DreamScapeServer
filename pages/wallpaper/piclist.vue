<template>
	<view class="piclist">
		<custom-head-top>
			<template #left>
				壁纸列表
			</template>
			<template #right>
				<uni-data-select style="width: 200px;" placeholder="选择分类"></uni-data-select>
				<button type="primary" size="mini" @click="handleAdd">
					<i class="el-icon-plus"></i>
					新增壁纸
				</button>
			</template>
		</custom-head-top>
		
		<view class="main">
			<uni-table class="table" ref="tableRef" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center">缩略图</uni-th>
					<uni-th align="center">分类</uni-th>
					<uni-th align="center">评分</uni-th>
					<uni-th align="center">评分数</uni-th>
					<uni-th align="center">下载数</uni-th>
					<uni-th align="center">阅读数</uni-th>
					<uni-th align="center">是否可见</uni-th>
					<uni-th align="center">发布人</uni-th>
					<uni-th align="center">发布时间</uni-th>
					<uni-th align="center" width="200">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="item in picList" :key="item._id">
					<uni-td class="thumb">
						<image :src="getSmallImg(item.picurl)" mode="aspectFill"></image>
					</uni-td>
					<uni-td>{{item.classid[0].name}}</uni-td>
					<uni-td class="score">
						<uni-rate class="uni-rate" :disabled="true" disabledColor="#f7f0ca" :size="16" :value="item.score" />
						<text class="text">{{item.score}}</text>
					</uni-td>
					<uni-td>{{item.score_count || 0}}</uni-td>
					<uni-td>{{item.download_count || 0}}</uni-td>
					<uni-td>{{item.view_count}}</uni-td>
					<uni-td>
						<switch :checked="item.checked" class="switchStyle"></switch>
					</uni-td>
					<uni-td>{{item.user_id[0].nickname}}</uni-td>
					<uni-td>{{dayjs(item.createTime).format("YYYY/MM/DD HH:mm")}}</uni-td>
					<uni-td>
						<view class="operate-btn-group">
							<button size="mini" type="primary" plain 
							@click="update(item._id)">修改</button>
							<button size="mini" type="warn" plain 
							@click="removeItem(item._id)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		
		<view class="paging">
			<uni-pagination :current="params.current" :total="params.total" :page-size="params.size" :show-icon="true" @change="pageChange"></uni-pagination>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { routerTo } from '../../utils/common';
import dayjs from 'dayjs';
import { getSmallImg } from '../../utils/tools';
const picCloudObj = uniCloud.importObject("admin-wallpaper-piclist");
const picList = ref([]);
const params = ref({
	current:1,
	total:0,
	size:5
})


const handleAdd = () =>{
	routerTo("/pages/wallpaper/picadd");
}

const pageChange = (e) =>{
	params.value.current = e.current;
	getData();
}

//获取数据
const getData = async() =>{
	let {errCode, errMsg, data, count} = await picCloudObj.list(params.value);
	picList.value = data;
	params.value.total = count;

}

const update = (id) =>{
	
}

const removeItem = (id) =>{
	
}

getData();
</script>

<style lang="scss" scoped>
.main{
	padding: 20px;
	.table{
		.thumb{
			image{
				width: 45px;
				height: 100px;
			}
		}
		.score{

			.uni-rate{display: inline-block;}
			.text{
				padding-left: 5px;

			}
		}
	}
}
</style>
