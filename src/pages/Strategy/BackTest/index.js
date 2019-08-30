import React, { Component } from 'react'
import './index.scss'
import { Select, message, DatePicker, Modal, Checkbox } from 'antd'
import Moment from 'moment'
import {
    strategyDetail, fetchStategyList, searchStcok, getKline, getQuote,
    backtest, standardCurve, deployStrategy, backtestMuti, backtestSingle
} from '../../../serivce'
import { changeNumber } from '../../../utils/utils'
// import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import Loading from '../../../components/Loading/index'
import TrustModal from './components/Trusteeship/Trusteeship'
import MutiCodeReport from '../MutiCodeReport/index'

const { Option } = Select;
const { RangePicker } = DatePicker;


export default class BackTest extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            initialFunds: 100000, //初始资金
            beginTime: Moment().subtract(6, 'month'),
            endTime: Moment(),
            strategyList: [], //策略列表
            strategyParams: [], //策略参数
            strategyId: "", //策略id
            searchText: "",//股票代码
            testCode: "", //测试股票代码全称
            searchList: [], //搜索股票列表
            selectStockList: [],//选择股票列表
            backTestStatus: "", //回测状态
            stockDate: [], //股票K线图数据
            curveDatas: [],//策略，沪深300收益率
            period: 6,
            quote: {
                px_change_rate: 0,
                last_px: 0
            },//股票行情
            capital: [], //每日盈亏数据
            tradeRecords: [],//交易记录
            release_id: "",//回测ID
            showTrustModal: false, //显示托管策略
            mutiCodeReport: "",

        }
    }
    componentWillMount() {
        const strategyId = this.props.match.params.id
        if (parseInt(strategyId)) {
            this.setState({ strategyId })
            this.fetchStrategyist()
            this.getStrategyDetail(strategyId)
        } else {
            this.fetchStrategyist((data) => {
                this.getStrategyDetail(data[0].id)
                this.setState({ strategyId: data[0].id })
            })
        }


    }
    getStrategyDetail(id) {
        strategyDetail({ id }).then(res => {
            const { params } = res.result
            this.setState({ strategyParams: params })
        })
    }
    //策略列表
    fetchStrategyist(callback) {
        const token = localStorage.getItem('token')
        fetchStategyList({ flag: true, token }).then(res => {
            this.setState({ strategyList: res.result.strategy })
            if (callback && typeof callback === 'function') {
                callback(res.result.strategy)
            }
        })
    }
    //选择策略
    selectStrategy(e) {
        this.setState({ strategyId: e })
        this.getStrategyDetail(e)
    }

    //选择回测时间
    onChangeDate(e1, e2) {
        const beginTime = e1[0]
        const endTime = e1[1]
        this.setState({ beginTime, endTime })
    }
    handleData(time) {
        if (!time) {
            return false
        } else {
            // 大于当前日期不能选 time > moment()
            // 小于当前日期不能选 time < moment().subtract(1, "days")
            // 只能选前7后7 time < moment().subtract(7, "days") || time > moment().add(7, 'd')
            return time > Moment()
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
    //点击搜索的股票
    selectStock(item) {
        let { selectStockList } = this.state
        let isInclude = false
        selectStockList.forEach(stockItem => {
            if (stockItem.prod_code === item.prod_code) {
                isInclude = true
            }
        })

        if (!isInclude) {
            item.status = ''
            selectStockList.push(item)
        }
        this.setState({ selectStockList, searchList: [], searchText: "" })
        // this.onGetKline(item.prod_code, 6)
        // this.onGetQuote(item.prod_code)
        // this.setState({ searchList: [], searchText: item.prod_code.substring(0, 6) + " " + item.prod_name, testCode: item.prod_code })
    }
    //删除选择的股票列表
    cancelSelectStock(index) {
        let { selectStockList } = this.state
        selectStockList = selectStockList.filter((stockItem, stockIndex) => {
            return stockIndex !== index
        })
        this.setState({ selectStockList })
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
        return new Promise((resolve, reject) => {
            getQuote({ code }).then(res => {
                this.setState({ quote: res[0] })
                resolve(res[0])
            })
        })

    }

    periodCallback(item) {
        this.getUrlParam(item.period)
    }
    getUrlParam = (period) => {
        const code = this.state.testCode
        this.onGetKline(code, period)
        this.setState({ period })

    }

    //修改参数
    onChangeParams(e, index) {
        let { strategyParams } = this.state
        strategyParams[index].def_value = e.target.value
        this.setState({ strategyParams })
    }

    //点击开始回测
    // async onBackTest() {
    //     let { testCode, strategyId, beginTime, endTime, initialFunds, strategyParams } = this.state
    //     if (!testCode) {

    //         Modal.error({
    //             title: '提示',
    //             content: '请选择回测标的!',
    //         })
    //         return
    //     }
    //     let params = {}
    //     if (strategyParams.length > 0) {
    //         strategyParams.forEach(item => {
    //             params[item.name] = item.def_value
    //         })
    //     } else {
    //         params = { initCaptital: 100000 }
    //     }

    //     const token = localStorage.getItem('token')
    //     const data = {
    //         token,
    //         strategyId,
    //         period: 6,
    //         code: testCode,
    //         startTime: beginTime.format('YYYY-MM-DD'),
    //         endTime: endTime.format('YYYY-MM-DD'),
    //         strategy_params: JSON.stringify(params),
    //         funds: initialFunds
    //     }
    //     this.setState({ status: 'loading' })
    //     let standardData = await this.getStandardCurve()
    //     backtest(data).then(res => {
    //         this.setSignal(res)
    //         let tradeReturn = res.result.trade_return
    //         const capital = res.result.trade_pl
    //         const tradeRecords = res.result.alerts.map((item, index) => {
    //             return {
    //                 key: index,
    //                 date: item.time.substring(0, 10),
    //                 price: item.signal.price,
    //                 count: item.signal.lots,
    //                 direct: item.signal.type === 1 ? '买入' : '卖出'
    //             }
    //         })
    //         let datas = standardData.map((item, index) => {
    //             for (let i = 0; i < tradeReturn.length; i++) {
    //                 if (item.date === tradeReturn[i].date) {
    //                     item.value1 = tradeReturn[i].value
    //                     tradeReturn.splice(i, 1)
    //                 }
    //             }
    //             return item
    //         })
    //         this.setState({ curveDatas: datas, capital, release_id: res.result.release_id, tradeRecords, status: 'success' })
    //         message.success('回测完成~')
    //     }).catch(err => {
    //         this.setState({ status: 'success' })
    //     })

    // }
    async getBackTestData(testCode, callback) {
        let { strategyId, beginTime, endTime, initialFunds, strategyParams } = this.state

        let params = {}
        if (strategyParams.length > 0) {
            strategyParams.forEach(item => {
                params[item.name] = item.def_value
            })
        } else {
            params = { initCaptital: 100000 }
        }

        const token = localStorage.getItem('token')
        const data = {
            token,
            strategyId,
            period: 6,
            code: testCode,
            startTime: beginTime.format('YYYY-MM-DD'),
            endTime: endTime.format('YYYY-MM-DD'),
            strategy_params: JSON.stringify(params),
            funds: initialFunds
        }
        this.setState({ status: 'loading' })
        let standardData = await this.getStandardCurve()
        let quote = await this.onGetQuote(testCode)
        backtest(data).then(res => {
            getKline({ prod_code: testCode, period: 6 }).then(ret => {
                let stockData = ret.data.candle[testCode]
                let tradeReturn = res.result.trade_return
                const tradeRecords = res.result.alerts.map((item, index) => {
                    return {
                        key: index,
                        date: item.time.substring(0, 10),
                        price: item.signal.price,
                        count: item.signal.lots,
                        direct: item.signal.type === 1 ? '买入' : '卖出'
                    }
                })
                let datas = standardData.map((item, index) => {
                    for (let i = 0; i < tradeReturn.length; i++) {
                        if (item.date === tradeReturn[i].date) {
                            item.value1 = tradeReturn[i].value
                            tradeReturn.splice(i, 1)
                        }
                    }
                    return item
                })

                callback({
                    curveDatas: datas,
                    stockData,
                    tradeRecords,
                    quote,
                    alerts: res.result.alerts

                })
                this.setState({ status: 'success' })
            })



        }).catch(err => {
            this.setState({ status: 'success' })
        })

    }

    async onBackTest() {
        let { selectStockList, strategyId, beginTime, endTime, initialFunds, backTestStatus } = this.state
        if (backTestStatus === 'loading') {
            return
        }
        if (selectStockList.length === 0) {
            message.info('至少选择一个标的')
            return
        }


        this.setState({ backTestStatus: "loading" })
        for (let i = 0; i < selectStockList.length; i++) {
            const data = {
                strategyId: strategyId,
                initFund: initialFunds,
                code: selectStockList[i].prod_code,
                startDate: beginTime.format('YYYYMMDD'),
                endDate: endTime.format('YYYYMMDD'),
            }
            await this.singleBacktest(data, i)
        }
        this.setState({ backTestStatus: "success" })
    }
    singleBacktest(data, index) {
        const { selectStockList } = this.state
        return new Promise((resolve, reject) => {
            backtestSingle(data).then(res => {
                selectStockList[index].status = 'success'
                selectStockList[index].testData = res
                selectStockList[index].isSelect = false
                this.setState({ selectStockList })
                resolve()
            }).catch(err=>{
                selectStockList[index].status = 'fail'
                reject(err)
            })
        })
    }

    changeCheckbox(index) {
        let { selectStockList } = this.state
        selectStockList[index].isSelect = !selectStockList[index].isSelect
        this.setState({ selectStockList })
    }
    changeAllCheckbox(e) {
        let { selectStockList } = this.state
        if (e.target.checked) {
            selectStockList = selectStockList.map(item => {
                item.isSelect = true
                return item
            })
        } else {
            selectStockList = selectStockList.map(item => {
                item.isSelect = false
                return item
            })
        }
        this.setState({ selectStockList })

    }
    //跳转至报告详情页
    toReportDetail(data, stockname, code) {
        const { beginTime, endTime, strategyList, strategyId } = this.state
        let strategyName = ""
        strategyList.forEach(item => {
            if (item.id === parseInt(strategyId)) {
                strategyName = item.name
            }
        })
        data.info = {
            name: strategyName,
            prod_name: stockname,
            prod_code: code,
            time_start: beginTime.format('YYYY-MM-DD'),
            time_end: endTime.format('YYYY-MM-DD'),
        }
        this.getBackTestData(code, (res) => {
            data.dataList = res
            localStorage.setItem('backTestDetail', JSON.stringify(data))
            window.open(`/#/strategy/backtestReport`, "_blank");
        })

    }

    //获取沪深300曲线
    getStandardCurve() {
        return new Promise((resolve, reject) => {
            const { beginTime, endTime } = this.state
            const data = {
                period: 6,
                code: '000300.SS',
                startTime: beginTime.format('YYYY-MM-DD'),
                endTime: endTime.format('YYYY-MM-DD'),
            }
            standardCurve(data).then(res => {
                resolve(res.result)
            })
        })

    }

    //设置回测买卖点
    setSignal(res) {
        let { stockDate } = this.state
        this.setState({ stockDate })
        stockDate = stockDate.map(dataItem => {
            const currentDate = Moment(dataItem.date).format('YYYY-MM-DD')
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
        return stockDate
    }

    //查看分析报告
    lookReport() {
        const { release_id } = this.state
        if (!release_id) {
            Modal.error({
                title: '提示',
                content: '请先回测才能查看报告',
            })
            return
        }
        window.open(`/#/strategy/backtest/report/${release_id}`, "_blank");
        // this.props.history.push(`/strategy/backtest/report/${release_id}`)
    }
    //点击托管
    trustStrategy() {
        if (!this.state.testCode) {
            Modal.error({
                title: '提示',
                content: '请选择回测标的!',
            })
            return
        }
        this.setState({ showTrustModal: true })

    }

    //策略托管及发布
    onDeployStrategy(value) {
        const { name, description, is_publish, price, is_announce_source, is_system_use, system_use_price } = value
        const { strategyId, quote, initialFunds, strategyParams } = this.state
        const token = localStorage.getItem('token')
        let params = {}
        if (strategyParams.length > 0) {
            strategyParams.forEach(item => {
                params[item.name] = item.def_value
            })
        } else {
            params = { initCaptital: 100000 }
        }
        const data = {
            token,
            strategy_id: strategyId,
            period: 6,
            prod_code: quote.prod_code,
            prod_name: quote.prod_name,
            strategy_params: JSON.stringify(params),
            funds: initialFunds,
            name, description, is_publish, price, is_announce_source, is_system_use, system_use_price
        }
        this.setState({ status: 'trusting', showTrustModal: false })
        deployStrategy(data).then(res => {
            if (res.success) {
                // message.success('托管成功~')
                this.props.history.push({
                    pathname: '/strategy/list',
                    search: '?type=3'
                })
            }
            this.setState({ status: 'success' })

        }).catch(err => {
            this.setState({ status: 'success' })
            console.log(err)
        })

    }

    getComposeReport() {
        let { selectStockList, strategyId, beginTime, endTime, initialFunds } = this.state
        let code = ""
        selectStockList.forEach((item) => {
            if (item.isSelect) {
                code = code + item.prod_code + ','
            }
        })
        if (code === "") {
            message.info('请至少选择一个股票')
            return
        }
        const data = {
            strategyId: strategyId,
            initFund: initialFunds,
            code: code.slice(0, -1),
            startDate: beginTime.format('YYYYMMDD'),
            endDate: endTime.format('YYYYMMDD'),
        }
        console.log(data)
        this.setState({ status: 'loading' })
        backtestMuti(data).then(res => {
            this.setState({ status: 'success', mutiCodeReport: res })
        }).catch(err=>{
            message.error('网络出错')
            this.setState({ status: 'success'})
        })
    }




    render() {
        const { status, strategyParams, beginTime, endTime, initialFunds, searchText, strategyList, backTestStatus,
            strategyId, searchList, quote, curveDatas, showTrustModal, selectStockList, mutiCodeReport
        } = this.state

        let isCheckAll = true
        selectStockList.forEach(item => {
            if (!item.isSelect) {
                isCheckAll = false
            }
        })

        let strategyName = ""
        strategyList.forEach(item => {
            if (item.id === parseInt(strategyId)) {
                strategyName = item.name
            }
        })

        // //每日盈亏数据
        // let chartData = capital.map((item) => {
        //     let obj = {}
        //     obj['日期'] = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
        //     obj['盈亏'] = Number(item.value.toFixed(2))
        //     return obj

        // })

        //收益率数据
        let data = []
        curveDatas.forEach((item, index) => {
            let date = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
            let obj = {}
            obj.date = date
            obj['策略'] = item.value1
            obj['沪深300'] = item.value
            data.push(obj)
        })

        const ds = new DataSet();
        const dv = ds.createView().source(data);

        dv.transform({
            type: "fold",
            fields: ['策略', '沪深300'],
            key: "types",
            value: "收益率"
        });
        // const cols = {
        //     date: {
        //         // range: [0, 1],
        //         tickCount: 8,
        //     }
        // };
        return (
            <div className="back-test-wrapper">
                {status === 'loading' ? <Loading text="回测中..." /> : null}
                {status === 'trusting' ? <Loading text="托管中..." /> : null}
                <TrustModal visible={showTrustModal}
                    hideModal={() => this.setState({ showTrustModal: false })}
                    strategyName={strategyName}
                    quote={quote}
                    className="trust-modal"
                    deployStrategy={this.onDeployStrategy.bind(this)}
                />
                <div className="nav-title">
                    <span onClick={() => this.props.history.push('/strategy/rank')}>策略</span>
                    <span>></span>
                    <span onClick={() => this.props.history.push('/strategy/list')}>我的策略</span>
                    <span>></span>
                    <span className="current">{strategyName}</span>
                </div>
                <div className="model-title">参数设置</div>
                <div className="params-set-wrapper">
                    <div className="param-line">
                        <span className="param-name">策略名称：</span>
                        <Select style={{ width: 200 }} onChange={this.selectStrategy.bind(this)} value={strategyName}>
                            {strategyList.map((item, index) => {
                                return (
                                    <Option value={item.id} key={index}>{item.name}</Option>
                                )
                            })}
                        </Select>
                        <span className="param-name" style={{ marginLeft: 30 }}>回测评率：</span>
                        <Select style={{ width: 200 }} value={'1日'}>
                            <Option value={1}>1日</Option>

                        </Select>
                    </div>
                    <div className="param-line">
                        <span className="param-name">回测时间：</span>
                        <RangePicker onChange={this.onChangeDate.bind(this)}
                            defaultValue={[beginTime, endTime]}
                            format={'YYYY-MM-DD'}
                            disabledDate={this.handleData.bind(this)}
                        />
                    </div>
                    <div className="param-line">
                        <span className="param-name">初始资金：</span>
                        <input type="number" value={initialFunds} onChange={(e) => this.setState({ initialFunds: e.target.value })} />
                        <span className="param-name" style={{ marginLeft: 30 }}>回测标的：</span>
                        <input type="text" value={searchText} placeholder="请输入股票代码或简拼" onChange={this.onSearchStock.bind(this)} />
                        {searchList.length > 0 ?
                            <ul className="stock-list">
                                {searchList.map((item, index) => {
                                    return (
                                        <li key={index} onClick={this.selectStock.bind(this, item)}>
                                            <span className="code">{item.prod_code.substring(0, 6)}</span>
                                            <span>{item.prod_name}</span>
                                        </li>
                                    )
                                })}
                            </ul> : null
                        }
                    </div>

                    <div className="select-stock-list">
                        <div>已选股票列表</div>

                        {backTestStatus === 'success' ?
                            <table className="table">
                                <tbody className="table" cellPadding="0" cellSpacing="0">
                                    <tr className="table-header">
                                        <td>全选<Checkbox onChange={this.changeAllCheckbox.bind(this)} style={{ marginLeft: 5 }} checked={isCheckAll} /></td>
                                        <td>股票名称</td>
                                        <td>股票代码</td>
                                        <td>收益率(%)</td>
                                        <td>最大回测(%)</td>
                                        <td>详情</td>

                                    </tr>
                                    {selectStockList.map((item, index) => {
                                        return (
                                            <tr className="table-item" key={index}>
                                                <td><Checkbox onChange={this.changeCheckbox.bind(this, index)} checked={item.isSelect} /></td>
                                                <td>{item.prod_name}</td>
                                                <td>{item.prod_code}</td>
                                                <td>{(item.testData.return_ratio * 100).toFixed(2)}</td>
                                                <td>{(item.testData.MaxDD * 100).toFixed(2)}</td>
                                                <td><span className="detail-btn" onClick={this.toReportDetail.bind(this, item.testData, item.prod_name, item.prod_code)}>报告详情</span></td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table> :
                            <table className="table">
                                <tbody className="table" cellPadding="0" cellSpacing="0">
                                    <tr className="table-header">
                                        <td>股票名称</td>
                                        <td>股票代码</td>
                                        {backTestStatus === 'loading' ? <td>状态</td> : null}
                                        {backTestStatus === '' ? <td>操作</td> : null}

                                    </tr>
                                    {selectStockList.map((item, index) => {
                                        return (
                                            <tr className="table-item" key={index}>
                                                <td>{item.prod_name}</td>
                                                <td>{item.prod_code}</td>
                                                {backTestStatus === 'loading' ? <td>{item.status === 'success' ? "已完成" : "回测中..."}</td> : null}
                                                {backTestStatus === '' ? <td className="delete"><span onClick={this.cancelSelectStock.bind(this, index)}>删除</span></td> : null}
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        }
                    </div>

                </div>
                {strategyParams.length > 0 ?
                    <div className="params-list">
                        <span className="title">策略参数名称：</span>
                        {strategyParams.map((item, index) => {
                            return (
                                <div key={index} className="param-item">
                                    <span>{item.name}：</span>
                                    <input type="number" value={item.def_value} onChange={(e) => this.onChangeParams(e, index)} />
                                </div>
                            )
                        })}

                    </div> : null
                }

                {
                    backTestStatus !== 'success' ?
                        <div className="operate-btn">
                            <span className="btn" onClick={this.onBackTest.bind(this)}>{backTestStatus === 'loading' ? '回测中...' : '回测'}</span>
                            {/* <span className="btn" onClick={this.trustStrategy.bind(this)}>托管</span> */}
                        </div> : null
                }
                {
                    backTestStatus === 'success' ?
                        <div className="operate-btn">
                            <span className="btn" onClick={this.getComposeReport.bind(this)}>生成组合报告</span>
                        </div> : null
                }

                {mutiCodeReport ?<MutiCodeReport  datas={mutiCodeReport}/>
                    : null
                }









                {/* <div className="model-title">每日盈亏（￥）</div>
                <div style={{ background: '#fff', marginTop: 10, marginBottom: 30 }}>
                    <Chart padding="auto" height={300} data={chartData} forceFit>
                        <Axis name='日期' />
                        <Axis name='盈亏' />
                        <Tooltip />
                        <Geom type='interval' position='日期*盈亏' color={['盈亏', (value) => {
                            if (value > 0)
                                return '#f55454';
                            else
                                return 'green';
                        }]} />
                    </Chart>
                </div> */}



                {/* <div className="mark">风险提示：投资有风险，请自主决策。上述信息供交流使用，仅供参考，不对您构成任何投资建议，据此操作，风险自担。</div> */}
                {/* <div className="look-report" onClick={this.lookReport.bind(this)}>
                    查看分析报表
                </div> */}
            </div>
        )
    }
}