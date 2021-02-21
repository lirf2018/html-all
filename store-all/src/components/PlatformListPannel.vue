<template>
	<div class="body-bg">
		<div class="close-head">
			<div class="close-x" @click="closeParentSowAddrListPannelFlag">
				<van-icon name="close" />
			</div>
		</div>
		<div style="height: 25px;"></div>
		<van-index-bar :index-list="indexList" highlight-color="#008000">
			<div class="paddr-div" v-for="(itemP,indexs) in dataList" :key="indexs">
				<van-index-anchor :index="itemP.sort_char" />
				<div class="paddr-div-info" v-for="item in itemP.addr_list" :key="item.id" @click="choseAddr(item)">
					<van-cell :title="item.addr_name" :value="item.freight_name" />
					<div class="paddr-detail">
						<span>{{item.detail_addr}}</span>
					</div>
				</div>
			</div>
		</van-index-bar>
	</div>
</template>

<script>
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		data() {
			return {
				indexList: [],
				dataList: []
			};
		},
		props: ["closeSowAddrListPannelFlag","indexListP","dataListP","choseAddrP"],
		watch:{
			indexListP: {
			    handler(newData, oldData) {
			      this.indexList = newData;
			    },
			    // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
			    immediate: true
			  },
			  dataListP: {
			      handler(newData, oldData) {
			        this.dataList = newData;
			      },
			      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
			      immediate: true
			    }
		},
		mounted: function() {
			// this.$nextTick(function() {
			// 	this.findPlatformList();
			// });
		},
		methods: {
			choseAddr(item){
				this.choseAddrP(item);
			},
			closeParentSowAddrListPannelFlag() {
				this.closeSowAddrListPannelFlag();
			},
			testData() {
				let vm = this;
				for (let i = 1; i < 3; i++) {
					vm.indexList.push(i);
					let j = i;
					let addrs = [];
					for (; j > 0; j--) {
						let obj = {
							"addr_name": "(" + i + ")安塘村服务站(" + j + ")",
							"addr_type": "6",
							"sort_char": "A",
							"freight": j,
							"addr_lat": "",
							"store_name": "",
							"detail_addr": "广西柳州市融水县和睦镇安塘村",
							"id": i + j,
							"addr_lng": ""
						}
						addrs.push(obj);
					}
					let objP = {
						addr_list: addrs,
						sort_char: i
					}
					vm.dataList.push(objP);
				}
			}
		}
	}
</script>

<style scoped>
	.body-bg {
		border: none;
		margin: 0;
		padding: 0;
		font-size: 12px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.close-head {
		position: fixed;
		right: 5px;
		color: gray;
		top: 5px;
		z-index: 99;
		font-size: 20px;
	}

	.paddr-div {
		padding-right: 10px;
	}

	.paddr-div-info {
		/* border: 1px solid red; */
		margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 15px;
		background-color: #F0F0F0;
		border-radius: 8px 8px;
	}

	>>>.van-cell {
		background-color: #F0F0F0;
		border-radius: 8px 8px;
	}

	.paddr-detail {
		color: gray;
		padding: 10px 15px;
	}
</style>
