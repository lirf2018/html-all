<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<div class="coupon" v-if="qr != null">
			<div>
				<div class="coupon-img">
					<div><img :src="imgPath+qr.couponImg" /></div>
				</div>
				<div class="coupon-title">
					<span>{{qr.couponName}}</span>
					<span v-if="qr.appointType == 2 && qr.recodeState != 4">当日有效：{{changeOutDate}}</span>
					<span v-if="qr.appointType != 2 && qr.recodeState != 4">有效期至：{{changeOutDate}}</span>
					<span>状态：{{recodeStateName}}</span>
				</div>
			</div>
		</div>
		<div class="coupon-code" v-show="qr != null && qr.recodeState == 1">
			<div class="barcode">
				<barcode :value="code" :options="barcodeOption" tag="svg"></barcode>
			</div>
			<div class="qrcode">
				<div id="qrcode"></div>
			</div>
			<div class="qrcode-desc">
				<span>出示二维码给店员核销</span>&nbsp;
				<span style="color: #008000;text-decoration: underline;">
					<van-icon name="replay" @click="refreshQr" />刷新
				</span>
			</div>
			<div class="qrcode-desc">
				<span>{{changeCodeOutTime}}</span>&nbsp;
			</div>
		</div>
		<div class="coupon-use-condition" v-if="qr != null && qr.needKnow != ''">
			<div><span>使用须知:</span></div>
			<div><span>{{qr.needKnow}}</span></div>
		</div>
		<div class="coupon-content" v-if="qr != null">
			<div>
				<article class="html_1XgRZFOt" v-html="qr.intro"></article>
			</div>
		</div>
		<div style="height: 15px;"></div>
	</div>
</template>

<script>
	import QRCode from 'qrcodejs2';
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
				title: '我的优惠券详情', //我的优惠券详情
				code: '000000000000000',
				barcodeOption: {
					displayValue: true, //是否默认显示条形码数据 //textPosition  :'top', //条形码数据显示的位置
					background: '#fff', //条形码背景颜色
					valid: function(valid) {

					},
					width: '2px', //单个条形码的宽度
					height: '55px',
					fontSize: '16px', //字体大小
					fontOptions: 'bold'
				},
				qrId: -1,
				qr: null,
				imgPath: '',
				changeCodeOutTime: '', // 卡券码有刷新有效时间
				changeOutDate: '',
				nowUseDate: 0,
				recodeStateName:''
			};
		},
		created() {},
		mounted() {
			let vm = this;
			let {
				qrId
			} = this.$route.query;
			vm.qrId = qrId;
			if (qrId > 0) {
				this.$nextTick(function() {
					vm.findData();
				});
			}
		},
		methods: {
			qrcode() {
				// 和div的id相同 必须是id  class类名会报错
				// 第二参数是他的配置项
				let qrCode = new QRCode('qrcode', {
					width: 150,
					height: 150,
					text: this.code,
					colorDark: '#000000'
				});
			},
			findData() {
				let vm = this;
				let params = {
					req_type: 'query_qr_detail',
					data: {
						qrId: vm.qrId
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.qr = res.data.couponDownQr;
						vm.imgPath = res.data.imgPath;
						vm.changeOutDate = res.data.changeOutDate;
						vm.changeCodeOutTime = res.data.time;
						vm.nowUseDate = res.data.nowUseDate;
						vm.recodeStateName = res.data.recodeStateName;
						vm.code = vm.qr.changeCode;
						//
						vm.$nextTick(function() {
							vm.qrcode();
						});
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			refreshQr() {
				let vm = this;
				let params = {
					req_type: 'refresh_qr_time',
					data: {
						qrId: vm.qrId
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.changeCodeOutTime = res.data.time;
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
		border: none;
		margin: 0;
		padding: 0;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.coupon,
	.coupon-code {
		color: #9ea7b4;
		background-color: #ffffff;
		margin-bottom: 10px;
		overflow: hidden;
		padding: 5px 0px;
		text-align: center;
	}

	.coupon-content {
		background-color: #ffffff;
		padding: 5px 10px;
	}

	.coupon>div {
		overflow: hidden;
		position: relative;
		padding: 10px 10px;
		text-align: left;
		height: 75px;
	}

	.coupon-img {
		float: left;
		width: 35%;
		overflow: hidden;
	}

	.coupon-img img {
		width: 100%;
		height: 75px;
		display: block;
	}

	.coupon-title {
		float: right;
		width: 65%;
	}

	.coupon-title>span {
		display: block;
		font-size: 12px;
		padding-left: 10px;
	}

	.coupon-title>span:first-child {
		font-size: 14px;
		color: #000000;
		display: -webkit-box;
		/* -webkit-box-orient: vertical; */
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 18px;
		margin-bottom: 3px;
	}

	.coupon-title>span:last-child {
		position: absolute;
		bottom: 3px;
	}

	/* barcode */
	.coupon-code {
		padding: 25px 0;
	}

	.barcode {
		font-size: 14px;
		padding-bottom: 10px;
	}

	.qrcode {
		margin: 0 auto;
		padding-bottom: 8px;
		font-size: 12px;
		width: 150px;
		height: 150px;
	}

	.qrcode img {
		width: 150px;
		height: 150px;
		margin: 0 auto;
	}

	.qrcode-desc {
		color: #9ea7b4;
		font-size: 12px;
	}

	.coupon-content {
		color: #464c5b;
		font-size: 14px;
		line-height: 20px;
	}
	
	.coupon-effect>div:first-child,
	.coupon-use-condition>div:first-child {
		color: #464c5b;
		padding-bottom: 8px;
	}
	
	.coupon-effect,
	.coupon-use-condition {
		padding: 0 10px;
		padding-bottom: 20px;
	}
	
	.coupon-effect>div:last-child,
	.coupon-use-condition>div:last-child {
		color: #9ea7b4;
		font-size: 12px;
	}
</style>
