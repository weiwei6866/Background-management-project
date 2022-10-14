<template>
  <div>
    <el-card v-show="scence == 1">
        <categorySelect/>
    </el-card>
    <el-card>
   
  
  <!-- 表格部分 -->
    <div v-show="scence == 1">
         <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addSpu" :disabled="!category3Id">添加Spu</el-button>
            <el-table
          :data="spuData"
        style="width: 100%" border>

        <el-table-column
            prop="prop"
            label="序号"
            width="80"
            type="index">
        </el-table-column>

        <el-table-column
            prop="spuName"
            label="spu名称"
            width="width">
        </el-table-column>

        <el-table-column
            prop="description"
            label="spu描述"
            width="width">
        </el-table-column>

        <el-table-column
            prop="prop"
            label="操作"
            width="width">
            <template slot-scope="{row}">
                <el-button type='success' size="mini" icon="el-icon-plus" @click="addValue(row)"></el-button>
                <el-button type='warning' size="mini" icon="el-icon-edit" @click="changeToInfo(row)"></el-button>
                <el-button type='info' size="mini" icon="el-icon-info" @click="showInfo(row)"></el-button>
                <el-button type='danger' size="mini" icon="el-icon-delete" @click="deleteSpu(row)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="getData"
        :current-page="pageNum"
        :page-sizes="[3, 5, 10]"
        :page-size="pageSize"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="totalCount"
        style="textAlign:center">
    </el-pagination>
    </div>

    <!-- 输入部分 -->
    <div v-show='scence == 2'>
      <el-form ref="form" label-width="80px" :model="spu">

        <el-form-item label="SPU名称">
          <el-input v-model="spu.spuName"></el-input>
        </el-form-item>

        <el-form-item label="品牌">
          <el-select  v-model="spu.tmId" placeholder="请选择品牌">
            <el-option :value="c1.id" v-for="c1 in TradeMarkList" :key="c1.id" :label="c1.tmName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="SPU描述">
        <el-input type="textarea" v-model="spu.description"></el-input>
        </el-form-item>

        <el-form-item label="spu图片">
        <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-success='updateSuccess'
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :fileList='testImgList'>
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        </el-form-item>

        <el-form-item label="销售属性">
            <el-select v-model="temporaryData.nameAndId" placeholder="placeholder">
                <el-option :label="c1.name" :value='`${c1.id}:${c1.name}`'  v-for="c1 in BaseSaleAttrList" :key="c1.id"></el-option>
            </el-select>
            <el-button type="primary" style="margin-left:10px" icon="el-icon-plus" @click="addAttributeValue" :disabled='!temporaryData.nameAndId.length>0'>添加销售属性</el-button>
        </el-form-item>

        <!-- 内嵌表格部分 -->
       
        <el-table
             :data="spu.spuSaleAttrList"
            style="width: 100%" border>

            <el-table-column
                prop="prop"
                label="序号"
                width="80"
                type="index"
                align="center">
            </el-table-column>
            <el-table-column
                prop="saleAttrName"
                label="属性名"
                width="150"
                 align="center"
               >
            </el-table-column>
            <el-table-column
                prop=""
                label="属性值名称列表"
                width="width"
               >
               <template slot-scope="{row,$index}">
            <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="index"
                closable
                 @close="handleClose(tag,row)"
                style="margin-left:8px">
                {{tag.saleAttrValueName}}
            </el-tag>
            <el-button @click="addOneEle(row,$index)" style="margin-left:5px" v-if="row.flag">添加</el-button>
            <el-input v-model="changedInputName" placeholder="" :ref="$index" v-else style="width:100px" @blur="blur(row,$index)"></el-input>
               </template>
            </el-table-column>
            <el-table-column
                prop="spuSaleAttrValueList"
                label="操作"
                width="width"
               >
               <template >
               <el-button type="danger" icon="el-icon-delete"></el-button>
               </template>
            </el-table-column>
        </el-table>
        </el-form>
        <el-button type="primary" style="margin-top:20px" @click="keepSave">保存</el-button>
        <el-button @click="cancel">取消</el-button>
    </div>

    <!-- 添加属性部分 -->
    <div v-show="scence == 3">
      <el-form ref="form" :model="skuInfo2" label-width="80px">

         <el-form-item label="SPU名称">
          {{haimian.spuName}}
        </el-form-item>

        <el-form-item label="SKU名称">
          <el-input v-model="skuInfo2.skuName"></el-input>
        </el-form-item>

        <el-form-item label="价格（元）"  >
          <el-input v-model="skuInfo2.price" type="number"></el-input>
        </el-form-item>

        <el-form-item label="重量（千克）"  >
          <el-input v-model="skuInfo2.weight" type="number"></el-input>
        </el-form-item>

        <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo2.skuDesc"></el-input>
        </el-form-item>

      <!-- 第一个特殊的select -->
        <el-form-item label="平台属性">
         <el-form :inline="true" ref="form"  label-width="80px">
            <el-form-item :label="c1.attrName" v-for="c1 in selectorInfo" :key="c1.id">
              <el-select  placeholder="" v-model="c1.attrIdAndValueId">
                <el-option :label="c2.valueName" :value="`${c1.id}:${c2.id}`" v-for="c2 in c1.attrValueList" :key="c2.id"></el-option>
              </el-select>
            </el-form-item>
         </el-form>
        </el-form-item>

      <!-- 第二个特殊的select -->
        <el-form-item label="销售属性">
         <el-form :inline="true" ref="form"  label-width="80px">
            <el-form-item :label="c1.saleAttrName" v-for="c1 in attrList" :key="c1.id">
              <el-select  placeholder="" v-model="c1.attrIdAndValueId">
                <el-option :label="c2.saleAttrValueName" :value="`${c1.id}:${c2.id}`" v-for="c2 in c1.spuSaleAttrValueList" :key='c2.id'></el-option>
              </el-select>
            </el-form-item>
         </el-form>
        </el-form-item>


        <!-- 图片列表 -->
        <el-form-item label="图片列表">
          
          <el-table
            :data="imgList"
            style="width: 100%" border  @selection-change='handlerChange'>

            <el-table-column
              prop="prop"
              width="width"
              type="selection"
              align="center">
            </el-table-column>
            
            <el-table-column
              prop="prop"
               width="200"
              label="图片"
               align="center"
            >
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width:100px">
            </template>
            </el-table-column>

            <el-table-column
              prop="imgName"
              width="width"
              label="名称"
               align="center"
            >
            </el-table-column>

            <el-table-column
              prop="prop"
              label="操作"
              width="width"
               align="center"
             >
             <template slot-scope="{row}">
              <el-button type="primary" @click="setDefault(row)" v-if="row.isDefault">设为默认</el-button>
             </template>
            </el-table-column>

          </el-table>
        </el-form-item>

        <el-button type="primary" @click="saveSku">保存</el-button>


      </el-form>
    </div>
    </el-card>
    <el-dialog :title="`${nickName}的列表`" :visible.sync="dialogTableVisible" v-loading="loading" :before-close='close'>

    <el-table
      :data="dialogData"
      style="width: 100%" border>

      <el-table-column
        prop="skuName"
        label="名称"
        width="width">
      </el-table-column>

      <el-table-column
        prop="price"
        label="价格"
        width="width">
      </el-table-column>

      <el-table-column
        prop="weight"
        label="重量"
        width="width">
      </el-table-column>

      <el-table-column
        prop="prop"
        label="默认图片"
        width="width">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px">
        </template>
      </el-table-column>
    </el-table>

