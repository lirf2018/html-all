import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({

	state: {
		// 存储token
		Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
		phone:''
	},

	mutations: {
		// 修改token，并将token存入localStorage
		userLogin(state, user) {
			state.Authorization = user.Authorization;
			localStorage.setItem('Authorization', user.Authorization);
			state.phone = user.phone;
			localStorage.setItem('phone', user.phone);
		},
		userLoginOut(state) {
			localStorage.removeItem('Authorization');
			state.Authorization = null
			localStorage.removeItem('phone');
			state.phone = null
		}
	}
});

export default store;
