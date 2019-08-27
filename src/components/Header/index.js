import React, { Component } from 'react'
import './index.scss'
import logo from '../../assets/logo_03.png'
import search_icon from '../../assets/search_icon.jpg'

import { connect } from 'react-redux'
import { changeHeaderIndex } from '../../pages/Compose/Index/actions'
import { searchStcok, getUserinfo, getUnreadNum } from '../../serivce'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Agreement from './components/Agreement/index'
import Forget from './components/Forget/Forget'

import { Modal } from 'antd'

class Header extends Component {
    constructor() {
        super()
        this.state = {
            tabList: ['首页', '选股', '组合', '策略', '市场扫描', '交易室'],
            tabIndex: 0,
            hoverIndex: 0,
            searchList: [],
            searchText: "",
            showLogin: false,
            showRegister: false,
            showAgreement: false,
            showForget: false,
            isLogin: false,
            userinfo: {},
            unread: 0,
            showUserList: false,
        }
    }
    componentWillMount() {
        let search = this.props.history.location.search
        if (search) {
            let searchName = search.split('=')[0].substring(1)
            if (searchName === 'userId') {
                let userId = search.split('=')[1]
                localStorage.setItem('userId', userId)
            }
        }

        const token = localStorage.getItem('token')
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo && token) {
            this.setState({ userinfo: JSON.parse(userInfo), isLogin: false })
            this.onGetUnreadNum(token)
        }

