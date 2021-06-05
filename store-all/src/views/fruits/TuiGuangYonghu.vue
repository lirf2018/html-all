<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<van-popup v-model="show" position="top" :style="{ height: '25%' }">
			<div class="desc">
				<p>累计奖励积分：推广人推广的用户，完成特定规则或者任务后，推广人得到的奖励总和，包括已用的和未用的奖励积分。</p>
			</div>
		</van-popup>
		<div class="my-jf">
			<span>累计奖励积分</span>
			<span>{{jifenCount}}</span>
			<div class="use-jifen" @click="toChangeJiFen">去兑换(可用积分：{{effectiveJifen}})</div>
			<div class="use-jifen-desc" @click="show = true">积分说明</div>
		</div>
		<div v-if="data != null" class="item-list">
			<div v-for="(item,index) in data" :key="index">
				<div class="shop-cart">
					<div>
						<div>
							<van-cell-group>
								<van-cell :title="item.nickName+' ('+item.phone+')'" />
							</van-cell-group>
						</div>
						<div class="cart-count"><span>{{item.inviterJf}}</span></div>
					</div>
				</div>
			</div>
			<div v-if="data == null || data.length==0">
				<div style="text-align: center;padding-top: 20px;color: gray;">------推荐不存在------</div>
			</div>
		</div>
		<EG />
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import Tbar from '@/components/Bottom-bar.vue';
	import EG from '@/components/EgMark.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Tbar: Tbar,
			EG: EG,
			Head: Head
		},
		data() {
			return {
				title: '我的用户',
				data: [],
				effectiveJifen: 0,
				show: false
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findMyUser();
			});
		},
		computed: {
			jifenCount: function() {
				let vm = this;
				let count = 0;
				for (var i = 0; i < vm.data.length; i++) {
					count = count + vm.data[i].inviterJf;
				}
				return count;
			}
		},
		methods: {
			toChangeJiFen() {
				Toast('敬请期待');
			},
			findMyUser() {
				let vm = this;
				let params = {
					req_type: 'find_my_user',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.data = res.data.list;
						vm.effectiveJifen = res.data.effectiveJifen?res.data.effectiveJifen:0;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			testData() {
				let vm = this;
				for (var i = 0; i < 30; i++) {
					let obj = {
						nickName: '',
						phone: i,
						inviterJf: i
					}
					vm.data.push(obj)
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

	.desc {
		padding: 0 10px;
		font-size: 12px;
	}

	.my-jf {
		background-color: #008000;
		color: #ffffff;
		font-size: 16px;
		text-align: center;
		padding: 2.2rem 0;
		position: fixed !important;
		width: 100%;
		z-index: 999;
		font-weight: bold;
	}

	.my-jf>span {
		display: block;
	}

	.my-jf>span:last-child {
		padding-top: 5px;
		font-size: 20px;
	}

	.use-jifen,
	.use-jifen-desc {
		position: absolute;
		font-weight: normal;
		font-size: 12px;
		text-decoration: underline;
	}

	.use-jifen {
		right: 15px;
		bottom: 10px;
	}

	.use-jifen-desc {
		right: 15px;
		top: 10px;
	}

	.item-list {
		margin-top: 100px;
	}

	/**
 * 退出
 */
	.exit-out {
		margin: 15px 30px;
	}

	.van-button {
		border-radius: 20px !important;
		width: 100%;
	}

	.shop-cart>div {
		position: relative;
	}

	.cart-count {
		background-color: #008000;
		color: #ffffff;
		height: 15px;
		text-align: center;
		line-height: 15px;
		font-size: 12px;
		border-radius: 50px;
		position: absolute;
		right: 35px;
		bottom: 12px;
		padding: 2px 2px;
	}

	>>>.van-button {
		height: 35px;
	}
</style>
