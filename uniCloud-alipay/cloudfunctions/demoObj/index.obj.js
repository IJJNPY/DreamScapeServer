const dayjs = require("dayjs");
module.exports = {
	_before: function () { // 通用预处理器

	},
	async demo2({type="download",dataRange=["2025-01-06",'2025-01-10'],number=9}={}){
		number = Math.min(number,15)
		let table = type=='download' ? 'xxm-bizhi-download' : type=='score' ? 'xxm-bizhi-score' : ''
		let wre = dataRange.length ?
		`createTime >= ${dayjs(dataRange[0]).startOf("day").valueOf()} && 
		createTime<=${dayjs(dataRange[1]).endOf("day").valueOf()}` 
		: {};
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		dbJQL.setUser({
			role:['admin']
		})
		let res = await dbJQL.collection(table).where(wre).get();
		return res;
		let {data:dataList=[]} = await dbJQL.collection(table).where(wre).groupBy("picid")
		.groupField("count(*) as countTotal").orderBy("countTotal desc").limit(number).get();
		let picidArr =  dataList.map(item=>item.picid);
		let {data:piclist=[]} = await dbJQL.collection("xxm-bizhi-piclist").where(`_id in ${JSON.stringify(picidArr)}`).field("_id,picurl").get();
		dataList =  dataList.map(item=>{
			let find = piclist.find(find=>find._id == item.picid);
			return {
				...item,
				picurl:find.picurl
			}
		})		
		return dataList 
	},
	async demo(){
		let currentDay =  dayjs().subtract(2,'day').subtract(1,"h");
		
		let startDayTime = currentDay.startOf("day").valueOf();
		let endDayTime = currentDay.endOf("day").valueOf();
		
		
		const dbJQL = uniCloud.databaseForJQL()
		dbJQL.setUser({
			role:['admin']
		})
		
		return await dbJQL.collection("xxm-data-overview")
		.get();
	}
}