        this.setTabIndex()
    }

    //当前tab的下标
    setTabIndex() {
        const pathname = this.props.history.location.pathname.substring(1)
        if (pathname === 'traderoom') {
            this.props.changeHeaderIndex(5)
        }
        if (pathname.includes('strategy')) {
            this.props.changeHeaderIndex(3)
        }
        if (pathname.includes('compose')) {
            this.props.changeHeaderIndex(2)
        }
        if (pathname.includes('selectStock')) {
            this.props.changeHeaderIndex(1)
        }
        if (pathname.includes('scanning')) {
            this.props.changeHeaderIndex(4)
        }

    }

    onTabHeader(index) {
        switch (index) {
            case 0:
                this.props.history.push('/')
                this.props.changeHeaderIndex(index)
                break
            case 1:
                // this.props.history.push('/selectStock')
                // this.props.changeHeaderIndex(index)
                break
            case 5:
                this.props.history.push('/traderoom')
                break
            default:
                break
        }
    }
    //搜索股票
    onSearchStock(e) {
        const code = e.target.value
        if (code === "") {
            this.setState({ searchList: [], searchText: "" })
        } else {
            searchStcok({ prod_code: code }).then(res => {
                this.setState({ searchList: res.data, searchText: code })
            })
        }
    }
    //登录成功
    successLogin(token) {
        this.onGetUserinfo(token)
        this.onGetUnreadNum(token)

    }
    //注册成功
    successRegister(token) {
        this.successLogin(token)
    }
    //获取用户信息
    onGetUserinfo(token) {
        getUserinfo({ token }).then(res => {
            localStorage.setItem('userInfo', JSON.stringify(res))
            localStorage.setItem('userId', res.id)
            window.location.reload();
            this.setState({ showLogin: false, isLogin: true, userinfo: res })
        })
    }
    //获取未读消息
    onGetUnreadNum(token) {
        getUnreadNum({ token }).then(res => {
            if(typeof res ==='number'){
                this.setState({ unread: res })
            }
        })
    }
    //退出登录
    logout() {
        this.setState({ userinfo: {}, isLogin: false })
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userId')
        this.props.history.replace('/')
    }
    closeAgreement() {
        this.setState({ showAgreement: false, showRegister: true })
    }
    onShowAgreement() {
        this.setState({ showAgreement: true, showRegister: false })
    }
    toTradeRoom(data) {
        this.props.history.push('/traderoom?code=' + data.prod_code)
    }
    selectStrategyTab(index) {
        let isLogin = this.isLogin()
        if (isLogin) {
            this.props.changeHeaderIndex(3)
            if (index === 1) {
                this.props.history.push('/strategy/edit')
            } else if (index === 3) {
                this.props.history.push('/strategy/rank')
            } else if (index === 0) {
                this.props.history.push('/strategy/create')
            }
        } else {
            Modal.info({
                title: "提示",
                content: "请先登录"
            })
            console.log('未登陆')
        }

    }
    selectStockTab(index) {
        let isLogin = this.isLogin()
        if (isLogin) {
            this.props.changeHeaderIndex(1)
            if (index === 0) {
                this.props.history.push('/selectStock')
            }else if(index===1){
                this.props.history.push('/selectStock/list')
            }
        } else {
            Modal.info({
                title: "提示",
                content: "请先登录"
            })
            console.log('未登陆')
        }
    }
    selectScanTab(index) {
        let isLogin = this.isLogin()
        if (isLogin) {
            this.props.changeHeaderIndex(4)
            if (index === 0) {
                this.props.history.push('/scanning/create')
            } else {
                this.props.history.push('/scanning/list')
            }
        } else {
            Modal.info({
                title: "提示",
                content: "请先登录"
            })
            console.log('未登陆')
        }
    }
    selectComposeTab(index) {
        let isLogin = this.isLogin()
        if (isLogin) {
            this.props.changeHeaderIndex(2)
            const userId = localStorage.getItem('userId')
            if (index === 0) {
                this.props.history.push('/compose/rank?userId=' + userId)
            } else if (index === 1) {
                this.props.history.push('/compose/create?userId=' + userId)
            } else if (index === 2) {
                this.props.history.push('/compose/mine?userId=' + userId)
            }
        } else {
            Modal.info({
                title: "提示",
                content: "请先登录"
            })
        }
    }
    isLogin() {
        const token = localStorage.getItem('token')
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo && token) {
            return true
        } else {
            return false
        }
    }

    render() {
        const { tabList, hoverIndex, searchList, searchText, showLogin, showRegister, showForget, showAgreement, userinfo, unread, showUserList } = this.state
        const tabIndex = this.props.headerIndex
        return (
            <div className="header-wrapper">
                {showLogin ? <Login
                    isLogin={this.successLogin.bind(this)}
                    cancelLogin={() => this.setState({ showLogin: false })}
                    toRegister={() => this.setState({ showRegister: true, showLogin: false })}
                    toForget={() => this.setState({ showLogin: false, showForget: true })}
                /> : null}

                {showRegister ? <Register
                    successRegister={this.successRegister.bind(this)}
                    closeRegister={() => this.setState({ showRegister: false })}
                    onShowAgreement={this.onShowAgreement.bind(this)}
                    toLogin={() => this.setState({ showRegister: false, showLogin: true })}
                /> : null}
                {showForget ?
                    <Forget
                        closeForget={() => this.setState({ showForget: false })}
                    /> : null
                }
                {showAgreement ? <Agreement closeAgreement={this.closeAgreement.bind(this)}

                /> : null}
                <div className="header">
                    <div className="left">
                        <img src={logo} alt="" className="logo" onClick={() => this.props.history.push('/')} />
                        <div className="header-tab">
                            {tabList.map((item, index) => {
                                return (
                                    <div className={tabIndex === index ? "tab-item active" : 'tab-item'}
                                        onClick={this.onTabHeader.bind(this, index)} key={index}
                                        onMouseEnter={() => this.setState({ hoverIndex: index })}
                                        onMouseLeave={() => this.setState({ hoverIndex: -1 })}
                                    >{item}
                                        <div className="tab-item-select-wrapper">
                                            {hoverIndex === 1 && index === 1 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectStockTab.bind(this, 0)}>智能选股</li>
                                                    {/* <li>场景分析</li> */}
                                                    <li onClick={this.selectStockTab.bind(this, 1)}>我的选股</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                            {hoverIndex === 2 && index === 2 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectComposeTab.bind(this, 0)}>组合排行</li>
                                                    <li onClick={this.selectComposeTab.bind(this, 1)}>创建组合</li>
                                                    <li onClick={this.selectComposeTab.bind(this, 2)}>我的组合</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                            {hoverIndex === 3 && index === 3 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectStrategyTab.bind(this, 0)}>搭建策略</li>
                                                    <li onClick={this.selectStrategyTab.bind(this, 1)}>编写策略</li>
                                                    <li onClick={() => {
                                                        this.props.history.push('/strategy/list')
                                                        this.props.changeHeaderIndex(index)
                                                    }}>我的策略</li>
                                                    <li onClick={this.selectStrategyTab.bind(this, 3)}>策略排行</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                            {hoverIndex === 4 && index === 4 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectScanTab.bind(this, 0)}>新建扫描</li>
                                                    <li onClick={this.selectScanTab.bind(this, 1)}>扫描列表</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                            {/* {hoverIndex === 5 && index === 5 ?
                                                <ul className="tab-item-select">
                                                    <li><a href="http://www.ezquant.cn/dealroom">我的自选股</a></li>
                                                    <li><a href="http://www.ezquant.cn/quote">行情</a></li>
                                                    <li><a href="http://www.ezquant.cn/news">资讯</a></li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            } */}
                                            {hoverIndex === 6 && index === 6 ?
                                                <ul className="tab-item-select">
                                                    <li><a href="http://www.ezquant.cn/quant/operation/manual">用户手册</a></li>
                                                    <li><a href="http://www.ezquant.cn/quant/school/index">学堂</a></li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                        </div>


                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    <div className="right">
                        <div className="input-wrapper">
                            <input className="input"
                                placeholder="请输入股票代码或简拼"
                                onChange={this.onSearchStock.bind(this)}
                                value={searchText}
                            />
                            <img src={search_icon} alt="" className="search-icon" />
                            {searchList.length > 0 ?
                                <ul className="stock-list">
                                    {searchList.map((item, index) => {
                                        return (
                                            <li key={index} onClick={this.toTradeRoom.bind(this, item)}>
                                                <span className="code">{item.prod_code.substring(0, 6)}</span>
                                                <span>{item.prod_name}</span>
                                            </li>
                                        )
                                    })}
                                </ul> : null
                            }

                        </div>
                        {userinfo.nickname ?
                            <div className="userinfo">
                                <span className="message">消息中心({unread})</span>
                                <img src={userinfo.portrait_thumbnail} alt="" className="avatar" />
                                <div className="username"
                                    onMouseEnter={() => this.setState({ showUserList: true })}
                                    onMouseLeave={() => this.setState({ showUserList: false })}
                                >
                                    <span className="name">{userinfo.nickname}</span>
                                    {showUserList ?
                                        <div className="user-list">
                                            <ul className="list">
                                                {/* <li>账号设置</li>
                                                <li>我的股票</li>
                                                <li>我的订单</li> */}
                                                <li onClick={this.logout.bind(this)}>退出账号</li>
                                            </ul>
                                        </div> : null
                                    }
                                </div>


                            </div> :
                            <div className="login-register">
                                <span onClick={() => this.setState({ showLogin: true })}>登录</span>
                                <span onClick={() => this.setState({ showRegister: true })}>注册</span>
                            </div>
                        }

                    </div>

                </div>
            </div >
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        headerIndex: state.home.headerIndex
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeHeaderIndex: (index) => {
            dispatch(changeHeaderIndex(index))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)

