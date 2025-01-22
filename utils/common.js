export function showToast({title="", duration=1500, icon="none", mask=false}={}){
	uni.showToast({
		title:String(title),
		icon,
		duration,
		mask
	})
}