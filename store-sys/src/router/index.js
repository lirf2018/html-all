import Vue from 'vue'
import Router from 'vue-router'


import Index from '@/views/Index.vue';
import Main from '@/views/Main.vue';
import Classify from '@/views/Classify.vue';
import Discounts from '@/views/Discounts.vue';
import Exception from '@/views/Exception.vue';
import Goods from '@/views/Goods.vue';
import Goodsrel from '@/views/Goodsrel.vue';
import Order from '@/views/Order.vue';
import Param from '@/views/Param.vue';
import Store from '@/views/Store.vue';
import Supplier from '@/views/Supplier.vue';
import Goodsreport from '@/views/report/GoodsSaleReport.vue';
import Orderreport from '@/views/report/OrderReport.vue';
import Test from '@/views/Test.vue';


Vue.use(Router)
export const pageLink = [{
		path: "/",
		component: Goodsreport
	},{
		path: "/index",
		component: Index
	},{
		path: "/main",
		component: Main
	},{
		path: "/classify",
		component: Classify
	},{
		path: "/discounts",
		component: Discounts
	},{
		path: "/exception",
		component: Exception
	},{
		path: "/goods",
		component: Goods
	},{
		path: "/goodsrel",
		component: Goodsrel
	},{
		path: "/order",
		component: Order
	},{
		path: "/param",
		component: Param
	},{
		path: "/store",
		component: Store
	},{
		path: "/supplier",
		component: Supplier
	},
	{
		path: "/goodsreport",
		component: Goodsreport
	},
	{
		path: "/orderreport",
		component: Orderreport
	}
]

//...将一个数组转为用逗号分隔的参数序列,组装成router
export default new Router({
	//mode: 'history',
	routes: [
		...pageLink
	]
})