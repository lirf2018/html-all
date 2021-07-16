<template>
	<div>
		<div id="container" class="main">

		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				h: '200px'
			}
		},
		created() {
			// this.initMap();
			// this.listen();
		},
		mounted: function() {
			// 可见范围高度
			// this.h = document.documentElement.clientHeight || document.body.clientHeight;
			this.initMap();
		},
		methods: {
			initMap() { // 如果想把地图的中心固定，可以使用这个方法，我这里要求自动定位到当前位置，所以不做这个初始化处理
				console.log("map")
				//定义地图中心点坐标
				var center = new TMap.LatLng(39.984120, 116.307484)
				//定义map变量，调用 TMap.Map() 构造函数创建地图
				var map = new TMap.Map(document.getElementById('container'), {
					center: center, //设置地图中心点坐标
					zoom: 17.2, //设置地图缩放级别
					pitch: 43.5, //设置俯仰角
					rotation: 45 //设置地图旋转角度
				});
				map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
				//初始化marker
				var marker = new TMap.MultiMarker({
					id: "marker-layer", //图层id
					map: map,
					styles: { //点标注的相关样式
						"marker": new TMap.MarkerStyle({
							"width": 25,
							"height": 35,
							"anchor": {
								x: 16,
								y: 32
							},
							"src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png"
						})
					},
					geometries: [{ //点标注数据数组
						"id": "demo",
						"styleId": "marker",
						"position": center,
						"properties": {
							"title": "marker"
						}
					}]
				});
				this.getCenter(map);
				map.on("tilesloaded", this.moveMap);
			},
			getCenter(map) {
				var mapCenter = map.getCenter(); //获取地图中心点坐标
				console.log("当前地图中心为: " + mapCenter.getLat().toFixed(6) + "," + mapCenter.getLng().toFixed(6))
			},
			moveMap(){
				console.log("当前地图中心为: " + mapCenter.getLat().toFixed(6) + "," + mapCenter.getLng().toFixed(6))
			}
		},
	}
</script>

<style scoped>
	.main {
		width: 100%;
		height: 300px;
	}
</style>
