<template>
    <div style="width: 10%;">
        <el-menu default-active="2" class="el-menu-vertical-demo">
            <el-sub-menu index="1">
                <template #title>
                    <span>导航一</span>
                </template>
                <el-menu-item-group title="Group One">
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
                <span>导航二</span>
            </el-menu-item>
            <el-menu-item index="3">
                <span>导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
                <span>导航四</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>