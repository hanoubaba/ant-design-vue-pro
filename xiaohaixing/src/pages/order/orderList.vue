<template>
    <uni-nav-bar leftIcon="left" @clickLeft="goBack" :statusBar="true" :border="false" title="我的订单"></uni-nav-bar>
    <view class="container">
        <view class="tabs color-333">
            <view class="tab" :class="{active: params.status == '0'}" @tap="selectTab('0')">
                <text class="title">全部</text>
                <view class="active-line"></view>
            </view>
            <view class="tab" :class="{active: params.status == '10'}" @tap="selectTab('10')">
                <text class="title">已下单</text>
                <view class="active-line"></view>
            </view>
            <view class="tab" :class="{active: params.status == '20'}" @tap="selectTab('20')">
                <text class="title">已发货</text>
                <view class="active-line"></view>
            </view>
            <view class="tab" :class="{active: params.status == '30'}" @tap="selectTab('30')">
                <text class="title">已完成</text>
                <view class="active-line"></view>
            </view>
        </view>
        <scroll-view scroll-y="true" class="data-list" @scrolltolower="nextPage">
            <view class="item" v-for="item in data" :key="item.id" @tap="toDetail(item.id)">
                <view class="header">
                    <text class="order-num color-333">订单编号：{{item.order_no}}</text>
                    <text class="status color-theme">{{item.order_status_text}}</text>
                </view>
                <view class="product-item">
                    <view class="box" v-for="p in item.goods" :key="p.id">
                        <image class="product-image" :src="p.ImageFrist" mode="aspectFit"></image>
                        <view class="info">
                            <view class="name color-333 font-bold">{{p.goods_name}}</view>
                            <view class="count">
                                <text class="starfish color-red font-bold">海星：</text>
                                <text class="count-num color-red font-bold">{{p.goods_price}}</text>
                                <text class="exchange color-666">已兑换 {{p.total_num}}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="footer">
                    <text class="total">合计：</text>
                    <text class="color-red font-bold">海星</text>
                    <text class="num color-red font-bold">{{item.total_price}}</text>
                </view>
                <view class="button-box" v-if="item.order_status == '20'">
                    <Btn name="确认收货" theme="theme" @tap.stop="takeOrder(item.id)"></Btn>
                </view>
            </view>
        </scroll-view>
    </view>
    <uni-popup ref="dialog" type="dialog">
        <uni-popup-dialog type="info"
            title="提示"
            content="您确认收到货物吗?"
            @confirm="confirm"
            ></uni-popup-dialog>
    </uni-popup>
</template>

<script setup>
    const goBack = () => {
        uni.switchTab({
            url: '/pages/my/my'
        })
    }
    const {status} = defineProps({
        status: {
            type: String,
            default: '0'
        }
    })
    const toDetail = (id) => {
        uni.navigateTo({
            url: `/pages/order/orderDetail?id=${id}`
        })
    }
    const activeId = ref();
    const dialog = ref();
    const takeOrder = (id) => {
        activeId.value = id;
        dialog.value.open();        
    }
    const confirm = () => {
        api.orderTakeOrder({
            data: {
                id: activeId.value
            },
            success(res) {
                activeId.value = null;
                loadList();
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    }
        
    const hasNext = ref(true);
    const data = ref([]);
    const nextPage = () => {
        if(hasNext.value) {
            params.page = params.page + 1;
            orderList();
        }
    }
    const params = reactive({
        page: 1,
        limit: 10,
        status: status
    });
    
    const selectTab = (status) => {
        params.status = status;
        loadList();
    }
    const orderList = () => {
        api.orderIndex({
            data: params,
            success(res) {
                if(res.data.length < params.limit) {
                    hasNext.value = false;
                }
                data.value.push(...res.data);
            }
        })
    }
    
    const loadList = () => {
        params.page = 1;
        hasNext.value = true;
        data.value = [];
        orderList();
    }
    
    loadList();
</script>

<style lang="scss" scoped>
    .container {
        min-height: calc(100vh - 44px);
        height: calc(100vh - 44px);
        background-color: #f7f7f7;
        .tabs {
            display: flex;
            height: 45px;
            .tab {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .title {
                    line-height: 41px;
                }
                .active-line {
                    height: 4px;
                    width: 24px;
                }
                &.active {
                    font-weight: bold;
                    color: #2583F4;
                    .active-line {
                        background-color: #2583F4;
                    }
                }
            }
        }
        .data-list {
            height: calc(100% - 45px);
            .item {
                background-color: #fff;
                margin-bottom: 10px;
                .header {
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #ccc;
                }
                .box {
                    display: flex;
                    border-bottom: 1px solid #ccc;
                    padding: 15px;
                    .product-image {
                        width: 85px;
                        height: 85px;
                    }
                    .info {
                        padding: 10px 15px;
                        display: flex;
                        flex-direction: column;
                        row-gap: 20px;
                        .count {
                            display: flex;
                            align-items: center;
                            .count-num {
                                font-size: 18px;
                            }
                            .exchange {
                                margin-left: 20px;
                            }
                        }
                    }            
                }
                .footer {
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    .num {
                        font-size: 18px;
                        margin-left: 3px;
                    }
                }
                .button-box {
                    text-align: right;
                    padding: 0 15px 10px;
                }
            }
        }
    }
    :deep(.uni-dialog-button.uni-border-left) {
        background-color: #2583F4;
        .uni-dialog-button-text {
            color: #fff;
        }
    }
</style>
