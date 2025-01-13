// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
// 获取 `class` 集合的引用
const ds_classify = db.collection('dreamscape-classify');


module.exports = {
	_before: function () { // 通用预处理器
		
	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	
	getClassList: async function(pageNum=1, pageSize=10) {
		// 参数校验，如无参数则不需要 
		try {
			// 计算偏移量
			const skip = (pageNum - 1) * pageSize;
			
			// 业务逻辑，进行分页查询
			let res = await ds_classify.skip(skip).limit(pageSize).get();
			
			// 返回结果
			return {
				errCode: 0,
				errMsg: '查询成功',
				data: res.data
			};
		} catch (e) {
			return {
				errCode: -1,
				errMsg: '查询失败:' + e.message
			};
		}
	},
	
	addClassList: async function() {
		try{
			let res = ds_classify.add(value);
			
			// 返回结果
			return {
				errCode: 0,
				errMsg: '新增成功',
				data: res.data
			};
		} catch (e) {
			return {
				errCode: -1,
				errMsg: '新增失败:' + e.message
			};
		}
	},
	
	// editClassList: async function() {
	// 	try{
	// 		let res = ds_classify.doc(???).update(value);
			
	// 		// 返回结果
	// 		return {
	// 			errCode: 0,
	// 			errMsg: '修改成功',
	// 			data: res.data
	// 		};
	// 	} catch (e) {
	// 		return {
	// 			errCode: -1,
	// 			errMsg: '修改失败:' + e.message
	// 		};
	// 	}
	// }
	
}


