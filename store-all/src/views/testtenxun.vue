<template>
    <div>
        <iframe id="mapPage" width="100%" :height="h" frameborder=0
            src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=4LPBZ-BJZLR-CJNWY-WQK47-DHU43-Z7FKE&referer=myapp">
        </iframe>
    </div>
</template>

<script>
export default {
    data(){
        return{
			h:'200px'
        }
    },
    created(){
        // this.initMap();
        this.listen();
    },
	mounted:function(){
		// 可见范围高度
		this.h = document.documentElement.clientHeight || document.body.clientHeight;
		
	},
    methods:{
        // initMap() { // 如果想把地图的中心固定，可以使用这个方法，我这里要求自动定位到当前位置，所以不做这个初始化处理
        //     console.log("map")
        //     //定义地图中心点坐标
        //     var center = new TMap.LatLng(39.984120, 116.307484)
        //     //定义map变量，调用 TMap.Map() 构造函数创建地图
        //     var map = new TMap.Map(document.getElementById('container'), {
        //         center: center,//设置地图中心点坐标
        //         zoom: 17.2,   //设置地图缩放级别
        //         pitch: 43.5,  //设置俯仰角
        //         rotation: 45    //设置地图旋转角度
        //     });
        // },
        listen() {
            window.addEventListener('message', function(event) {
                // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                var loc = event.data;
                if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                    console.log('location', loc); // 获取的选中的地址数据
                }
				let dd = document.getElementById("mapPage").innerHTML;
				 console.log(dd); // 获取的选中的地址数据
				
                return false
            }, false);
        }
		
		
    },
}
</script>

<style  scoped>
    .main{
        width:100%;
        height:150px;
    }
	
	>>>.active{
		background-image: url(fruits/card.png);
	}
</style>