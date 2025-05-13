<template>
    <view class="container">
        <image class="success-image" src="/static/order/success.png" mode="aspectFit"></image>
        <text class="status">转赠成功</text>
        <view class="button-box">
            <Btn name="返回首页" @tap="toIndex"></Btn>
        </view>
    </view>
</template>

<script setup>
    const toIndex = () => {
        uni.switchTab({
            url: '/pages/index/index'
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
        .button-box {
            padding: 20px 0;
            display: flex;
            column-gap: 30px;
            margin-top: 30px;
        }
    }
</style>
