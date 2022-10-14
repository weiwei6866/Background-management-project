<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" :inline="true"> 

    <el-form-item label="一级分类">
        <el-select v-model="form.firstId" placeholder="请选择" @change="firChange" :disabled='!scence'>
            <el-option :label="c1.name" :value="c1.id" v-for="c1 in first" :key="c1.id"></el-option>
        </el-select>
    </el-form-item>
    
    <el-form-item label="二级分类">
        <el-select v-model="form.secondId" placeholder="请选择" @change="senChange" :disabled='!scence'>
            <el-option :label="c2.name" :value="c2.id" v-for="c2 in second" :key="c2.id"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="三级分类">
        <el-select v-model="form.thirdId" placeholder="请选择" @change="send3id" :disabled='!scence'>
            <el-option :label="c3.name" :value="c3.id" v-for="c3 in third" :key="c3.id"></el-option>
        </el-select>
    </el-form-item>

</el-form>
  </div>
</template>

<script>
export default {
    name:'categorySelect',

    
    data() {
        return {
             form:{
                firstId:'',
                secondId:'',
                thirdId:''
            },

            scence:true,

                first:[],
                second:[],
                third:[],


                dataInfo:[]

        }
    },

        async created(){
        let result = await this.$api.attr.reqCategory1List()
        this.first = result.data
    },

    methods: {
        async firChange(){
           let result =  await this.$api.attr.reqCategory2List(this.form.firstId)
          this.second = result.data
        },

        async senChange(){
          let result = await this.$api.attr.reqCategory3List(this.form.secondId)
          this.third = result.data
        },

        send3id(){
            this.$bus.$emit('get3id',this.form.thirdId,this.form)
        },

        async updateOrgetDate(){
            const {firstId,secondId,thirdId} = this.form
            let result = await this.$api.attr.reqInfor(firstId,secondId,thirdId)
            this.dataInfo = result.data
            this.$bus.$emit('sendThreeInfo',this.dataInfo)
        }
    },

    computed:{
        thirdId(){
            return this.form.thirdId
        }
    },

    mounted() {
      this.$bus.$on('scenceStable',(a)=>{
            this.scence = a
      })  
    },


    watch:{
         thirdId(newVal){
            this.updateOrgetDate()
            
        }
    }
}
</script>

<style>

</style>