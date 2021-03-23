<template>
    <div class ="header-container">
    <div class="section">
        <div class='logo'>LightMark</div>
    <Dropdown trigger="hover" @on-click="showFileMenu">
        <a class="dropdown-link" href="javascript:void(0)">
        <span class="file-list">已有文件列表</span>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem v-for="(file,index) in user.files"
                :key = "index"
                :name= "index"
            >{{file.name}}</DropdownItem>
        </DropdownMenu>
    </Dropdown>
    </div>

    <Dropdown trigger="hover" @on-click="changeMenu">
    <a class="dropdown-link" href="javascript:void(0)">
        <span class="username">{{ username }}</span>
        <img class="avatar" src="../assets/pic/avatar.jpg" alt="">
        <Icon type="ios-arrow-down" size="14"></Icon>
    </a>
    <DropdownMenu slot="list">
        <DropdownItem name="a">修改密码</DropdownItem>
        <DropdownItem name="b">退出</DropdownItem>
    </DropdownMenu>
    </Dropdown>    

    <Modal
      title="修改密码"
      v-model="modal"
      @on-ok="ok"
      :loading="modalLoading"
      class-name="vertical-center-modal">
      <Form :model="formItem" :label-width="90" ref="formItem">
        <FormItem label="旧密码" prop="oldPassword">
            <Input v-model="formItem.oldPassword" type="password" maxlength="20" placeholder="请输入旧密码"/>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
            <Input v-model="formItem.newPassword" type="password" maxlength="20" placeholder="请输入新密码"/>
        </FormItem>
        <FormItem label="确认新密码" prop="confirmPassword">
            <Input v-model="formItem.confirmPassword" type="password" maxlength="20" placeholder="请再次确认新密码"/>
        </FormItem>
      </Form>
    </Modal>


    </div>
</template>


<script>
import {resetPwd} from '@/utils/api';
import bus from '../assets/js/bus'

export default {
    name:'Header',
    components:{},
    data(){
        return {
		modal: false,
        modalLoading: true,
        // username: this.$store.state.userInfo.data.userData.username,
        username: 'Tommy',
        formItem: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
        },
        user: {
            files: [
                {
                    name:'readme.md',
                    content:'#   标题一'
                },
                {
                    name:'prototype.md',
                    content:'Hello world!'
                }
                ]
        }
        }
    },
    computed:{

    },
    created() {},
    mounted() {
    
    },
  methods: {
    // 点击头像下拉菜单选择
    changeMenu(name) {
      if (name == 'a') {
        this.modal = true;
        this.$refs['formItem'].resetFields();
      } else if (name == 'b') {
        this.$store.dispatch('userInfo/logout')
      }
    },
    showFileMenu(index){
        const content = this.user.files[index].content
        // console.log(content);
        bus.$emit('getContent',content);
    },
    // 提交修改密码
    ok() {
      setTimeout(() => {
        this.modalLoading = false;
        this.$nextTick(() => {
          this.modalLoading = true;
        });
    }, 100);

      if (!this.$Valid.validPass(this.formItem.oldPassword)) {
        this.$Message.error("旧密码应为8到20位字母或数字！");
        return false;
      } else if (!this.$Valid.validPass(this.formItem.newPassword)) {
        this.$Message.error("新密码应为8到20位字母或数字！");
        return false;
      } else if (!this.$Valid.validPass(this.formItem.confirmPassword)){
        this.$Message.error("确认密码有误");
        return false;
      } else if (this.formItem.confirmPassword !== this.formItem.newPassword){
        this.$Message.error("两次密码不一致");
        return false;
      }

      let data = {
        username: this.$store.state.userInfo.data.userData.username,
        oldPassword: this.formItem.oldPassword,
        newPassword: this.formItem.confirmPassword
      }

      resetPwd(data)
      .then(res => {
        if (res.code == 0) {
          this.modal = false;
          this.$Message.success('修改密码成功');
        } else {
          this.$Message.error(res.msg);
        }
      })
    }

  }   
}
</script>


<style lang="less" scoped>

.header-container {
    font-family: Arial,'Times New Roman','Microsoft YaHei',SimHei; 
    width: 100%;
    background: #24292e;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 60px 10px 40px;
    box-sizing: border-box;
    .section {
        display: flex;
        .logo{
            font:600;
            color: #fff;
            font-size:20px;
            margin-right: 60px;
        }

      .file-list {
        display: flex;
        align-items: center;
        margin: 0 auto;
        font-size: 18px;
        line-height: 30px;
        li {
            list-style-type: none;
            color: #fff;
            margin-right: 40px;
            a {
                color: #fff;
                opacity: .5;
                &:hover, &.active {
                opacity: 1;
                };
          }
        }
      }
    }
    .dropdown-link {
      color: #fff; 
      .username {
        padding-right: 10px;
      }
      .ivu-icon {
        margin-left: 5px;
      }
    }
    img {
      outline: none;
      &.logo {
        height: 40px;
      }
      &.avatar {
        border-radius: 50%;
        width: 42px;
        height: 42px;
        vertical-align: middle;
        background: #eee;
      }
  }
    .dropdown-link{
        span{
            font-size: 18px;
        }
    }


}
.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal{
      top: 0;
  }
}




</style>
