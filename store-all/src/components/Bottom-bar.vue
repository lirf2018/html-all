<template>
	<div class="boot">
		<div style="height: 51px; width: 100%;clear: both;"></div>
		<van-tabbar v-model="tbActive" active-color="#008000">
			<van-tabbar-item icon="wap-home-o" to="/main">首页</van-tabbar-item>
			<van-tabbar-item icon="apps-o" to="/classifySingleGoods1">分类</van-tabbar-item>
			<van-tabbar-item icon="shopping-cart-o" badge="3" to="/shopCart">购物车</van-tabbar-item>
			<van-tabbar-item icon="user-circle-o" to="/center">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	export default {
		props: ['tbActive'],
		methods: {
			toPageUrl(url) {
				if (url == null || url == '') {
					return
				}
				this.$router.push(url);
			}
		}
	};
</script>

<style>
	.van-info {
		background-color: #008000 !important;
	}
</style>
