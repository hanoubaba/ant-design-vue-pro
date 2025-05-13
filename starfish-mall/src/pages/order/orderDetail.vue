<template>
    <view class="container header-bg">
        <image class="bg-image" src="/static/common/bj.png" mode="aspectFill"></image>
        <uni-nav-bar leftIcon="left" @clickLeft="back" backgroundColor="transparent" :statusBar="true"  :border="false" title="订单详情"></uni-nav-bar>
        <view class="order-info">
            <view class="box" v-for="item in order.goods" :key="item.id">
                <image class="product-image" :src="item.ImageFrist" mode="aspectFit"></image>
                <view class="info">
                    <view class="name color-333 font-bold">{{item.goods_name}}</view>
                    <view class="count">
                        <text class="starfish color-red font-bold">罗特币：</text>
                        <text class="count-num color-red font-bold">{{item.goods_price}}</text>
                        <text class="exchange color-666">已兑换 {{item.total_num}}</text>
                    </view>
                </view>
            </view>
            <view class="button-box" v-if="order.order_status == '20'">
                <Btn name="确认收货" theme="theme" @tap="confirmReceipt"></Btn>
            </view>
            <view class="item-box">
                <view class="item font-bold">
                    <view class="name color-333">商品总价</view>
                    <view class="value color-red">{{order.total_price}} 罗特币</view>
                </view>
                <view class="item font-bold">
                    <view class="name color-333">实付款</view>
                    <view class="value color-red">{{order.pay_price}} 罗特币</view>
                </view>
            </view>
        </view>
        <view class="boundary"></view>
        <view class="order-desc color-333">
            <view class="title font-bold">订单信息</view>
            <view class="desc">
                <view class="desc-item">
                    <view class="name">订单编号：</view>
                    <view class="value">{{order.order_no}}</view>
                    <view class="copy" @tap="copy(order.order_no)">复制</view>
                </view>
                <view class="desc-item">
                    <view class="name">下单时间：</view>
                    <view class="value">{{order.createtime_text}}</view>
                </view>
                
                <view class="desc-item">
                    <view class="name">支付方式：</view>
                    <view class="value">{{order.pay_method}}</view>
                </view>
                
                <view class="desc-item">
                    <view class="name">支付时间：</view>
                    <view class="value">{{order.pay_time_text}}</view>
                </view>
            </view>
        </view>
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
    const {id} = defineProps({
        id: String
    })
    const back = () => {
        uni.navigateBack()
    }
    const dialog = ref();  
    const confirmReceipt = () => {
        dialog.value.open();
    }
    const confirm = () => {
        api.orderTakeOrder({
            data: {
                id
            },
            success(res) {
                activeId.value = null;
                init();
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    }
    const copy = (str) => {
        $$.copy(str);
    }
    const order = ref({});
    const init = () => {
        api.orderDetail({
            data: {
                id
            },
            success(res) {
                order.value = res.data.order_data;
            }
        })
    }
    init();
</script>

<style lang="scss" scoped>
    .container {
        .order-info {
            position: relative;
            z-index: 2;
            padding-top: 15px;
            padding: 0 15px;
            .box {
                display: flex;
                border: 1px solid #ccc;
                padding: 15px;
                background-color: #fff;
                border-radius: 10px;
                margin: 10px 0 5px;
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
            .item-box {
                margin-top: 30px;
            }
            .item {
                display: flex;
                justify-content: space-between;
                margin: 15px 0;
            }
            .button-box {
                text-align: right;
            }
        }
        .boundary {
            position: relative;
            z-index: 2;
            background-color: #f7f7f7;
            height: 10px;
        }
        .order-desc {
            padding: 15px;
            .title {
                font-size: 17px;
            }
            .desc {
                padding: 15px 0;
                .desc-item {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    .copy {
                        margin-left: auto;
                        background-color: #2583F4;
                        color: #fff;
                        padding: 2px 5px;
                        border-radius: 5px;
                    }
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
    .header-bg {
        .bg-image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            aspect-ratio: 1.5 / 1;
            z-index: 0;
        }
    }
</style>
