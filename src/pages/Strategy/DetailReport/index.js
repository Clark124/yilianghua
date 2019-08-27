import React, { Component } from 'react'
import './index.scss'
import { strategyDetailReport, collectFollow, addCollect, standardCurve,getKline ,getQuote} from '../../../serivce'
import Loading from '../../../components/Loading/index'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import Moment from 'moment'
import DataSet from "@antv/data-set";
import { Modal } from 'antd'
import TradeRoomChart from '../../../components/traderoomchart/traderoomchart'
import { changeNumber } from '../../../utils/utils'


const minuteData = []


export default class DetailReport extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            data: {},
            visible: false,
            visibleCode: false,
            followCount: 1,
            stockDate: [],
            quote: {
                px_change_rate: 0,
                last_px: 0
            },
        }
    }


    componentWillMount() {
        this.onStrategyDetailReport()
    }
    onStrategyDetailReport() {
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        const data = {
            id,
            token,
        }
        strategyDetailReport(data).then(async res => {
            const { time_start, time_end, trade_return,prod_code,alerts } = res
            this.onGetKline(prod_code,6,alerts)
            this.onGetQuote(prod_code)
            let standardData = await this.getStandardCurve(time_start, time_end)
            let datas = standardData.map((item, index) => {
                for (let i = 0; i < trade_return.length; i++) {
                    if (item.date === trade_return[i].date) {
                        item.value1 = Number(trade_return[i].value.toFixed(2))
                        item.value = Number(item.value.toFixed(2))
                        trade_return.splice(i, 1)
                    }
                }
                return item
            })
            res.trade_return = datas
            this.setState({ data: res, status: "success" })
        })
    }
     //K线图数据
     onGetKline(prod_code, period,alerts) {
        getKline({ prod_code, period }).then(res => {
            let data = res.data.candle[prod_code]
            data = changeNumber(data, 2)
            this.setSignal(alerts,data)
            // this.setState({ stockDate: data })
        })
    }
     //设置回测买卖点
     setSignal(alerts,data) {
     
        this.setState({ stockDate :data})
        let stockDate = data.map(dataItem => {
            const currentDate = Moment(dataItem.date).format('YYYY-MM-DD')
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
    //股票行情数据
    onGetQuote(code) {
        getQuote({ code }).then(res => {
            this.setState({ quote: res[0] })
        })
    }

    //获取沪深300曲线
    getStandardCurve(beginTime, endTime) {
        return new Promise((resolve, reject) => {
            const data = {
                period: 6,
                code: '000300.SS',
                startTime: beginTime,
                endTime: endTime,
            }
            standardCurve(data).then(res => {
                resolve(res.result)
            })
        })

    }

    followOrder(type) {
        if (!type) {
            Modal.info({
                title: "提示",
                content: "已经跟单过了"
            })
        } else {
            this.setState({ visible: true })
        }
    }
    followOk() {
        const { data, followCount } = this.state
        const token = localStorage.getItem('token')
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        const body = {
            release_id: data.id,
            link: '/quant/strategy/list?upBtn1=follow',
            message: `${userInfo.nickname}订购了你的策略`,
            type: 'follow'
        }
        const datas = {
            token,
            body: JSON.stringify(body),
            unit_count: followCount,
            subject: `跟单${followCount}个月`
        }
        collectFollow(datas).then(res => {
            if (res.data === 'success') {
                this.setState({
                    visible: false,
                    // data: { ...this.state.data, is_subscription: true }
                })
                // message.success('跟单成功！')
                this.props.history.push({
                    pathname: '/strategy/list',
                    search: '?type=4'
                })
            }
        })
    }

    collectOrder(type) {
        if (!type) {
            Modal.info({
                title: "提示",
                content: "已经收藏过了"
            })
        } else {
            const id = this.state.data.id
            const token = localStorage.getItem("token")
            const data = {
                token,
                collect_id: id,
                type: 'strategy'
            }
            addCollect(data).then(res => {
                this.setState({ data: { ...this.state.data, is_collect: true } })
                Modal.success({
                    title: "提示",
                    content: "收藏成功"
                })
            })
        }
    }

    reduceFollowCount() {
        const { followCount } = this.state
        if (followCount <= 1) {
            return
        }
        this.setState({ followCount: this.state.followCount - 1 })
    }
    addFollowCount() {
        this.setState({ followCount: this.state.followCount + 1 })
    }




    render() {
        const { status } = this.state
        if (status === 'success') {
            const {
                // is_subscription, is_collect, nickname, create_date, description, 
                name, prod_name, prod_code, time_start, time_end,
                return_ratio, MaxDD, max_nwinner, winner_avg, nwinner,
                timing_raio, return_risk_ratio, nloser, loser_avg, max_nloser, yearly_return_ratio, profit_factor, largest_capital,
                minimum_capital, winning_ratio,
                trade_return, alerts, express,
            } = this.state.data
            const { followCount, stockDate, quote } = this.state
            let data = []
            trade_return.forEach((item, index) => {
                let date = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                let obj = {}
                obj.date = date
                obj['用户收益'] = item.value1
                obj['沪深300'] = item.value
                data.push(obj)
            })

            const ds = new DataSet();
            const dv = ds.createView().source(data);

            dv.transform({
                type: "fold",
                fields: ['用户收益', '沪深300'],
                key: "types",
                value: "收益率"
            });
            const cols = {
                date: {
                    // range: [0, 1],
                    tickCount: 8,
                }
            };
            return (
                <div className="detail-report-wrapper">
                    <div className="nav-title">
                        <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                        <span>></span>
                        <span onClick={()=>this.props.history.push('/strategy/rank')}>策略排行榜</span>
                        <span>></span>
                        <span className="current">回测报告</span>
                    </div>
                    {/* <div className="base-info-wrapper">
                        <div className="strategy-name">{name}</div>
                        <div className="operate-btn">
                            {is_subscription ? <span className="has" onClick={this.followOrder.bind(this, false)}>已跟单</span> : <span className="orange" onClick={this.followOrder.bind(this, true)}>跟单</span>}
                            {is_collect ? <span className="has" onClick={this.collectOrder.bind(this, false)}>已收藏</span> : <span onClick={this.collectOrder.bind(this, true)}>收藏</span>}
                        </div>
                        <div className="create">
                            <span>创建人：{nickname}</span>
                            <span>创建时间：{create_date}</span>
                        </div>
                        <div className="intro">策略介绍：{description ? description : '无'}</div>
                        <div className="look-btn">
                            <span onClick={() => this.setState({ visibleCode: true })}>查看策略源码</span>

                        </div>
                    </div> */}

                    <div className="backtest-title">策略基本信息：</div>
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>策略名称</td>
                                <td>交易证券</td>
                                <td>开始日期</td>
                                <td>结束日期</td>
                                <td>K线周期</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{name}</td>
                                <td>{prod_name}({prod_code.substring(0, 6)})</td>
                                <td>{time_start}</td>
                                <td>{time_end}</td>
                                <td>1日</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="backtest-title">基本交易统计信息：</div>
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>收益率</td>
                                <td>最大回测</td>
                                <td>盈利次数</td>
                                <td>平均盈利</td>
                                <td>连续盈利次数</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{(return_ratio * 100).toFixed(2)}%</td>
                                <td>{Number(MaxDD) * 100}%</td>
                                <td>{nwinner}</td>
                                <td>{Number(winner_avg).toFixed(2)}</td>
                                <td>{max_nwinner}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table item" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>择时收益率</td>
                                <td>收益风险比</td>
                                <td>亏损次数</td>
                                <td>平均亏损</td>
                                <td>连续亏损次数</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{(timing_raio * 100).toFixed(2)}%</td>
                                <td>{return_risk_ratio.toFixed(2)}%</td>
                                <td>{nloser}</td>
                                <td>{Number(loser_avg).toFixed(2)}</td>
                                <td>{max_nloser}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table item" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>年化收益率</td>
                                <td>获利因子</td>
                                <td>赢率</td>
                                <td>最大资金规模</td>
                                <td>最小资金规模</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{(yearly_return_ratio * 100).toFixed(2)}%</td>
                                <td>{Number(profit_factor).toFixed(2)}</td>
                                <td>{(Number(winning_ratio) * 100).toFixed(2)}%</td>
                                <td>{Number(largest_capital).toFixed(2)}</td>
                                <td>{Number(minimum_capital).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="backtest-title">收益曲线图：</div>
                    <div style={{ background: '#fff', marginTop: 10, marginBottom: 30 }}>
                        <Chart height={400} data={dv} scale={cols} forceFit>
                            <Legend textStyle={{ fontSize: '14' }} marker="square" />
                            <Axis name="date" />
                            <Axis line={{ stroke: "#ccc" }} name="收益率" />
                            <Tooltip crosshairs={{ type: "y" }} />
                            <Geom
                                type="line"
                                position="date*收益率"
                                size={2}
                                color={["types", ['#3E6ECF', '#E5364F']]}
                            />
                        </Chart>
                    </div>

                    <div className="backtest-title">买卖信号</div>
                    <div className="stock-k-line">
                        {stockDate.length > 0 ?
                            <TradeRoomChart
                                data={stockDate}
                                width={1200}
                                height={565}
                                minuteData={minuteData}  //可根据股票或者外汇来设定
                                // periodCallback={this.periodCallback.bind(this)} //周期回调
                                quote={quote}
                            /> : null
                        }
                    </div>

                    <div className="backtest-title">交易记录</div>
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>股票</td>
                                <td>买卖方向</td>
                                <td>成交价</td>
                                <td>股数</td>
                                <td>交易时间</td>

                            </tr>
                            {alerts.reverse().map((item, index) => {
                                return (
                                    <tr className="table-item" key={index}>
                                        <td>{prod_name}({prod_code})</td>
                                        <td style={item.signal.type === 1 ? { color: 'red' } : { color: 'green' }}>{item.signal.type === 1 ? '买' : "卖"}</td>
                                        <td>{item.signal.price}</td>
                                        <td>{item.signal.lots}</td>
                                        <td>{item.signal.time.substring(0, 10)}</td>

                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>

                    <Modal
                        title="跟单"
                        visible={this.state.visible}
                        onOk={this.followOk.bind(this)}
                        onCancel={() => this.setState({ visible: false })}
                        width={400}
                    >
                        <div className="follow-model">
                            <div>策略名称：{name}</div>
                            <div className="choose-count">
                                <span>选择数量：</span>
                                <span className="btn" onClick={this.reduceFollowCount.bind(this)}>-</span>
                                <span className="count">{followCount}</span>
                                <span className="btn" onClick={this.addFollowCount.bind(this)}>+</span>
                                <span className="text">个月</span>
                            </div>
                        </div>

                    </Modal>
                    <Modal
                        title="策略源码"
                        visible={this.state.visibleCode}
                        width={400}
                        height={400}
                        footer={null}
                        onCancel={() => this.setState({ visibleCode: false })}
                    >
                        <div className="code-wrapper">
                            <textarea value={express} onChange={() => { }} />
                        </div>

                    </Modal>
                </div>
            )
        } else {
            return (
                <div style={{ height: 800 }}>
                    <Loading text="加载中..." />
                </div>
            )

        }

    }
}