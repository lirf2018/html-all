<template>
	<div class="boot">
		<div style="height: 51px; width: 100%;clear: both;"></div>
		<van-tabbar v-model="tbActive" active-color="#008000">
			<van-tabbar-item icon="wap-home-o">首页</van-tabbar-item>
			<van-tabbar-item icon="apps-o">分类</van-tabbar-item>
			<van-tabbar-item icon="shopping-cart-o" badge="3">购物车</van-tabbar-item>
			<van-tabbar-item icon="user-circle-o">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
export default {
	props: ['tbActive']
};
</script>

<style>
.van-info {
	background-color: #008000 !important;
}
</style>
