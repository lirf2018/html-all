<template>
	<div class="boot">
		<div style="height: 51px; width: 100%;clear: both;"></div>
		<van-tabbar v-model="tbActive" active-color="#008000">
			<van-tabbar-item name='0' icon="wap-home-o" to="/main">首页</van-tabbar-item>
			<van-tabbar-item name='1' icon="apps-o" to="/classifySingleGoods1">分类</van-tabbar-item>
			<van-tabbar-item name='2' icon="shopping-cart-o" :badge="cartCount" to="/shopCart">购物车</van-tabbar-item>
			<van-tabbar-item name='3' icon="user-circle-o" to="/center">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
import axios from '@/network/request.js';

export default {
	props: ['tbActiveParent'],
	data() {
		return {
			cartCount: 0,
			tbActive: 0
		};
	},
	mounted: function() {
		this.$nextTick(function() {
			this.findOrderCartCount();
			this.tbActive = this.tbActiveParent
		});
	},
	methods: {
		findOrderCartCount() {
			let vm = this;
			let params = {
				req_type: 'find_order_cart_count',
				data: { userId: 0 }
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.cartCount = res.data.count;
				}
			});
		},
		toPageUrl(url) {
			if (url == null || url == '') {
				return;
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
