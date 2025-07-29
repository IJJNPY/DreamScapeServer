import {compressAndConvertToWebP} from "./tools.js"
import dayjs from "dayjs";
export function showToast({title="",duration=1500,icon="none",mask=false}={}){
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
			success: ({confirm}) => {
			  if (confirm) resolve('confirm')
			  else resolve('cancel')
			},
			fail: () => {
			  reject('fail')
			}
		})
	})
}

//路由跳转方法
export const routerTo = (url,type='navigate')=>{
	if(type === "navigate"){
		uni.navigateTo({
			url
		})
	}else if(type==='redirect'){
		uni.redirectTo({
			url
		})
	}else if(type==="reLaunch"){
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

//上传一张图片
export const uploadFileItem = async(url,rootPath="wallpaper")=>{
	let tempurl = await compressAndConvertToWebP(url);	
	return await uniCloud.uploadFile({
		filePath:tempurl,
		cloudPath:rootPath+"/"+dayjs().format("YYYYMMDD")+"/"+Date.now()+".webp"
	})
}


export const uploadFileGroup = async(url)=>{
	
}


export function hasPermission(value,user_id=null){
	let {permission=[],role=[],uid=""} = uniCloud.getCurrentUserInfo()
	return role.includes("admin") || permission.includes(value) || user_id == uid
}



