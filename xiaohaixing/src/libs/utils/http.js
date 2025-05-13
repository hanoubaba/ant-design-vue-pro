import { API_PREFIX } from '@/libs/config';

const toLogin = () => {
    uni.showToast({
        title: '请登录后操作',
        icon: 'error'
    })
    uni.redirectTo({
        url:'/pages/login/login'
    });
    uni.removeStorageSync('token');
}
const request = (method, url, params, useToken = true) => {
    const { header = {}, success = () => {}, error } = params;
    const token = uni.getStorageSync('token');
    // 除了需要验证登录的接口 其他非需要验证登录的接口也默认加上token
    if(useToken && !token) {
        toLogin();
    }
    $$.delete(params, ['header']);
    header.token = token;
    
    $$.delete(params, ['error', 'url', 'method', 'success']);
    uni.showLoading({title: '加载中...'});
    return uni.request({
        url: `${API_PREFIX}/${url}`,
        method,
        header,
        ... params,
        success(res) {
            if(res?.data?.code == 401) {
                toLogin();
                return;
            }
            const resData = res?.data || {msg: '请求繁忙请稍等'}
            if(resData.code == 1) {
                success(resData);
            }
            else {
                if(error) {
                    error(resData)
                }
                else {                    
                    uni.showModal({
                        title: '提示',
                        content: resData.msg,
                        showCancel: false,
                        confirmColor: '#F1411D'
                    })
                }
            }
        },
        fail(err) {
            uni.showToast({
                title: '请求繁忙请稍等',
                icon: 'error'
            })
            console.error(err)
        },
        complete(res) {
            uni.hideLoading()
        }
    })
}
const assemble = (url) => (typeof(url) === 'string') ? {name: $$.camel(url), url} : {name: Object.keys(url)[0], url: Object.values(url)[0]};
const createApi = (list, method) => {
    const api = {};
    list.forEach(item => {
        const {name, url} = assemble(item);
        api[name] = (params, token) => request(method, url, params, token);
    })
    return api;
}
export const createGetApi = (list) => createApi(list, 'GET');
export const createPostApi = (list) => createApi(list, 'POST');