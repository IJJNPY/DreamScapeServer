export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
		getSysConfig ({commit}) {
			const db = uniCloud.database()
			return db
				.collection('xxm-system-config')
				.orderBy("_id asc")
				.limit(1)
				.field('brand,logo')
				.get()
				.then(({result}) => {
					const [config] = result.data
					commit("app/SET_APP_NAME",config.brand,{root:true})
					commit("app/SET_APP_LOGO",config.logo,{root:true})
				})
		}
	}
}
