<template>
  <div class="login-container">
    <div class="pageHeader">
      <span>LightMark编辑</span>
    </div>

    <div class="login-box">
      <div class="login-text" v-if="typeView !=2">
        <a href="javascript:;" :class="typeView == 0? 'active':''" @click="handleTab(0)">登录</a>
        <b>·</b>
        <a href="javascript:;" :class="typeView == 1? 'active':''" @click="handleTab(1)">注册</a>
      </div>

      <!-- 登录模块 -->
      <div class="content" v-show="typeView == 0">
        <div class="input-box">
          <input 
                autocomplete="off"
                type="text"
                placeholder="请输入注册邮箱/手机号"
                class ="input"
                v-model="formLogin.userName"/>
          <input 
                autocomplete="off"
                type="password"
                placeholder="请输入密码"
                class ="input"
                v-model="formLogin.userPwd"
                />
          <Button 
            class="loginBtn" 
            type="primary" 
            :disabled="isDisabled" 
            :loading="isLoading" 
            @click.stop="login">
            立即登录
          </Button>

          <div class="option">
            <Checkbox class="remember" v-model="checked" @on-change="checkChange">
              <span class="checked">记住我</span>
            </Checkbox>

            <span class="forget-pwd" @click.stop="forgetPwd">忘记密码？</span>
          </div>
      </div>
      </div>
      <!-- 注册模块 -->
      <div class="content" v-show="typeView == 1">
        <div class="input-box">
          <input 
                autocomplete="off"
                type="text"
                placeholder="请输入注册邮箱/手机号"
                class ="input"
                v-model="formRegister.userName"/>
          <input 
                autocomplete="off"
                type="password"
                placeholder="请输入密码"
                class ="input"
                v-model="formRegister.userPwd"
                maxlength="20"
                @keyup.enter ="register"
                />
          <input 
                autocomplete="off"
                type="password"
                placeholder="请再次输入密码"
                class ="input"
                v-model="formRegister.userPwd2"
                maxlength="20"
                @keyup.enter ="register"
                />
          <Button 
            class="loginBtn" 
            type="primary" 
            :disabled="isRegAble" 
            :loading="isLoading" 
            @click.stop="register">
            立即注册
          </Button>
        </div>
    </div>

  </div>
  </div>
</template>



<script>
import { 
  // login,
  register
 } from '@/utils/api';

export default {
  name:'login',
  components:{

  },
    data() {
    return {
      formLogin: {
        userName: '',
        userPwd: '',
      },
      formRegister: {
        userName: '',
        userPwd: '',
        userPwd2: '',
      },
      typeView: 0, //显示不同的view
      checked: false, // 记住登录
      isLoading: false,
    };
},
  computed: {
    // 登陆按钮状态
    isDisabled() {
      return !(this.formLogin.userName && this.formLogin.userPwd);
    },
    // 注册按钮状态
    isRegAble() {
      return !(this.formRegister.userName && this.formRegister.userPwd && this.formRegister.userPwd2);
    },
  },
  mounted() {
    this.getCookie();
  },
  methods: {
    // 登录/注册tab切换
    handleTab(type) {
      this.typeView = type;
      // console.log(type)
      this.clearInput();
    },
    // 输入框焦点样式
    focusInput(index) {
      if (index === 1)
        this.$refs.loginVerifyCode.style.borderBottomColor = '#0f52e0';
      else this.$refs.resetVerifyCode.style.borderBottomColor = '#0f52e0';
    },
    blurInput(index) {
      if (index === 2)
        this.$refs.resetVerifyCode.style.borderBottomColor = '#e7e7e7';
      else this.$refs.loginVerifyCode.style.borderBottomColor = '#e7e7e7';
    },
    // 返回登录界面
    selectLogin() {
      this.typeView = 0;
      this.clearInput();
    },
    //忘记密码界面
    forgetPwd() {
      this.$Message.info('忘记密码，请联系客服');
      // this.typeView = 2;
      // this.clearInput();
    },

    // 立即登录
    login() {
      console.log('登录')
      if (this.isDisabled || this.isLoading) {
        console.log('Loading')
        return false;
      }



      // if (!this.$Valid.validUserName(this.formLogin.userName)) {
      //   this.$Message.error('请输入正确的邮箱/手机号');
      //   return false;
      // }

      if (!this.$Valid.validPass(this.formLogin.userPwd)) {
        this.$Message.error('密码应为8到20位字母或数字！');
        return false;
      }

      // 预先登录
      setTimeout(()=>{
        this.$router.push('/home');
      },200)


      // // 判断复选框是否被勾选，勾选则调用配置cookie方法
      // if (this.checked) {
      //   // 传入账号名，密码，和保存天数3个参数
      //   this.setCookie(this.formLogin.userName, this.formLogin.userPwd, 7);
      // } else {
      //   // 清空Cookie
      //   this.clearCookie();
      // }
      
      // this.isLoading = true;

      // let form = {
      //   username: this.formLogin.userName,
      //   password: this.formLogin.userPwd
      // };

      // login(form)
      // .then(res => {
      //   console.log('登录===', res);
      //   this.isLoading = false;
      //   if (res.code == 0) {
      //     this.clearInput();
      //     this.$Message.success('登录成功');
      //     this.$store.dispatch('userInfo/saveInfo', res.data);
      //     this.$router.push('/home');
      //   } else {
      //     this.$Message.error(res.msg);
      //   }

      // })
      // .catch(() => {
      //   this.isLoading = false;
      // });
    },

        // 立即注册
    register() {
      if (this.isRegAble || this.isLoading) {
        return false;
      }

      if (!this.$Valid.validUserName(this.formRegister.userName)) {
        this.$Message.error("请输入正确的邮箱/手机号");
        return false;
      } else if (!this.$Valid.validPass(this.formRegister.userPwd)) {
        this.$Message.error("密码应为8到20位字母或数字！");
        return false;
      } else if (!this.$Valid.validPass(this.formRegister.userPwd2)){
        this.$Message.error("确认密码有误");
        return false;
      } else if (this.formRegister.userPwd2 !== this.formRegister.userPwd){
        this.$Message.error("两次密码不一致");
        return false;
      }

      this.isLoading = true;

      let data = {
        username: this.formRegister.userName,
        password: this.formRegister.userPwd2
      }

      register(data)
      .then(res => {
        this.isLoading = false;
        console.log('注册===', res);
        if (res.code == 0) {
          this.clearInput();
          this.$Message.success('注册成功');
          this.$store.dispatch('userInfo/saveInfo', res.data);
          this.$router.push('/home');
        } else {
          this.$Message.error(res.msg);
        }
      })
      .catch(() => {
        this.isLoading = false;
      })

    },
       // 设置cookie
    setCookie(user_name, user_pwd, exdays) {
      // 获取时间
      let exdate = new Date(); 
      // 保存的天数
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); 
      // 字符串拼接cookie
      window.document.cookie = 'userName' + '=' + user_name + ';path=/;expires=' + exdate.toUTCString();
      window.document.cookie = 'userPwd' + '=' + user_pwd + ';path=/;expires=' + exdate.toUTCString();
    },

    // 读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        // 这里显示的格式需要切割一下自己可输出看下
        let arr = document.cookie.split('; '); 
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          // 再次切割
          let arr2 = arr[i].split('='); 
          // 判断查找相对应的值
          if (arr2[0] == 'userName') {
            // 保存数据并赋值
            this.formLogin.userName = arr2[1]; 
          } else if (arr2[0] == 'userPwd') {
            this.formLogin.userPwd = arr2[1];
          }
        }
      }
    },

    //清除cookie
    clearCookie() {
      // 修改前2个值都为空，天数为负1天就好了
      this.setCookie('', '', -1); 
    },

    // 是否勾选记住密码
    checkChange(status) {
      console.log(status);
      this.checked = status;
    },

    // 清空输入框
    clearInput() {
      this.formLogin = {
        userName: '',
        userPwd: '',
      }
      this.formRegister = {
        userName: '',
        userPwd2: '',
        userPwd: '',
      }
    }

  }
}

