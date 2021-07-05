<template>
	<div>
		<van-picker show-toolbar title="选择日期" :columns="columns" @cancel="onCancel_" @confirm="onConfirm_" />
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head
		},
		props: ['onConfirm', 'onCancel'],
		data() {
			return {
				columns: []
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.getDateList();
			});
		},
		methods: {
			getDateList() {
				let vm = this;
				let params = {
					req_type: 'get_date_list',
					data: {
					
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.columns = res.data.date_list;
					} else {
						Toast(res.resp_desc);
					}
				}).catch(err => {
					// this.error = true;
				})
			},
			onConfirm_(value) {
				this.onConfirm(value);
			},
			onCancel_() {
				this.onCancel();
			}
		}
	};
</script>

<style scoped>
	>>>.van-picker-column__item {
		color: grey !important;
	}

	>>>.van-picker-column__item--selected {
		color: #008000 !important;
	}
</style>
