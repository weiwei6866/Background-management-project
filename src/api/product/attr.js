import request from '@/utils/request'

export const reqCategory1List = ()=>request({url:'/admin/product/getCategory1',method:'get'})
export const reqCategory2List = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
export const reqCategory3List = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

//从id 1 2 3 获取数据进行展示
export const reqInfor = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`})

//添加属性名字与属性值的接口
export const reqAddOrUpdateAttr = (data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})