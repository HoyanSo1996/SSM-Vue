<template>
  <div>
    <div style="margin: 20px 5px">
      <el-button type="primary">新增</el-button>
      <el-button>其它</el-button>
    </div>

    <!-- 搜索-->
    <div style="margin: 10px 5px">
      <el-input v-model="search" placeholder=" 请输入关键字" style="width:15%"></el-input>
      <el-button style="margin-left: 10px" type="primary">查询</el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column sortable prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  components: {

  },
  data() {
    return {
      search: '',
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        }
      ]
    }
  },
  methods: {
    handleEdit() {
    }
  }
}
</script>
