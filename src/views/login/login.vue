<template>
<div class="note">
	<transition name="form-fade" mode="in-out">
		<div class="loginFrame login-container" v-show="showLogin">
			<el-form ref="form" status-icon :model="form" :rules="rules" label-width="0px" class="ruleForm">
				<h3>欢迎使用</h3>
				<div class="formGroup">
					<el-form-item prop="username">
	                    <el-input placeholder="请输入您的用户名" v-model="form.username" style="width:97%;height: 36px;">
	                        <el-button slot="prepend" icon="iconfont icon-user1"></el-button>
	                    </el-input>
	                    <span style="font-size: 14px;color: #e81c1c;">*</span>
	                </el-form-item>
					<el-form-item prop="password">
	                    <el-input type="password" placeholder="请输入您的密码" v-model="form.password" @keyup.enter.native="Login('form')" style="width: 97%;height: 36px;">
	                        <el-button slot="prepend" icon="iconfont icon-dengluzhucemima"></el-button>
	                    </el-input>
	                    <span style="font-size: 14px;color: #e81c1c;">*</span>
	                </el-form-item>
				</div>
			  	<div class="formButton">
					<el-form-item>
			    		<el-button style = "width: 97%;" @click="Login('form')" :loading="logining">登    录</el-button>
					</el-form-item>
				</div>
			</el-form>
			<div class="copy-right">Copyright  2019  文革建材</div>
		</div>
	</transition>
</div>
</template>
<script>
	export default {
	    data() {
	        return {
	            logining : false,
	            showLogin: false,
	            form: {
			        username: localStorage.username || "admin",
			        password: localStorage.password || "123456"
			    },
	            rules: {
	                username :[
	                    {
	                    	required: true,
	                    	message: '请输入账号',
	                    	trigger: 'blur'
	                    },
	                ],
	                password: [
	                    {
	                    	required: true,
	                    	message: '请输入密码',
	                    	trigger: 'blur'
	                    },
	                ]
	            },
	        };
	    },
	    mounted() {
		    this.showLogin = true;
		},
		methods:{
			Login(formName) {
		        this.$refs[formName].validate(valid => {
		          	if (valid) {
		            	this.logining = true;
		            	setTimeout(function(){
		            		this.logining = false;
		            		this.$router.push('/Activity');
		            		localStorage.username = this.form.username;
						    localStorage.password = this.form.password;
						    localStorage.token = 'aaaa';
	                  	}.bind(this),1000);
		           	}
		        });
		    }
		}
	}
</script>
 
<style scoped lang="scss">
	.note {
		position: relative;
        width:100%;
        height:100%;
        /* background:linear-gradient(#344159, #35425b);
        background: -webkit-linear-gradient(#344159, #35425b);
        background: -moz-linear-gradient(#344159, #35425b); 
        background: -o-linear-gradient(#344159, #35425b); */
        /* -webkit-filter: blur(2px);
          	    -moz-filter: blur(2px);
          	    -ms-filter: blur(2px);
          	    -o-filter: blur(2px);
          	    filter: blur(2px); */  
        background: url('../../../static/images/login-bg.jpg') 0 0 no-repeat;
        background-size: 100%;
        overflow: hidden;
        .login-container {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -255px;
			margin-left: -245px;
		    width: 490px;
			height: 510px;
			background-color: #ffffff;
			box-shadow: 0px 3px 24px 0px 
				rgba(0, 0, 0, 0.39);
			border-radius: 10px;
			-webkit-border-radius: 10px;
		    border-radius: 10px;
		    -moz-border-radius: 10px;
		    /*margin: 180px auto;*/
		    padding: 32px 35px 44px 50px;
		    box-sizing: border-box;
		    h3{
		    	text-align: center;
				font-size: 26px;
				color: #323232;
				margin-bottom: 25px;
				letter-spacing: 2px;
			}
			.formButton button{
				height: 46px;
				background-color: #446aaf;
				border-radius: 5px;
				font-size: 16px;
				color: #fefefe;
			}
			.copy-right{
				width: 97%;
				font-family: MicrosoftYaHei;
				font-size: 14px;
				line-height: 14px;
				color: #818891;
				margin-top: 14px;
				text-align: center;
			}
		}
    }
    .form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
</style>