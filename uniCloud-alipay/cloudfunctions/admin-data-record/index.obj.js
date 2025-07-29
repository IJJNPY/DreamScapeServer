//用于记录数据的相关信息的云对象
const dayjs = require("dayjs");
module.exports = {
	_before: function () { // 通用预处理器
		console.log( this.getMethodName());
	},
	async recordList({size=5,current=1,classid="",type=""}={}){
		if(!type) return {errCode:400,errMsg:"type必填"};
		size = Math.min(100,size);
		let skip = (current - 1) * size
		let where = {}
		let tablename = (type=='download') ? 'xxm-bizhi-download' : (type=='score') ?'xxm-bizhi-score' : "";
		if(classid) where.classid = classid
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let tableTemp = dbJQL.collection(tablename).where(where)
		.orderBy("createTime desc").skip(skip).limit(size).getTemp();
		let classTemp = dbJQL.collection("xxm-bizhi-classify").field("_id,name").getTemp();
		let picTemp = dbJQL.collection("xxm-bizhi-piclist").field(`
			_id,			
			picurl			
		`).getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
				
		let res = await dbJQL.collection(tableTemp,picTemp,classTemp,userTemp)
		.field(`
			userScore,
			ip,
			user_id.nickname as nickname,
			createTime,
			classid.name as classname,
			picid.picurl as picurl			
		`)
		.get({getCount:true});	
					
		let data = res.data.map(item=>({
			...item,
			classname:item.classname[0],
			nickname:item.nickname[0],
			picurl:item.picurl[0]			
		}))
		return {...res,data};
	},
	
	async coinRecord({size=5,current=1,dataRange=[]}={}){
		
		size = Math.min(100,size);
		let skip = (current - 1) * size;
		let wre = dataRange.length ? 
		`createTime >= ${dayjs(dataRange[0]).startOf("day").valueOf()} && 
		createTime<=${dayjs(dataRange[1]).endOf("day").valueOf()}` 
		: {};
		
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let coinTemp  = dbJQL.collection("xxm-activity-coin").where(wre).orderBy("createTime desc").skip(skip).limit(size).getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
		let res = await dbJQL.collection(coinTemp,userTemp)		
		.field(`
		createTime,
		dayGet,
		total,		
		ip,
		record,
		user_id.nickname as nickname
		`)
		.get({getCount:true})
		let data = res.data.map(item=>{
			return {
				...item,
				nickname:item.nickname[0]
			}
		})
		
		return {...res,data};
		
	},
	
	async usageRecord({size=5,current=1,single=""}={}){
		size = Math.min(100,size);
		let skip = (current - 1) * size;
		let wre = single ? 
		`createTime >= ${dayjs(single).startOf("day").valueOf()} && 
		createTime<=${dayjs(single).endOf("day").valueOf()}` 
		: {};		
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-data-usage").where(wre)
		.groupBy("ip")
		.groupField("count(*) as countTotal")		
		.orderBy("countTotal desc").skip(skip).limit(size).get({getCount:true});
	},
	
	async usageIpList({size=5,current=1,single="",ip=""}={}){
		size = Math.min(100,size);
		let skip = (current - 1) * size;
		let wre = 
		`createTime >= ${dayjs(single).startOf("day").valueOf()} && 
		createTime<=${dayjs(single).endOf("day").valueOf()} && ip == "${ip}"`;		
				
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		return await dbJQL.collection("xxm-data-usage").where(wre).orderBy("createTime desc").skip(skip).limit(size).get();		
	}
	
}