</el-dialog>
  </div>  
</template>

<script>
 let vm = {
    name:'spu',

    data() {
        return {
          dialogTableVisible:false,
          dialogData:[],
          loading:true,
          nickName:'',


          //进入第三个页面请求的信息
          selectorInfo:[],
          imgList:[],
          attrList:[],
          haimian:{},
          imgarray:[],




          allId:{},
          skuInfo:{},
        testImgList:[],
        changedInputName:'',
            

            category3Id:'',

            totalCount:0,

            pageNum:1,

            pageSize:3,

            spuData:[],

            scence:1,

        temporaryData:{
            nameAndId:''
        },

        

        spu: {
        //三级分类的id
        category3Id: '',
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string", 
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        },

        skuInfo2: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],



      },

            //预先发数据请求的信息
            TradeMarkList:[],
            BaseSaleAttrList:[],


            //关于照片墙的信息
             dialogImageUrl: '',
             dialogVisible: false


        }

        
      
    },

    mounted() {
         this.$bus.$on('get3id',(id,allId)=>{
                this.category3Id = id
                this.allId = allId
                this.getData()
            })

            
    },

    methods: {

     handlerChange(a){
      console.log(a);
      this.imgarray = a
    },

        handleSizeChange(a){
            this.pageSize = a
            this.getData(this.pageNum,a,this.category3Id)
        },

       async getData(pager = 1){
            this.page = pager
           let result =  await this.$api.spu.reqspuList(pager,this.pageSize,this.category3Id)
           this.totalCount = result.data.total
           this.pageNum = result.data.current
           this.pageSize = result.data.size
           this.spuData = result.data.records
        },
        
       async addSpu(){
            
            this.scence = 2
            try {
                let result = await this.$api.spu.reqTradeMarkList()
                this.TradeMarkList = result.data
                let result2 = await this.$api.spu.reqBaseSaleAttrList()
                this.BaseSaleAttrList = result2.data

                this.spu.category3Id = this.category3Id
            } catch (error) {
                
            }
            
        },

          handleRemove(file, fileList) {
            this.updateSuccess('','',fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      updateSuccess(a,b,fileList){
        this.testImgList = fileList

        this.spu.spuImageList = fileList.map(item=>{
            return{
                imgName:item.name,
                imgUrl:item.url
            }
        })
      },

      async keepSave(){
        this.spu.spuSaleAttrList.forEach(item=>{
            delete item.flag
        })
        try {
          await this.$api.spu.reqAddOrUpdateSpu(this.spu) 
          this.getData()
          this.scence = 1 
          this.spu = {
        //三级分类的id
        category3Id: '',
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string", 
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        }
        this.testImgList = []
        this.temporaryData.nameAndId = ''
        } catch (error) {
            
        }
  
      },

      addAttributeValue(){
        let obj = {}
        //开始把临时的数据赋值给spu
        obj.saleAttrName = this.temporaryData.nameAndId.split(':')[1]
        obj.baseSaleAttrId = this.temporaryData.nameAndId.split(':')[0]
        obj.spuSaleAttrValueList = []
        obj.flag = true
        this.spu.spuSaleAttrList.push(obj)
        this.temporaryData.nameAndId = ''
      },

      addOneEle(row,$index){
        this.changedInputName = ''
        row.flag = false
        this.$nextTick(()=>{
            this.$refs[$index].focus()
        })

      },
      blur(row){
        row.flag = true
        let obj = {}
        obj.baseSaleAttrId = row.baseSaleAttrId
        obj.saleAttrValueName = this.changedInputName
        


        let result = row.spuSaleAttrValueList.every((item)=>{
                return item.saleAttrValueName !== this.changedInputName
        })

        if(result == true && this.changedInputName){
            row.spuSaleAttrValueList.push(obj)
        }

      },

      cancel(){
       this.scence = 1
       sessionStorage.setItem('3id',this.category3Id)
       Object.assign(this._data,this.$options.data())
       this.category3Id = sessionStorage.getItem('3id')
       this.getData()
      },

     async changeToInfo(row){       //修改需要
        this.addSpu()
        let result = await this.$api.spu.reqSpu(row.id)
        result.data.spuSaleAttrList.forEach(item=>{
          item.flag = true
        })
        this.spu = result.data
        let result2 = await this.$api.spu.reqSpuImageList(row.id)
        this.testImgList = result2.data.map(item=>{
          return{
            name:item.imgName,
            url:item.imgUrl
          }
        })
      },

      handleClose(tag,row){
          row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(tag),1)
      },


      async deleteSpu(row){
        await this.$api.spu.reqDeleteSpu(row.id)
        this.getData()
      },

     async addValue(row){
      this.haimian = row
      this.skuInfo2.category3Id = row.category3Id
      this.skuInfo2.spuId = row.id
      this.skuInfo2.tmId = row.tmId
        const {firstId,secondId,thirdId} = this.allId
        this.scence = 3
        let result6 = await this.$api.sku.reqAttrInfoList(firstId,secondId,thirdId)
        this.selectorInfo = result6.data

         let result = await this.$api.sku.reqSpuImageList(row.id)
      if(result.code == 200){
          this.imgList = result.data
          this.imgList.forEach(item=>{
            this.$set(item,'isDefault',1)
          })
      }
      let result2 = await this.$api.sku.reqSpuSaleAttrList(row.id)
      if(result2.code == 200){
        this.attrList = result2.data
      }
      },

      setDefault(row){
      this.imgList.forEach(item=>{
          item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo2.skuDefaultImg = row.imgUrl
      },

      
     async saveSku(){
      let arr = this.selectorInfo.map(item=>{
        if(item.attrIdAndValueId){
          return{
          attrId: item.attrIdAndValueId.split(':')[0],
          valueId: item.attrIdAndValueId.split(':')[1],
          }
        }
      })
        this.skuInfo2.skuAttrValueList = arr.filter(item=>{
          if(item){
            return true
          }
        })


      let brr = this.attrList.map(item=>{
        if(item.attrIdAndValueId){
          return{
          saleAttrId: item.attrIdAndValueId.split(':')[0],
          saleAttrValueId: item.attrIdAndValueId.split(':')[1],
          }
        }
      })
        this.skuInfo2.skuSaleAttrValueList = brr.filter(item=>{
          if(item){
            return true
          }
        })


        this.skuInfo2.skuImageList = this.imgarray.map(item=>{
          return{
            imgName:item.imgName,
            imgUrl:item.imgUrl,
            isDefault:item.isDefault,
            spuImgId:item.id
          }
        })

        console.log(this.skuInfo2);

      let result = await this.$api.sku.reqAddSku(this.skuInfo2)
      if(result.code == 200){
        this.$message({type:"success",
        message:'保存成功'})
        this.scence = 1
        this.getData()
      }
      

      

    },

   async showInfo(row){
    console.log(row);
    this.nickName = row.spuName
      this.dialogTableVisible = true
      let result = await this.$api.sku.reqSkuList(row.id)
      this.dialogData = result.data
      this.loading = false

    },

    close(done){
      this.dialogData = []
      this.loading = true
      done()
    }

    
    },
}

export default vm

</script>

<style>

</style>