<template>
    <view class="container">
        <view class="date-title color-999">已选择日期</view>
        <view class="date color-333">
            <view class="name font-bold">请选择</view>
            <view class="select-date">
                <view class="font-bold" @tap="selectDate">选择日期{{ params.month ? `(${params.month})`: ''}}</view>
                <image class="date-icon" src="/static/common/date-icon.png" mode="aspectFit"></image>
            </view>
        </view>
        <view class="data-box">
            <scroll-view scroll-y="true" class="data-list" @scrolltolower="nextPage">
                <view class="item font-bold" v-for="item in data" :key="item.id">
                    <image class="head" :src="item.accept_user_data.avatar" mode="aspectFit"></image>
                    <view class="left">
                        <view class="name color-333">{{item.accept_user_data.nickname}}</view>
                        <view class="date-value color-999">{{item.score}}</view>
                    </view>
                    <view class="right">
                        <text class="value color-theme">{{item.score}}</text>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>    
    <uni-popup ref="datePopup" type="bottom" background-color="transparent">
        <view class="date-box">
            <view class="bar font-bold">
                <view class="cancel color-theme" @tap="closeDate">取消</view>
                <view class="title">月份</view>
                <view class="confirm color-theme" @tap="confirmDate">确定</view>
            </view>
            <picker-view indicator-style="height: 50px;" :value="value" @change="bindDateChange" class="picker-view">
                <picker-view-column>
                    <view class="item" v-for="(item, index) in years" :key="index">{{item}}年</view>
                </picker-view-column>
                <picker-view-column>
                    <view class="item" v-for="(item, index) in months" :key="index">{{item}}月</view>
                </picker-view-column>
            </picker-view>
        </view>
    </uni-popup>
</template>

<script setup>
    import usePage from '@utils/page'
    
    const year = new Date().getFullYear();
    const years = ref([]);
    for(let y = year - 5; y <= year; y ++) years.value.push(y);
    const months = ref([]);
    for(let m = 1; m <= 12; m ++) months.value.push(m);
    const value = ref([0, 0])
    
    const selectDate = () => {
        params.month = '';
        datePopup.value.open();
    }
    const datePopup = ref();
    const closeDate = () => {
        datePopup.value.close();
    }
    const confirmDate = () => {
        datePopup.value.close();
        params.month = years.value[value.value[0]] + '-' + months.value[value.value[1]];
        loadList();
    }
    const bindDateChange = (e) => {
        value.value = e.detail.value;
    }
    
    const params = reactive({month: null})
    const {
        hasNext,
        data,
        nextPage,
        loadList
    } = usePage(api.userGiveLog, params);    
    const init = () => {
        loadList();
    }
    init();
</script>

<style lang="scss" scoped>
    .container {
        background-color: #f7f7f7;
        min-height: calc(100vh - 44px);
        padding: 15px;
        .date-title {
            font-size: 13px;
        }
        .date {
            font-size: 15px;
            display: flex;
            align-items: center;
            padding: 15px 0;
            .select-date {
                margin-left: auto;
                display: flex;
                align-items: center;
            }
            .date-icon {
                margin-left: 5px;
                width: 16px;
                height: 16px;
            }
        }
        .data-box {
            border-radius: 10px;            
            .data-list {
                display: flex;
                flex-direction: column;
                height: calc(100vh - 150px);
                .item {
                    padding: 15px;
                    background-color: #fff;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    .head {
                        height: 55px;
                        width: 55px;
                        border-radius: 50%;
                    }
                    .name {
                        font-size: 15px;
                    }
                    .date-value {
                        font-size: 12px;
                        padding: 15px 0 0;
                    }
                    .left {
                        margin-left: 10px;
                    }
                    .right {
                        text-align: right;
                        margin-left: auto;
                        .value {
                            font-size: 18px;
                        }
                    }
                }
            }
        }
    }
    .date-box {
        background-color: #fff;
        border-radius: 15px 15px 0 0;
        overflow: hidden;
        padding: 15px;
        .bar {
            display: flex;
            justify-content: space-between;
            .cancel, .confirm {
                padding: 0 15px;
            }
            .title {
                font-size: 15px;
            }
        }
        .picker-view {
            height: 250px;
            .item {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>
