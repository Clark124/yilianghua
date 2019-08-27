import React, { Component } from 'react'
import './index.scss'
import Header from '../../components/Header/index'
import Footer from '../../components/Footer/index'
import Tourist from './Component/Tourist'
import Quote from './Component/Quote'
import Strategy from './Component/Strategy'
import Handicap from './Component/Handicap'
import CreatePool from './Component/CreatePool'
import TradeModal from './Component/Trade'

import {
    getKline, getLastKline, getQuote, getBalanceFast, getSellPoint,
    myStockPool, poolStcokList, deletePoolStock, searchStcok,
    addPoolStock, createPool, currentHold, isHoliday
} from '../../serivce'
import TradeRoomChart from '../../components/traderoomchart/traderoomchart'
import { changeNumber } from '../../utils/utils'
import moment from 'moment'
import { Select, message } from 'antd';

import search_icon from '../../assets/search_icon_1.jpg'
import reduce_icon from '../../assets/sub_op.png'
import add_icon from '../../assets/add_op.png'

const { Option } = Select;

const minuteData = [
    { title: '1 minute', value: '1 m', period: 1 },
    { title: '5 minute', value: '5 m', period: 2 },
    { title: '15 minute', value: '15 m', period: 3 },
    { title: '30 minute', value: '30m', period: 4 },
    { title: '1 Hour', value: '1 H', period: 5 },
    { title: '1 Day', value: '1 D', period: 6 },
    { title: '7 Day', value: '7 D', period: 7 },
    { title: '1 Month', value: '1 M', period: 8 },
]


