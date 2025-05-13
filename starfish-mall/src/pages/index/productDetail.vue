<template>
    <view class="container">
        <image class="back-icon" @tap="back" src="/static/common/back.png" mode="aspectFit"></image>
        <view class="product-info">
            <swiper class="swiper"
                circular
                indicator-color="#fff"
                indicator-active-color="#2583F4"
                :indicator-dots="true" :autoplay="true">
                <swiper-item v-for="item in detailData.imgs_url" :key="item">
                    <view class="swiper-item">
                        <image class="product" :src="item" mode="aspectFill"></image>
                    </view>
                </swiper-item>
            </swiper>
            <view class="stock">
                <view class="progress-bar">
                    <view class="progress"></view>
                </view>
                <text class="stock-num color-theme">总库存{{detailData.total_stock}}件</text>
            </view>
            <view class="footer">
                <view class="count">
                    <text class="starfish color-red font-bold">罗特币：</text>
                    <text class="count-num color-red font-bold">{{detailData.goods_price}}</text>
                    <text class="exchange color-666">已兑换{{detailData.goods_sales}}</text>
                </view>
                <view class="desc color-333 font-bold">
                    {{detailData.goods_name}}
                </view>
            </view>
        </view>
        <view class="product-detail">
            <text class="color-333 font-bold">商品详情</text>
            <!-- <image class="detail-image" :src="detailData.image" mode="widthFix"></image> -->
            <rich-text class="content" :nodes="detailData.content"></rich-text>
        </view>
        <view class="bottom-btn">
            <view class="button-box color-fff">
                <view class="item add" @tap="addShoppingCart">加入购物车</view>
                <view class="item exchange" @tap="exchange">立即兑换</view>
            </view>
        </view>
    </view>
    <uni-popup ref="productPopup" type="bottom" background-color="#fff">
        <view class="exchange-content">
            <view class="exchange-info">
                <image class="product-image" src="/static/test/1.png" mode="aspectFit"></image>
                <view class="info">
                    <view class="name color-333 font-bold">{{detailData.goods_name}}</view>
                    <view class="count">
                        <text class="starfish color-red font-bold">罗特币：</text>
                        <text class="count-num color-red font-bold">{{detailData.goods_price}}</text>
                        <text class="exchange color-666">已兑换{{detailData.goods_sales}}</text>
                    </view>
                </view>
            </view>
            <view class="spec">
                <text class="title color-333">商品规格</text>
                <view class="list">
                    <view class="item color-333"
                        :class="{active: selectItemIdx == item.goods_spec_id}"
                        v-for="item in specData"
                        :key="item.goods_spec_id"
                        v-show="item.stock_num != -1"
                        @tap="selectItemIdx = item.goods_spec_id"
                        >{{item.spu_name}}</view>
                </view>
            </view>
            <view class="buy-num">
                <text class="color-999">购买数量</text>
                <uni-number-box @change="changeNumValue" :min="1" :width="40"/>
            </view>
            <view class="button-box">
                <Btn v-show="clickType == 1" name="加入购物车" type="big" theme="orange" @tap="toShoppingCart"></Btn>
                <Btn v-show="clickType == 2" name="立即兑换" type="big" theme="theme" @tap="toOrder"></Btn>
            </view>
        </view>
    </uni-popup>
</template>

<script setup>
    const back = () => {
        uni.switchTab({
            url: '/pages/index/index'
        })
    }
    const {id} = defineProps({
        id: String
    })
    const detailData = ref({});
    const specData = ref([]);
    const selectItemIdx = ref();
    const goodsNum = ref(1);
    const productDetail = () => {
        api.productDetail({
            data: {
                goods_id: id
            },
            success(res) {
                detailData.value = res.data.detail;
                specData.value = res.data.specData;
                selectItemIdx.value = specData.value[0].goods_spec_id;
            }
        }, false)
    }
    
    productDetail();
    
    const productPopup = ref();
    const clickType = ref() // 1: 点击购物车 2: 点击兑换
    const addShoppingCart = () => {
        const token = uni.getStorageSync('token');
        if (!token) {
            uni.navigateTo({
                url: '/pages/login/login'
            });
            return;
        }
        clickType.value = 1;
        productPopup.value.open();        
    }
    const toShoppingCart = () => {
        api.cartAdd({
            data: {
                spec_id: selectItemIdx.value, 
                num: goodsNum.value
            },
            success(res) {
                uni.showToast({
                    title: '购物车添加成功',
                    icon: 'none'
                })
                uni.navigateTo({
                    url: '/pages/shoppingCart/shoppingCart'
                })
            }
        });
    }
    const exchange = () => {
        const token = uni.getStorageSync('token');
        if (!token) {
            uni.navigateTo({
                url: '/pages/login/login'
            });
            return;
        }
        clickType.value = 2;
        productPopup.value.open();
    }
    const changeNumValue = (value) => {
        goodsNum.value = value;
    }
    const toOrder = () => {
        uni.navigateTo({
            url: `/pages/order/order?spec_id=${selectItemIdx.value}&num=${goodsNum.value}`
        })
    }
