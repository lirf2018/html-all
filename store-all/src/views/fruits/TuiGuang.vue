<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<div @click="toPage('/tuiGuangYonghu')">
			<van-cell-group>
				<van-cell title="累计推广" is-link :value="tuiguangCount+'人'" />
			</van-cell-group>
		</div>
		<div class="coupon-code" v-show="showCodeFlag">
			<div class="barcode">
				<barcode :value="code" :options="barcodeOption" tag="svg"></barcode>
			</div>
			<div class="qrcode">
				<div id="qrcode"></div>
			</div>
			<div class="qrcode-desc"><span>提供给新用户扫码注册</span></div>
		</div>
		<div style="position: relative;text-align: center;padding-top: 30px;" v-show="!showCodeFlag">
			<span>未绑定会员卡</span>
			<span class="bang-card" @click="toPage('bangMemberNum')">去绑定</span>
		</div>
		<div class="coupon-content">
			<div>
				<article>
					<p>说明：</p>
					<p><span style="font-size: 0.14rem">1、新用户通过扫当前二维码并注册，即视为当前二维码的推广用户。</span></p>
					<p><span style="font-size: 0.14rem">2、新用户在注册页面输入推广码（一维码），即视为当前二维码的推广用户。</span></p>
					<p><span style="font-size: 0.14rem">3、会员所推广的用户真实消费成功后，平台对每一单将随机奖励推广人。</span></p>
					<p><span
							style="font-size: 0.14rem">4、公平公正平等诚实原则，一切非正当手段获得的奖励包括且不限于(不显示系统错误，系统被攻击，账单对应不上实际对接平台流水等)，平台有权取消奖励。</span>
					</p>
					<p><span style="font-size: 0.14rem">5、公平公正平等诚实原则，推广用户每一笔消费记录都会有对接交易平台真实流水，平台会根据实际审核结果发放奖励。</span>
					</p>
					<p><span style="font-size: 0.14rem">6、公平公正平等诚实原则，系统被攻击或者异常数据，平台有权取消奖励。</span></p>
					<p><span style="font-size: 0.14rem">7、最终解释权归平台所有。</span></p>
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
				title: '我的推广码', //
				code: '',
				url: '/PhoneLogin?member=',
				showCodeFlag: false,
				tuiguangCount: 0,
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
			let {
				member
			} = this.$route.query;
			this.code = member;
			if (member != null && member != '') {
				this.showCodeFlag = true;
				this.qrcode(); //调用二维码生成的方法
			}
			this.findMyUser();
		},
		methods: {
			qrcode() {
				let vm = this;
				// 和div的id相同 必须是id  class类名会报错
				// 第二参数是他的配置项
				let qrCode = new QRCode('qrcode', {
					width: 150,
					height: 150,
					text: vm.url + '' + vm.code,
					colorDark: '#000000'
				});
			},
			toPage(path) {
				this.$router.push(path);
			},
			findMyUser() {
				let vm = this;
				let params = {
					req_type: 'find_my_user',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.tuiguangCount = res.data.list.length;
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
	
	.bang-card{
		color: #008000;
		position: absolute;
		right: 20px;
		bottom: -15px;
		font-size: 12px;
		font-weight: bold;
		text-decoration: underline;
	}
</style>
