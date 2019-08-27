import React, { Component } from 'react'
import './index.scss'
import icon_cancel from './assets/icon_cancel.png'
import { message } from 'antd'
import {getCode,findPassword} from '../../../../serivce'

export default class Login extends Component {
    constructor(){
        super()
        this.state = {
            phone:"",
            username:"",
            password:"",
            passwordConfirm:"",
            code:"",
            yzmBtnText: "获取验证码",
            countDown: 60,
            agree:true,
        }
    }
    onChangePhone(e){
        this.setState({phone:e.target.value})
    }
    onChangePassword(e){
        this.setState({password:e.target.value})
    }
    //获取验证码
    onGetCode(){
        const { phone, yzmBtnText } = this.state
        if (yzmBtnText !== "获取验证码") {
            return;
        }

        if (phone.length !== 11) {
            message.error('请输入正确的手机号码！')
            return;
        }
        const data = {
            phone: phone,
            type:'zcw'
        };
        this.countDowning()
        getCode(data).then(res => {

        }).catch(err => {
            console.log(err);
        });
    }
    //倒计时
    countDowning() {
        this.setState({
            yzmBtnText: this.state.countDown + 's',
        })

        this.countDowns = setInterval(() => {
            let { countDown } = this.state
            if (countDown === 0) {
                this.setState({
                    countDown: 60,
                    yzmBtnText: '获取验证码'
                })
                clearInterval(this.countDowns);
                return;
            }
            this.setState({
                yzmBtnText: this.state.countDown + "s",
                countDown: this.state.countDown - 1
            })
        }, 1000);
    }
    onSubmit(){
        const {phone,password,passwordConfirm,code,agree} = this.state
        if(phone===""||phone.length<11){
            message.error('请输入正确的手机号！')
            return
        }
        if(password===""||passwordConfirm===""||password.length<8){
            message.error('请输入正确的密码')
            return
        }
        if(password!==passwordConfirm){
            message.error('密码不一致')
            return
        }
        if(code===""){
            message.error('请输入验证码！')
            return
        }
        if(!agree){
            message.error('请阅读并同意用户协议')
            return
        }
        const data = {
            phone,
            password,
            confirmPassword:passwordConfirm,
            captcha:code,
        }
        findPassword(data).then(res=>{
            if(res.error){
                message.error(res.error)
                return
            }
            if(res.success){
                localStorage.setItem('token')
                // this.props.successRegister(res.token)
            }
        })
       
    
    }
    render() {
        const {phone,password,passwordConfirm,code,yzmBtnText} = this.state
        return (
            <div className="register-wrapper">
                <div className="login">
                    <img src={icon_cancel} alt="" className="icon-cancel" onClick={()=>this.props.closeForget()} />
                    <div className="title">找回密码</div>
                    <div className="input-wrapper">
                        <input className="phone" type="number" placeholder="请输入手机号" onChange={this.onChangePhone.bind(this)} value={phone}/>
                        <div className="code-wrapper">
                            <input className="code" type="number" placeholder="请输入验证码" onChange={(e)=>this.setState({code:e.target.value})} value={code}/>
                            <div className={yzmBtnText === '获取验证码' ?"code-btn":"code-btn gray"} onClick={this.onGetCode.bind(this)}>{yzmBtnText}</div>
                        </div>
                        <input className="password" type="password" placeholder="请输入8位以上密码" onChange={this.onChangePassword.bind(this)} value={password}/>
                        <input className="password" type="password" placeholder="请输入确认密码" onChange={(e)=>this.setState({passwordConfirm:e.target.value})} value={passwordConfirm}/>
                      
                        <div className="login-btn" onClick={this.onSubmit.bind(this)}>确认</div>
                        
                    </div>

                </div>
            </div>
        )
    }
}