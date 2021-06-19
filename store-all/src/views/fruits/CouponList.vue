<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="coupon">
				<div class="coupon-list" v-for="(item, index) in couponList" :key="index">
					<div class="coupon-content">
						<div class="coupon-img"><img :src="item.coupon_img" /></div>
						<div class="coupon-title">
							<span>{{ item.coupon_name }}</span>
							<span>{{ item.start_time }}-{{ item.end_time }}</span>
						</div>
					</div>
					<!-- <div @click="toPage(1,item.coupon_id)" class="coupon-use"
						v-if="item.appoint_type ==2 && item.now_use_date == 0 ">
						<span>点击领取</span>
						<span>{{ item.count_get }}领取</span>
					</div>
					<div @click="toPage(0,item.coupon_id)" class="coupon-use" v-else>
						<span>点击使用</span>
						<span>{{ item.count_get }}领取</span>
					</div> -->
					<div @click="toPage(0,item.coupon_id)" class="coupon-use">
						<span>点击查看</span>
						<span>{{ item.count_get }}领取</span>
					</div>
				</div>
			</div>
		</van-list>
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
				title: '优惠券列表',
				couponList: [],
				loading: false,
				finished: false,
				refreshing: false,
				testGoodsId: 0,
				currePage: 1,
				hasNext: false
			};
		},
		created() {},
		methods: {
			onLoad() {
				let vm = this;
				let {
					catogeryId,
					goodsName
				} = vm.$route.query;
				let params = {
					req_type: 'query_coupon_list',
					data: {
						currePage: vm.currePage,
						userId: 0
					}
				}; // 参数
				this.loading = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							let list = res.data.list;
							let hasNext = res.data.hasNext;
							vm.initdata(list, hasNext);
							vm.currePage = vm.currePage + 1;
						} else {
							Toast(res.resp_desc);
						}
					}).catch(err => {
						// this.error = true;
					})
					.finally(() => {
						this.loading = false;
					});
			},
			initdata(list, hasNext) {
				let vm = this;
				for (let i = 0; i < list.length; i++) {
					this.couponList.push(list[i]);
				}
				this.loading = false;
				if (hasNext == false) {
					this.finished = true;
				}
			},
			onRefresh() {
				// 清空列表数据
				this.finished = false;

				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.loading = true;
				this.onLoad();
			},
			toPage(type, couponId) {
				if (type == 1) {
					// 点击领取
					this.$router.push('allGoodsList');
				} else {
					// 详情
					this.$router.push('couponDetail?couponId=' + couponId);
				}
			}
		}
	};
</script>

<style scoped>
	.body-bg {
		border: none;
		line-height: 20px;
		margin: 0;
		padding: 0;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.coupon {
		background-color: #ffffff;
		padding: 10px 10px;
		padding-bottom: 0px;
		overflow: hidden;
		font-size: 14px;
		color: #464c5b;
	}

	.coupon>.coupon-list:not(:last-child) {
		margin-bottom: 20px;
	}

	.coupon-list {
		height: 5rem;
		border-radius: 8px;
		display: flex;
		position: relative;
	}

	.coupon-content {
		display: flex;
		overflow: hidden;
		position: relative;
		margin-right: 5rem;
		border: 1px solid #c3cbd6;
		border-radius: 5px 10px 10px 5px;
		border-right: 1px dashed #e1e1e1;
		width: 100%;
	}

	.coupon-img,
	.coupon-use {
		height: 5rem;
		width: 5rem;
	}

	.coupon-img img {
		height: 5rem;
		width: 4.5rem;
		display: block;
		border: none;
	}

	.coupon-title>span {
		display: block;
		color: #464c5b;
		font-weight: bold;
		padding: 5px 5px 0 5px;
		font-size: 12px;
		line-height: 17px;
	}

	.coupon-title>span:last-child {
		position: absolute;
		bottom: 2px;
		font-size: 12px;
		color: #657180;
		font-weight: normal;
	}

	.coupon-use {
		border: 1px solid #c3cbd6;
		right: 0px;
		background-color: #f0f0f0;
		text-align: center;
		position: absolute;
		margin: 0 auto;
		height: 4.8rem;
		border-radius: 10px 8px 8px 10px;
		border-left: 1px dashed #e1e1e1;
	}

	.coupon-use>span {
		display: block;
		font-size: 12px;
		text-align: center;
	}

	.coupon-use>span:first-child {
		color: #ffffff;
		background-color: #008000;
		margin: 0 5px;
		margin-top: 10px;
		border-radius: 10px;
		font-size: 12px;
		padding: 3px 5px;
	}

	.coupon-use>span:last-child {
		margin-top: .5rem;
	}
</style>
