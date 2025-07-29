const utils = require("custom-utils");
module.exports = {
	_before: function () { // 通用预处理器
		utils.useRecord(this)
	},
	async list({pageSize=8,pageNum=1,select=false}={}){
		pageSize = Math.min(pageSize,20);
		let skip = (pageNum - 1)*pageSize;
		let wre = {enable:true}
		if(select) wre.select = true;
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		
		return await dbJQL.collection("xxm-bizhi-classify").where(wre).orderBy("sort asc").skip(skip).limit(pageSize).get();
		
		let classTemp = dbJQL.collection("xxm-bizhi-classify").where(wre).orderBy("sort asc").skip(skip).limit(pageSize).getTemp();		
		let picTemp = dbJQL.collection("xxm-bizhi-piclist").field("createTime,classid").orderBy("createTime","desc").limit(1).getTemp();
		
		
		let res = await dbJQL.collection(classTemp,picTemp)
		.field(`
		_id._value as _id,
		name,
		picurl,
		select,
		_id['xxm-bizhi-piclist'].createTime as updateTime`).get({getCount:true});
		
		let data = res.data.map(item=>({...item,updateTime:item.updateTime[0]}))		
		return {...res,data}
	}
}
