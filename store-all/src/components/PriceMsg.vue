<template>
	<div>
		<div class="advice2">
			价格说明：如果商品出现2个价格，第一个为销售价格，第二个带删除线的为商品原价格
			<span>商品总价 = 商品原价 x 数量</span>
			<span>优惠总价 = 商品总价 - 商品销售价总价 - 其它优惠价格</span>
			<span>押金总价 = 商品押金 x 数量 - 其它优惠价格</span>
			<span>订单总价 = 商品总价 + 押金总价 + 邮费/配送费/自取费</span>
			<OrderSaleNotice />
		</div>
	</div>
</template>

<script>
	import OrderSaleNotice from '@/components/OrderSaleNotice.vue';
	export default {
		components: {
			OrderSaleNotice:OrderSaleNotice
		}
	}
</script>

<style scoped>
	
	.advice2 {
		color: #9ea7b4;
		font-size: 12px;
		text-align: left;
		padding: 10px 10px 0 10px;
		margin-bottom: 30px;
		font-weight: normal;
	}
	.advice2>span{
		display: block;
	}
	
</style>
