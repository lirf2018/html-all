<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<div class="coupon">
			<baidu-map id="allmap" @ready="handler"></baidu-map>
		</div>
		<button @click="locationbtn()">测试</button>&nbsp;&nbsp;
		<button @click="getUserLocationbtn()">获取当前定位</button>&nbsp;&nbsp;
		<button @click="getUserLocationbtn3()">获取当前定位1</button>&nbsp;&nbsp;
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
				point: '0',
				center: {
					nowLng: 0,
					point: {},
					marker: {},
					map: {},
					lng: 0,
					lat: 0
				},
				zoom: 15
			};
		},
		created() {
			this.$nextTick(()=>{
			  this.getLocation()
			  let watch1 = window.navigator.geolocation.watchPosition(this.getLocation); // watchPosition()方法：不停的获取和更新用户的地理位置信息，执行间隔时间0ms；当设备地理位置发生改变时，自动调用；  好像删除也么有影响
			  console.log(watch1) 
			    //清除watch1
			  window.navigator.geolocation.clearWatch(watch1);
			})
		},
		methods: {
			handler({
				BMap,
				map
			}) {
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition((r) => {
					var pt = r.point;
					var x = pt.lng;
					var y = pt.lat;
					// console.log("x=" + x + "   y=" + y)
					var ggPoint = new BMap.Point(x, y);
					//地图初始化
					var bm = new BMap.Map("allmap");
					bm.centerAndZoom(ggPoint, 15);
					bm.addControl(new BMap.NavigationControl());
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
			mapReady({
				BMap,
				map
			}) {
				// 选择一个经纬度作为中心点 longitude=114.02597366    latitude=22.54605355
				this.point = new BMap.Point(114.02597366, 22.54605355);
				map.centerAndZoom(this.point, 15);
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
			},
			getUserLocationbtn2() {
				//getCurrentPosition与定时器setInterval类似多次请求，因为位置需要不间断的获取
				//直接navigator.geolocation表示单次获取位置
				navigator.geolocation.getCurrentPosition(function(position) {
					alter("经度" + position.coords.longitude);
					alter("纬度" + position.coords.latitude);
					alter("准确度" + position.coords.accuracy);
					alter("海拔" + position.coords.altitude);
					alter("海拔准确度" + position.coords.altitudeAcuracy);
					alter("行进方向" + position.coords.heading);
					alter("地面速度" + position.coords.speed);
					alter("请求的时间" + new Date(position.timestamp));
					console.log("=============================================")
				}, function(err) {
					alert(err.code);
					// code：返回获取位置的状态
					//          0  :  不包括其他错误编号中的错误
					// ​		     1  :  用户拒绝浏览器获取位置信息
					// ​		     2  :  尝试获取用户信息，但失败了
					// ​		     3  :   设置了timeout值，获取位置超时了
				}, {
					enableHighAcuracy: false, //位置是否精确获取
					timeout: 5000, //获取位置允许的最长时间
					maximumAge: 1000 //多久更新获取一次位置
				})
			},
			getUserLocationbtn3(){
				navigator.geolocation.getCurrentPosition(position => {
				  alert("纬度："+position.coords.latitude+"；经度："+position.coords.longitude)
				});
			},
			success(){
				alert()
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
