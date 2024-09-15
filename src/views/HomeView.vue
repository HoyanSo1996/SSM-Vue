<template>
  <div>
    <div style="margin: 20px 5px">
      <el-button type="primary" @click="add()">新增</el-button>
      <el-button>其它</el-button>
    </div>

    <!-- 搜索框 -->
    <div style="margin: 10px 5px">
      <el-input v-model="search" placeholder="请输入关键字" style="width:15%"></el-input>
      <el-button style="margin-left: 10px" type="primary" @click="query">查询</el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="家居名" sortable></el-table-column>
      <el-table-column prop="manufacturer" label="制造商"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="sales" label="销量"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <!-- 
            使用<template #default=“scope”>可以在外部获取组件内的数据
            scope 指的当前行数据的对象, 有多个属性, rowIndex 代表这行的索引值, row 代表这一行的数据
        -->
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <!-- <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
          <!-- 如果点击取消, 就不会触发 handleDelete -->
          <el-popconfirm title="确定删除?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
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
    <el-dialog title="家居信息" v-model="dialogVisible" width="500">
      <span>
        <!-- 
            (1) :rules="rules" 指定要使用规则
            (2) ref="form" 指定创建的规则应用到 form 表单
            (3) prop 指定各个规则与哪个 el-form-item 关联
        -->
        <el-form :model="form" :rules="rules" ref="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="家居名" prop="name">
            <el-input v-model="form.name" style="width: 60%;"/> {{serverValidErrors.name}}
          </el-form-item>
          <el-form-item label="制造商" prop="manufacturer">
            <el-input v-model="form.manufacturer" style="width: 60%;"/> {{serverValidErrors.manufacturer}}
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" style="width: 60%;"/> {{serverValidErrors.price}}
          </el-form-item>
          <el-form-item label="销量" prop="sales">
            <el-input v-model="form.sales" style="width: 60%;"/> {{serverValidErrors.sales}}
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="form.stock" style="width: 60%;"/> {{serverValidErrors.stock}}
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="save(form.id)">Confirm</el-button>
        </div>
      </template>
    </el-dialog>

    <div style="margin: 30px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
      tableData: [],
      // 存放后端错误信息
      serverValidErrors: {},
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '请输入家居名', trigger: 'blur' }
        ],
        manufacturer: [
          { required: true, message: '请输入制造商名', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { pattern: /^(([1-9]\d*)|(0))(\.\d+)?$/, message: '请输入合规数字', trigger: 'blur' }
        ],
        sales: [
          { required: true, message: '请输入销量', trigger: 'blur' },
          { pattern: /^(([1-9]\d*)|(0))$/, message: '请输入合规数字', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { pattern: /^(([1-9]\d*)|(0))$/, message: '请输入合规数字', trigger: 'blur' }
        ]
      },
      // 默认初始数据
      currentPage: 1,
      pageSize: 5,
      total: 10
    }
  },
  methods: {
    add() {
      // 这里将 form 属性置为空, 目的是为了每次打开新增家居弹窗时, 情况表单中的内容
      this.form = {};
      this.dialogVisible = true;

      // 清空 前端 验证失败后的提示信息
      if (this.$refs['form'] != undefined) {
        this.$refs['form'].resetFields();
      }
      // 清空 后端 验证失败后的提示信息
      this.serverValidErrors = [];
    },
    handleEdit(row) {
      /**
       * 有两种方法获取回显值
       * (1) 通过后端的 queryById 接口根据 scope.row.id 获取家居信息
       * (2) 直接在前端的 tableData 中获取一行的数据 scope.row (有缺点: 可能和数据库中的数据不一致, 
       *     例如其他人修改了数据, 但我们还没手动刷新页面就点击了编辑按钮, 那么此时弹窗的数据还是老数据)
       */
      // console.log("row =", row.name);
      // 这里要对 row 对象进行深拷贝, 这样表格中的行数据和弹出框的数据就是独立的了.
      // 否则该表弹出框的数据, 行数据也会进行改变
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },

    save(id) {
      // 在点击 comfirm 按钮时, 对表单数据进行校验
      this.$refs['form'].validate((valid => {
        // 验证后端的验证逻辑 test
        // valid = true;
        if (!valid) {
          // 弹出更新失败信息
          this.$message({
            type: "error",
            message: "表单验证失败, 不提交"
          });
          return false;

        } else {
          // 根据是否有 id 值来判断该弹出框是点击新增按钮的, 还是删除按钮的。
          // console.log("id =", id);
          if (id) {
            request.put("/api/furniture/modify", this.form).then(res => {
              if (res.code === 200) {
                this.$message({ //弹出更新成功的消息框
                  type: "success",
                  message: "更新成功"
                });
                this.query();  // 刷新页面
                this.dialogVisible = false;
              } else if (res.code === 400) {
                this.serverValidErrors.name = res.data.name;
                this.serverValidErrors.manufacturer = res.data.manufacturer;
                this.serverValidErrors.price = res.data.price;
                this.serverValidErrors.sales = res.data.sales;
                this.serverValidErrors.stock = res.data.stock;
              } else {
                this.$message({//弹出更新失败信息
                  type: "error",
                  message: "更新失败"
                })
              }
            }).catch(err => {
              console.log("err =", err);
            });
          } else {
            /** 
             * 1. vuw.config.js 文件会将 /api/furniture/add 代理到 http://localhost:8080/SSM_Demo/furniture/add
             * 2. this.form 代表 要提交的表单数据
             */
            request.post("/api/furniture/add", this.form).then(res => {
              if (res.code === 200) {
                this.$message({ //弹出更新成功的消息框
                  type: "success",
                  message: "添加成功"
                });
                // 在添加完家居后, 需要调用 list() 方法更新表单
                this.query();
                this.dialogVisible = false;
              } else if (res.code === 400) {
                this.serverValidErrors.name = res.data.name;
                this.serverValidErrors.manufacturer = res.data.manufacturer;
                this.serverValidErrors.price = res.data.price;
                this.serverValidErrors.sales = res.data.sales;
                this.serverValidErrors.stock = res.data.stock;
              } else {
                this.$message({//弹出更新失败信息
                  type: "error",
                  message: "添加失败"
                })
              }
            }).catch(err => {
              console.log("err =", err);
            });

            /** 
             * 这里不能把上面的 this.dialogVisible = false 和 this.query() 不能为了减少代码而提取到最后,
             * 因为上面 request 用的是 Ajax 请求, 是异步的, 如果将上面两行代码提取出来, 那么会造成 Ajax 
             * 还没返回结果, 就先关闭弹出窗和刷新页面的现象. 
             */
          }
        }
      }));
    },
    handleDelete(id) {
      // console.log("id =", id);
      request.delete(`/api/furniture/remove?id=${id}`).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else {
          this.$message({
            type: "error",
            message: "删除失败"
          })
        }
        // 刷新列表, 关闭弹窗
        this.query();
        this.dialogVisible = false;
      }).catch(err => {
        console.log("err =", err)
      });
    },
    // 普通查询
    // query() {
    //   request.get("/api/furniture/query").then(res => {
    //     this.tableData = res.data;
    //   }).catch(err => {
    //     console.log("err =", err)
    //   });
    // },
    // 分页查询
    query() {
      request.get("/api/furniture/page", {
        params: {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          name: this.search
        }
      }).then(res => {
        //console.log("res =", res);
        this.tableData = res.data.list;
        this.currentPage = res.data.pageNum;
        this.pageSize = res.data.pageSize;
        this.total = res.data.total;
        // this.pageNo = res.data;

      }).catch(err => {
        console.log("err =", err)
      });
    },
    handleSizeChange() {
      // 每当选择每页显示条数下拉栏, page-sizes 会给 page-size 属性传值, 并触发当前方法. 
      // 由于 pageSize 值是双向绑定的, 所以 data() 中的 pageSize 的值也会改变
      // 此时只需要手动触发 query 方法刷新页面就行了.
      this.query();
    },
    handleCurrentChange() {
      // 每当点击导航栏上的页码, 就会触发当前方法.
      // 由于 currentPage 值是双向绑定的, 所以 data() 中的 currentPage 的值也会改变
      // 此时只需要手动触发 query 方法刷新页面就行了.
      this.query();
    }
  },
  // 生命周期函数 - 创建 vue 实例前
  created() {
    this.query();
  }
}
</script>
