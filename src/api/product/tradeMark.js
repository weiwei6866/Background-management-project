import request from '@/utils/request'
//获取品牌列表

export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:"get"})

export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //带给服务器数据携带ID---修改
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark });
    } else {
        //新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark });
    }
}


//删除品牌的接口
export const reqDeleteTrademark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})