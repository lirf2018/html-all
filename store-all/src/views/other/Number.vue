<template>
	<div class="app-div">
		<div class="in-number"><input v-model="vlaue" @keydown="insertNumber" @keyup="insertNumber" /></div>
		<div class="div-1"></div>
		<div class="numbe-panel">
			<div>
				<div :class="item.numbePanelClass" v-for="(item, index) in numbesList" :key="index">
					<span :class="item.fontColor">{{ item.numStr }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			vlaue: null,
			numbesList: []
		};
	},
	mounted() {
		let vm = this;
		for (var i = 1; i < 50; i++) {
			let key = i;
			if (i < 10) {
				key = 0 + '' + i;
			}
			let obj = {
				numStr: key,
				numbePanelClass: 'numbe-panel-no-unchose',
				fontColor: 'fontColor-green'
			};
			vm.setFontColor(obj);
			vm.numbesList.push(obj);
		}
	},
	methods: {
		insertNumber() {
			let vm = this;
			//
			for (let j = 0; j < vm.numbesList.length; j++) {
				// 取第二个位数
				let obj = vm.numbesList[j].numStr + '';
				//
				let ket_ = obj.charAt(1) + '';
				vm.numbesList[j].numbePanelClass = 'numbe-panel-no-unchose';
			}
			// 选中的下标
			let cheose = [];
			if (vm.vlaue != null && vm.vlaue != '') {
				for (let i = 0; i < vm.vlaue.length; i++) {
					let key = vm.vlaue.charAt(i) + '';
					for (let j = 0; j < vm.numbesList.length; j++) {
						// 取第二个位数
						let obj = vm.numbesList[j].numStr + '';
						//
						let ket_ = obj.charAt(1) + '';
						if (key == ket_) {
							cheose.push(j);
						}
					}
				}
				// 设置选中
				for (var i = 0; i < cheose.length; i++) {
					vm.numbesList[cheose[i]].numbePanelClass = 'numbe-panel-no-chose';
				}
			}
		},
		setFontColor(data) {
			if (
				data.numStr == '01' ||
				data.numStr == '02' ||
				data.numStr == '07' ||
				data.numStr == '08' ||
				data.numStr == '13' ||
				data.numStr == '19' ||
				data.numStr == '12' ||
				data.numStr == '18' ||
				data.numStr == '23' ||
				data.numStr == '24' ||
				data.numStr == '29' ||
				data.numStr == '30' ||
				data.numStr == '34' ||
				data.numStr == '35' ||
				data.numStr == '40' ||
				data.numStr == '45' ||
				data.numStr == '46'
			) {
				//红色
				data.fontColor ='fontColor-red'
			} else if (
				data.numStr == '03' ||
				data.numStr == '04' ||
				data.numStr == '09' ||
				data.numStr == '10' ||
				data.numStr == '14' ||
				data.numStr == '15' ||
				data.numStr == '20' ||
				data.numStr == '25' ||
				data.numStr == '26' ||
				data.numStr == '31' ||
				data.numStr == '37' ||
				data.numStr == '36' ||
				data.numStr == '42' ||
				data.numStr == '41' ||
				data.numStr == '47' ||
				data.numStr == '48'
			) {
				//蓝色
				data.fontColor ='fontColor-blue'
			}
		}
	}
};
</script>

<style scoped>
.div-1 {
	height: 20px;
	background-color: #fbffa6;
}
.in-number {
	text-align: center;
	margin: 0px auto;
	background-color: #fbffa6;
}

.in-number > input {
	border: 1px solid grey;
	margin-top: 20px;
	height: 30px;
	font-size: 18px;
	font-weight: bold;
}
.numbe-panel {
	background-color: #fbffa6;
	margin: 0 auto;
	text-align: center;
	overflow: auto;
}
.numbe-panel-no-unchose {
	border: 3px solid 	#C0C0C0;
	width: 35px;
	height: 35px;
	line-height: 35px;
	text-align: center;
	border-radius: 50% 50%;
	float: left;
	background-color: white;
	margin: 20px 0 0 10px;
	font-size: 18px;
}

.numbe-panel-no-chose {
	border: 3px solid red;
	width: 35px;
	height: 35px;
	line-height: 35px;
	text-align: center;
	border-radius: 50% 50%;
	float: left;
	margin: 20px 0 0 10px;
	background-color: white;
	font-size: 18px;
}

.fontColor-red {
	color: 	#DC143C;
}
.fontColor-green {
	color: 	#32CD32;
}
.fontColor-blue {
	color: #6495ED;
}
</style>
