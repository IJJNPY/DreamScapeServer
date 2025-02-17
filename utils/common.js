import dayjs from "dayjs"
import { compressImage } from "./tools"

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

export function previewImg(url){
	if(!url) return;
	uni.previewImage({
		urls:[url]
	})
}

export const uploadFileItem = async(url) =>{
	let tempurl = await compressImage(url)
	return uniCloud.uploadFile({
		filePath: tempurl,
		cloudPath: "wallpaper/"+dayjs().format("YYYYMMDD")+"/"+Date.now()+".webp",
		//阿里云必须要设置，腾讯云和支付宝云不需要
		cloudPathAsRealPath: true
	})
}

export const uploadFileGroup = async(url) =>{

}