</script>

<style lang="less" scoped>

*{
  padding: 0;
  margin: 0;
}

.login-container {
  background-image: url('../assets/pic/background1.jpg');
  background-position:center ;
  background-size: cover;
  position: relative;
  width: 100vw;
  height: 100vh;

  .pageHeader {
    padding-top: 40px;
    padding-left: 60px;
    
    img {
      vertical-align: middle;
      display: inline-block;
      margin-right: 15px;
    }

    span {
      font-size: 20px;
      display: inline-block;
      vertical-align: -4px;
      color: rgba(255, 255, 255, 1);
    }

  }
    .login-box{
      position: absolute;
      left:50%;
      top: 30%;
      transform: translateY(-50%);
      transform: translateX(-50%);
      box-sizing: border-box;
      text-align: center;
      box-shadow: 0 1px 11px rgba(0,0,0,0.3);
      border-radius: 2px;
      width:420px;
      background: #fff;
      padding: 45px 35px;


      .option{
        text-align: left;
        margin-top: 18px;
        .check{
          padding-left: 5px;
        }
        .forget-pwd, .goback{
          float: right;
          font-size:14px;
          font-weight: 400;
          color: gray;
          line-height: 20px;
          cursor: pointer;
        }
        .protocol{
          color: gray;
          cursor: pointer;
        }

      }

      .login-text {
        width: 100%;
        text-align: center;
        padding:  0 0 30px;
        font-size: 24px;
        letter-spacing: 1px;
        font-style: normal;
        a{
          text-decoration: none;
          padding: 10px;
          color: gray;
          &.active{
            font-weight: 600;
            color:#24292e;
            border-bottom: 2px solid #24292e;
          }
          &:hover{
            border-bottom: 2px solid #24292e;
          }
        }

        b {
          padding: 10px;
        }
        .title {
          font-weight: 600;
          padding: 0 0 30px;
          font-size: 24px;
          letter-spacing: 1px;
          color: gray;
        }
      }

      .input-box {
        .input {
          &:nth-child(1) {
          /*margin-top: 10px;*/
          }
          &:nth-child(2),
          &:nth-child(3) {
          margin-top: 20px;
          }
      }
    }
    .loginBtn {
      width: 100%;
      height: 45px;
      margin-top: 40px;
      font-size: 15px;
    }

    .input {
      padding: 10px 0px;
      font-size: 15px;
      width: 350px;
      color: #2c2e33;
      outline: none; // 去除选中状态边框
      border: 1px solid #fff;
      border-bottom-color: #e7e7e7;
      background-color: rgba(0, 0, 0, 0); // 透明背景
    }

    input:focus {
      border-bottom-color: #24292e;
      outline: none;
    }
    .button {
      line-height: 45px;
      cursor: pointer;
      margin-top: 50px;
      border: none;
      outline: none;
      height: 45px;
      width: 350px;
      background: rgba(216, 216, 216, 1);
      border-radius: 2px;
      color: white;
      font-size: 15px;
    }
    }

}

Button{
    background-color: #24292e;
    border-color: #24292e;
    &:hover{
      background-color: #24292e;
      border-color: #24292e;
      opacity: 0.9;
      }
    
}

</style>
