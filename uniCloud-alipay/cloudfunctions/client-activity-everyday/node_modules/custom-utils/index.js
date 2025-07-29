const uniID = require('uni-id-common')
module.exports = {
	httpsToCloud : (str) => {
	  return str.replace("https://", "cloud://")
	    .replace(/\.normal\.cloudstatic\.cn/, '');
	},
	uuid:()=>{
		return Math.random();
	},
	async useRecord(that){
		let clientInfo  = that.getClientInfo()
		let {clientIP,uniPlatform} = clientInfo
		const methodName = that.getMethodName()
		const params = that.getParams()
		const {functionName} = that.getCloudInfo()
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo
		})
		dbJQL.collection("xxm-data-usage").add({
			ip:clientIP,
			uniPlatform,
			methodName,
			params:JSON.stringify(params),
			functionName
		})		
	}
}
