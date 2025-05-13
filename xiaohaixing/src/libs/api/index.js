import {createPostApi} from '@/libs/utils/http'
export default createPostApi([
    'user/mobilelogin',
    'user/wechatMobileLogin',
    {userInfo: 'user/info'},
    'user/score',
    'user/score_log',
    'user/give_log',
    'user/give',
    {userList: 'user/user_list'},
    'index/init',
    'index/rank_list',
    'product/index',
    'product/category',
    'product/detail',
    'order/prepare',
    'order/index',
    'order/detail',
    'order/take_order',
    'order/pay',
    'cart/index',
    {cartAdd: 'cart/add_cart'},
    {cartDel: 'cart/del_cart'}
]);
