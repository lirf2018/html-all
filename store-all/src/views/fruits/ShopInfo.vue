<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="activity-contnets" v-if="null != shop">
			<div class="div-c" v-html="introduce" ref="divImg"></div>
			<div>
				<div class="shopAddr" v-if="shop.address != null && shop.address != ''">
					<div>店铺地址：</div>
					<div><span>{{shop.address}}</span></div>
				</div>
				<div class="toway" v-if="shop.toway != null && shop.toway != ''">
					<div>到达方式：</div>
					<div><span>{{shop.toway}}</span></div>
				</div>
				<div class="img-div">
					<div v-for="(item,index) in imgList" :key="index"><img :src="item.imgUrl"/></div>
				</div>
			</div>
		</div>
		<div style="height: 10px;"></div>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head
		},
		data() {
			return {
				title: '店铺介绍',
				shop: null,
				introduce: '',
				imgList:[]
			};
		},
		created() {},
		mounted: function() {
			this.$nextTick(function() {
				this.findInfoDetail();
			});
		},
		methods: {
			findInfoDetail() {
				let vm = this;
				let {
					shopId
				} = this.$route.query;
				let params = {
					req_type: 'find_shop_info',
					data: {
						shopId: shopId
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.shop = res.data.shop;
						vm.imgList = res.data.imgList;
						vm.introduce = vm.shop.introduce;
					} else {
						Toast(res.resp_desc);
					}
				});
			}
		}
	};
</script>

<style scoped>
	.body-bg {
		background-color: #F8F8F8;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.activity-contnets {
		margin: 10px 10px;
		background-color: #ffffff;
		border-radius: 10px;
	}

	.activity-contnets>div {
		padding: 10px 10px;
	}

	.div-c>>>img {
		max-width: 100%;
		height: auto;
	}

	.shopAddr>div:nth-child(1),
	.toway>div:nth-child(1) {
		font-size: 14px;
		font-weight: 900;
	}

	.shopAddr>div:nth-child(2),
	.toway>div:nth-child(2) {
		color: gray;
		font-size: 12px;
	}
	.toway{
		margin-bottom: 15px;
	}
	
	.img-div img{
		width: 100%;
		/* display: block; */
	}
</style>
