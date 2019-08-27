import React, { Component } from 'react'
import './index.scss'
import { backTestReport } from '../../../serivce'
import Loading from '../../../components/Loading/index'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import Moment from 'moment'

export default class BackTestReport extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            data: {}
        }
    }
    componentWillMount() {
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        if (id && token) {
            this.setState({ status: "loading" })
            backTestReport({ token, id }).then(res => {
                this.setState({ data: res, status: 'success' })
            }).catch(err => {
                this.setState({ status: 'success' })
            })
        }
    }
    render() {
        const { status, data } = this.state
        if (status === 'success') {
            const { name, prod_name, prod_code, time_start, time_end, return_ratio, MaxDD, max_nwinner, winner_avg, nwinner,
                timing_raio, return_risk_ratio, nloser, loser_avg, max_nloser, yearly_return_ratio, profit_factor, largest_capital,
                minimum_capital, winning_ratio, capital_curve
            } = data

            let chartData = capital_curve.map((item) => {
                let obj = {}
                obj['日期'] = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                obj['资金'] = Number(item.value.toFixed(2))
                return obj

            })
            const cols = {
                date: {
                    // range: [0, 1],
                    tickCount: 8,
                }
            };

            return (
                <div className="back-test-report">
                   
                    <div className="nav-title">
                        <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                        <span>></span>
                        <span onClick={()=>this.props.history.push('/strategy/list')}>我的策略</span>
                        <span>></span>
                        <span className="current">回测报告</span>
                    </div>
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

                    <div className="backtest-title">资金曲线图：</div>
                    <div style={{ background: '#fff', marginTop: 10, marginBottom: 30 }}>
                        <Chart height={400} data={chartData} scale={cols} forceFit>
                            <Legend textStyle={{ fontSize: '14' }} marker="square" />
                            <Axis name="日期" />
                            <Axis line={{ stroke: "#ccc" }} name="资金" />
                            <Tooltip crosshairs={{ type: "y" }} />
                            <Geom
                                type="line"
                                position="日期*资金"
                                size={2}
                                color='red'
                            />
                        </Chart>
                    </div>
                    <div className="mark">风险提示：投资有风险，请自主决策。上述信息供交流使用，仅供参考，不对您构成任何投资建议，据此操作，风险自担。</div>
                </div>
            )
        } else {
            return (
                <div style={{height:800}}>
                     <Loading text="加载中..." />
                </div>
            )
        }

    }
}