<template>
    <view class="container">
        <view class="order-info">
            <view class="box" v-for="item in order.goods_list" :key="item.goods_id">
                <image class="product-image" :src="item.ImageFrist" mode="aspectFit"></image>
                <view class="info">
                    <view class="name color-333 font-bold">{{item.goods_name}}</view>
                    <view class="count">
                        <text class="starfish color-red font-bold">海星：</text>
                        <text class="count-num color-red font-bold">{{item.goods_price}}</text>
                        <text class="exchange color-666">已兑换 {{item.num}}</text>
                    </view>
                </view>
            </view>
            <view class="leave-word">
                <view class="color-333">留言：</view>
                <view class="content">
                    <textarea class="input" placeholder="选填，建议留言前与商家沟通确认" v-model="remark"/>
                </view>
            </view>
        </view>
        <!-- <view class="info-item color-333">
            <text class="name">商品金额</text>
            <text class="value">¥{{order.total_price}}</text>
        </view> -->
        <view class="info-item color-333">
            <text class="name">支付方式</text>
            <text class="value">{{order.pay_method}}</text>
        </view>
        <view class="footer">
            <view class="total">
                <text class="color-333">合计：</text>
                <text class="total-num color-red font-bold">{{order.total_price}}</text>
            </view>
            <view class="toexchange color-fff" @tap="submit">
                去兑换
            </view>
        </view>
    </view>
    <uni-popup ref="dialog" type="dialog">
        <uni-popup-dialog type="info" cancelText="取消" 
            confirmText="知道了"
            title="提示"
            :content="resMsg"
            icon="/static/common/message-icon.png"
            ></uni-popup-dialog>
    </uni-popup>
</template>

<script setup>
    const {spec_id, num, cart_id} = defineProps({
        spec_id: {
            type: String
        }, 
        num: {
            type: String
        },
        cart_id: {
            type: String
        }
    })
    
    const dialog = ref();
    const confirm = () => {
        uni.navigateTo({
            url: '/pages/order/orderSucc'
        })
    }
    const remark = ref();
    const resMsg = ref();
    const submit = () => {
        api.orderPay({
            data: {
                spec_id: spec_id ? Number(spec_id): null,
                num: num ? Number(num): null,
                cart_id,
                remark: remark.value
            },
            success(res) {
                uni.navigateTo({
                    url: '/pages/order/orderSucc'
                })
            },
            error(res) {
                resMsg.value = res.msg;
                dialog.value.open();
            }
        })
    }
    const order = ref({});
    const init = () => {
        api.orderPrepare({
            data: {
                spec_id,
                num,
                cart_id
            },
            success(res) {
                order.value = res.data;
            }
        })
    }
    init();
</script>

<style lang="scss" scoped>
    .container {
        background-color: #F8F8F8;
        min-height: calc(100vh - 44px);
    }
    .order-info {
        border-top: 1px solid #ccc;
        background-color: #fff;
        padding: 0 15px;
        .box {
            display: flex;
            border-bottom: 1px solid #ccc;
            padding: 15px 0;
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
        .leave-word {
            display: flex;
            padding: 20px 0;
            .content {
                flex: 1;
                .input {
                    width: 100%;
                    height: 45px;
                    font-size: 14px;
                }
            }
        }
    }
    .info-item {
        padding: 20px 15px;
        background-color: #fff;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
    }
    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .total {
            padding: 0 15px;
            background-color: #fff;
            display: flex;
            align-items: center;
            height: 50px;
            flex: 1;
            .total-num {
                font-size: 18px;
            }
        }
        .toexchange {
            background-color: #2583F4;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
        }
    }
    :deep(.uni-dialog-button.uni-border-left) {        
        background-color: #2583F4;
        .uni-dialog-button-text {
            color: #fff;
        }
    }
</style>
