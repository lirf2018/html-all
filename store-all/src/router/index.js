import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

import AllGoodsList from '@/views/fruits/AllGoodsList.vue';
import SearchGoods from '@/views/fruits/SearchGoods.vue';
import AddSuggest from '@/views/fruits/AddSuggest.vue';
import SuggestDetail from '@/views/fruits/SuggestDetail.vue';
import InfoList from '@/views/fruits/InfoList.vue'
import InfoDetail from '@/views/fruits/InfoDetail.vue'
import Center from '@/views/fruits/Center.vue';
import ClassifySingleGoods1 from '@/views/fruits/ClassifySingleGoods1.vue'; //左边为菜单，右边商品列表（滚动）
import ClassifyGoods2 from '@/views/fruits/ClassifyGoods2.vue';
import ClassifySingleGoods from '@/views/fruits/ClassifySingleGoods.vue'; //左边为菜单，右边商品列表（不滚动）
import GoodsSingle from '@/views/fruits/GoodsSingle.vue'
import GoodsSku from '@/views/fruits/GoodsSku.vue'
import CouponList from '@/views/fruits/CouponList.vue';
import CouponDetail from '@/views/fruits/CouponDetail.vue';
import MyCouponList from '@/views/fruits/MyCouponList.vue';
import MyCouponDetail from '@/views/fruits/MyCouponDetail.vue';
import Main from '@/views/fruits/Main.vue';
import MyJifen from '@/views/fruits/MyJifen.vue';
import Message from '@/views/fruits/Message.vue';
import MySuggest from '@/views/fruits/MySuggest.vue';
import OrderList from '@/views/fruits/OrderList.vue';
import OrderDetail from '@/views/fruits/OrderDetail.vue';
import Search from '@/views/fruits/Search.vue';
import ShopCart from '@/views/fruits/ShopCart.vue';
import Classify from '@/views/fruits/Classify.vue';
import AccountLogin from '@/views/fruits/AccountLogin.vue';
import PhoneLogin from '@/views/fruits/PhoneLogin.vue';
import ResetPasswd from '@/views/fruits/ResetPasswd.vue';
import SetPasswd from '@/views/fruits/SetPasswd.vue';
import UpdatePasswd from '@/views/fruits/UpdatePasswd.vue';
import BangPhone from '@/views/fruits/BangPhone.vue';
import ChangeBangPhone from '@/views/fruits/ChangeBangPhone.vue';
import BangList from '@/views/fruits/BangList.vue';
import OrderSubmit from '@/views/fruits/OrderSubmit.vue';
import OrderSubmit2 from '@/views/fruits/OrderSubmit2.vue';

import UserAddr from '@/views/fruits/UserAddr.vue';
import AddUserAddr from '@/views/fruits/AddUserAddr.vue';



import ShowMain from '@/views/ShowMain.vue';

export const pageLink = [
	{
		path: "/",
		component: Main
	},
	{
		path: "/main",
		component: Main
	},
	{
		path: "/allGoodsList",
		component: AllGoodsList
	},
	{
		path: "/addSuggest",
		component: AddSuggest
	},
	{
		path: "/infoList",
		component: InfoList
	},
	{
		path: "/infoDetail",
		component: InfoDetail
	},
	{
		path: "/center",
		component: Center
	},
	{
		path: "/classifySingleGoods1",
		component: ClassifySingleGoods1
	},
	{
		path: "/classifyGoods2",
		component: ClassifyGoods2
	},
	{
		path: "/classifySingleGoods",
		component: ClassifySingleGoods
	},
	{
		path: "/classify",
		component: Classify
	},
	{
		path: "/goodsSingle",
		component: GoodsSingle
	},
	{
		path: "/goodsSku",
		component: GoodsSku
	},
	{
		path: "/couponList",
		component: CouponList
	},
	{
		path: "/couponDetail",
		component: CouponDetail
	},
	{
		path: "/myCouponList",
		component: MyCouponList
	},
	{
		path: "/myCouponDetail",
		component: MyCouponDetail
	},
	{
		path: "/myJifen",
		component: MyJifen
	},
	{
		path: "/message",
		component: Message
	},
	{
		path: "/mySuggest",
		component: MySuggest
	},
	{
		path: "/orderList",
		component: OrderList
	},
	{
		path: "/orderDetail",
		component: OrderDetail
	},
	{
		path: "/search",
		component: Search
	},
	{
		path: "/searchGoods",
		component: SearchGoods
	},
	{
		path: "/shopCart",
		component: ShopCart
	},
	{
		path: "/accountLogin",
		component: AccountLogin
	},
	{
		path: "/phoneLogin",
		component: PhoneLogin
	},
	{
		path: "/resetPasswd",
		component: ResetPasswd
	},
	{
		path: "/setPasswd",
		component: SetPasswd
	},
	{
		path: "/suggestDetail",
		component: SuggestDetail
	},
	{
		path: "/updatePasswd",
		component: UpdatePasswd
	},
	{
		path: "/bangPhone",
		component: BangPhone
	},
	{
		path: "/changeBangPhone",
		component: ChangeBangPhone
	},
	{
		path: "/bangList",
		component: BangList
	},
	{
		path: "/home",
		component: ShowMain
	},
	{
		path: "/userAddr",
		component: UserAddr
	},
	{
		path: "/addUserAddr",
		component: AddUserAddr
	},
	{
		path:"/orderSubmit",
		component:OrderSubmit
	},{
		path:"/orderSubmit2",
		component:OrderSubmit2
	}
]




//...将一个数组转为用逗号分隔的参数序列,组装成router
export default new Router({
	//mode: 'history',
	routes: [
		...pageLink
	]
})
