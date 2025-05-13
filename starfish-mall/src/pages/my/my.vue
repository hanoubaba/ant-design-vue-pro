<template>
    <view class="container header-bg">
        <image class="bg-image" src="/static/common/bj.png" mode="aspectFill"></image>
        <view class="header">
            <view class="big-title">
                <text class="text">个人中心</text>
            </view>
            <view class="info">
                <view class="head">
                    <image class="head-image" :src="userInfo.avatar" mode="aspectFit"></image>
                </view>
                <view class="desc">
                    <view class="name color-fff">{{userInfo.nickname}}</view>
                    <view class="mobile color-fff">{{userInfo.mobile}}</view>
                </view>
            </view>
            <view class="card">
                <view class="title">
                    <image class="icon" src="/static/common/starfish.png" mode="aspectFit"></image>
                    <text class="text1">罗特</text>
                    <text class="text2 color-red">商城</text>
                    <image class="corner" src="/static/common/card-corner.png" mode="aspectFit"></image>
                </view>
                <image class="card-bg" src="/static/common/starfish-logo.png" mode="aspectFit"></image>
                <view class="content">
                    <text class="value color-red">{{userInfo.score}}</text>
                    <text class="name">罗特币数量</text>
                </view>
            </view>
        </view>
        <view class="order">
            <view class="order-header">
                <text class="title">我的订单</text>
                <view class="order-all" @tap="toOrderList('0')">
                    <text class="show color-999">查看全部</text>
                    <image class="arrow" src="/static/my/arrow-right.png" mode="aspectFit"></image>
                </view>
            </view>
            <view class="status-list">
                <view class="item" @tap="toOrderList('0')">
                    <image class="icon" src="/static/my/order-all.png" mode="aspectFit"></image>
                    <text class="name color-333">全部订单</text>
                </view>
                <view class="item" @tap="toOrderList('10')">
                    <image class="icon" src="/static/my/order-place.png" mode="aspectFit"></image>
                    <text class="name color-333">已下单</text>
                </view>
                <view class="item" @tap="toOrderList('20')">
                    <image class="icon" src="/static/my/order-deliver.png" mode="aspectFit"></image>
                    <text class="name color-333">已发货</text>
                </view>
                <view class="item" @tap="toOrderList('30')">
                    <image class="icon" src="/static/my/order-complete.png" mode="aspectFit"></image>
                    <text class="name color-333">已完成</text>
                </view>
            </view>
        </view>
        <view class="button-box">
            <Btn name="退出登录" type="big" @tap="exit"></Btn>
        </view>
    </view>
    <uni-popup ref="dialog" type="dialog">
        <uni-popup-dialog type="info"
            title="提示"
            content="是否要退出登录?"
            @confirm="confirm"
            ></uni-popup-dialog>
    </uni-popup>
</template>

<script setup>
    const dialog = ref();    
    const exit = () => {
        dialog.value.open();
    }
    const confirm = () => {
        uni.removeStorageSync('token');
        uni.redirectTo({
            url: '/pages/login/login'
        })
    }
    const toOrderList = (status) => {
        uni.navigateTo({
            url: `/pages/order/orderList?status=${status}`
        })
    }
    const userInfo = ref({});
    const init = () => {
        api.userInfo({
            success(res) {
                userInfo.value = res.data.user_data;
            }
        })
    }
    onShow(init);
</script>

<style lang="scss" scoped>
    .container {
        padding: 15px;
        min-height: calc(100vh - 50px);
    }
    .header-bg {
        .bg-image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            aspect-ratio: 1.5 / 1;
            z-index: 1;
        }
    }
    .header {
        position: relative;
        z-index: 2;
        padding: 15px 0;
        .big-title {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            column-gap: 5px;
            .text {
                font-size: 18px;
                color: #fff;
            }
        }
        .info {
            display: flex;
            height: 100px;
            align-items: center;
            column-gap: 15px;
            .head-image {
                width: 60px;
                height: 60px;
                border-radius: 30px;
            }
            .desc {
                display: flex;
                flex-direction: column;
                row-gap: 10px;
                .name {
                    font-size: 18px;
                }
                .mobile {
                    font-size: 10px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    padding-left: 22px;
                    background: url(/static/my/mobile-bar.png) no-repeat;
                    background-size: contain;
                }
            }
        }
        .card {
            background-color: #e9f3ff;
            border-radius: 13px;
            padding-bottom: 15px;
            position: relative;
            .title {
                display: flex;
                align-items: center;
                height: 40px;
                margin-left: 15px;
                font-weight: bold;
                .icon {
                    width: 30px;
                    height: 30px;
                }
                .corner {
                    height: 40px;
                    width: auto;
                    margin-left: auto;
                    aspect-ratio: 3.585 / 1;
                }
            }
            .card-bg {
                width: 132px;
                height: 106px;
                position: absolute;
                top: -60px;
                right: -20px;
            }
            .content {
                margin: 0 10px;
                background-color: #fff;
                padding: 10px 20px;
                border-radius: 15px;
                display: flex;
                flex-direction: column;
                .value {
                    font-size: 26px;
                    font-weight: bold;
                }
                .name {
                    font-size: 10px;
                }
            }
        }
    }
    .order {
        background-color: #fff;
        border-radius: 10px;
        .order-header {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #F3F3F3;
            padding: 10px 15px;
            justify-content: space-between;
            .title {
                font-size: 15px;
            }
            .order-all {
                display: flex;
                align-items: center;
            }
            .show {
                margin-left: auto;
                font-size: 13px;
            }
            .arrow {
                width: 13px;
                height: 13px;
            }
        }
        .status-list {
            display: flex;
            justify-content: space-around;
            padding: 15px 0;
            .item {
                display: flex;
                flex-direction: column;
                align-items: center;
                .name {
                    font-size: 13px;
                }
            }
            .icon {
                width: 40px;
                height: 40px;
            }
        }
    }
    .button-box {
        position: absolute;
        bottom: 50px;
        width: calc(100% - 30px);
    }
    :deep(.uni-dialog-button.uni-border-left) {
        background-color: #2583F4;
        .uni-dialog-button-text {
            color: #fff;
        }
    }
</style>
