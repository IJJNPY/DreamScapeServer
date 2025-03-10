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

function sortArrById(arr1, arr2) {
    const sortedArr = [];
    for (const id of arr2) {
        for (const item of arr1) {
            if (item._id === id) {
                sortedArr.push(item);
                break;  // 找到对应元素后就跳出内层循环，继续处理下一个arr2中的id
            }
        }
    }
    return sortedArr;
}



const dayjs = require("dayjs");
const db = uniCloud.database();
const dbCmd = db.command;
const utils = require("custom-utils");
module.exports = {
	_before: function () { // 通用预处理器
		// utils.useRecord(this)
	},
	async list({pageSize=5,pageNum=1}={}){
		let today = dayjs().format('YYYY-MM-DD')
		pageSize = Math.min(20,pageSize);
		let skip = (pageNum - 1) * pageSize
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
		let dayTemp = dbJQL.collection("wallpaper-activity-everyday")
		.where(`checked == true && day <= "${today}"`)
		.orderBy("day desc")
		.skip(skip).limit(pageSize).getTemp();
		let picTemp = dbJQL.collection("wallpaper-piclist").field("_id,picurl").getTemp();		
		let p1 = dbJQL.collection(dayTemp,picTemp).get({getCount:true});
		
		let p2 = dbJQL.collection("wallpaper-activity-everyday")
		.where(`checked == true && day <= "${today}"`)
		.orderBy("day desc")
		.skip(skip).limit(pageSize).get()
		
		let [result,lists] = await Promise.all([p1,p2])	
				
		let data = sortPicListByArr2(result.data,lists.data);
		data.forEach(item=>{
			let find =  lists.data.find(i=>i._id==item._id);
			item.size=find.picList.length
		})		
		return {...result,data}		
	},
	async item(id=""){
		let wre = {}
		id ? wre._id = id : wre.day = dayjs().format('YYYY-MM-DD');
		db.collection("wallpaper-activity-everyday").where(wre).update({
			view_count:dbCmd.inc(1)
		})
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		//获取每日推荐满足条件的一条数据
		let detail  = await dbJQL.collection("wallpaper-activity-everyday")
		.where(wre).orderBy("createTime desc").limit(1).get({getOne:true})
		if(!detail.data){
			detail = await dbJQL.collection("wallpaper-activity-everyday").orderBy("createTime desc").limit(1).get({getOne:true})
		}		
		
		//壁纸主表，user和classify是副表，为了获取用户昵称和分类名称
		let picTemp = dbJQL.collection("wallpaper-piclist")
		.where(`_id in ${JSON.stringify(detail.data.picList)}`).getTemp();
		let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp()
		let clssTemp = dbJQL.collection("wallpaper-classify").field("_id,name").getTemp()
		//联表查询，过滤字段
		let picRes = await dbJQL.collection(picTemp,userTemp,clssTemp)
		.field(`
		_id,
		checked,
		classid.name as classname,
		classid._id as classid,
		description,
		picurl,
		score,
		tabs,
		user_id.nickname as nickname,
		view_count
		`)
		.get();
		
			
		//单独遍历修改字段值
		picRes.data = picRes.data.map(item=>({...item,classname:item.classname[0],
		classid:item.classid[0],
		nickname:item.nickname[0]}))
		
		//默认查询会按照日期顺序排序，需要自己写方法按照everyday表中的picList顺序输出
		let sort =  sortArrById(picRes.data,detail.data.picList)
		
		//为detai每日数据赋值
		detail.data.picList = sort
		
		//输入
		return detail
		
	}	
}
