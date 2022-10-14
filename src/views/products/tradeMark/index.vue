<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" size="medium" style="margin-bottom:10px" @click="openDialog">添加</el-button>

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
  <el-form :model="form" >
    <el-form-item label="品牌名称" label-width="100px">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="品牌logo" label-width="100px">
        <!-- picture -->
        <el-upload
  class="avatar-uploader"
  action="/dev-api/admin/product/fileUpload"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </div>
</el-dialog>

<el-table
    :data="listData"
    style="width: 100%" border>

    <el-table-column
        prop="prop"
        label="序号"
        width="80"
         type="index"
         align="center">
    </el-table-column>

    <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
          align="center">
    </el-table-column>

    <el-table-column
        prop="prop"
        label="品牌Logo"
        width="width"
          align="center">
          <template slot-scope="{row}">
            <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
          </template>
    </el-table-column>

    <el-table-column
        prop="prop"
        label="操作"
        width="400"
          align="center">
    <template slot-scope="{row,$index}">
                <el-button type="warning" icon="el-icon-edit" @click="editinfo(row)">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteOne(row,$index)">删除</el-button>
    </template>
    </el-table-column>
</el-table>


<el-pagination
    style="textAlign:center"
    @size-change="handleSizeChange"
    @current-change="getData"
    :current-page="page"
    :page-sizes="[3, 5, 10]"
    :page-size="size"
    layout="prev, pager, next, jumper,->,sizes,total"
    :total="orginal.total">
</el-pagination>
  </div>
</template>

<script>
export default {
    name:'tradeMark',

    data() {
        return {
            listData:[],
            orginal:{},
            page:1,
            size:3,
            dialogFormVisible:false,

            form:{
                name:"",
                imageUrl: ''
            },

            imageUrl: ''

        }
    },

    mounted() {
        this.getData()
    },

    methods: {
        async getData(pager = 1,size = this.size){
           this.page = pager
           let result = await this.$api.trademark.reqTradeMarkList(this.page,size) 
           this.listData = result.data.records
           this.orginal = result.data
        },

        handleSizeChange(size){
            this.size = size
            this.getData(this.page,size)
        },

        openDialog(){
            this.form = {}
            this.imageUrl = ''
            this.dialogFormVisible = true
        },

              handleAvatarSuccess(res, file) {
        this.form.imageUrl = URL.createObjectURL(file.raw);
        this.imageUrl = URL.createObjectURL(file.raw);
      },

      
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },


      async confirm(){
        if(Object.keys(this.form).length>0 && this.imageUrl !== ''){
            this.dialogFormVisible = false
           let obj = {}
           obj.logoUrl = this.form.imageUrl
           obj.tmName = this.form.name
           obj.id = this.form.id
            try {
            await this.$api.trademark.reqAddOrUpdateTradeMark(obj)
            if(this.form.id){
                this.getData(this.page)
            }else{
                this.getData(1)
            }
            // this.getData()
            } catch (error) {
                
            }
        }
      },


      editinfo(row){
        this.imageUrl = row.logoUrl
        this.form.name = row.tmName
        this.form.imageUrl = row.logoUrl
        this.form.id = row.id
        this.dialogFormVisible = true
        
      },

      async deleteOne(row,index){
        this.listData.splice(index,1)
        await this.$api.trademark.reqDeleteTrademark(row.id)
        if(this.listData.length < 1){
            this.getData(this.page - 1)
        }else{
            this.getData(this.page)
        }
        

      }
    


    },

}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>