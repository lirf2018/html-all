<template>
	<div class="body-bg">
		<van-popup v-model="show" round position="bottom" :style="{ height: '80%' }">
			<div class="co-chose" id="coChose">
				<div class="title">
					<span>请选择</span>
					<span class="close-icon"><van-icon name="cross" @click="closeDiv" /></span>
				</div>
				<div class="co-addr-info" v-show="provinceName != ''">
					<div class="co-province" @click="clickHasChose(1)" v-show="provinceName != ''">
						<span :class="provinceName != '' ? 'co-point-first co-point-check' : 'co-point-first'"></span>
						<span class="step-line-down"></span>
						<span class="co-addr-name">{{ provinceName }}</span>
					</div>
					<div class="co-city" v-show="provinceName != ''" @click="clickHasChose(2)">
						<span :class="cityName != '' ? 'co-point-next co-point-check' : 'co-point-next'"></span>
						<span class="step-line-up"></span>
						<div v-show="cityName != ''">
							<span class="step-line-down"></span>
							<span class="co-addr-name">{{ cityName }}</span>
						</div>
						<span class="co-addr-name" v-show="cityName == ''">请选择 市/直辖县/直辖区/自治州</span>
					</div>
					<div class="co-county" v-show="cityName != ''" @click="clickHasChose(3)">
						<span :class="countyName != '' ? 'co-point-next co-point-check' : 'co-point-next'"></span>
						<span class="step-line-up"></span>
						<div v-show="countyName != ''">
							<span class="step-line-down"></span>
							<span class="co-addr-name">{{ countyName }}</span>
						</div>
						<span class="co-addr-name" v-show="countyName == ''">请选择 市辖区/县/自治县</span>
					</div>
					<div class="co-town" v-show="countyName != ''" @click="clickHasChose(4)">
						<span :class="townName != '' ? 'co-point-next co-point-check' : 'co-point-next'"></span>
						<span class="step-line-up"></span>
						<span class="co-addr-name">{{ townName }}</span>
						<span class="co-addr-name" v-show="townName == ''">请选择 乡/镇/街道</span>
					</div>
				</div>
				<div class="is-loading" v-show="isLoading"><van-loading /></div>
			</div>
			<div :style="styleHeight"></div>
			<div co-addr-items>
				<div
					v-show="!isLoading"
					class="co-addr-item"
					:style="{ color: item.isSelect ? '#008000' : '' }"
					v-for="(item, index) in list"
					:key="index"
					@click="clickAddrItem(item.regionId, item.regionName, item.regionLevel, item.regionCode)"
				>
					<span class="co-name">{{ item.regionName }}</span>
					<span class="co-select" v-show="item.isSelect"><van-icon :color="item.isSelect ? '#008000' : ''" name="success" /></span>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
