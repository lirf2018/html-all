<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="coupon">
				<div class="coupon-list" v-for="(item, index) in couponList" :key="item.couponId">
					<div class="coupon-content">
						<div class="coupon-img"><img :src="item.couponImg" /></div>
						<div class="coupon-title">
							<span>{{ item.couponName }}</span>
							<span>{{ item.couponBegin }}-{{ item.couponEnd }}</span>
						</div>
					</div>
					<div class="coupon-use">
						<span>点击使用</span>
						<span>{{ item.couponGet }}领取</span>
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
				testId: 0
			};
		},
		created() {},
		methods: {
			onLoad() {
				// 异步更新数据
				// setTimeout 仅做示例，真实场景中一般为 ajax 请求
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						this.testId = this.testId + 1;
						var obj = {
							couponId: this.testId,
							couponName: this.testId + '莎莎SUISSE 产品满700立减250优惠券优惠券',
							couponImg: 'https://img.yzcdn.cn/vant/apple-2.jpg',
							couponGet: 563253,
							couponBegin: '2020.01.01',
							couponEnd: '2020.02.02'
						};
						this.couponList.push(obj);
					}

					// 加载状态结束
					this.loading = false;

					// 数据全部加载完成
					if (this.couponList.length >= 40) {
						this.finished = true;
					}
				}, 1000);
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
