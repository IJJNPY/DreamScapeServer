let {httpsToCloud,uuid} = require("custom-utils");

module.exports = {
	_before: function () { // 通用预处理器

	},
	async add(params={}){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-piclist").add(params);
	},
	async list({size=5,current=1,viewSort='',scoreSort='',classid=""}={}){	
		size = Math.min(100,size);
		let skip = (current - 1) * size
		let order = "createTime desc"
		let where = {}		
		if(viewSort) order = `view_count ${viewSort},`+order;
		if(scoreSort) order = `score ${scoreSort},`+order;
		if(classid) where.classid = classid
		
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})		
		let picTemp  = dbJQL.collection("xxm-bizhi-piclist").where(where).orderBy(order)
		.skip(skip)
		.limit(size)
		.getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		let classTemp = dbJQL.collection("xxm-bizhi-classify").field("_id,name").getTemp();
		
		return await dbJQL.collection(picTemp,userTemp,classTemp).field(`
		picurl,		
		score,		
		checked,
		createTime,
		classid.name as classname,
		user_id.nickname as nickname,
		arrayElemAt(user_id._id,0) as user_id,
		view_count,
		download_count,
		score_count
		`).get({getCount:true});
		
	},
	
	
	async search({size=5,current=1,classid="",keyword=""}={}){
		size = Math.min(100,size);
		let skip = (current - 1) * size		
		let where = {}	
		if(classid) where.classid = classid
		if(keyword){
			where = {
				...where,
				$or:[
					{description:{$regex:keyword,$options:'i'}},
					{tabs:{$elemMatch:{$regex:keyword,$options:'i'}}}				
				]
			}
		}
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})	
		
		return await dbJQL.collection("xxm-bizhi-piclist").where(where).orderBy("createTime desc").skip(skip).limit(size).field("_id,picurl").get({getCount:true});
		
	},
	
	
	async remove(ids = []){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let {data} = await dbJQL.collection("xxm-bizhi-piclist")
		.where(`_id in ${JSON.stringify(ids)}`).field("picurl").get();
		let urls = data.map(item=>httpsToCloud(item.picurl));
		
		let deleteFilePromise = uniCloud.deleteFile({
			fileList:urls
		})			
		
		let removeDataPromise = dbJQL.collection("xxm-bizhi-piclist")
		.where(`_id in ${JSON.stringify(ids)}`).remove();
		
		let [,result] = await Promise.all([deleteFilePromise,removeDataPromise]);
		return result
		
	},
	async item(id){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-piclist").doc(id)	
		.field(`
		picurl,
		description,
		score,
		tabs,
		checked,
		classid
		`)
		.get({getOne:true})		
	},
	async update(params={}){
		let {_id,...data} = params;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-bizhi-piclist").doc(_id)
		.update(data)
	}
}
