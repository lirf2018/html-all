<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="user-img">
			<div class="img-div">
				<img class="card-css" src="../../assets/card.png">
				<div class="card-num">
					<span>No. </span>
					<span>{{memberNum}}</span>
				</div>
				<div class="show-qrcode" v-show="showClickQr" @click="show = true">
					<div class="qrcode">
						<div id="qrcode"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="login-info" v-show="!memberNumFlag">
			<van-cell-group >
				<van-field v-model="memberNum" type="tel" label="会员号:" placeholder="请输入会员号" />
			</van-cell-group>
		</div>
		<div style="clear: both;"></div>
		<div class="login-btn">
			<div v-show="memberNumFlag" @click="delBang"><span>解绑会员号</span></div>
			<div v-show="!memberNumFlag" @click="addBang"><span>绑定会员号</span></div>
		</div>
		<van-popup v-model="show">
			<MyQrCode :memberCode="memberNum" />
		</van-popup>
		<EG />
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import EG from '@/components/EgMark.vue';
	import axios from '@/network/request.js';
	import MyQrCode from '@/components/MyQrCode.vue';
	import QRCode from 'qrcodejs2';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			MyQrCode: MyQrCode,
			EG: EG,
			Head: Head
		},
		data() {
			return {
				title: '会员号',
				memberNumFlag: false,
				memberNum: '',
				show: false,
				showClickQr:false,
				imgCard:''
			};
		},
		mounted: function() {
			this.findUserBangList();
			this.$nextTick(function() {
				this.qrcode();
			});
		},
		methods: {
			findUserBangList() {
				let vm = this;
				let params = {
					req_type: 'find_sns_bang_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					vm.memberNumFlag = false;
					if (res.resp_code == 1) {
						// 1、腾讯微博；2、新浪微博；3、人人网；4、微信；5、服务窗；6、一起沃；7、QQ;8、绑定会员号；9、绑定手机号
						let data = res.data.list;
						vm.imgCard = res.data.cardImg;
						for (var i = 0; i < data.length; i++) {
							if (data[i].snsType == 8) {
								vm.memberNum = data[i].memberNum;
								if (vm.memberNum != '' && vm.memberNum != null) {
									vm.memberNumFlag = true;
									vm.showClickQr = true;
								}
							}
						}
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			toPage(path) {
				this.$router.push(path);
			},
			delBang() {
				this.$dialog
					.confirm({
						title: '提示',
						message: '确认解绑吗？'
					})
					.then(() => {
						let vm = this;
						let params = {
							req_type: 'update_member_num',
							data: {
								type: 'del'
							}
						}; // 参数
						axios.post('', params).then(function(res) {
							if (res.resp_code == 1) {
								Toast('解绑成功');
								vm.findUserBangList();
								vm.showClickQr = false;
							} else {
								Toast(res.resp_desc);
							}
						});
					})
					.catch(() => {
						// on cancel
						// console.info('---------on cancel----------');
					});
			},
			addBang() {
				let vm = this;
				if (vm.memberNum == '' || vm.memberNum == null) {
					Toast('会员号不能为空');
					return;
				}
				let params = {
					req_type: 'update_member_num',
					data: {
						type: 'add',
						"memberNum": vm.memberNum
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast('绑定成功');
						vm.findUserBangList();
						vm.showClickQr = true;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			qrcode() {
				let vm = this;
				// 和div的id相同 必须是id  class类名会报错
				// 第二参数是他的配置项
				let qrCode = new QRCode('qrcode', {
					width: 25,
					height: 25,
					text: '0',
					colorDark: '#969799'
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
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.user-img {
		text-align: center;
		padding: 10px 20px;
	}
	.card-css{
		height: auto;
		width: 100%;
		border-radius: 5%;
	}
	
	.img-div{
		position: relative;
	}
	
	.card-num{
		font-weight: bold;
		position: absolute;
		right: 12px;
		top: 10px;
		/* color: white; */
	}

	.login-info {
		padding: 0 15px;
	}

	.login-info .van-field__label {
		width: auto !important;
		padding-right: 15px !important;
	}

	.login-btn {
		text-align: center;
		padding: 20px 0;
	}

	.login-btn>div {
		width: 90%;
		margin: 10px auto;
		padding: 8px 0;
		border-radius: 50px;
		color: #ffffff;
		background: #008000;
	}
	
	/*  */
	.show-qrcode {
		position: absolute;
		bottom: 30px;
		right: 15px;
	}

	.qrcode {
		margin: 0 auto;
		font-size: 12px;
		width: 30px;
		height: 30px;
	}
</style>
