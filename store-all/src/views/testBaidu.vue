<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<div class="coupon">
			<!-- <baidu-map id="allmap" @ready="mapReady"></baidu-map> -->
			<div id="l-map" style="height: 300px;"></div>
			<div>
				<div id="r-result">
					<div
						style="font: 12px Arial, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, STHeiti, sans-serif; border: 1px solid rgb(153, 153, 153);">
						<div style="background: rgb(255, 255, 255);">
							<ol style="list-style: none; padding: 0px; margin: 0px;">
								<li style="margin: 2px 0px; padding: 0px 5px 5px 0px; cursor: pointer; overflow: hidden; line-height: 17px;"
									v-for="(item,index) in addrList" :key="index">
									<span
										style="background:url(http://webmap0.bdimg.com/wolfman/static/common/images/markers_new2x_2960fb4.png) -180px -139px no-repeat;background-size: 300px 300px;width:18px;height:27px;cursor:pointer;float:left;*zoom:1;overflow:hidden;margin:2px 3px 0 5px;*margin-right:0px;display:inline;">&nbsp;</span>
									<div
										style="zoom: 1; overflow: hidden; padding: 0px 5px; background-color: rgb(240, 240, 240);">
										<div style="line-height:20px;font-size:12px;"><span style="color:#00c;">{{item.title}}</span>
										</div>
										<div style="padding:2px 0;line-height:18px;*zoom:1;overflow:hidden;"><b
												style="float:left;font-weight:bold;*zoom:1;overflow:hidden;padding-right:5px;*margin-right:-3px;">地址:</b><span
												style="color:#666;display:block;zoom:1;overflow:hidden;">{{item.address}}</span>
										</div>
									</div>
								</li>
							</ol>
						</div>
						<div
							style="white-space: nowrap; text-align: right; background: rgb(229, 236, 249); margin-top: 5px; padding: 2px; overflow: hidden; zoom: 1;">
							<div style="float: left; margin-right: 5px;">
								<p style="margin:0;padding:0;white-space:nowrap"><span style="margin-right:3px">1</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	export default {
		components: {
			Head: Head
		},
		data() {
			return {
				title: '测试',
				map: null,
				addrList: [],
				lng: 114.02597366,
				lat: 22.54605355,
				center: {
					nowLng: 0,
					point: {},
					marker: {},
					map: {},
					lng: 114.02597366,
					lat: 22.54605355,
					flag: true
				},
				zoom: 15
			};
		},
		created() {
			// const watchId = navigator.geolocation.watchPosition(
			// 	position => console.log("====" + position)
			// );
		},
		mounted: function(e) {
			let vm = this
			this.$nextTick(() => {
				vm.map = new BMapGL.Map('l-map');
				let point = new BMapGL.Point(vm.lng, vm.lat);
				vm.map.centerAndZoom(point, 14);
				// 选择一个经纬度作为中心点 longitude=114.02597366    latitude=22.54605355
				vm.map.clearOverlays();
				//添加gps marker和label
				var marker = new BMapGL.Marker(point, {
					enableDragging: false
				});
				marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
				vm.map.addOverlay(marker); //添加GPS marker
				//
				vm.map.addEventListener("moveend", vm.showCurrentPoi);
				vm.searchAddr();

				//获取当前地理信息
				window.navigator.geolocation.getCurrentPosition(vm.success, vm.error);
			})
		},
		methods: {
			showCurrentPoi() {
				console.log("========================showCurrentPoi")
				let vm = this
				// if (!vm.flag) {
				// 	return
				// }
				vm.flag = false;
				var center = vm.map.getCenter(); // 获取地图中心点
				let lng = center.lng.toFixed(5);
				let lat = center.lat.toFixed(5);
				console.log('地图中心点: (' + lng + ', ' + lat + ')');
				//
				let point = new BMapGL.Point(lng, lat);
				vm.map.clearOverlays();
				var marker = new BMapGL.Marker(point, {
					enableDragging: false
				});
				vm.map.addOverlay(marker); //添加GPS marker
				vm.searchAddr();
			},
			searchAddr() {
				let vm = this
				vm.addrList = [];
				var myKeys = ["坂田街道"];
				console.log("========================searchAddr" + vm.map)
				//检索地址
				var local = new BMapGL.LocalSearch(vm.map, {
					// renderOptions: {
					// 	panel: "r-result"
					// },
					pageCapacity: 100,
					onSearchComplete: function(results) {
						console.log("========================results.length" + results.length)
						for (var i = 0; i <= results.length; i++) {
							let data = results[i];
							if (data) {
								let array = data._pois;
								for (var j = 0; j < array.length; j++) {
									let title = array[j].title;
									let address = array[j].address;
									let obj = {
										title: title,
										address: address
									}
									vm.addrList.push(obj);
								}
							}
						}
					}
				});
				local.searchInBounds(myKeys, vm.map.getBounds());
			},
			//获取地理信息成功时的回调函数
			success(position) {
				// alert("成功获取您的地理信息");
				console.log("成功获取您的地理信息")

				//获取经度维度信息
				//coords属性
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
				//打印纬度,经度信息
				console.log(latitude);
				console.log(longitude);
			},

			//获取地理信息失败时的回调函数
			error(msg) {
				// alert("获取您的地理信息失败");
				console.log("获取您的地理信息失败")
			},
			mapReady1() {
				let vm = this
				var map = new BMap.Map('container'); // 创建Map实例
				map.centerAndZoom(new BMap.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
				map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
			},
			mapReady({
				BMap,
				map
			}) {
				let vm = this
				// 获取位置坐标
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition((r) => {
					var pt = r.point;
					var lng = pt.lng;
					var lat = pt.lat;
					// 选择一个经纬度作为中心点 longitude=114.02597366    latitude=22.54605355
					var point = new BMap.Point(pt.lng, pt.lat);
					//
					map.centerAndZoom(point, 15);
					map.clearOverlays();
					//添加gps marker和label
					var marker = new BMap.Marker(point, {
						enableDragging: false
					});
					marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
					map.addOverlay(marker); //添加GPS marker
					// var label = new BMap.Label("未转换的GPS坐标（错误）", {
					// 	offset: new BMap.Size(20, -10)
					// });
					// marker.setLabel(label); //添加GPS label
				})
			},
			handler({
				BMap,
				map
			}) {
				let vm = this
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition((r) => {
					var pt = r.point;
					var x = pt.lng;
					var y = pt.lat;
					console.log("x=" + x + "   y=" + y)
					var ggPoint = new BMap.Point(x, y);
					var gc = new BMap.Geocoder();
					gc.getLocation(ggPoint, function(rs) {
						var addComp = rs.addressComponents;
						//console.log(rs.address); //地址信息
						//console.log(rs.address); //弹出当前所在地址 street
						//addressComponents: {streetNumber: "55号", street: "农轩路", district: "福田区", city: "深圳市", province: "广东省"}
						//console.log(addComp.street);
					});

					let street = "农轩路";

					//地图初始化
					var bm = new BMap.Map("allmap");
					bm.centerAndZoom(ggPoint, 15);
					bm.addControl(new BMap.NavigationControl());
					//
					var options = {
						onSearchComplete: function(results) {
							// 判断状态是否正确
							if (local.getStatus() == BMAP_STATUS_SUCCESS) {
								vm.addrList = [];
								for (var i = 0; i < results.getCurrentNumPois(); i++) {
									vm.addrLis.push(results.getPoi(i).title + ", " + results.getPoi(i)
										.address);
								}

							}
						}
					}

					this.$nextTick(() => {
						// 百度地图API功能
						var map = window.BMapGL.Map("l-map");
						map.centerAndZoom(window.BMapGL.Point(ggPoint), 15);
						var local = window.BMapGL.LocalSearch(map, options);
						local.search(street);
					})

					//添加gps marker和label
					var markergg = new BMap.Marker(ggPoint);
					bm.addOverlay(markergg); //添加GPS marker
					var labelgg = new BMap.Label("未转换的GPS坐标（错误）", {
						offset: new BMap.Size(20, -10)
					});
					markergg.setLabel(labelgg); //添加GPS label

					var translateCallback = function(data) { //坐标转换完之后的回调函数
						// console.log(data)
						// console.log(data.status)
						if (data.status === 0) {
							var marker = new BMap.Marker(data.points[0]);
							bm.addOverlay(marker);
							var label = new BMap.Label("转换的GPS坐标（正确）", {
								offset: new BMap.Size(20, -10)
							});
							marker.setLabel(label); //添加百度label
							bm.setCenter(data.points[0]);
						}
					}

					//坐标转换完之后的回调函数
					setTimeout(() => {
						var convertor = new BMap.Convertor();
						var pointArr = [];
						pointArr.push(ggPoint);
						convertor.translate(pointArr, 1, 5, translateCallback)
					}, 1000);
				})
			},
			locationbtn() {
				let map = new BMap.Map('allmap');
				let point = new BMap.Point(this.center.lng, this.center.lat);
				map.centerAndZoom(point, 15)
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition((r) => {
					if (r.point) {
						this.center.lng = r.longitude;
						this.center.lat = r.latitude;
						// console.log('您当前经纬度：' + this.center.lng + ',' + this.center.lat);
						var point = new BMap.Point(this.center.lng, this.center.lat); //用当前定位的经纬度查找省市区街道等信息

						var gc = new BMap.Geocoder();
						gc.getLocation(point, function(rs) {
							var addComp = rs.addressComponents;
							console.log(rs.address); //地址信息
							console.log(rs.address); //弹出当前所在地址
						});
						let markers = new BMap.Marker(r.point);
						map.addOverlay(markers);
						map.panTo(r.point);
						map.centerAndZoom(r.point, 16);
					}
				})
			},
			getUserLocationbtn({
				BMap,
				map
			}) {
				var vm = this;
				var geolocation = new BMap.Geolocation();
				var gc = new BMap.Geocoder();
				//弹出地理授权 获取当前的经纬度
				geolocation.getCurrentPosition(function(r) {
					if (this.getStatus() == BMAP_STATUS_SUCCESS) { //通过Geolocation类的getStatus()可以判断是否成功定位。
						var pt = r.point;
						vm.center.lng = pt.lng;
						vm.center.lat = vm.lat;
						vm.point = pt
						vm.zoom = 14
						var ggPoint = new BMap.Point(vm.center.lng, vm.center.lat);
						map.centerAndZoom(ggPoint, vm.zoom);

						gc.getLocation(pt, function(rs) {
							var addComp = rs.addressComponents;
							alert(addComp.province + addComp.city + addComp.district + addComp.street +
								addComp.streetNumber);
							// latitude:当前位置的纬度

							//               longitude:当前位置的经度
						});
					} else {
						//关于状态码  
						//BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。  
						//BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。  
						//BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。  
						//BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。  
						//BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。  
						//BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。  
						//BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)  
						//BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)  
						//BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)  
						switch (this.getStatus()) {
							case 2:
								alert('位置结果未知 获取位置失败.');
								break;
							case 3:
								alert('导航结果未知 获取位置失败..');
								break;
							case 4:
								alert('非法密钥 获取位置失败.');
								break;
							case 5:
								alert('对不起,非法请求位置  获取位置失败.');
								break;
							case 6:
								alert('对不起,当前 没有权限 获取位置失败.');
								break;
							case 7:
								alert('对不起,服务不可用 获取位置失败.');
								break;
							case 8:
								alert('对不起,请求超时 获取位置失败.');
								break;

						}
					}
				})
			}
		},
		/* activated:function() {
			var _this = this;
			var geolocation = new BMap.Geolocation();
			//弹出地理授权 获取当前的经纬度
			geolocation.getCurrentPosition(function(r) {
				if (this.getStatus() == BMAP_STATUS_SUCCESS) {
					_this.nowLat = r.point.lat;
					_this.nowLng = r.point.lng;
					_this.useBaiduMap();
				} else {
					alert("baidu return failed");
				}
			})
		} */
	};
</script>

<style>
	/* 设定地图的大小 */
	#allmap {
		height: 300px;
		/* width: 600px; */
		margin: 0 auto;
	}

	.coupon {
		/* height: 600px;
		width: 600px; */
	}
</style>
