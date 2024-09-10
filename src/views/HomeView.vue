<template>
  <div>
    <div style="margin: 20px 5px">
      <el-button type="primary" @click="add()">新增</el-button>
      <el-button>其它</el-button>
    </div>

    <!-- 搜索-->
    <div style="margin: 10px 5px">
      <el-input v-model="search" placeholder=" 请输入关键字" style="width:15%"></el-input>
      <el-button style="margin-left: 10px" type="primary">查询</el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="家居名" sortable ></el-table-column>
      <el-table-column prop="manufacturer" label="制造商"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="sales" label="销量"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button link type="primary" @click="handleEdit(scope.row)" >编辑</el-button>
          <el-button link type="primary" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      添加家居弹窗的说明:
      1. el-dialog ：v-model="dialogVisible" 表示对话框, 和 dialogVisible 变量双向绑定, 控制是否显示对话框
      2. el-form : model="form" 表示表单, 数据和 form 数据变量双向绑定
      3. el-input v-model="form.name" 表示表单的 input 控件，名字为 name 需要和后台 Javabean[Furn] 属性一致.
         在前端中, 对象的属性是可以动态生成的(即先定义对象, 再定义属性), 所以不需要在 vue 对象的 form 属性中声明 name 等成员属性. 
    -->
    <el-dialog title="添加家居" v-model="dialogVisible"  width="500">
      <span>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="家居名">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="制造商">
            <el-input v-model="form.manufacturer" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.price" />
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="form.sales" />
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="form.stock" />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="save()">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 导入 request 对象
import request from '@/utils/request';

export default {
  name: 'HomeView',
  components: {

  },
  data() {
    return {
      search: '',
      dialogVisible: false,
      form: {},
      tableData: []
    }
  },
  methods: {
    handleEdit() {
    },
    add() {
      this.dialogVisible = true;
      // 这里将 form 属性置为空, 目的是为了每次打开新增家居弹窗时, 情况表单中的内容
      this.form = {}
    },
    save() {
      /** 
       * 1. vuw.config.js 文件会将 /api/furniture/add 代理到 http://localhost:8080/SSM_Demo/furniture/add
       * 2. this.form 代表 要提交的表单数据
       */
      request.post("/api/furniture/save", this.form).then(res => {
        this.dialogVisible = false;
        // 在添加完家居后, 需要调用 list() 方法更新表单
        this.query();
      }).catch(err => {
        console.log("err =", err)
      });
    },
    query() {
      request.get("/api/furniture/query").then(res => {
        this.tableData = res;
      }).catch(err => {
        console.log("err =", err)
      });
    }
  },
  //生命周期函数 - 创建 vue 实例前
  created() {
    this.query();
  }
}
</script>
