<template>
	<div class="body-bg">
		<div class="user-img">
			<div>
				<van-image round width="7rem" height="7rem" src="https://img.yzcdn.cn/vant/cat.jpeg" />
			</div>
		</div>
		<div class="login-info">
			<van-cell-group>
				<van-field v-model="tel" type="tel" label="手机号" placeholder="请输入手机号" :error-message="telMsg"
					maxlength='11' />
				<van-field v-model="smsCode" center clearable label="验证码" placeholder="请输入短信验证码" :error-message="smsMsg"
					maxlength='4'>
					<template #button>
						<van-button size="small" type="primary" @click="showImgVerify" :disabled="smsDisabled">{{sms}}
						</van-button>
					</template>
				</van-field>
				<van-field v-model="memberNum" type="tel" label="推荐人" placeholder="请输入推荐人" />
			</van-cell-group>
		</div>
		<!-- <div class="forget-passwd">
			<div @click="accountLogin"><span>账号密码登录</span></div>
		</div> -->
		<div style="clear: both;"></div>
		<div class="login-btn">
			<div @click="login"><span>登录/注册</span></div>
		</div>
		<van-dialog :beforeClose="beforeClose" v-model="show" title="" show-cancel-button @confirm="imgConfirm"
			@cancel="imgCancel()">
			<div class="verify-img-title">
				<span>{{verifyImgTitle}}</span>
				<span style="color: #008000;text-decoration: underline;" @click="initVerifyIimg">
					<van-icon name="replay" />刷新
				</span>
			</div>
			<div style="clear: both;height: 10px;"></div>
			<div class="verify-img">
				<div class="img-var">
					<div class="img-var-div" v-for="(item,index) in verifyIimg" :key="index"
						@click="choseImg(item.img_uuid)">
						<div class="overlay-div">
							<van-overlay :show="item.overlayShow" />
						</div>
						<div class="chose-div" v-show="item.overlayShow">
							<van-icon name="checked" />
						</div>
						<img class="item-img" :src="item.verify_img_path" v-if="item.verify_type == 0" />
						<!-- 			<div class="item-div" v-if="item.verify_type != 0">
							<div class="item-word" :style="item.backImg">
								<span>{{item.word}}</span>
							</div>
						</div> -->
						<div class="item-div" v-if="item.verify_type != 0">
							<div class="item-img-div">
								<img class="item-img" :src="item.backImg" />
							</div>
							<div class="item-word" v-if="item.verify_type != 0">
								<span>{{item.word}}</span>
							</div>
						</div>
					</div>
				</div>
				<div style="clear: both;height: 10px;"></div>
			</div>
		</van-dialog>
		<EG />
	</div>
</template>

