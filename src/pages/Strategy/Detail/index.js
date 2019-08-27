import React, { Component } from 'react'
import './index.scss'
import { strategyDetailData, standardCurve, addCollect, collectFollow } from '../../../serivce'
import Loading from '../../../components/Loading/index'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import Moment from 'moment'
import DataSet from "@antv/data-set";
import { Modal } from 'antd'

export default class Detail extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            data: {},
            visible: false,
            followItem: {},
            followCount: 1,
            visibleCode: false,

        }
    }
    componentWillMount() {
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        if (id && token) {
            this.setState({ status: "loading" })
            strategyDetailData({ token, id }).then(async res => {
                let curve = res.data.return_ratio
                let len = curve.length
                if (len > 1) {
                    const startTime = Moment(curve[0].date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                    const endTime = Moment(curve[len - 1].date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                    let standardData = await this.getStandardCurve(startTime, endTime)
                    let datas = standardData.map((item, index) => {
                        for (let i = 0; i < curve.length; i++) {
                            if (item.date === curve[i].date) {
                                item.value = Number(item.value.toFixed(2))
                                item.value1 = Number(curve[i].value.toFixed(2))
                                curve.splice(i, 1)
                            }
                        }
                        return item
                    })
                    res.data.return_ratio = datas
                }

                this.setState({ data: res.data, status: 'success' })
            }).catch(err => {
                this.setState({ status: 'success' })
            })
        }
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
            const { data, visible, followCount, } = this.state
            const { strategy_name, funds, new_funds, stock_name, code, return_ratio: curvesData, position_stock, transaction_record, name, nickname, create_date, description,
                is_subscription, is_collect, express,id
            } = data
            const { return_ratio, MaxDD, max_nwinner, winner_avg, nwinner,
                timing_return, return_risk_ratio, nloser, loser_avg, max_nloser, yearly_return_ratio, profit_factor, largest_capital,
                minimum_capital, winning_ratio
            } = data.perform
            let datas = []

            let curveDatas = curvesData
            curveDatas.forEach((item, index) => {
                let date = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                let obj = {}
                obj.date = date
                obj['用户收益'] = item.value1
                obj['沪深300'] = item.value
                datas.push(obj)
            })

            const ds = new DataSet();
            const dv = ds.createView().source(datas);

            dv.transform({
                type: "fold",
                fields: ['用户收益', '沪深300'],
                key: "types",
                value: "收益率"
            });
            const cols = {
                date: {
                    tickCount: 8,
                }
            };
            return (
                <div className="strategy-detail-wrapper">
                    <div className="nav-title">
                        <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                        <span>></span>
                        <span className="current">策略详情</span>
                    </div>
                    <div className="base-info-wrapper">
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
                            <span onClick={()=>{
                                  window.open(`/#/strategy/detail/report/${id}`, "_blank");
                            }}>查看回测报告</span>
                        </div>
                    </div>
                    <div className="backtest-title">基本信息：</div>
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>策略名称</td>
                                <td>初始资金</td>
                                <td>当前资金</td>
                                <td>盈亏金额</td>
                                <td>交易股票</td>
                                <td>k线周期</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{strategy_name}</td>
                                <td>{funds}</td>
                                <td>{new_funds.toFixed(2)}</td>
                                <td>{(new_funds - funds).toFixed(2)}</td>
                                <td>{stock_name}({code})</td>
                                <td>{'1日 '}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="backtest-title">交易统计：</div>
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
                                <td>{(timing_return * 100).toFixed(2)}%</td>
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

                    <div className="backtest-title">收益图：</div>
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

                    <div className="backtest-title">持仓记录</div>
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>股票</td>
                                <td>当前价</td>
                                <td>成本价</td>
                                <td>持股数</td>
                                <td>持股市值</td>
                                <td>盈亏比例</td>
                                <td>浮动盈亏</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{position_stock.security_name}</td>
                                <td>{position_stock.last_px}</td>
                                <td>{position_stock.cost_price}</td>
                                <td>{position_stock.position}</td>
                                <td>{(position_stock.position * position_stock.last_px).toFixed(2)}</td>
                                <td>{position_stock.last_px?((position_stock.last_px - position_stock.cost_price) * position_stock.position * 100 / (position_stock.cost_price * position_stock.position)).toFixed(2):"--"}%</td>
                                <td>{((position_stock.last_px - position_stock.cost_price) * position_stock.position).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

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
                            {transaction_record.map((item, index) => {
                                return (
                                    <tr className="table-item" key={index}>
                                        <td>{item.security_name}({item.security.substring(0, 6)})</td>
                                        <td style={item.type === 1 ? { color: 'red' } : { color: 'green' }}>{item.type === 1 ? '买' : "卖"}</td>
                                        <td>{item.price}</td>
                                        <td>{item.lots}</td>
                                        <td>{item.time.substring(0, 10)}</td>

                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                    <Modal
                        title="跟单"
                        visible={visible}
                        onOk={this.followOk.bind(this)}
                        onCancel={() => this.setState({ visible: false })}
                        width={400}
                    >
                        <div className="follow-model">
                            <div>策略名称：{strategy_name}</div>
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
                    <div className="mark">风险提示：投资有风险，请自主决策。上述信息供交流使用，仅供参考，不对您构成任何投资建议，据此操作，风险自担。</div>

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