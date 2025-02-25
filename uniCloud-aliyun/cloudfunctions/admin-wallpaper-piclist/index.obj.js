// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj

const { url } = require("inspector");

// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-piclist").add(params)
	},
	async list({size=5,current=1,viewSort='',classid=''}={}){
		size = Math.min(100,size);
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let order = "createTime desc";
		let where = {};
		if(viewSort) order = `view_count ${viewSort},` + order;
		if(classid) where.classid = classid;
		
		console.log(order);
		let skip = (current-1)*size;
		let picTemp = dbJQL.collection("wallpaper-piclist").where(where).orderBy(order)
		.skip(skip)
		.limit(size).getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		let classTemp = dbJQL.collection("wallpaper-classify").field("_id,name").getTemp();
		
		return await dbJQL.collection(picTemp,userTemp,classTemp).field(`
		picurl,
		description,
		score,
		tabs,
		checked,
		createTime,
		classid,
		user_id,
		view_count,
		download_count,
		score_count
		`).get({getCount:true});
	},
	
	async search({size=5,current=1,classid='',keyword=''}={}){
		size = Math.min(50,size);
		let skip = (current-1)*size;
		let where = {};
		if(classid) where.classid = classid;
		if(keyword){
			where = {
				...where,
				$or:[
					{description:{$regex:keyword,$options:'i'}},
					{tabs:{$regex:keyword,$options:'i'}}
				]
			}
		}
		
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		return await dbJQL.collection("wallpaper-piclist").where(where)
		.orderBy("createTime desc").skip(skip).limit(size).field("_id,picurl").get({getCount:true});
		
	},
	
	async remove(ids = []){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data} = await dbJQL.collection("wallpaper-piclist").where(`_id in ${JSON.stringify(ids)}`).field("picurl").get();
		let urls = data.map(item=>item.picurl);
		
		let deleteFilePromise = uniCloud.deleteFile({
			fileList:urls
		});
		
		let removeDataPromise = dbJQL.collection("wallpaper-piclist").where(`_id in ${JSON.stringify(ids)}`).remove();
		
		let [,result] = await Promise.all([deleteFilePromise,removeDataPromise]);
		return result; 
	},
	async getitem(id){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-piclist").doc(id).field(`
		picurl,
		description,
		score,
		tabs,
		checked
		`).get({getOne:true});
	},
	async update(params={}){
		let {_id,...data} = params;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("wallpaper-piclist").doc(_id).update(data);
	}
}
