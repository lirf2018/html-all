<template>
	<div>
		<div><Head :title="title" /></div>
		<div class="coupon">
			
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '优惠券列表'
		};
	},
	created(){
	}
};
</script>

<style>
	
	
</style>
