<template>
    <view class="container">
        <image v-if="avatarUrl" class="logo" :src="avatarUrl" mode="aspectFit"></image>
        <button v-if="!avatarUrl" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="avatar-btn">
            <text class="text color-666">授权头像</text>
        </button>
        <view class="nick-box">
            <view class="name">昵称</view>
            <view class="input">
                <input
                    name="nickname"
                    type="nickname"
                    placeholder="请输入昵称"
                    v-model="nickname"
                  />
            </view>
        </view>
        <view class="button-box">
            <button open-type="getPhoneNumber" @getphonenumber="tologin" class="btn theme">授权登录</button>
        </view>
    </view>
</template>

<script setup>
    import { API_PREFIX } from '@/libs/config'
    const avatarUrl = ref();
    const nickname = ref();
    const onChooseAvatar = (e) => {
        uni.uploadFile({
            url: API_PREFIX + '/common/upload',
            filePath: e.detail.avatarUrl,
            name: 'file',
            success(res) {
                const resData = JSON.parse(res.data)
                avatarUrl.value = resData.data.fullurl;
            }
        })
    }
    const tologin = (e) => {
        if(!avatarUrl.value) {
            uni.showToast({
                title: '请选择头像',
                icon: 'none'
            })
            return;
        }
        if(!nickname.value) {
            uni.showToast({
                title: '请输入昵称',
                icon: 'none'
            })
            return;
        }
        uni.showModal({
            title: '提示',
            content: '使用前请仔细阅读《隐私保护指引》，当您点击同意后，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力如您拒绝，将无法使用该服务',
            cancelText: '拒绝',
            confirmText: '同意',
            confirmColor: '#2583F4',
            success(r) {
                if(r.confirm) {
                    uni.login({
                        provider: 'weixin',
                        success(res) {
                            const { encryptedData, iv, code } = e.detail;
                            api.userWechatMobileLogin({
                                data: {
                                    login_code: res.code,
                                    code, 
                                    pid: "0",
                                    avatar: avatarUrl.value,
                                    nickname: nickname.value
                                },
                                success(res) {
                                    const userinfo = res.data.userinfo;
                                    uni.setStorageSync('token', userinfo.token);
                                    uni.switchTab({
                                        url: '/pages/index/index'
                                    })
                                }
                            })
                        }
                    })
                }
            }
        });
    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 15px;
        min-height: calc(100vh - 44px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .avatar-btn {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            .text {
                font-size: 14px;
            }
        }
        .logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 1px solid #ccc;
        }
        .nick-box {
            display: flex;
            padding-top: 50px;
            border-bottom: 1px solid #999;
            .name {
                width: 60px;
                padding: 10px 0;
            }
            .input {
                width: 200px;
                padding: 10px 0;
            }
        }
        .button-box {
            width: 100%;
            margin-top: 100px;
        }
    }
    .btn {
        border: 1px solid #2583F4;
        border-radius: 40px;
        font-size: 14px;
        padding: 0 15px;
        margin-bottom: 20px;
    }
    .theme {
        background-color: #2583F4;
        color: #fff;
    }
</style>
