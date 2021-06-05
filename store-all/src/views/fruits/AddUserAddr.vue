<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="addrs-list">
			<div class="user-info">
				<div>
					<van-field v-model="username" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
				</div>
				<div>
					<van-field v-model="phone" placeholder="手机号码" :rules="[{ required: true, message: '请填写手机号码' }]" />
				</div>
				<div class="addr" @click="showAddrDiv">
					<div class="addr-left">
						<div v-if="province != ''">
							<div class="province">
								<span>{{ province }}</span>
							</div>
							<div class="city">
								<span>{{ city }}</span>
							</div>
							<div class="county">
								<span>{{ county }}</span>
							</div>
							<div class="town">
								<span>{{ town }}</span>
							</div>
						</div>
						<div v-if="province == ''">
							<div class="area"><span>所在地区</span></div>
						</div>
					</div>
					<div class="addr-right">
						<span>
							<van-icon name="arrow" />
						</span>
					</div>
				</div>
				<div class="addr-detail">
					<van-field lock-scroll="false" v-model="addrDetail" rows="2" type="textarea"
						placeholder="详细地址:如道路、门牌号、小区、楼栋号、单元室等" />
				</div>
			</div>
			<div class="is-default">
				<div>
					<div><span>设为默认地址</span></div>
					<div>
						<van-switch size="18" v-model="checked" active-color="#008000" inactive-color="#9ea7b4" />
					</div>
				</div>
			</div>
		</div>
		<div style="height: 45px;"></div>
		<div class="add-btn" @click="saveData">
			<div><span>保存地址</span></div>
		</div>
		<div class="addrs">
			<AddrPanel :showp="show" @closeAddrDivS="closeAddrDiv" @setAddrDataS="setAddrData"></AddrPanel>
		</div>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import AddrPanel from '@/components/AddrPanel.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head,
			AddrPanel: AddrPanel
		},
		data() {
			return {
				id: null,
				title: '添加收货地址',
				checked: false,
				username: '',
				phone: '',
				addrCodes: '',
				province: '',
				city: '',
				county: '',
				town: '',
				addrDetail: '',
				show: false
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.findDetail();
			});
		},
		methods: {
			findDetail() {
				let vm = this;
				let {
					id
				} = this.$route.query;
				if (null == id) {
					return;
				}
				vm.id = id;
				let params = {
					req_type: 'query_globle_addr_detail',
					data: {
						id: id,
						user_id: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.checked = res.data.is_default;
						vm.username = res.data.user_name;
						vm.phone = res.data.phone;
						vm.province = res.data.province;
						vm.city = res.data.city;
						vm.county = res.data.county;
						vm.town = res.data.town;
						vm.addrDetail = res.data.addr_detail;
						vm.addrCodes = res.data.area_ids;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			saveData() {
				let vm = this;
				if (vm.checked) {
					vm.isDefault = 1;
				}
				if (vm.username == '' || vm.username == null) {
					Toast('用户名不能为空');
					return;
				}
				if (vm.phone == '' || vm.phone == null) {
					Toast('手机号码不能为空');
					return;
				}
				if (vm.addrDetail == '' || vm.addrDetail == null) {
					Toast('详细地址不能为空');
					return;
				}
				if (vm.addrCodes == '' || vm.addrCodes == null) {
					Toast('选择地址有误,请重新选择');
					return;
				}
				let params = {
					req_type: 'add_user_addr',
					data: {
						id: vm.id,
						user_id: 0,
						area_Ids: vm.addrCodes,
						area_names: vm.province + vm.city + vm.county + vm.town,
						addr_detail: vm.addrDetail,
						addr_type: 1,
						user_phone: vm.phone,
						user_name: vm.username,
						is_default: vm.isDefault
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast('操作成功');
						vm.$nextTick(function() {
							vm.$router.push('userAddr');
						});
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			showAddrDiv() {
				this.show = true;
			},
			closeAddrDiv() {
				this.show = false;
			},
			setAddrData(data) {
				this.addrCodes = data.addrCodes;
				this.province = data.province;
				this.city = data.city;
				this.county = data.county;
				this.town = data.town;
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

	/* addrs-list */
	.addrs-list {
		padding: 10px 10px;
	}

	.user-info {
		margin-bottom: 10px;
	}

	.user-info>div {
		border-bottom: 1px solid #f0f0f0;
	}

	.addr {
		padding: 15px 10px;
		position: relative;
	}

	.addr-left>div>div {
		padding: 2px 0;
	}

	.area {
		color: #969799;
	}

	.addr-right {
		height: 15px;
		width: 15px;
		font-size: 18px;
		color: #c3cbd6;
		position: absolute;
		right: 0px;
		top: 35%;
	}

	/* add-btn */
	.add-btn>div {
		color: #ffffff;
		text-align: center;
		position: fixed;
		bottom: 0px;
		margin: 0 auto;
		width: 100%;
		background-color: #ffffff;
		height: 45px;
		overflow: hidden;
	}

	.add-btn span {
		background-color: #008000;
		border-radius: 50px;
		padding: 13px 30%;
		line-height: 45px;
	}

	/* is-default */

	.is-default {
		position: relative;
		overflow: hidden;
		padding: 10px 10px;
	}

	.is-default>div>div:first-child {
		float: left;
	}

	.is-default>div>div:last-child {
		float: right;
	}

	.addrs {
		position: relative;
	}

	.van-action-sheet__header {
		position: fixed;
		width: 100%;
		top: 0px;
		border-bottom: 1px solid #f0f0f0;
	}
</style>
