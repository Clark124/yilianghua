import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux'

import Bundle from './bundle';
// const History = require('history')

// const history = History.createBrowserHistory()
// const location = history.location.pathname
// console.log(location)

// let isLogin = localStorage.getItem('userinfo');
// let userInfo = ""
// if (isLogin) {
//     userInfo = JSON.parse(isLogin)
// }
//判断是否是登录状态
// const nextRoute = ['/', '/home','/postcard','/searchcode','/information','/recentchat','/contractuser','/goldreward','/myAnswer','/redpackage']
// if (nextRoute.indexOf(location) >= 0 || location.includes('chatRoom') || location.includes('questionDetail')|| location.includes('userdetail') ) {
//     if (!isLogin) {
//         history.push('/')
//     } else {
//         if (location === '/') {
//             history.push('/home')
//         } else {
//             history.push(location)
//         }

//     }
// } else {
//     history.push('/')
// }

//首页
const Index = (props) => (
    <Bundle load={() => import('../pages/Index/Index')}>
        {(Index) => <Index {...props} />}
    </Bundle>
)

// 路由按需加载
const Compose = (props) => (
    <Bundle load={() => import('../pages/Compose/Index/Index')}>
        {(Index) => <Index {...props} />}
    </Bundle>
);

//交易室
const TradeRoom = (props) => (
    <Bundle load={() => import('../pages/TradeRoom/index')}>
        {(TradeRoom) => <TradeRoom {...props} />}
    </Bundle>
)

const Report = (props) => (
    <Bundle load={() => import('../pages/BackTestReport/index')}>
        {(Report) => <Report {...props} />}
    </Bundle>
)

//策略
const Startegy = (props) => (
    <Bundle load={() => import('../pages/Strategy/Index/index')}>
        {(Startegy) => <Startegy {...props} />}
    </Bundle>
)
//选股
const SelectStock = (props) => (
    <Bundle load={() => import('../pages/SelectStock/index')}>
        {(Select) => <Select {...props} />}
    </Bundle>
)

//扫描
const Scanning = (props) => (
    <Bundle load={() => import('../pages/Scanning/index')}>
        {(Scanning) => <Scanning {...props} />}
    </Bundle>
)

const routerMap = [
    { path: '/', component: Index, exact: true },
    { path: '/selectStock', component: SelectStock, exact: false },
    { path: '/compose', component: Compose, exact: false },
    { path: '/strategy', component: Startegy, exact: false },
    { path: '/scanning', component: Scanning, exact: false },
    { path: '/tradeRoom', component: TradeRoom, exact: true },
    { path: '/report', component: Report, exact: false },

]


class Routers extends Component {
    componentWillMount() {
        // this.props.getUserInfo(userInfo)
    }
    render() {
        return (
            <Router>
                <Switch>
                    {routerMap.map((router) =>
                        <Route key={router.path} exact={router.exact} path={router.path} component={router.component} />
                    )}
                </Switch>
            </Router>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(null, mapDispatchToProps)(Routers);

