<template>
  <div>
   <el-card>
<categorySelect ref="category" @scence='scence'></categorySelect>
   </el-card>

   <!-- 第二个card -->
   <el-card>
    <div v-if="scence">
            <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addAttrbute" :disabled='!oneArr.categoryId'>添加属性</el-button>
    <el-table
        :data="listAttrInfo"
        style="width: 100%" border key="table1">

        <el-table-column
         prop="prop"
            label="序号"
            width="80"
              type="index"
              align="center">
        </el-table-column>

        <el-table-column
             prop="attrName"
            label="属性值名称"
            width="150"
             align="center">
        </el-table-column>

        <el-table-column
            prop="prop"
            label="属性值列表"
            width="width"
             align="center">
             <template slot-scope="{row}">
                <el-tag type="success" v-for="c1 in row.attrValueList" :key="c1.id">{{c1.valueName}}</el-tag>
             </template>
        </el-table-column>

        <el-table-column
            prop="prop"
            label="操作"
            width="150"
             align="center">
             <template slot-scope="{row}">
                <el-button type="warning" icon="el-icon-edit" @click="goEdit(row)"></el-button>
                <el-button type="danger" icon="el-icon-delete"></el-button>
             </template>
        </el-table-column>
    </el-table>
    </div>
    <div v-else>
        <el-form :inline="true" ref="form" :model="oneArr" label-width="60px">
           <el-form-item label="属性名">
            <el-input v-model="oneArr.attrName"></el-input>
           </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrbuteValue" :disabled='!oneArr.attrName'>添加属性值</el-button>
        <el-button @click="scence = true">取消</el-button>

      <el-table style="width: 100%;margin:20px" border :data="oneArr.attrValueList" key="table2">

        <el-table-column
          prop="prop"
          label="序号"
          width="80"
          align="center"
          type="index">
        </el-table-column>

        <el-table-column
          prop="prop"
          label="属性值名称"
          width="width">
          <template slot-scope="{row,$index}">
            <el-input v-model="row.valueName" size="mini" :ref="$index" v-if="row.flag" @blur="goBlur(row)" ></el-input> 
            <span v-else @click="changeToInput(row,$index)" >{{row.valueName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="prop"
          label="操作"
          width="width">
          <template slot-scope="{row}">
            
            <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" @click="deleteOne(row)"></el-button>

          </template>
        </el-table-column>

      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
   </el-card>
  </div>
</template>

<script>
export default {
    name:'attr',

    data() {
        return {
          listAttrInfo:[],

          scence:true,

          oneArr:{
            attrName:'',
            attrValueList:[

            ],
            categoryId:0,
            categoryLevel:3,
            
          },
            
          classid:0
        }
    },

    mounted() {
        this.$bus.$on('sendThreeInfo',(info)=>{
           this.listAttrInfo = info
        })

        this.$bus.$on('get3id',(id)=>{
            this.oneArr.categoryId = id
            this.classid = id
        })
    },

    methods: {
        addAttrbute(){
            this.oneArr = {
               attrName:'',
            attrValueList:[

            ],
            categoryId:this.classid,
            categoryLevel:3,
            }
            this.scence = false
        },

        goEdit(row){
                 //需要修改
            this.oneArr = JSON.parse(JSON.stringify(row))
            this.oneArr.attrValueList.forEach(item=>{
              this.$set(item,'flag',false)
            })
            this.scence = false
        },

        addAttrbuteValue(){
            this.oneArr.attrValueList.push({
                attrId:undefined,
                valueName:"",
                flag:true
            })
            this.$nextTick(()=>{
             
            })
        },

        goBlur(row){
            if(row.valueName){
                row.flag = false
            }
        },

        changeToInput(row,$index){
          row.flag = true
          this.$nextTick(()=>{
            this.$refs[$index].focus()
          })
        },

        async save(){
          this.oneArr.attrValueList.forEach((item)=>{
            delete item.flag
          })
          try {
           let result = await this.$api.attr.reqAddOrUpdateAttr(this.oneArr)
           this.$refs.category.updateOrgetDate()
           this.scence = true
            
  
          } catch (error) {
            
          }
        },

        deleteOne(row){
          this.oneArr.attrValueList.splice(this.oneArr.attrValueList.indexOf(row),1)
        }
    },


    watch:{
      scence(newVal){
        this.$bus.$emit('scenceStable',newVal)
      }
    }


}
</script>

<style>

</style>