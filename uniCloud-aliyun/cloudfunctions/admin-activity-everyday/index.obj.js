// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
function sortPicListByArr2(arr1, arr2) {
    return arr1.map(item => {
        const matchItem = arr2.find(i => i._id === item._id);
        if (matchItem) {
            const newPicList = [];
            matchItem.picList.forEach(picId => {
                const targetPic = item.picList.find(pic => pic._id === picId);
                if (targetPic) {
                    newPicList.push(targetPic);
                }
            });
            item.picList = newPicList;
        }
        return item;
    });
}
const dayjs = require("dayjs");
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-activity-everyday").add(params);	
	},
	async list({size=5,current=1}={}){
		size = Math.min(30,size);
		let skip = (current - 1) * size
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let dayTemp = dbJQL.collection("wallpaper-activity-everyday").orderBy("day desc")
		.skip(skip).limit(size).getTemp();
		let picTemp = dbJQL.collection("wallpaper-piclist").field("_id,picurl").getTemp();
		let result =await dbJQL.collection(dayTemp,picTemp).get({getCount:true});
		let lists = await dbJQL.collection("wallpaper-activity-everyday").orderBy("day desc")
		.skip(skip).limit(size).get()
		let data = sortPicListByArr2(result.data,lists.data);
		data.forEach(item=>{
			let find =  lists.data.find(i=>i._id==item._id);
			item.size=find.picList.length
		})		
		return {...result,data}
		
	},
	async remove(id=''){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-activity-everyday").doc(id).remove();		
	},
	async item(id=""){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let dayTemp = dbJQL.collection("wallpaper-activity-everyday")
		.where(`_id == "${id}"`).orderBy("createTime desc").limit(1).getTemp();
		let picTemp = dbJQL.collection("wallpaper-piclist").field("_id,picurl").getTemp();
		let result = await dbJQL.collection(dayTemp,picTemp).get();
		let lists = await dbJQL.collection("wallpaper-activity-everyday")
		.where(`_id == "${id}"`).orderBy("createTime desc").limit(1).field("picList").get();
		let data = sortPicListByArr2(result.data,lists.data);
		return {...result,data}
		
	},
	async update(params={}){
		let {_id,...data} = params;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-activity-everyday").doc(_id)
		.update(data)
	},
	async updateCheck(value=true){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-activity-everyday")
		.update({
			checked:value
		})
	},
	async _timing(){
		let today = dayjs().format("YYYY-MM-DD")
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		dbJQL.setUser({
			uid:"679056089755e3746202aa61"
		})
		
		let {total} = await dbJQL.collection("wallpaper-activity-everyday")
		.where(`day == "${today}"`)
		.count();
		if(total!=0){
			console.log({msg:"已有数据,无需自动新增"});
			return {msg:"已有数据"};	
		} 	
		let {data} = await dbJQL.collection("wallpaper-piclist").aggregate()
		.match({checked:true})
		.sample({size:15})
		.limit(15)
		.project({
			_id:1
		})
		.end();
		let picList = data.map(item=>item._id);
		let result = await dbJQL.collection("wallpaper-activity-everyday").add({
			picList,
			day:today,
			theme:"每日精选推荐"			
		})		
		console.log(result);
		return result
	}
}
