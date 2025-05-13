export default (apiMothed, params = {}, listFn) => {    
    const hasNext = ref(true);
    const data = ref([]);
    const pageParams = reactive({
        page: 1,
        limit: 10,
        ... toRefs(params)
    });
    
    const dataList = () => {
        apiMothed({
            data: pageParams,
            success(res) {
                const list = listFn ? listFn(res) : res.data;
                if(list.length < pageParams.limit) {
                    hasNext.value = false;
                }
                data.value.push(...list);
            }
        })
    }
    
    const loadList = () => {
        pageParams.page = 1;
        hasNext.value = true;
        data.value = [];
        dataList();
    }
    
    const nextPage = () => {
        if(hasNext.value) {
            pageParams.page = pageParams.page + 1;
            dataList();
        }
    }
    
    return {
        hasNext,
        data,
        nextPage,
        loadList
    }
}