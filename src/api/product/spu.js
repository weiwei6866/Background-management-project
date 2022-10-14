import request from '@/utils/request'

export const reqspuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:"get",params:{category3Id}})

export const reqSpu = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

export const reqTradeMarkList = ()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:"get"})   //进入获取

export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

export const reqBaseSaleAttrList = ()=>request({url:'/admin/product/baseSaleAttrList',method:"get"})        //进入获取

export const reqAddOrUpdateSpu = (spuInfo)=>{
    if(spuInfo.id){
        return request({url:'/admin/product/updateSpuInfo',method:"post",data:spuInfo})

        }else{
        return request({url:'/admin/product/saveSpuInfo',method:"post",data:spuInfo})
        }
    
}

// export const reqAddOrUpdateSpu = (spuInfo) => {
//     //携带的参数带有id----修改spu
//     if (spuInfo.id) {
//         return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
//     } else {
//         //携带的参数不带id---添加SPU
//         return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
//     }
// }

export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})