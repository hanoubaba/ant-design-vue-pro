<template>
    <view class="container">
        <view class="header color-333">
            <text class="title font-bold">购物车</text>
            <view class="count color-fff">共 {{totalNum}} 件宝贝</view>
            <text class="btn" @tap="isEdit = !isEdit">{{isEdit ? '完成': '编辑'}}</text>
        </view>
        <view class="list">
            <view class="item" v-for="item in cartList" :key="item.id">
                <image class="select-icon"
                    :src="selectedIds.includes(item.id) 
                        ? `/static/shopping-cart/selected.png` 
                            : `/static/shopping-cart/not-selected.png`"
                    mode="aspectFit"
                    @tap="selectedProd(item.id)"
                    ></image>
                <view class="box">
                    <image class="product-image" :src="item.ImageFrist" mode="aspectFit"></image>
                    <view class="info">
                        <view class="name color-333 font-bold">{{item.goods_name}}</view>
                        <view class="count">
                            <text class="starfish color-red font-bold">罗特币：</text>
                            <text class="count-num color-red font-bold">{{item.goods_price}}</text>
                            <text class="exchange color-666">已兑换 {{item.num}}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>        
        <view class="footer">
            <view class="select-box" @tap="selectAll">
                <image class="select-icon"
                    :src="selectAllFlag ? `/static/shopping-cart/selected.png` 
                            : `/static/shopping-cart/not-selected.png`"
                    mode="aspectFit"></image>
                <text class="all color-666">全选</text>
            </view>
            <view class="total" v-if="!isEdit">
                <text class="color-333">合计：</text>
                <text class="color-red">罗特币</text>
                <text class="total-num color-red font-bold">{{totalPrice}}</text>
            </view>
            <view class="confirm color-fff" v-if="!isEdit" @tap="toOrder">
                选好了
            </view>
            <view class="delete" v-if="isEdit">
                <Btn name="删除" :width="90" theme="theme" @tap="doDelete"></Btn>
            </view>
        </view>
    </view>
    <uni-popup ref="dialog" type="dialog">
        <uni-popup-dialog type="info"
            title="删除提示"
            content="您确认删除该记录吗?"
            @confirm="confirm"
            ></uni-popup-dialog>
    </uni-popup>
</template>

<script setup>
    const isEdit = ref(false);
    const dialog = ref();
    const doDelete = () => {
        if(selectedIds.value.length == 0) {
            uni.showToast({
                title: '请选择要删除的宝贝',
                icon: 'none'
            })
        }
        else
            dialog.value.open();
    }
    
    const selectedIds = ref([]);
    const selectedProd = (id) => {
        const idx = selectedIds.value.indexOf(id);
        if(idx == -1) {
            selectedIds.value.push(id)
            if(selectedIds.value.length == cartList.value.length) {
                selectAllFlag.value = true;
            }
        }
        else {
            selectedIds.value.splice(idx, 1)
            selectAllFlag.value = false;
        }
    }
    
    const selectAllFlag = ref(false)
    const selectAll = () => {
        selectAllFlag.value = !selectAllFlag.value;
        if(selectAllFlag.value) {
            selectedIds.value = cartList.value.map(c => c.id);
        }
        else {
            selectedIds.value = [];
        }
    }
    
    const toOrder = () => {
        if(selectedIds.value.length == 0) {
            uni.showToast({
                title: '请选择要下单的宝贝',
                icon: 'none'
            })
        }
        else {
            uni.navigateTo({
                url: `/pages/order/order?cart_id=${selectedIds.value.join()}`
            })
        }
    }
    
    const confirm = () => {
        api.cartDel({
            data: {
                id: selectedIds.value.join()
            },
            success(res) {
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                cartIndex();
            }
        })
    }
    
    const cartList = ref([])
    const cartIndex = () => {
        api.cartIndex({
            success(res) {
                cartList.value = res.data;
            }
        })
    }
    const totalNum = computed(() => {
        return cartList.value.map(c => c.num).reduce((a, c) => a + c, 0)
    });
    const totalPrice = computed(() => {
        return cartList.value.map(c => Number(c.goods_price) * c.num).reduce((a, c) => Number(a) + Number(c), 0)
    });
    
    cartIndex();
</script>

<style lang="scss" scoped>
    .container {        
        min-height: calc(100vh - 44px);
    }
    .select-icon {
        width: 16px;
        height: 16px;
    }
    .container {
        background-color: #F2F2F2;
        padding: 15px;
        .header {
            display: flex;
            align-items: center;
            padding: 15px 0;
            .title {
                font-size: 20px;
            }
            .count {
                background-color: #2583F4;
                font-size: 12px;
                padding: 3px 10px;
                border-radius: 20px;
                margin-left: 10px;
            }
            .btn {
                margin-left: auto;
            }
        }
        .list {
            .item {
                display: flex;
                align-items: center;
                padding: 0 15px;
                background-color: #fff;
                border-radius: 10px;
                margin-bottom: 10px;
                .box {
                    margin-left: 20px;
                    display: flex;
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
            }
        }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #fff;
            .select-box {
                padding: 0 15px;
                display: flex;
                height: 100%;
                align-items: center;
                .all {
                    margin-left: 10px;
                }
            }
            .total {
                padding: 0 15px;
                display: flex;
                align-items: center;
                height: 50px;
                flex: 1;
                justify-content: flex-end;
                .total-num {
                    font-size: 18px;
                    margin-left: 5px;
                }
            }
            .confirm {
                background-color: #2583F4;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 120px;
            }
            .delete {
                width: 120px;
                display: flex;
                justify-content: center;
                align-items: center;
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
