<template>
	<div>
		<div class="title"><span>页面样例展示</span></div>
		<div style="height: 50px;"></div>
		<div class="contents">
			<div v-for="(item, index) in list" :key="index">
				<div class="c-title">{{ item.name }}-样例</div>
				<div class="c-contents">
					<div v-for="(l, index) in item.eg"><van-cell :title="l.name" is-link :to="l.link" /></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	mounted() {
		var main = {
			name: 'Main页',
			eg: [
				{
					name: 'Main页',
					link: '/main'
				}
			]
		};

		var center = {
			name: '用户中心页',
			eg: [
				{
					name: '用户中心',
					link: '/center'
				}
			]
		};

		var userAddr = {
			name: '用户收货地址页',
			eg: [
				{
					name: '收货地址',
					link: '/userAddr'
				},
				{
					name: '添加收货地址',
					link: '/addUserAddr'
				}
			]
		};

		var goodsList = {
			name: '商品列表页',
			eg: [
				{
					name: '商品列表1',
					link: '/allGoodsList'
				},
				{
					name: '搜索分类商品列表2',
					link: '/searchGoods'
				}
			]
		};

		var goodsClassify = {
			name: '商品分类页',
			eg: [
				{
					name: '搜索',
					link: '/search'
				},
				{
					name: '分类',
					link: '/classify'
				},
				{
					name: '全部分类搜索',
					link: '/classifyGoods2'
				},
				{
					name: '（单品）左边为分类（按分类加载）',
					link: '/classifySingleGoods'
				},
				{
					name: '（（单品）左边为分类（按全部加载）',
					link: '/classifySingleGoods1'
				}
			]
		};

		var goodsDetail = {
			name: '商品详情页',
			eg: [
				{
					name: '单品详情',
					link: '/goodsSingle'
				},
				{
					name: 'sku商品详情',
					link: '/goodsSku'
				}
			]
		};
		var shopCart = {
			name: '购物车页',
			eg: [
				{
					name: '购物车',
					link: '/shopCart'
				}
			]
		};

		var order = {
			name: '订单页',
			eg: [
				{
					name: '订单列表',
					link: '/orderList'
				},
				{
					name: '订单详情',
					link: '/orderDetail'
				},
				{
					name: '提交订单',
					link: '/orderSubmit'
				},
				{
					name: '提交订单2',
					link: '/orderSubmit2'
				}
			]
		};

		var account = {
			name: '账户体系页',
			eg: [
				{
					name: '绑定列表',
					link: '/bangList'
				},
				{
					name: '账户密码登录',
					link: '/accountLogin'
				},
				{
					name: '手机登录',
					link: '/phoneLogin'
				},
				{
					name: '重置密码',
					link: '/resetPasswd'
				},
				{
					name: '设置密码',
					link: '/setPasswd'
				},
				{
					name: '更新密码',
					link: '/updatePasswd'
				},
				{
					name: '绑定手机',
					link: '/bangPhone'
				},
				{
					name: '修改绑定手机',
					link: '/changeBangPhone'
				}
			]
		};

		var message = {
			name: '系统消息',
			eg: [
				{
					name: '消息列表',
					link: '/message'
				}
			]
		};

		var suggest = {
			name: '建议反馈',
			eg: [
				{
					name: '建议反馈列表',
					link: '/mySuggest'
				},
				{
					name: '建议反馈详情',
					link: '/suggestDetail'
				},
				{
					name: '新增建议反馈',
					link: '/addSuggest'
				}
			]
		};

		var jf = {
			name: '积分',
			eg: [
				{
					name: '积分',
					link: '/myJifen'
				}
			]
		};

		var activity = {
			name: '活动',
			eg: [
				{
					name: '活动列表',
					link: '/activityList'
				},
				{
					name: '活动详情',
					link: '/activityDetail'
				}
			]
		};

		var coupon = {
			name: '优惠券',
			eg: [
				{
					name: '优惠券表',
					link: '/couponList'
				},
				{
					name: '优惠券详情',
					link: '/couponDetail'
				},
				{
					name: '我的优惠券列表',
					link: '/myCouponList'
				},
				{
					name: '我的优惠券详情',
					link: '/myCouponDetail'
				}
			]
		};

		this.list.push(main);
		this.list.push(center);
		this.list.push(userAddr);
		this.list.push(goodsList);
		this.list.push(goodsClassify);
		this.list.push(goodsDetail);
		this.list.push(shopCart);
		this.list.push(order);

		this.list.push(account);
		this.list.push(message);
		this.list.push(suggest);
		this.list.push(jf); //
		this.list.push(activity);
		this.list.push(coupon);
	}
};
</script>

<style scoped>
body {
	border: none;
}
.title {
	text-align: center;
	background-color: #9ea7b4;
	border: 1px solid #9ea7b4;
	height: 50px;
	line-height: 50px;
	font-size: 2rem;
	font-weight: bold;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 99999999999999;
}

.contents {
	padding: 10px 10px;
	font-size: 0.8rem;
	font-weight: bold;
}

.contents > div {
	border: 1px solid grey;
	margin-bottom: 10px;
}
.contents > div > div:first-child {
	border-bottom: 1px solid #c3cbd6;
	margin: 0 5px;
	padding: 10px 10px;
	font-size: 1rem;
}
.contents > div > div:last-child {
	font-size: 0.6rem;
	font-weight: normal;
}
</style>
