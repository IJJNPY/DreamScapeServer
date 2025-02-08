<template>
	<view class="picadd">
		<custom-head-top>
			<template #left>
				新增壁纸
			</template>
		</custom-head-top>
		
		<view class="main">
			<view class="grid">
				<view class="itemBox pic" v-for="item in 7">
					<view class="left">
						<image src="/static/logo.png" mode="aspectFit"></image>
						<view class="mask">
							<view class="icon">
								<uni-icons type="compose" size="20" color="#fff"></uni-icons>
							</view>
							<view class="icon" @click="delImg">
								<uni-icons type="trash" size="20" color="#fff"></uni-icons>
							</view>
						</view>
					</view>
					<view class="right">右字</view>
				</view>
				<view class="itemBox add">
					<view class="icon">+</view>
					<view class="text">点击选择图片</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.main{
	padding:20px;
	.grid{
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 30px;
		.itemBox{
			background: #f8f8f8;
			width: 100%;
			min-height: 300px;
			border: 1px solid transparent;
			display: flex;
			align-items: start;
			padding: 20px;
			.left{
				width: 150px;
				aspect-ratio: 9/20;
				position: relative;
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
			.right{
				flex: 1;
				border: 1px solid red;
				margin-left: 20px;
			}
		}
		.itemBox.pic{
			
		}
		
		.itemBox.add{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: #999;
			cursor: pointer;
			.icon{
				font-size: 50px;
			}
			.text{
				font-size: 20px;
				padding-top: 20px;
			}
		}
		
		.itemBox:hover{
			border-color: #cfcfcf;
		}
	}
}
</style>