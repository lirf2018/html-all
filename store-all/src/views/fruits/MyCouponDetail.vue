<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<div class="coupon">
			<div>
				<div class="coupon-img">
					<div><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
				</div>
				<div class="coupon-title">
					<span>莎莎SUISSE 产品满700立减250优惠券优惠券</span>
					<span>有效期：2019.09.03-2022.03.03</span>
					<span>状态：已使用</span>
				</div>
			</div>
		</div>
		<div class="coupon-code">
			<div class="barcode">
				<barcode :value="code" :options="barcodeOption" tag="svg"></barcode>
			</div>
			<div class="qrcode">
				<div id="qrcode"></div>
			</div>
			<div class="qrcode-desc"><span>长按优惠码复制或出示二维码给店员核销</span></div>
		</div>
		<div class="coupon-content">
			<div>
				<article class="html_1XgRZFOt">
					<p><span style="font-size: 0.14rem">【港澳地区】莎莎Suisse Programme银联卡消费满港币/澳门币700立减港币/澳门币250</span></p>
					<p><span style="font-size: 0.14rem">【活动范围】所有银联卡（卡号以62开头）</span></p>
					<p><span style="font-size: 0.14rem">【活动地点】莎莎香港及澳门所有门店</span></p>
					<p>
						<span style="font-size: 0.14rem">
							【活动内容】优惠活动期内，银联持卡人在莎莎香港或澳门门店以银联卡购买单件或同一系列的Suisse
							Programme产品，购买单一产品或单组产品每笔消费金额满港币或澳门币700元及经验证莎莎专属优惠二维码/条形码后，单笔消费金额立减港币或澳门币250元。
						</span>
					</p>
					<p><span style="font-size: 0.14rem">【活动细则】&nbsp;</span></p>
					<p>
						<span style="font-size: 0.14rem">
							1.活动时间：
							<span style="font-size: 0.14rem">即日起至2020年05月31日</span>
						</span>
					</p>
					<p><span style="font-size: 0.14rem">2.具体电子优惠券可使用时间以券显示有效期为准，单笔交易仅可使用一张电子优惠券。</span></p>
					<p><span style="font-size: 0.14rem">3.电子优惠券数量有限，先到先得。</span></p>
					<p><span style="font-size: 0.14rem">4.此优惠只适用于购买Suisse Programme系列产品。</span></p>
					<p><span style="font-size: 0.14rem">5.每一62银联卡持卡人于同一交易日内最多只可用1张莎莎专属优惠劵。</span></p>
					<p><span style="font-size: 0.14rem">6.每张莎莎电子优惠券仅可使用一次，不可拆分，不能提现。</span></p>
					<p><span style="font-size: 0.14rem">7.必须于付款前声明使用且主动出示电子优惠券。</span></p>
					<p><span style="font-size: 0.14rem">8.该优惠不适用于购买礼券、联合推广换购产品、美容疗程，发型服务，餐饮服务，批发产品以及指定正价货品。</span></p>
					<p><span style="font-size: 0.14rem">9.该优惠不可与莎莎贵宾卡会员折扣优惠、其他银联优惠、其他信用卡之额外折扣、现金券或其他推广优惠同时使用。</span></p>
					<p><span style="font-size: 0.14rem">10.如交易发生退款或退货，仅退还持卡人实际支付的金额，并不包含优惠金额。</span></p>
					<p><span style="font-size: 0.14rem">11.如退货后适用商品金额未达到活动指定金额，将不能享用此电子优惠券。</span></p>
					<p><span style="font-size: 0.14rem">12.已使用的电子优惠券即时失效，如发生退货交易，电子优惠券将不获返还。</span></p>
					<p><span style="font-size: 0.14rem">13.可兑换券数量有限，按实际交易发生顺序计算，额满活动即止。</span></p>
					<p><span style="font-size: 0.14rem">14.活动详情以店内信息为准。</span></p>
					<p><br /></p>
				</article>
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
				code: '622812550451042645',
				barcodeOption: {
					displayValue: true, //是否默认显示条形码数据 //textPosition  :'top', //条形码数据显示的位置
					background: '#fff', //条形码背景颜色
					valid: function(valid) {
						console.log(valid);
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
				}
			};
		},
		created() {},
		mounted() {
			this.qrcode(); //调用二维码生成的方法
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
		height: auto;
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
		color: #464c5b;
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
		color: #464c5b;
		font-size: 12px;
	}

	.coupon-content {
		color: #464c5b;
		font-size: 14px;
		line-height: 20px;
	}
</style>