<script>
	import EG from '@/components/EgMark.vue';
	import axios from '@/network/request.js';
	import {
		mapMutations
	} from 'vuex';
	import {
		validTelphone
	} from '@/commons/common.js'
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			EG: EG
		},
		data() {
			return {
				tel: '13418915218',
				telMsg: '', //手机号错误
				sms: '发送验证码',
				smsCode: '1111',
				smsMsg: '', //验证码错误
				smsDisabled: false,
				times: 3, // 倒计时时间
				timesBack: 3,
				memberNum: '',
				timer: null,
				show: false,
				verifyIimg: [],
				verifyImgTitle: '',
				verifyIimgChoseStrs: '',
				uuidMark: ''
			};
		},
		mounted: function() {
			let {
				member
			} = this.$route.query;
			this.memberNum = member;
		},
		methods: {
			initVerifyIimg() {
				let vm = this;
				vm.initVerifyIimgShow();
				vm.uuidMark = '';
				vm.verifyImgTitle = '加载选项......';
				vm.verifyIimg = [];
				let params = {
					req_type: 'get_verify_img_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.uuidMark = res.data.uuidImgVerifyMark;
						vm.verifyImgTitle = res.data.title;
						let list = res.data.list;
						for (var i = 0; i < list.length; i++) {
							let obj = {
								verify_type: list[i].verify_type,
								img_uuid: list[i].img_uuid,
								word: list[i].word,
								verify_img_path: list[i].verify_img_path,
								// backImg: "background: url(" + list[i].back_img + ") no-repeat",
								backImg: list[i].back_img,
								overlayShow: false
							}
							vm.verifyIimg.push(obj);
						}
						vm.$nextTick(function() {
							vm.show = true;
						});

					} else {
						Toast(res.resp_desc);
					}
				});
			},
			choseImg(imgUuid) {
				let vm = this;
				for (var i = 0; i < vm.verifyIimg.length; i++) {
					if (imgUuid == vm.verifyIimg[i].img_uuid) {
						vm.verifyIimg[i].overlayShow = vm.verifyIimg[i].overlayShow ? false : true;
					}
				}
			},
			beforeClose(action, done) {
				if (action == 'cancel') {
					done();
					return
				}
				done(false);
				this.beforeCloseEnd(action, done);
			},
			beforeCloseEnd(action, done) {
				let vm = this;
				vm.verifyIimgChoseStrs = '';
				for (var i = 0; i < vm.verifyIimg.length; i++) {
					if (vm.verifyIimg[i].overlayShow) {
						vm.verifyIimgChoseStrs = vm.verifyIimgChoseStrs + vm.verifyIimg[i].img_uuid + ',';
					}
				}
				if (this.verifyIimgChoseStrs == '') {
					Toast("请选择图片");
					done(false);
					return
				}
				let params = {
					req_type: 'check_verify_img',
					data: {
						uuidMark: vm.uuidMark,
						imgUuidStrs: vm.verifyIimgChoseStrs
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						// 图片校验通过
						vm.sendToMsg();
						done();
						vm.show = false;
						console.log("=============ok==========")
					} else {
						vm.initVerifyIimg();
						Toast(res.resp_desc);
					}
				});
			},
			imgConfirm() {

			},
			imgCancel() {
				let vm = this;
				vm.initVerifyIimgShow();
			},
			...mapMutations(['userLogin']),
			accountLogin() {
				let url = "accountLogin";
				this.$router.push(url);
			},
			login() {
				let vm = this;
				if (vm.tel == null || vm.tel == '') {
					Toast('手机号不能为空');
					return;
				}
				if (!validTelphone(vm.tel)) {
					Toast('非法手机号');
					return;
				}
				if (vm.smsCode == '' || vm.smsCode == null) {
					Toast('验证码不能为空');
					return;
				}
				let params = {
					req_type: 'phone_code_login',
					data: {
						phone: vm.tel,
						phone_code: vm.smsCode,
						member_code: vm.memberNum
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let passTime = res.data.passTime;
						let token = res.data.token;
						Toast('登陆成功');
						vm.userLogin({
							Authorization: token,
							phone: vm.tel
						});
						vm.$router.push("main");
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			sendToMsg() {
				let vm = this;
				let w = "重新获取";
				if (vm.tel == null || vm.tel == '') {
					Toast('手机号不能为空');
					return;
				}
				if (!validTelphone(vm.tel)) {
					Toast('非法手机号');
					return;
				}
				vm.sendCode();
				vm.sms = w + "(" + vm.times + "秒)";
				vm.smsDisabled = true;
				this.timer = setInterval(() => {
					this.times--;
					vm.sms = w + "(" + vm.times + "秒)";
					if (vm.times <= 0) {
						vm.sms = "发送验证码";
						vm.smsDisabled = false;
						vm.times = vm.timesBack;
						clearInterval(this.timer);
					}
				}, 1000)
			},
			sendCode() {
				let vm = this;
				let params = {
					req_type: 'send_phone_code',
					data: {
						valid_type: 6,
						valid_param: vm.tel,
						valid_desc: '登录或者注册'
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.list = res.data.user_addr_list;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			initVerifyIimgShow() {
				let vm = this;
				for (var i = 0; i < vm.verifyIimg.length; i++) {
					vm.verifyIimg[i].overlayShow = false;
				}
			},
			showImgVerify() {
				this.initVerifyIimg();
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
		padding: 30px 0;
		background: #008000;
	}

	.forget-passwd {
		padding: 18px 0;
		font-size: 12px;
		color: #9ea7b4;
		overflow: auto;
	}

	.forget-passwd>div {
		float: right;
		padding: 0 15px;
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
		font-size: 14px;
	}

	.login-btn>div {
		width: 90%;
		margin: 10px auto;
		padding: 8px 0;
		border-radius: 50px;
		color: #ffffff;
		background: #008000;
	}

	.verify-img {
		text-align: center;
		margin: 0 auto;
		/* border: 1px solid red */
	}

	/* width*3+ */
	.img-var {
		/* clear: both; */
		width: 277px;
		overflow: auto;
		text-align: center;
		margin: 0 auto;
	}

	.img-var-div {
		width: 80px;
		height: 80px;
		border: 1px solid #ebedf0;
		margin: 5px 5px;
		float: left;
		position: relative;
	}

	.overlay-div {}


	.item-img {
		width: 100%;
		height: 100%;
	}

	.item-word {
		line-height: 80px;
	}

	.img-var>>>.van-overlay {
		position: absolute;
		width: 80px;
		height: 80px;
	}

	.chose-div {
		color: white;
		font-size: 2.2rem;
		position: absolute;
		text-align: center;
		width: 20px;
		margin: 0 auto;
		z-index: 999999;
		font-weight: bold;
		vertical-align: middle;
		left: 25px;
		top: 25px;
	}

	.verify-img-title {
		font-size: 14px;
		margin: 15px 10px;
	}

	.verify-img-title>span:first-child {
		font-size: 14px;
		float: left;
		line-height: 16px;
		width: 75%;
		text-align: center;
	}

	.verify-img-title>span:last-child {
		font-size: 14px;
		float: right;
		width: 20%;

	}

	.item-div>div {
		width: 80px;
		height: 80px;
		font-weight: bold;
		color: white;
		text-align: center;
	}

	.item-img {
		height: 100%;
		width: 100%;
	}

	.item-word {
		position: absolute;
		top: 3px;
	}

	>>>.van-field__label {
		width: 4rem;
	}
</style>