</script>

<style lang="scss" scoped>
    .product-info {
        .swiper {
            width: 100%;
            height: 300px;
            .swiper-item {
                width: 100%;
                height: 100%;
                .product {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .stock {
            height: 47px;
            background: url(/static/product/stock.png) no-repeat;
            background-size: 100% 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 15px;
            .progress-bar {
                background-color: #c9e2ff;
                height: 8px;
                width: 40%;
                border-radius: 4px;
                .progress {
                    background-color: #2583F4;
                    height: 8px;
                    width: 88%;
                    border-radius: 4px;
                }
            }
            .stock-num {
                font-size: 12px;
                font-weight: bold;
                margin-left: 15px;
            }
        }
        .footer {
            background-color: #fff;
            border-radius: 0 0 20px 20px;
            padding: 15px;
            .count {
                display: flex;
                align-items: center;
                .exchange {
                    margin-left: 20px;
                }
                .count-num {
                    font-size: 18px;
                }
            }
            .desc {
                margin-top: 10px;
            }
        }
    }
    .product-detail {
        background-color: #fff;
        padding: 15px 15px 100px;
        margin: 15px 0 100px;
        border-radius: 20px;
        .detail-image {
            margin-top: 15px;
            width: 100%;
        }
        .content {
            width: 100%;
            img {
                width: 100%;
            }
        }
        // .button-box {
        //     border-radius: 10px;
        //     overflow: hidden;
        //     display: flex;
        //     position: relative;
        //     height: 44px;
        //     margin: 15px 0;
        //     .item {
        //         height: 44px;
        //         display: flex;
        //         align-items: center;
        //         justify-content: center;
        //         position: absolute;
        //         top: 0;
        //         width: 57%;
        //     }
        //     .add {
        //         background-color: #FF7B23;
        //         clip-path: polygon(0 0, 0 100%, 80% 100%, 100% 0);
        //     }
        //     .exchange {
        //         background-color: #2583F4;
        //         clip-path: polygon(20% 0, 0 100%, 100% 100%, 100% 0);
        //         right: 0;
        //     }
        // }
    }
    .bottom-btn {
        background-color: #fff;
        padding: 15px;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        height: 80px;
    }
    .button-box {
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        position: relative;
        height: 44px;
        margin: 15px 0;
        width: 100%;
        .item {
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            width: 57%;
        }
        .add {
            background-color: #FF7B23;
            clip-path: polygon(0 0, 0 100%, 80% 100%, 100% 0);
        }
        .exchange {
            background-color: #2583F4;
            clip-path: polygon(20% 0, 0 100%, 100% 100%, 100% 0);
            right: 0;
        }
    }
    .exchange-content {
        padding: 15px;
        .exchange-info {
            display: flex;
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
        .spec {
            padding: 15px 0;
            .list {
                padding: 15px 0;
                display: flex;
                column-gap: 10px;
                flex-wrap: wrap;
                row-gap: 10px;
                .item {
                    background-color: #f5f5f5;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 5px;
                    padding: 0 20px;
                    border: 1px solid #f5f5f5;
                    &.active {
                        border-color: #2583F4;
                        color: #2583F4;
                        background-color: #f1f7ff;
                        font-weight: bold;
                    }
                }
            }
        }
        .buy-num {
            font-size: 13px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .button-box {
            padding: 50px 0;
        }
    }
</style>
