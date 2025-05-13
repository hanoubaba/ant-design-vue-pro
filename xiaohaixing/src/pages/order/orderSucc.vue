<template>
    <view class="container">
        <image class="success-image" src="/static/order/success.png" mode="aspectFit"></image>
        <text class="status">支付成功</text>
        <view class="desc color-999">支付成功，可在个人中心查看我的订单</view>
        <view class="button-box">
            <Btn name="返回首页" @tap="toIndex"></Btn>
            <Btn name="查看订单" @tap="toOrderList" theme="theme"></Btn>
        </view>
    </view>
</template>

<script setup>
    const toIndex = () => {
        uni.switchTab({
            url: '/pages/index/index'
        })
    }
    const toOrderList = () => {
        uni.navigateTo({
            url: '/pages/order/orderList'
        })
    }
</script>

<style lang="scss" scoped>
    .container {
        min-height: calc(100vh - 44px);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30px;
        .success-image {
            width: 215px;
            height: 215px;
        }
        .status {
            font-size: 20px;
        }
        .desc {
            padding: 15px 0;
        }
        .button-box {
            padding: 20px 0;
            display: flex;
            column-gap: 30px;
        }
    }
</style>
