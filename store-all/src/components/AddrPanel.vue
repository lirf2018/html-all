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
					@click="clickAddrItem(item.regionId, item.regionName, item.regionLevel)"
				>
					<span class="co-name">{{ item.regionName }}</span>
					<span class="co-select" v-show="item.isSelect"><van-icon :color="item.isSelect ? '#008000' : ''" name="success" /></span>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
export default {
	props: ['showp'],
	methods: {
		closeDiv() {
			this.$emit('closeAddrDivS', false);
		},
		clickAddrItem(regionId, regionName, regionLevel) {
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
			townName: ''
		};
	},
	mounted() {
		this.listProvince = [
			{ regionLevel: 1, regionId: '10209', regionCode: '110000000000', regionName: '北京市', freight: '100', isSelect: false },
			{ regionLevel: 1, regionId: '10227', regionCode: '120000000000', regionName: '天津市', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '10245', regionCode: '130000000000', regionName: '河北省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '10436', regionCode: '140000000000', regionName: '山西省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '10577', regionCode: '150000000000', regionName: '内蒙古自治区', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '10702', regionCode: '210000000000', regionName: '辽宁省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '10831', regionCode: '220000000000', regionName: '吉林省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '10909', regionCode: '230000000000', regionName: '黑龙江省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11063', regionCode: '310000000000', regionName: '上海市', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11081', regionCode: '320000000000', regionName: '江苏省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11204', regionCode: '330000000000', regionName: '浙江省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11316', regionCode: '340000000000', regionName: '安徽省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11454', regionCode: '350000000000', regionName: '福建省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11558', regionCode: '360000000000', regionName: '江西省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11681', regionCode: '370000000000', regionName: '山东省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '11853', regionCode: '410000000000', regionName: '河南省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12047', regionCode: '420000000000', regionName: '湖北省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12177', regionCode: '430000000000', regionName: '湖南省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12328', regionCode: '440000000000', regionName: '广东省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12491', regionCode: '450000000000', regionName: '广西壮族自治区', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12631', regionCode: '460000000000', regionName: '海南省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12662', regionCode: '500000000000', regionName: '重庆市', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12703', regionCode: '510000000000', regionName: '四川省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '12926', regionCode: '520000000000', regionName: '贵州省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13029', regionCode: '530000000000', regionName: '云南省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13183', regionCode: '540000000000', regionName: '西藏自治区', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13271', regionCode: '610000000000', regionName: '陕西省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13399', regionCode: '620000000000', regionName: '甘肃省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13512', regionCode: '630000000000', regionName: '青海省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13566', regionCode: '640000000000', regionName: '宁夏回族自治区', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13599', regionCode: '650000000000', regionName: '新疆维吾尔自治区', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '13724', regionCode: '710000000000', regionName: '台湾省', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '14103', regionCode: '810000000000', regionName: '香港特别行政区', freight: '0', isSelect: false },
			{ regionLevel: 1, regionId: '14125', regionCode: '820000000000', regionName: '澳门特别行政区', freight: '0', isSelect: false }
		];

		this.listCity = [
			{ regionLevel: 2, regionId: '12492', regionCode: '450100000000', regionName: '南宁市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12506', regionCode: '450200000000', regionName: '柳州市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12518', regionCode: '450300000000', regionName: '桂林市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12537', regionCode: '450400000000', regionName: '梧州市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12546', regionCode: '450500000000', regionName: '北海市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12552', regionCode: '450600000000', regionName: '防城港市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12558', regionCode: '450700000000', regionName: '钦州市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12564', regionCode: '450800000000', regionName: '贵港市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12571', regionCode: '450900000000', regionName: '玉林市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12580', regionCode: '451000000000', regionName: '百色市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12594', regionCode: '451100000000', regionName: '贺州市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12601', regionCode: '451200000000', regionName: '河池市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12614', regionCode: '451300000000', regionName: '来宾市', freight: '0', isSelect: false },
			{ regionLevel: 2, regionId: '12622', regionCode: '451400000000', regionName: '崇左市', freight: '0', isSelect: false }
		];
		this.listCounty = [
			{ regionLevel: 3, regionId: '12507', regionCode: '450201000000', regionName: '市辖区', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12508', regionCode: '450202000000', regionName: '城中区', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12509', regionCode: '450203000000', regionName: '鱼峰区', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12510', regionCode: '450204000000', regionName: '柳南区', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12511', regionCode: '450205000000', regionName: '柳北区', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12512', regionCode: '450206000000', regionName: '柳江区', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12513', regionCode: '450222000000', regionName: '柳城县', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12514', regionCode: '450223000000', regionName: '鹿寨县', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12515', regionCode: '450224000000', regionName: '融安县', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12516', regionCode: '450225000000', regionName: '融水苗族自治县', freight: '0', isSelect: false },
			{ regionLevel: 3, regionId: '12517', regionCode: '450226000000', regionName: '三江侗族自治县', freight: '0', isSelect: false }
		];
		this.listTown = [
			{ regionLevel: 4, regionId: '32157', regionCode: '450225100000', regionName: '融水镇', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32158', regionCode: '450225101000', regionName: '和睦镇', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32159', regionCode: '450225102000', regionName: '三防镇', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32160', regionCode: '450225103000', regionName: '怀宝镇', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32161', regionCode: '450225104000', regionName: '洞头镇', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32162', regionCode: '450225105000', regionName: '大浪镇', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32163', regionCode: '450225106000', regionName: '永乐镇', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32164', regionCode: '450225201000', regionName: '四荣乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32165', regionCode: '450225202000', regionName: '香粉乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32166', regionCode: '450225203000', regionName: '安太乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32167', regionCode: '450225205000', regionName: '汪洞乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32168', regionCode: '450225206000', regionName: '同练瑶族乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32169', regionCode: '450225207000', regionName: '滚贝侗族乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32170', regionCode: '450225208000', regionName: '杆洞乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32171', regionCode: '450225209000', regionName: '安陲乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32172', regionCode: '450225211000', regionName: '白云乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32173', regionCode: '450225212000', regionName: '红水乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32174', regionCode: '450225213000', regionName: '拱洞乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32175', regionCode: '450225214000', regionName: '良寨乡', freight: '0', isSelect: false },
			{ regionLevel: 4, regionId: '32176', regionCode: '450225215000', regionName: '大年乡', freight: '0', isSelect: false }
		];
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
				if(null!=document.getElementById('coChose')){
					this.isLoading = true;
					setTimeout(() => {
						let h = document.getElementById('coChose').clientHeight + 10 -90;
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
