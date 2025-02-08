export function showToast({title="", duration=1500, icon="none", mask=false}={}){
	uni.showToast({
		title:String(title),
		icon,
		duration,
		mask
	})
}

//显示模态弹窗
export function showModal({content="",showCancel=true}={}){
	return new Promise((resolve,reject)=>{
		uni.showModal({
			title:"提示",
			content,
			showCancel,
			success:({confirm}) => {
				if(confirm) resolve('confirm')
				else resolve('cancel')
			},
			fail: () => {
				reject('fail')
			}
		})
	})
}

//封装跳转方法
export const routerTo = (url,type='navigate')=>{
	if(type === 'navigate'){
		uni.navigateTo({
			url
		})
	}else if(type === 'redirect'){
		uni.redirectTo({
			url
		})
	}else if(type === 'reLaunch'){
		uni.reLaunch({
			url
		})
	}else{
		return "错误信息"
	}
}