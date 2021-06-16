<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="coupon">
			<div class="shop-info" v-if="shop != null">
				<div>
					<span><img :src="imgPath+shop.shopLogo" /></span>
					<span>{{shop.shopName}}</span>
				</div>
			</div>
			<div>
				<CouponLine />
			</div>
			<div class="title" v-if="coupon != null">
				<div><span>{{coupon.couponName}}</span></div>
				<div><span>{{coupon.title}}</span></div>
			</div>
			<div class="coupon-code" v-show="showCodeFlag">
				<div class="barcode">
					<barcode :value="code" :options="barcodeOption" tag="svg"></barcode>
				</div>
				<div class="qrcode">
					<div id="qrcode"></div>
				</div>
				<div class="qrcode-desc"><span>长按优惠码复制或出示二维码给店员核销</span></div>
			</div>
			<div>
				<CouponLine />
			</div>
			<div class="coupon-detail"><span>优惠券详情</span></div>
			<div class="coupon-effect" v-if="coupon != null">
				<div><span>领取时间:</span></div>
				<div>
					<span>{{beginDate}}</span>
					<span>&nbsp;至&nbsp;</span>
					<span>{{endDate}}</span>
				</div>
			</div>
			<div class="coupon-use-condition" v-if="coupon != null && coupon.needKnow != ''">
				<div><span>使用须知:</span></div>
				<div><span>{{coupon.needKnow}}</span></div>
			</div>
			<div class="coupon-content" v-if="coupon != null">
				<div>
					<article class="html_1XgRZFOt" v-html="coupon.intro">
					</article>
				</div>
			</div>
		</div>
		<div style="height: 15px;">
			</div?>
		</div>
</template>

<script>
	import QRCode from 'qrcodejs2';
	import Head from '@/components/Head.vue';
	import CouponLine from '@/components/CouponLine.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head,
			CouponLine: CouponLine
		},
		data() {
			return {
				title: '优惠券详情',
				showCodeFlag: false,
				code: '000000000',
				barcodeOption: {
					displayValue: true, //是否默认显示条形码数据 //textPosition  :'top', //条形码数据显示的位置
					background: '#fff', //条形码背景颜色
					valid: function(valid) {
						// console.log(valid);
					},
					width: '2px', //单个条形码的宽度
					height: '55px',
					fontSize: '16px', //字体大小
					fontOptions: 'bold'
					// format: "CODE39",//选择要使用的条形码类型
					//  width:3,//设置条之间的宽度
					//  height:100,//高度
					//  displayValue:true,//是否在条形码下方显示文字
					//  text:"456",//覆盖显示的文本
					//  fontOptions:"bold italic",//使文字加粗体或变斜体
					//  font:"fantasy",//设置文本的字体
					//  textAlign:"left",//设置文本的水平对齐方式
					//  textPosition:"top",//设置文本的垂直位置
					//  textMargin:5,//设置条形码和文本之间的间距
					//  fontSize:15,//设置文本的大小
					//  background:"#eee",//设置条形码的背景
					//  lineColor:"#2196f3",//设置条和文本的颜色。
					//  margin:15//设置条形码周围的空白边距
				},
				coupon: null,
				shop: null,
				couponId: null,
				imgPath: '',
				beginDate: '',
				endDate: ''
			};
		},
		created() {},
		mounted() {
			let vm = this;
			let {
				couponId
			} = this.$route.query;
			vm.couponId = couponId;
			this.$nextTick(function() {
				vm.findData();
			});
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
					req_type: 'query_coupon_detail',
					data: {
						couponId: vm.couponId
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.coupon = res.data.coupon;
						vm.shop = res.data.shop;
						vm.imgPath = res.data.imgPath;
						vm.beginDate = res.data.beginDate;
						vm.endDate = res.data.endDate;
						//
						// vm.code = "99";
						// vm.showCodeFlag = true;
						vm.$nextTick(function() {
							vm.qrcode(); //调用二维码生成的方法
						});
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
		line-height: 20px;
		margin: 0;
		padding: 0;
		background-color: #008000;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.coupon {
		color: #464c5b;
		background-color: #ffffff;
		margin-bottom: 10px;
		overflow: hidden;
		padding: 5px 0px;
		margin: 15px 15px;
		border-radius: 20px;
	}

	.shop-info {
		overflow: hidden;
	}

	.shop-info>div {
		width: 3rem;
		height: 3rem;
		width: 100%;
		margin: 10px 10px;
	}

	.shop-info>div>span {
		display: block;
		color: #464c5b;
		font-weight: bold;
	}

	.shop-info>div>span:first-child {
		float: left;
	}

	.shop-info>div>span:last-child {
		float: left;
		line-height: 3rem;
		margin-left: 15px;
	}

	.shop-info img {
		width: 3rem;
		height: 3rem;
	}

	/* title */

	.title {
		padding: 10px 10px;
		color: #000000;
		text-align: center;
		font-weight: bold;
	}

	.title>div:first-child {
		color: #000000;
		font-size: 14px;
		margin-bottom: 5px;
	}

	.title>div:last-child {
		color: #000000;
		font-size: 20px;
	}

	.coupon-content {
		background-color: #ffffff;
		padding: 5px 10px;
	}

	.coupon-img {
		float: left;
		width: 30%;
		overflow: hidden;
	}

	.coupon-img img {
		width: 100%;
		height: auto;
		display: block;
	}

	.coupon-title {
		float: right;
		width: 70%;
	}

	.coupon-title>span {
		display: block;
		font-size: 12px;
		padding-left: 10px;
	}

	.coupon-title>span:first-child {
		color: #464c5b;
		margin-bottom: 8px;
		display: -webkit-box;
		/* -webkit-box-orient: vertical; */
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 20px;
	}

	.coupon-title>span:last-child {
		position: absolute;
		bottom: 10px;
	}

	/* barcode */
	.coupon-code {
		text-align: center;
		padding-bottom: 10px;
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
		padding-top: 3px;
	}

	.coupon-effect,
	.coupon-use-condition {
		padding: 0 10px;
		padding-bottom: 20px;
	}

	.coupon-detail {
		padding: 0 10px 18px 10px;
		font-size: 14px;
		color: #464c5b;
		font-weight: bold;
	}

	.coupon-detail>span {
		border-left: 3px solid #008000;
		padding-left: 10px;
	}

	.coupon-effect>div:first-child,
	.coupon-use-condition>div:first-child {
		color: #464c5b;
		padding-bottom: 8px;
	}

	.coupon-effect>div:last-child,
	.coupon-use-condition>div:last-child {
		color: #9ea7b4;
		font-size: 12px;
	}

	.coupon-content {
		/* line-height: 20px; */
	}
	
	.coupon{
		z-index: 0;
	}
</style>
