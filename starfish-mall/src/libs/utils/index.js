const $cache = {};
export default {
    debounce(func, id = '', wait = 500) {
        let debounceTimerId = `debounceTimerId_${id}`;
        if ($cache[debounceTimerId]) {
            clearTimeout($cache[debounceTimerId])
            Reflect.deleteProperty($cache, debounceTimerId)
        }
        $cache[debounceTimerId] = setTimeout(func, wait)
    },
    required: (params) => {
        if(!params) return false;
        for(let [k, v] of Object.entries(params)) {
            if(v === undefined || v == null || v.toString().trim().length == 0) return false;
        }
        return true;
    },
    clear: (obj, field) => {
        for (const key in obj) {
            (!field || field == key || field.includes(key)) && Reflect.set(obj, key, null)
        }
    },
    delete: (obj, field) => {
        for (const key in obj) {
            (!field || field == key || field.includes(key)) && Reflect.deleteProperty(obj, key)
        }
    },
    clone: (target, source) => {
        for(let [k, v] of Object.entries(source)) {
            Reflect.set(target, k, v)
        }
    },
    camel(s) {
        return s.split(/[\/_]/)
            .map((p, i) => (i === 0) ? p: (p.charAt(0).toUpperCase() + p.slice(1))).join('');
    },
    copy: (data) => {
        uni.setClipboardData({
        	data,
        	success: function () {
        		uni.showToast({
        		    title: '已复制',
        		    icon: 'none'
        		})
        	}
        });
    }
}