<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="my-jf">
			<span>可用积分</span>
			<span>1000</span>
		</div>
		<div class="jf-items">
			<van-tabs v-model="active" color="#008000">
				<van-tab title="积分记录">
					<van-list v-model="loadingA" :finished="finishedA" finished-text="没有更多了" @load="onLoadA">
						<div class="no-list" v-show="!showJf">
							<span><van-icon name="bookmark-o" /></span>
							<span>暂无积分记录</span>
						</div>
						<div class="ji-list" v-show="showJf">
							<div class="list-title">
								<div><span>事项</span></div>
								<div><span>分值</span></div>
								<div><span>时间</span></div>
							</div>
							<div style="width: 100%;clear: both;height: 35px;"></div>
							<div class="list-items">
								<div class="item-info" v-for="(item, index) in jiList" :key="index">
									<span>{{ item.title }}</span>
									<span>+{{ item.score }}</span>
									<span>{{ item.date }}</span>
								</div>
							</div>
							<div style="width: 100%;clear: both;"></div>
						</div>
					</van-list>
				</van-tab>
				<van-tab title="兑换记录">
					<van-list v-model="loadingB" :finished="finishedB" finished-text="没有更多了" @load="onLoadB">
						<div class="no-list" v-show="!showRecord">
							<span><van-icon name="bookmark-o" /></span>
							<span>暂无兑换记录</span>
						</div>
						<div class="ji-change-record" v-show="showRecord">
							<div class="list-title">
								<div><span>事项</span></div>
								<div><span>分值</span></div>
								<div><span>时间</span></div>
							</div>
							<div style="width: 100%;clear: both;height: 35px;"></div>
							<div class="list-items">
								<div class="item-info" v-for="(item, index) in changeList" :key="index">
									<span>{{ item.title }}</span>
									<span>-{{ item.score }}</span>
									<span>{{ item.date }}</span>
								</div>
							</div>
							<div style="width: 100%;clear: both;"></div>
						</div>
					</van-list>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '我的积分',
			active: 1,
			jiList: [],
			changeList: [],
			loadingB: false,
			finishedB: false,
			refreshingB: false,
			loadingA: false,
			finishedA: false,
			refreshingA: false,
			showRecord: false,
			showJf: false,
			testindexA: 0,
			testindexB: 0
		};
	},
	mounted() {
		this.showJf = true;
		this.showRecord = true;
	},
	methods: {
		onLoadB() {
			setTimeout(() => {
				console.log('------------' + this.changeList.length);
				for (let i = 0; i < 10; i++) {
					this.testindexB = this.testindexB + 1;
					var obj = {
						title: '事项B-' + this.testindexB,
						score: 10000,
						date: '2018-01-01'
					};
					this.changeList.push(obj);
				}
				this.loadingB = false;

				if (this.changeList.length >= 40) {
					this.finishedB = true;
				}
				this.showRecord = this.changeList.length > 0 ? true : false;
			}, 1000);
		},
		onRefreshB() {
			// 清空列表数据
			this.finishedB = false;

			// 重新加载数据
			// 将 loading 设置为 true，表示处于加载状态
			this.loadingB = true;
			this.onLoadB();
			this.showRecord = this.changeList.length > 0 ? true : false;
		},
		onLoadA() {
			setTimeout(() => {
				for (let i = 0; i < 10; i++) {
					this.testindexA = this.testindexA + 1;
					var obj = {
						title: '事项A-' + this.testindexA,
						score: 10000,
						date: '2018-01-01'
					};
					this.jiList.push(obj);
				}
				this.loadingA = false;

				if (this.jiList.length >= 40) {
					this.finishedA = true;
				}
				this.showji = this.jiList.length > 0 ? true : false;
			}, 1000);
		},
		onRefreshA() {
			// 清空列表数据
			this.finishedA = false;

			// 重新加载数据
			// 将 loading 设置为 true，表示处于加载状态
			this.loadingA = true;
			this.onLoadA();
			this.showji = this.jiList.length > 0 ? true : false;
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

.my-jf {
	background-color: #008000;
	color: #ffffff;
	font-size: 16px;
	text-align: center;
	padding: 2.2rem 0;
	position: fixed !important;
	width: 100%;
	z-index: 9999999;
	font-weight: bold;
}

.my-jf > span {
	display: block;
}

.my-jf > span:last-child {
	padding-top: 5px;
	font-size: 20px;
}

.no-list {
	text-align: center;
	color: #c3cbd6;
	padding-top: 3rem;
}

.no-list > span {
	display: block;
}
.no-list > span:last-child {
	font-size: 16px;
}
/*  */
.ji-list,
.ji-change-record {
	font-size: 16px;
	color: #323233;
	width: 100%;
	margin-top: 6.8rem !important;
}

.list-items {
	margin-top: 5rem;
	font-size: 14px;
}

.list-title {
	margin-top: 3.5rem !important;
	position: fixed;
	width: 100%;
	z-index: 999;
	background-color: #ffffff;
}

.list-title > div > span {
	border-right: 1px solid #ebedf0;
	display: block;
	padding: 10px 0;
	border-bottom: 1px solid #f0f0f0;
}
.list-title > div > span:last-child {
	border: nones;
}
.list-title,
.item-info {
	text-align: center;
	overflow: hidden;
	padding: 8px 0;
}

.item-info {
	background-color: #ffffff;
	border-bottom: 1px solid #f0f0f0;
	color: #657180;
}

.list-title > div,
.item-info > span {
	float: left;
	width: 33.3%;
	display: block;
}
>>> .van-tabs__wrap,
.van-hairline--top-bottom {
	position: fixed !important;
	width: 100%;
	z-index: 999999;
	padding: 10px 0;
}


.van-tab{
	font-size: 16px !important;
}

</style>
