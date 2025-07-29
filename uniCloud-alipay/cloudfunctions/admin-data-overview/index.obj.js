const dayjs = require("dayjs");
const {mergeAndSort,getDatesBetween} = require("./utils.js");
function getRandomNumber() {
    return Math.floor(Math.random() * (300 - 50 + 1)) + 50;
}

module.exports = {
	_before: function () { // 通用预处理器

	},
	//排行榜
	async rankOrder({type=null,dataRange=[],number=9}={}){
		number = Math.min(number,15)
		let table = type=='download' ? 'xxm-bizhi-download' : type=='score' ? 'xxm-bizhi-score' : ''
		let wre = dataRange.length ?
		`createTime >= ${dayjs(dataRange[0]).startOf("day").valueOf()} && 
		createTime<=${dayjs(dataRange[1]).endOf("day").valueOf()}` 
		: {};
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
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
	//分类喜好度
	async likeClassify({dataRange=[],number=9}={}){
		number = Math.min(number,15)
		let wre = dataRange.length ?
		`createTime >= ${dayjs(dataRange[0]).startOf("day").valueOf()} && 
		createTime<=${dayjs(dataRange[1]).endOf("day").valueOf()}` 
		: {};
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let p1 =  dbJQL.collection("xxm-bizhi-download").where(wre).groupBy("classid")
		.groupField("count(*) as countTotal").orderBy("countTotal desc").limit(number).get();
		
		let p2 =  dbJQL.collection("xxm-bizhi-score").where(wre).groupBy("classid")
		.groupField("count(*) as countTotal").orderBy("countTotal desc").limit(number).get();
		
		let [{data:downloadData},{data:scoreData}] = await Promise.all([p1,p2]);
		let merge = mergeAndSort(downloadData,scoreData,5)
		let classids = merge.map(item=>item.classid);
		
		let {data:classData} = await dbJQL.collection("xxm-bizhi-classify").where(`_id in ${JSON.stringify(classids)}`).field("_id,name").get();
		
		merge = merge.map(item=>{
			let find = classData.find(find=>find._id == item.classid);
			return {
				...item,
				classname:find.name
			}
		})
		
		return merge.map(item=>{
			return {
				name:item.classname,
				value:item.countTotal
			}
		})
		
		
	},
	//统计数据量
	async countTotal({dataRange=[]}={}){	
		let dateIntervar = getDatesBetween(dataRange[0],dataRange[1])
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let {data=[]} = await dbJQL.collection("xxm-data-overview")
		.where(`day in ${JSON.stringify(dateIntervar)}`).orderBy("day asc")
		.field("coinCount,day,downloadCount,scoreCount,uploadCount,usageCount,userCount")
		.get();
		
		return dateIntervar.map(item=>{
			let find = data.find(find=>find.day == item);
			if(!find){
				return {
					coinCount:0,
					day:item,
					downloadCount:0,
					scoreCount:0,
					uploadCount:0,
					usageCount:0,
					userCount:0
				}
			}
			return find;
		})
		
		 
	},
	
	
	async _timing(){
		let currentDay =  dayjs().subtract(1,"h")
		let startHour = currentDay.startOf("h").format("YYYY-MM-DD HH:mm:ss");
		let startTime = currentDay.startOf("h").valueOf();
		let endHour = currentDay.endOf("h").format("YYYY-MM-DD HH:mm:ss");
		let endTime = currentDay.endOf("h").valueOf();
		let startDay = currentDay.startOf("day").format("YYYY-MM-DD")
		let startDayTime = currentDay.startOf("day").valueOf();
		let endDayTime = currentDay.endOf("day").valueOf();
		
		const dbJQL = uniCloud.databaseForJQL()
		dbJQL.setUser({
			role:["admin"]
		})
		let p1 = dbJQL.collection("xxm-bizhi-download")
		.where(`createTime>=${startTime} && createTime <= ${endTime}`).count()
		let p2 = dbJQL.collection("xxm-bizhi-score").where(`createTime>=${startTime} && createTime <= ${endTime}`).count();
		let p3 = dbJQL.collection("xxm-data-usage")
		.where(`createTime>=${startTime} && createTime <= ${endTime}`)
		.count();
		let p4 = dbJQL.collection("xxm-data-usage")
		.where(`createTime>=${startDayTime} && createTime <= ${endDayTime}`)
		.groupBy("ip")
		.groupField("count(*) as countTotal").count();
		let p5 = dbJQL.collection("xxm-activity-coin")
		.where(`createTime>=${startTime} && createTime <= ${endTime}`)
		.count()
		let p6 = dbJQL.collection("xxm-bizhi-piclist")
		.where(`createTime>=${startTime} && createTime <= ${endTime}`)
		.count()
		
		let [{total:downloadCount=0},{total:scoreCount=0},{total:usageCount=0},
		{total:userCount=0},{total:coinCount=0},{total:uploadCount=0}] 
		= await Promise.all([p1,p2,p3,p4,p5,p6])
		
		let item = {downloadCount,scoreCount,
		userCount,usageCount,coinCount,uploadCount}
		
		let {data:oneday} = await dbJQL.collection("xxm-data-overview")
		.where(`day == "${startDay}"`).get({getOne:true});
		
		if(!oneday) return await dbJQL.collection("xxm-data-overview").add({
					 day:startDay,
					 record:[{...item,time:startHour+"~"+endHour}],
					 ...item
		})
		
		let result = await dbJQL.collection("xxm-data-overview").where(`day == "${startDay}"`)
		.update({
			 record:[...oneday.record,{...item,time:startHour+"~"+endHour}],
			 downloadCount:oneday.downloadCount + item.downloadCount,
			 scoreCount:oneday.scoreCount + item.scoreCount,
			 userCount:item.userCount,
			 usageCount:oneday.usageCount + item.usageCount,
			 coinCount:oneday.coinCount + item.coinCount,
			 uploadCount:oneday.uploadCount + item.uploadCount
		})
		console.log(result);
		return result
	}
	
}