export default class TradeRoom extends Component {
    constructor() {
        super()
        this.state = {
            token: "",
            isHoliday: false, //是否节假日
            stockPoolIndex: 0,
            tabRightIndex: 1,
            stockDate: [], //股票K线图数据
            period: 6,
            userInfo: "",
            code: "", //股票代码
            quote: {},//股票行情
            balance: {
                floatProfit: 0, //浮动盈亏
            },//资金数据
            poolList: [], //股票池
            poolIndex: 0, //当前股票池的下标
            poolStockList: [],//股票池名称对应的股票列表
            searchStockList: [],//搜索股票列表
            searchText: "",
            showCreatePool: false, //显示创建股票池
            showTradeModel: false, //显示交易模块
            currentHoldList:[], //当前持仓列表

        }
    }
    componentWillMount() {
        let code = ""
        //判断是否有查询的股票
        const search = this.props.location.search
        if (search) {
            code = search.split('=')[1]
        } else {
            code = '000001.SS'
        }

        this.onGetQuote(code)

        this.setState({ code })

        const userInfo = localStorage.getItem('userInfo')
        const token = localStorage.getItem('token')
        if (userInfo) {
            this.setState({ userInfo: JSON.parse(userInfo) })
        }
        if (token) {
            this.onGetBalanceFast(token)
            this.onCurrentHold(token)
            this.onGetMyPool(token)
            this.setState({ token })
        }
        this.onGetKline(code, 6)
        this.getHoliday(this.refreshData.bind(this, code, 6))
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    //判断是否节假日
    getHoliday(callback) {
        isHoliday({}).then(res => {
            const currentYear = new Date().getFullYear()
            let dateList = ""
            if (res.data[currentYear]) {
                dateList = res.data[currentYear].split(',')
                const nowDate = moment(new Date()).format('YYYYMMDD')
                if (dateList.includes(nowDate)) {
                    this.setState({ isHoliday: true })
                } else {
                    if (callback) {
                        callback()
                    }
                }
            }
        }).catch(err => {
            console.log(err)
        })
    }
    //刷新数据
    refreshData(code, period) {
        const currentTime = new Date().toTimeString()
        const { isHoliday } = this.state
        const token = localStorage.getItem('token')
        if (!isHoliday) {
            if ((currentTime >= '09:00:00' && currentTime <= '11:30:00') || (currentTime >= '13:00:00' && currentTime <= '15:00:00')) {
                this.timer = setInterval(() => {
                    if (period === 1) {
                        this.onGetKline(code, period)
                    } else {
                        this.onGetLastKline(code, period)
                    }
                    this.onGetQuote(code)
                    if (token) {
                        this.onCurrentHold(token)
                        this.onGetBalanceFast(token)
                    }

                }, 3000)
            }
        }

    }

    onGetLastKline(prod_code, period) {
        let { stockDate } = this.state
        const len = stockDate.length
        getLastKline({ prod_code, period }).then(res => {
            let result = res.data.candle[prod_code]
            result = changeNumber(result, 2)
            result = result[1]
          
            if(stockDate[len - 1].date.toLocaleString()===result.date.toLocaleString()){
                stockDate[len - 1] = { ...stockDate[len - 1], ...result }
            }else{
                stockDate.push(result)
            }
          
           
            this.setState({ stockDate })
        })
    }

    //K线图数据
    onGetKline(prod_code, period) {
        getKline({ prod_code, period }).then(res => {
            let data = res.data.candle[prod_code]
            data = changeNumber(data, 2)
            this.setState({ stockDate: data })
        })
    }
    //股票行情数据
    onGetQuote(code) {
        getQuote({ code }).then(res => {
            this.setState({ quote: res[0] })
        })
    }
    //交易及资金数据
    onGetBalanceFast(token) {
        getBalanceFast({ token }).then(res => {
            this.setState({ balance: { ...this.state.balance, ...res.data.data[0] } })
        })
    }

    //当前持仓
    onCurrentHold(token) {
        currentHold({ token }).then(res => {
            const data = res.data.data
            //计算浮动盈亏
            let floatProfit = 0
            if(data&&data.length>0){
                data.forEach(item => {
                    floatProfit = floatProfit + Number(item.day_income_balance)
                })
            }
          
            this.setState({ balance: { ...this.state.balance, floatProfit },currentHoldList: data})
        })
    }
    //获取我的股票池
    onGetMyPool(token) {
        myStockPool({ token }).then(res => {
            this.setState({ poolList: res.data })
            this.poolStcokList(res.data[0].id)
        })
    }
    //切换股票池
    changePool(e) {
        const { poolList } = this.state
        let index = 0
        poolList.forEach((item, itemIndex) => {
            if (item.id === e) {
                index = itemIndex
            }
        })
        this.setState({ poolIndex: index })
        this.poolStcokList(e)

    }

    poolStcokList(id) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            id,
            page_count: 1000
        }
        poolStcokList(data).then(res => {
            this.setState({ poolStockList: res.data })
        })

    }


    changePoolTab(index) {
        this.setState({ stockPoolIndex: index })
    }
    changeRightTab(index) {
        this.setState({ tabRightIndex: index })
    }
    periodCallback(item) {
        clearInterval(this.timer)
        this.getUrlParam(item.period)
    }
    getUrlParam = (period) => {
        const code = this.state.code
        this.onGetKline(code, period)
        this.refreshData(code, period)
        this.setState({ period })

    }

    //点击策略设置好买卖点
    setBuyPoint(item) {
        let { period, stockDate } = this.state
        if (period !== 6) {
            return
        }
        this.setState({ stockDate })
        const data = {
            strategyId: item.strategy_id,
            period: 6,
            code: item.stock_code,
            funds: 10000,
            startTime: moment(new Date()).subtract(1, 'year').format('YYYY-MM-DD'),
            endTime: moment(new Date()).format('YYYY-MM-DD'),
            strategy_params: item.strategy_params,
            strategy_name: item.strategy_name,
            strategy_version: item.strategy_version,
        }

        getSellPoint(data).then(res => {
            stockDate = stockDate.map(dataItem => {
                const currentDate = moment(dataItem.date).format('YYYY-MM-DD')
                let hasSignal = false
                let signal = ""
                res.result.alerts.forEach(resItem => {
                    const alertDate = resItem.time.substring(0, 10)

                    if (currentDate === alertDate) {
                        hasSignal = true

                        if (resItem.signal.type === 1) {
                            signal = 'buy'
                        } else {
                            signal = 'sell'
                        }
                    }
                })
                if (hasSignal) {
                    dataItem.signal = signal
                    return dataItem
                } else {
                    delete dataItem.signal
                    return dataItem
                }
            })
            this.setState({ stockDate })
        })

    }
    //设置回测买卖点
    setSignal(alerts) {
        let { stockDate } = this.state
        this.setState({ stockDate })
        stockDate = stockDate.map(dataItem => {
            const currentDate = moment(dataItem.date).format('YYYY-MM-DD')
            let hasSignal = false
            let signal = ""
            alerts.forEach(resItem => {
                const alertDate = resItem.time.substring(0, 10)

                if (currentDate === alertDate) {
                    hasSignal = true

                    if (resItem.signal.type === 1) {
                        signal = 'buy'
                    } else {
                        signal = 'sell'
                    }
                }
            })
            if (hasSignal) {
                dataItem.signal = signal
                return dataItem
            } else {
                delete dataItem.signal
                return dataItem
            }
        })
        this.setState({ stockDate })
    }

    //更换股票K线数据及行情数据
    changeStock(item) {
        const code = item.stock_code
        if (this.timer) {
            clearInterval(this.timer)
        }
        const { tabRightIndex } = this.state
        if (tabRightIndex === 1) {
            this.refs.strategy.refreshStrategy(code)
        } else {
            this.refs.strategy.getData(code)
        }
        this.refs.quote.changeCode(code)
        this.onGetQuote(code)
        this.setState({ code, period: 6, stockDate: [] })
        this.onGetKline(code, 6)
        this.refreshData(code, 6)
    }
    //股票池股票
    changeStock1(item) {
        if (this.timer) {
            clearInterval(this.timer)
        }
        const code = item.prod_code
        const { tabRightIndex } = this.state
        if (tabRightIndex === 1) {
            this.refs.strategy.refreshStrategy(code)
        } else {
            this.refs.strategy.getData(code)
        }
        this.refs.quote.changeCode(code)
        this.onGetQuote(code)
        this.setState({ code, period: 6, stockDate: [] })
        this.onGetKline(code, 6)
        this.refreshData(code, 6)
    }
    //搜索后更新股票
    changeStock2(item) {
        if (this.timer) {
            clearInterval(this.timer)
        }
        const code = item.prod_code
        const { tabRightIndex } = this.state
        if (tabRightIndex === 1) {
            this.refs.strategy.refreshStrategy(code)
        } else {
            this.refs.strategy.getData(code)
        }
        this.refs.quote.changeCode(code)
        this.onGetQuote(code)
        
        this.setState({ code, period: 6, stockDate: [], searchStockList: [], searchText: "" })
        this.onGetKline(code, 6)
        this.refreshData(code, 6)
    }
    //通过当前持仓切换股票
    changeStock3(code) {
        if (this.timer) {
            clearInterval(this.timer)
        }
        const { tabRightIndex } = this.state
        if (tabRightIndex === 1) {
            this.refs.strategy.refreshStrategy(code)
        } else {
            this.refs.strategy.getData(code)
        }
        this.refs.quote.changeCode(code)
        this.onGetQuote(code)
        this.setState({ code, period: 6, stockDate: [] })
        this.onGetKline(code, 6)
        this.refreshData(code, 6)
    }
    //创建股票池
    onCreatePool(text) {
        const { token } = this.state
        createPool({ token, name: text }).then(res => {
            message.success('创建成功！')
            myStockPool({ token }).then(res => {
                this.setState({ poolList: res.data })

                this.setState({ showCreatePool: false, poolStockList: [], poolIndex: res.data.length - 1 })
            })

        })
    }

    //删除自选股的股票
    onDeletePoolStock(index, item) {
        let { poolList, poolIndex, poolStockList } = this.state
        const token = localStorage.getItem('token')
        const codes = item.prod_code
        const stock_pool_id = poolList[poolIndex].id
        const data = {
            token, codes, stock_pool_id
        }
        deletePoolStock(data).then(res => {
            if (res.success) {
                poolStockList = poolStockList.filter((stock, stockIndex) => {
                    return index !== stockIndex
                })
                this.setState({ poolStockList })
                message.success('删除成功')
            }
        })

    }
    //增加自选股的股票
    onAddPoolStock(e, item) {
        e.stopPropagation()
        let { poolList, poolIndex } = this.state
        const token = localStorage.getItem('token')
        if (!token) {
            message.warning('请先登录~')
            return
        }
        let codes = [{ 'name': item.prod_name, 'code': item.prod_code }]
        codes = JSON.stringify(codes)
        const stock_pool_id = poolList[poolIndex].id
        const data = {
            token, codes, stock_pool_id
        }
        addPoolStock(data).then(res => {
            if (res.success) {
                this.poolStcokList(stock_pool_id)
                this.setState({ searchStockList: [], searchText: "" })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    //输入搜索股票
    onChangeSearch(e) {
        const code = e.target.value
        if (code === "") {
            this.setState({ searchStockList: [], searchText: "" })
        } else {
            searchStcok({ prod_code: code }).then(res => {
                this.setState({ searchStockList: res.data, searchText: code })
            })
        }
    }

    //显示交易模块
    openTradeModal(type){
        this.setState({showTradeModel:true},()=>{
            let index = 0
            if(type===0){
                index = 7
            }else if(type===1){
                index = 0
            }else if(type===2){
                index = 1
            }
            this.refs.tradeModal.onChangeTab(index)
        })
    }

    // //重置交易模块输入
    // resetTradeModal(){
    //     if(this.state.showTradeModel){
    //         this.refs.tradeModal
    //     }
    // }


    render() {
        const { userInfo, stockPoolIndex, tabRightIndex, stockDate, quote, balance, code, poolList, poolIndex, poolStockList,
            searchText, searchStockList, showCreatePool, isHoliday, showTradeModel,currentHoldList
        } = this.state
        let poolValue = ""
        if (poolList.length > 0) {
            poolValue = poolList[poolIndex].name
        }
        return (
            <div className="traderoom-wrapper">
                <Header history={this.props.history} />
                <div className="traderoom-container">
                    <div className="user-message">
                        <Tourist
                            userInfo={userInfo}
                            balance={balance}
                        />

                    </div>
                    <div className="stock-chart-wrapper">
                        <div className="main">
                            <div className="left">
                                <div className="tab">
                                    <span onClick={this.changePoolTab.bind(this, 0)} className={stockPoolIndex === 0 ? 'active' : ''}>我的股票池</span>
                                    {/* <span onClick={this.changePoolTab.bind(this, 1)} className={stockPoolIndex === 1 ? 'active' : ''}>我的组合</span> */}
                                </div>
                                <div className="content">
                                    <div className="pool">
                                        <Select defaultValue="自选股" style={{ width: 199, border: 'none' }} onChange={this.changePool.bind(this)} value={poolValue}>
                                            {poolList.map((item, index) => {
                                                return <Option value={item.id} key={index}>{item.name}</Option>
                                            })}
                                        </Select>
                                        <div className="search-wrapper">
                                            <input type="text" placeholder="请输入股票代码或简拼" onChange={this.onChangeSearch.bind(this)} value={searchText} />
                                            <img src={search_icon} alt="" className="icon-search" />
                                        </div>
                                        <div className="stock-list">
                                            {
                                                poolStockList.map((item, index) => {
                                                    return (
                                                        <div className="stock-item" key={index}>
                                                            <div className="stock-item-name" onClick={this.changeStock1.bind(this, item)}>
                                                                <span className="stock-name">{item.prod_name}</span>
                                                                <span className={item.px_change_rate >= 0 ? "price" : "price green"}>{item.last_px.toFixed(2)}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span className={item.px_change_rate >= 0 ? "rate" : "rate green"}>{item.px_change_rate.toFixed(2)}%</span>
                                                                <img src={reduce_icon} alt="" className="reduce-icon" onClick={this.onDeletePoolStock.bind(this, index, item)} />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        {searchStockList.length > 0 ?
                                            <div className="search-list-wrapper">
                                                {searchStockList.map((item, index) => {
                                                    return (
                                                        <div className="search-item" key={index} onClick={this.changeStock2.bind(this, item)}>
                                                            <div>
                                                                <span className="code">{item.prod_code.substring(0, 6)}</span>
                                                                <span className="name">{item.prod_name}</span>
                                                            </div>
                                                            <img src={add_icon} alt="" className="add-icon" onClick={(e) => this.onAddPoolStock(e, item)} />
                                                        </div>
                                                    )
                                                })}
                                            </div> : null
                                        }

                                        <div className="create-pool" onClick={() => {
                                            if (!this.state.token) {
                                                message.warning('请先登录~')
                                                return
                                            }
                                            this.setState({ showCreatePool: true })
                                        }}>
                                            新建股票池
                                        </div>
                                    </div>

                                </div>

                                {/* <div className="news">
                                    <div className="title">
                                        相关动态
                                    </div>
                                </div> */}
                            </div>
                            <div className="right">
                                <div className="stock-container">
                                    <div className="stock-chart">
                                        {stockDate.length > 0 ?
                                            <TradeRoomChart
                                                data={stockDate}
                                                width={760}
                                                height={565}
                                                minuteData={minuteData}  //可根据股票或者外汇来设定
                                                periodCallback={this.periodCallback.bind(this)} //周期回调
                                                quote={quote}
                                            /> : null
                                        }

                                    </div>
                                    <div className="strategy-wrapper">
                                        <div className="tab">
                                            <span onClick={this.changeRightTab.bind(this, 0)} className={tabRightIndex === 0 ? 'active' : ''}>盘口</span>
                                            <span onClick={this.changeRightTab.bind(this, 1)} className={tabRightIndex === 1 ? 'active' : ''}>策略</span>
                                        </div>
                                        {tabRightIndex === 1 ? <Strategy
                                            ref="strategy"
                                            setBuyPoint={this.setBuyPoint.bind(this)}
                                            setSignal={this.setSignal.bind(this)}
                                            changeStock={this.changeStock.bind(this)}
                                            {...this.props}
                                            code={code} /> : null}
                                        {tabRightIndex === 0 && quote.prod_name ?
                                            <Handicap
                                                ref="strategy"
                                                code={code}
                                                quote={quote}
                                                isHoliday={isHoliday}
                                            /> : null}
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="bottom">
                            <div className="item">
                                <span>可用：</span>
                                <span>{balance.enable_balance}</span>
                            </div>
                            <div className="item">
                                <span>市值：</span>
                                <span>{balance.market_value}</span>
                            </div>
                            <div className="item">
                                <span>资产：</span>
                                <span>{balance.asset_balance}</span>
                            </div>
                            <div className="trade-btn">
                                <span className="btn hold" onClick={this.openTradeModal.bind(this,0)}>查看持仓</span>
                                <span className="btn buy" onClick={this.openTradeModal.bind(this,1)}>买入</span>
                                <span className="btn sell" onClick={this.openTradeModal.bind(this,2)}>卖出</span>
                            </div>
                        </div>

                        {showTradeModel ?
                            <TradeModal
                                closeTradeModal={() => this.setState({ showTradeModel: false })}
                                onChangeStock={(code)=>this.changeStock3(code)}
                                balance={balance}
                                currentHoldList={currentHoldList}
                                quote={quote}
                                ref="tradeModal"
                            /> : null}
                    </div>

                    {quote.prod_name ? <Quote quote={quote} {...this.props} ref="quote"/> : null}
                </div>
                <Footer />
                {showCreatePool ? <CreatePool
                    cancelCreatePool={() => this.setState({ showCreatePool: false })}
                    createPool={this.onCreatePool.bind(this)}
                /> : null}
            </div>
        )
    }
}