import axios from '@/network/request.js';
export default {
	props: ['showp'],
	methods: {
		findAddrList(regionCode) {
			let vm = this;
			let params = {
				req_type: 'query_globle_addr_list',
				data: {
					parentId: regionCode
				}
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.initPageData(res.data.list);
				}
			});
		},
		closeDiv() {
			this.$emit('closeAddrDivS', false);
		},
		clickAddrItem(regionId, regionName, regionLevel, regionCode) {
			let vm = this;
			if (regionLevel == 4) {
				vm.clickAddrItemAfter(regionId, regionName, regionLevel);
				return;
			}
			vm.regionCode = regionCode;
			let params = {
				req_type: 'query_globle_addr_list',
				data: {
					parentId: regionCode
				}
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.initPageData(res.data.list);
					if (res.data.list.length > 0) {
						vm.clickAddrItemAfter(regionId, regionName, regionLevel);
					}
				}
			});
		},
		clickAddrItemAfter(regionId, regionName, regionLevel) {
			this.isLoading = true;
			//点击地址
			if (this.choseLevel != regionLevel && this.choseLevel != 5) {
				return;
			}
			if (this.choseLevel != 4 && this.choseLevel != 5) {
				this.list = [];
			}

			if (this.choseLevel == 0) {
			} else if (this.choseLevel == 1) {
				if (this.provinceName != '') {
					//修改省
					this.cityName = '';
					this.countyName = '';
					this.townName = '';
				}
				this.provinceName = regionName;
				this.choseLevel = 2;
				this.setList(this.listCity);
			} else if (this.choseLevel == 2) {
				if (this.cityName != '') {
					//修改市
					this.countyName = '';
					this.townName = '';
				}
				this.cityName = regionName;
				this.choseLevel = 3;
				this.setList(this.listCounty);
			} else if (this.choseLevel == 3) {
				if (this.countyName != '') {
					//修改县
					this.townName = '';
				}
				this.countyName = regionName;
				this.choseLevel = 4;
				this.setList(this.listTown);
			} else if (this.choseLevel == 4 || this.choseLevel == 5) {
				this.townName = regionName;
				this.choseLevel = 5;
			} else {
				//数据异常
			}
			this.addrCodesArray[this.choseLevel - 2] = regionId;
			this.setIsSelect(this.choseLevel - 2);
			if (this.choseLevel == 5) {
				this.addrCodes = this.addrCodesArray[0] + '-' + this.addrCodesArray[1] + '-' + this.addrCodesArray[2] + '-' + this.addrCodesArray[3];
				this.$emit('closeAddrDivS', false);
				let data = {
					addrCodes: this.addrCodes,
					province: this.provinceName,
					city: this.cityName,
					county: this.countyName,
					town: this.townName
				};
				this.$emit('setAddrDataS', data);
			}
		},
		clickHasChose(choseLevel) {
			//点击已选地址
			this.choseLevel = choseLevel;
			if (this.choseLevel == 0) {
			} else if (this.choseLevel == 1) {
				this.list = this.listProvince;
			} else if (this.choseLevel == 2) {
				this.list = this.listCity;
			} else if (this.choseLevel == 3) {
				this.list = this.listCounty;
			} else if (this.choseLevel == 4) {
				this.list = this.listTown;
			} else {
				//数据异常
			}
			this.setIsSelect(this.choseLevel - 1);
		},
		setIsSelect(index) {
			let regionId_ = this.addrCodesArray[index];
			this.list.forEach(function(e) {
				if (e.regionId == regionId_) {
					e.isSelect = true;
				} else {
					e.isSelect = false;
				}
			});
		},
		setList(list) {
			setTimeout(() => {
				let h = document.getElementById('coChose').clientHeight + 10 - 90;
				this.styleHeight = 'height: ' + h + 'px;';
				this.list = list;
				this.isLoading = false;
			}, 1000);
		},
		initPageData(list) {
			// region_level //选择层级0:国家1:省/自治区/直辖市/特别行政区2:市/省(自治区)直辖县/省直辖区/自治州3:市辖区/县/自治县4:乡/镇/街道5:村
			if (list.length > 0) {
				let regionLevel = list[0].regionLevel;
				let data = [];
				for (var i = 0; i < list.length; i++) {
					let obj = {
						regionLevel: list[i].regionLevel,
						regionId: list[i].regionId,
						regionCode: list[i].regionCode,
						regionName: list[i].regionName,
						freight: list[i].freight,
						parentId: list[i].parentId,
						isSelect: false
					};
					data.push(obj);
				}
				if (regionLevel == 0) {
				} else if (regionLevel == 1) {
					this.listProvince = data;
				} else if (regionLevel == 2) {
					this.listCity = data;
				} else if (regionLevel == 3) {
					this.listCounty = data;
				} else if (regionLevel == 4) {
					this.listTown = data;
				}
			}
		}
	},
	data() {
		return {
			isLoading: true,
			show: false,
			ischeck: true,
			styleHeight: 'height: 50px;',
			list: [],
			listProvince: [],
			listCity: [],
			listCounty: [],
			listTown: [],
			choseLevel: 1, //选择层级0:国家1:省/自治区/直辖市/特别行政区2:市/省(自治区)直辖县/省直辖区/自治州3:市辖区/县/自治县4:乡/镇/街道5:村
			addrCodesArray: [], //index0,1,2,3  用于存储选择的地址标示
			addrCodes: '',
			provinceName: '',
			cityName: '',
			countyName: '',
			townName: '',
			regionCode: '000000000000'
		};
	},
	mounted: function() {
		this.$nextTick(function() {
			this.findAddrList('000000000000');
		});
		setTimeout(() => {
			this.list = this.listProvince;
			this.isLoading = false;
		}, 1000);
	},
	watch: {
		showp: {
			immediate: true,
			handler(newValue, oldValue) {
				this.show = newValue;
				// console.log("================="+this.provinceName)
				// console.log("================="+this.cityName)
				// console.log("================="+this.countyName)
				// console.log("================="+this.townName)
				// for (let i = 0; i < this.addrCodesArray.length; i++) {
				// 	console.log("================="+this.addrCodesArray[i])
				// }
				if (null != document.getElementById('coChose')) {
					this.isLoading = true;
					setTimeout(() => {
						let h = document.getElementById('coChose').clientHeight + 10 - 90;
						this.styleHeight = 'height: ' + h + 'px;';
						this.isLoading = false;
					}, 1000);
				}
			}
		}
	}
};
</script>

<style scoped>
.body-bg {
	font-size: 14px;
	color: #323233;
	font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	overflow: hidden;
}

/* co-chose */
.co-chose {
	position: fixed;
	width: 100%;
	background-color: #ffffff;
	background: #ffffff;
	z-index: 999999999999;
	border-radius: 20px 20px 0 0;
}

.title {
	text-align: center;
	color: #323233;
	padding: 10px 0;
	position: relative;
	overflow: hidden;
	background-color: #ffffff;
	background: #ffffff;
	border-radius: 50px 50px 0 0;
}

.close-icon {
	position: absolute;
	right: 8px;
	top: 15%;
	text-align: center;
	height: 30px;
	width: 30px;
	font-size: 20px;
	color: #9ea7b4;
	background-color: #ffffff;
	background: #ffffff;
}

/* co-addr-info */
.co-addr-info {
	padding: 5px 5px 20px 5px;
	background-color: #ffffff;
	background: #ffffff;
	border-bottom: 1px solid #c3cbd6;
}
.co-province,
.co-city,
.co-county,
.co-town {
	position: relative;
	overflow: hidden;
	padding: 10px 0;
}

.co-addr-info span {
	display: block;
}

.co-addr-name {
	padding-left: 30px;
}

/* step-line co-point */

.step-line-up,
.step-line-down {
	width: 10px;
	height: 50%;
	position: absolute;
	border-left: 2px solid #008000;
	margin-left: 10px;
}

.step-line-up {
	top: 0px;
}

.step-line-down {
	bottom: 0px;
}

.co-point-first,
.co-point-next {
	width: 8px;
	height: 8px;
	border-radius: 50px;
	border: 1px solid #008000;
	position: absolute;
	left: 6px;
	top: 38%;
	background-color: #ffffff;
	background: #ffffff;
	z-index: 10;
}

.co-point-check {
	background-color: #008000;
	background: #008000;
}

/* co-addr-items */
.co-addr-item {
	padding: 15px 15px;
}

.co-select {
	position: absolute;
	right: 10px;
	color: #ffffff;
	font-size: 16px;
}

.check-addr {
	color: #008000;
}

.is-loading {
	text-align: center;
	height: 90px;
	line-height: 90px;
}
</style>
