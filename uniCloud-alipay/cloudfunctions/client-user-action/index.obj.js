const db = uniCloud.database();
const dbCmd = db.command;
const dayjs = require("dayjs");
const utils = require("custom-utils");
module.exports = {
	_before: function () { // 通用预处理器
		utils.useRecord(this)
	},
	async writeDownload({picid="",classid=""}={}){
		if(!picid) return {errCode:400,errMsg:"picid必填"};
		if(!classid) return {errCode:400,errMsg:"classid必填"};
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		db.collection("xxm-bizhi-piclist").doc(picid).update({download_count:dbCmd.inc(1)})
		let {total} = await dbJQL.collection("xxm-bizhi-download")
		.where(`picid == "${picid}" && user_id == $cloudEnv_uid`)
		.count()
		if(total) return await dbJQL.collection("xxm-bizhi-download").where(`picid == "${picid}" && user_id == $cloudEnv_uid`).update({createTime:Date.now()})		
		return await dbJQL.collection("xxm-bizhi-download").add({
			picid,
			classid
		})
	},
	//用户评分操作
	async setupScore({picid="",classid="",userScore=""}={}){
		if(!picid) return {errCode:400,errMsg:"picid必填"};
		if(!classid) return {errCode:400,errMsg:"classid必填"};
		if(!userScore) return {errCode:400,errMsg:"评分必填"};
		if(!(!isNaN(userScore) && !isNaN(parseFloat(userScore)))) return {errCode:400,errMsg:"评分类型错误，需要Number类型"}
		userScore = Number( Math.min(5,userScore) )
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let {data:{score}={}} = await dbJQL.collection("xxm-bizhi-piclist").doc(picid)
		.field("_id,score")
		.get({getOne:true})
		if(!score) return {errCode:400,errMsg:"操作有误"};
		score = Number(score);
		
		//判断评分数据库中当前用户是否已经平分
		let {total} = await dbJQL.collection("xxm-bizhi-score")
		.where(`picid == "${picid}" && user_id == $cloudEnv_uid`)
		.count()
		if(total) return {errCode:400,errMsg:"已评分过，不可重复评分"}
		
		//计算评分规则
		let updateScore = (score + (userScore - score)/10).toFixed(4)		
		db.collection("xxm-bizhi-piclist").doc(picid).update({score_count:dbCmd.inc(1),score:updateScore})
		return await dbJQL.collection("xxm-bizhi-score").add({
			picid,
			classid,
			userScore:userScore+""
		})
	},
	
	async userScore(picid=""){
		if(!picid) return {errCode:400,errMsg:"picid必填"};
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data:{userScore=""}={}} = await dbJQL.collection("xxm-bizhi-score").where(`picid == "${picid}" && user_id == $cloudEnv_uid`).field("_id,userScore").orderBy("createTime desc").get({getOne:true});
		return userScore;	
	},
	
	async userHistoryCount(){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let p1 = dbJQL.collection("xxm-bizhi-download").where(`user_id == $cloudEnv_uid`).count();
		let p2 = dbJQL.collection("xxm-bizhi-score").where(`user_id == $cloudEnv_uid`).count();
		
		let [{total:downloadSize=0}={},{total:scoreSize=0}={}] = await Promise.all([p1,p2]);
		return {downloadSize,scoreSize};		
	},
	
	async userHistoryList ({pageSize=9,pageNum=1,type=""}={}){
		if(!type) return {errCode:400,errMsg:"type必填"};
		pageSize = Math.min(pageSize,20);
		let skip = (pageNum - 1)*pageSize;	
		let tablename = (type=='download') ? 'xxm-bizhi-download' : 
		(type=='score') ?'xxm-bizhi-score' : "";
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let tableTemp = dbJQL.collection(tablename).where(`user_id == $cloudEnv_uid`)
		.orderBy("createTime desc").skip(skip).limit(pageSize).getTemp();
		let classTemp = dbJQL.collection("xxm-bizhi-classify").field("_id,name").getTemp();
		let picTemp = dbJQL.collection("xxm-bizhi-piclist").field(`
			_id,
			checked,
			classid,
			description,
			picurl,
			score,
			tabs,
			user_id,
			view_count
		`).getTemp();
			
				
		let res = await dbJQL.collection(tableTemp,picTemp,classTemp)
		.field(`
			userScore,
			classid._id as classid,
			classid.name as classname,
			picid._id as _id,
			picid.description as description,
			picid.picurl as picurl,
			picid.score as score,
			picid.tabs as tabs,
			picid.user_id as user_id,
			picid.view_count as view_count			
		`)
		.get();
		
		let data = res.data.map(item=>({...item,
			classname:item.classname[0],
			classid:item.classid[0],
			_id:item._id[0],
			description:item.description[0],
			picurl:item.picurl[0],
			score:item.score[0],
			tabs:item.tabs[0],
			user_id:item.user_id[0],
			view_count:item.view_count[0]
		}))
		
		let user_id_arr = data.map(item=>item.user_id);
		
		let {data:authData=[]} = await dbJQL.collection("uni-id-users")
		.where(`_id in ${JSON.stringify(user_id_arr)}`)
		.field("_id,nickname")
		.get();
		
		data = data.map(item=>{
			let find = authData.find(find=>find._id == item.user_id);
			return {
				...item,
				nickname:find.nickname
			}
		})
				
		return {...res,data};
	},
	
	//每日获取硬币
	async giveDayCoin(){
		let start = dayjs().startOf("day").valueOf()
		let end = dayjs().endOf("day").valueOf()
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data=null} = await dbJQL.collection("xxm-activity-coin").
		where(`user_id == $cloudEnv_uid && createTime >= ${start} && createTime <= ${end}`).limit(1).get({getOne:true});		
		if(data && data.dayGet) return {errCode:400,errMsg:"已经领取硬币，不可重复获取"}
		let {data:config={}} = await dbJQL.collection("xxm-system-config").limit(1).field("dayCoin").get({getOne:true})
		let recordItem= {time:Date.now(),score:config.dayCoin,desc:"每日领币"}
		if(data){
			let params = {
				dayGet:true,
				total:data.total +config.dayCoin,
				record:[...data.record,recordItem]
			}
			return await dbJQL.collection("xxm-activity-coin")
			.where(`user_id == $cloudEnv_uid && createTime >= ${start} && createTime <= ${end}`).update(params)
		}
		
		return await dbJQL.collection("xxm-activity-coin").add({
			total:config.dayCoin,
			dayGet:true,
			record:[recordItem]
		})
	},
	
	//看广告获取硬币
	async giveAdCoin(){
		let start = dayjs().startOf("day").valueOf()
		let end = dayjs().endOf("day").valueOf()
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let p1 = dbJQL.collection("xxm-activity-coin").
		where(`user_id == $cloudEnv_uid && createTime >= ${start} && createTime <= ${end}`).limit(1).get({getOne:true});
		
		let p2 = dbJQL.collection("xxm-system-config").limit(1)
		.field("adCoin").get({getOne:true})
		
		let [{data:coin=null},{data:config=null}] = await Promise.all([p1,p2]);
		let recordItem= {time:Date.now(),score:config.adCoin,desc:"看广告获取硬币"}
		if(coin){
			//更新
			let params = {
				total:coin.total +config.adCoin,
				record:[...coin.record,recordItem]
			}
			return await dbJQL.collection("xxm-activity-coin")
			.where(`user_id == $cloudEnv_uid && createTime >= ${start} && createTime <= ${end}`).update(params);			
		}else{
			//新增
			return await dbJQL.collection("xxm-activity-coin").add({
				total:config.adCoin,				
				record:[recordItem]
			})
		}
		
		
	},
	
	async getCoinCount(){
		let start = dayjs().startOf("day").valueOf()
		let end = dayjs().endOf("day").valueOf()
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data:{total=0}={}} = await dbJQL.collection("xxm-activity-coin").
		where(`user_id == $cloudEnv_uid && createTime >= ${start} && createTime <= ${end}`).limit(1).field("total").get({getOne:true});
		return total;
	},
	
	//扣除硬币
	async minusCoin(){
		let start = dayjs().startOf("day").valueOf()
		let end = dayjs().endOf("day").valueOf()
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let p1 = dbJQL.collection("xxm-activity-coin").
		where(`user_id == $cloudEnv_uid && createTime >= ${start} && createTime <= ${end}`).limit(1).get({getOne:true});
		
		let p2 = dbJQL.collection("xxm-system-config").limit(1)
		.field("dayCoin").get({getOne:true});
		
		let [{data:coin=null},{data:config=null}]  = await Promise.all([p1,p2]);
		if(!coin) return {errCode:400,errMsg:"没有硬币啦"}
		let recordItem= {time:Date.now(),score:-config.dayCoin,desc:"下载扣除硬币"}
		let params = {
			total:coin.total - config.dayCoin,
			record:[...coin.record,recordItem]
		}
		return await dbJQL.collection("xxm-activity-coin").
		where(`user_id == $cloudEnv_uid && createTime >= ${start} && createTime <= ${end}`)
		.update(params)
	}
	
	
	
	
}
