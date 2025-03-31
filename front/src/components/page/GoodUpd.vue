<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品上下架
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="商品名" class="handle-input mr10"></el-input>
                <el-select v-model="tempname" placeholder="分类名称" class="handle-input mr10" @change="selectCategory">
                    <el-option
                    v-for="item in cateData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="primary" icon="el-icon-lx-add" @click="newShop">上架商品</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column prop="id" label="商品ID" width="75" align="center"></el-table-column>
                <el-table-column prop="name" label="商品名" align="center"></el-table-column>
                <el-table-column prop="iconImage" label="图片" align="center"></el-table-column>
                <el-table-column prop="describe" label="描述" align="center"></el-table-column>
                <el-table-column prop="saled" label="销售量" align="center"></el-table-column>
                <el-table-column prop="categoryId" label="所属分类ID" width="75" align="center"></el-table-column>
                <el-table-column prop="updatetime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
            <!-- <div class="allshop">
                <a :total="pageTotal"
                >本页共{{currTotal}}条;仓库商品共:{{pageTotal}}条</a>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="90%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="商品名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="form.describe"></el-input>
                </el-form-item>
                <el-form-item 
                    v-for="(spec, index) in form.specs"
                    :label="商品规格 + index"
                    :key="spec.key"
                    :prop="'specs.' + index + 'key'"
                    >
                    <el-input 
                            v-model="spec.dimension" 
                            placeholder="规格"
                        ></el-input>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            @click="removeSpec(index)"
                            :disabled="form.specs.length === 1"
                        ></el-button>
                </el-form-item>

                <el-form-item>
                    <el-button 
                        type="primary" 
                        icon="el-icon-plus" 
                        @click="addSpec">
                        添加规格
                    </el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>


      <el-dialog title="上架商品" :visible.sync="editVisible2" width="70%">
        <el-form ref="form" :model="newform" label-width="90px">
          <el-form-item label="商品名">
            <el-input v-model="newform.name"></el-input>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input v-model="newform.describe"></el-input>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-upload
                class="upload-demo"
                drag
                :action="UploadUrl"
                :before-upload="beforeUpload"
                :on-success="UploadSuccess"
                :on-error="UploadError"
                :accept="allowedTypes"
                :limit="1">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="所属分类">
            <el-select v-model="tempname" placeholder="分类名称" class="handle-input mr10" @change="selectCategory">
                    <el-option
                    v-for="item in cateData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit2">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    import { fetchData, getGoodByName, pushGood, updGood, baseUrl } from '../../api/index';
    import { delGood, delMulGood, getGood, getGoodByCategory, updSuggFoot, getGoodCate } from '../../api';
export default {
    name: 'GoodUpd',
    data() {
        return {
            query: {
                name: null,
                category: null,
                pageIndex: 1,
                pageSize: 24
            },
            formLabelWidth: '120px',
            tableData: [],
            cateData:[],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            editVisible2: false,
            total: 0,
            catetotal: 0,
            form: {},
            newform: {},
            idx: -1,
            id: -1,
            tempname: '',
            UploadUrl: `${baseUrl}/common/upload`,
            allowedTypes: 'image/jpeg, image/png', 
            refreshKey: 0,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            getGood(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.total = res.total;
            });
            getGoodCate({pageIndex: 0,pageSize: 0}).then(res => {
                console.log(res);
                this.cateData = res.list;
                this.catetotal = res.total;
            });
            this.cateData.push({id: 0,name: '全部'});
        },
        selectCategory(selectedId) {
            this.query.category = selectedId;
            this.tempname = this.cateData.find(item => item.id === selectedId).name;
            this.newform.categoryId = selectedId;
        },
        // 触发搜索按钮
        handleSearch() {
            getGood(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.total = res.total;
            });
        },
        newShop(){
            this.editVisible2 = true;
        },

        beforeUpload(file) {
        const isImage = this.allowedTypes.includes(file.type)
        const isSizeValid = file.size / 1024 <= 500 // 转换为KB

        if (!isImage) {
            this.$message.error('只能上传 JPG/PNG 格式的图片!')
            return false
        }

        if (!isSizeValid) {
            this.$message.error('图片大小不能超过 500KB!')
            return false
        }
        return true
        },

        // 上传成功处理
        UploadSuccess(response, file, fileList) {
        // 根据实际接口返回结构调整路径
        if (response.status === 200) {
            this.newform.iconImage = response.imageName
            this.$message.success('图片上传成功!')
        } else {
            this.$message.success('wrong!')
            this.UploadError(new Error('接口返回数据格式异常'))
        }
        },

        // 错误处理
        UploadError(err, file, fileList) {
        console.error('上传失败:', err)
        this.$message.error('图片上传失败，请重试')
        },

        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                    delGood(this.tableData[index]);
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                }).catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.success(`删除了${str}`);

            delMulGood(this.multipleSelection);
            this.multipleSelection = [];
            this.$router.go(0);
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.form.specs = [{
                dimension: "",
                price: "",
                originalPrice: "",
                dozen: "",
                store: ""
            }]
            this.editVisible = true;
        },

        addSpec() {
            this.form.specs.push({
                key: Date.now(),
                dimension: "",
                price: "",
                originalPrice: "",
                dozen: "",
                store: ""
            });
        },
        
        // 删除规格
        removeSpec(index) {
            if (this.form.specs.length > 1) {
            this.form.specs.splice(index, 1);
            }
        },

        // 保存编辑
        saveEdit() {

            updGood(this.form).then(res=>{
                if(res.status===200){
                    this.editVisible = false;
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.$set(this.tableData, this.idx, this.form);
                }
                else {
                    this.$message.error(`商品名不能为空！`)
                }
            })

        },
        saveEdit2() {
            this.editVisible2 = false;
            if(this.newform.name && this.newform.categoryId) {
                pushGood(this.newform).then(res => {
                    if (res.status === 200) {
                        this.newform={};
                        this.$message.success(`上架成功`);
                        getGood(this.query).then(res => {
                        console.log(res);
                        this.tableData = res.list;
                        this.total = res.total;
                        });
                    } else {
                        this.$message.error(`商品已存在`)
                    }
                });
            }
            else {
                this.$message.error("上架失败,信息没有填写完整!")
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>

  .allshop {
    margin-top: 20px;
    margin-right: 50px;
    text-align: right;
  }
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
