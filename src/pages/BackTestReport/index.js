import React, { Component } from 'react'
import './index.scss'
import logo from './images/logo.png'
import logoTitle from './images/logo_title.png'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import moment from 'moment'
// import radio_1 from '../../assets/radio_1.png'
// import radio_2 from '../../assets/radio_2.png'
// import { getData } from '../../service/service'

export default class Index extends Component {
    constructor() {
        super()
        this.state = {
            profitIndex: 0,
            status: "loading",
            datas: {}
        }
    }
    componentWillMount() {
        let data = localStorage.getItem('report')
        if (data) {
            data = JSON.parse(data)
            this.setState({ datas: data, status: 'success' })
        }
        console.log(data)
    }
    onChangeGraph(index) {
        this.setState({ profitIndex: index })
    }
    render() {
        const { status } = this.state

        if (status === 'success') {
            const { datas } = this.state

            let { monthStat, pf, yearStat, information, datetime, newValueSeries, newValueSeries300, tradeRecord } = datas
            const { totalprofit, MaxDD, MaxRU, Market_expose_ratio, STD_return, pl_ratio, profit_factor, winning_ratio, trade_number,
                return_ratio, timing_return, Sharpe_ratio, holding_time_ratio, capital, nwinner, nloser, max_nwinner, max_nloser, totalwinner, totalloser,
                profit_avg, winner_avg, loser_avg, totalholdtime, winnerholdtime, loserholdtime, entry_eff_winner, exit_eff_winner,
                trade_eff_winner, entry_eff_ratio, exit_eff_ratio, trade_eff_ratio
            } = pf
            let { composeName, description, startTime, endTime, comboStyle } = information
           
            let data = []
            newValueSeries.forEach((item, index) => {
                let obj = {}
                obj.date = moment(new Date(datetime[index])).format('YYYY-MM-DD')
                obj['组合曲线'] = item
                obj['沪深300'] = newValueSeries300[index]
                data.push(obj)
            })


            const ds = new DataSet();
            const dv = ds.createView().source(data);
            dv.transform({
                type: "fold",
                fields: ['组合曲线', '沪深300'],
                key: "types",
                value: "净值"
            });
            const cols = {
                date: {
                    // range: [0, 1],
                    tickCount: 8,
                }
            };
            monthStat = Object.values(monthStat)
            yearStat = Object.values(yearStat)
            return (
                <div className="report-wrapper">
                    <div className="logo-header">
                        <img src={logo} className="logo" alt="" />
                        <img src={logoTitle} className="logo-title" alt="" />
                    </div>
                    <div className="container">
                        <div className="title">基本报告</div>
                        <div className="content">
                            <div className="base-info">
                                <div className="left">
                                    <div className="info">组合名称：{composeName}</div>
                                    <div className="info">组合风格：{comboStyle.join(" ")}</div>

                                    <div className="introduce">
                                        <div>组合说明：</div>
                                        <div className="text">{description}</div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="info">回测开始时间：{startTime}</div>
                                    <div className="info">回测结束时间：{endTime}</div>
                                </div>
                            </div>
                            <div className="content-item">
                                <div className="title">绩效报告</div>
                                <table className="table" cellPadding="0" cellSpacing="0">
                                    <tbody className="t-body">
                                        <tr className="table-header">
                                            <td>总盈亏</td>
                                            <td>最大回测</td>
                                            <td>最大持续盈利</td>
                                            <td>市场参与率</td>
                                            <td>盈亏标准差</td>
                                            <td>盈亏比</td>
                                            <td>获利因子</td>
                                            <td>胜率</td>
                                        </tr>
                                        <tr className="table-item">
                                            <td>{(typeof totalprofit)==='number'?totalprofit.toFixed(2):"NaN"}</td>
                                            <td>{(typeof MaxDD)==='number'?MaxDD.toFixed(2):"NaN"}</td>
                                            <td>{(typeof MaxRU)==='number'?MaxRU.toFixed(2):"NaN"}</td>
                                            <td>{(typeof Market_expose_ratio)==='number'?Market_expose_ratio.toFixed(2):"NaN"}</td>
                                            <td>{(typeof STD_return)==='number'?STD_return.toFixed(2):"NaN"}</td>
                                            <td>{(typeof pl_ratio)==='number'?pl_ratio.toFixed(2):"NaN"}</td>
                                            <td>{(typeof profit_factor)==='number'?profit_factor.toFixed(2):"NaN"}</td>
                                            <td>{(typeof winning_ratio)==='number'?winning_ratio.toFixed(2):"NaN"}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table" cellPadding="0" cellSpacing="0">
                                    <tbody className="t-body">
                                        <tr className="table-header">
                                            <td>交易次数</td>
                                            <td>收益率</td>
                                            <td>择时收益率</td>
                                            <td>夏普率</td>
                                            <td>平均盈亏持仓时间比</td>
                                            <td>初始资金</td>
                                            <td>盈利次数</td>
                                            <td>亏损次数</td>
                                        </tr>
                                        <tr className="table-item">
                                            <td>{trade_number}</td>
                                            <td>{(typeof return_ratio)==='number'?return_ratio.toFixed(2):'NaN'}</td>
                                            <td>{(typeof timing_return)==='number'?timing_return.toFixed(2):'NaN'}</td>
                                            <td>{(typeof Sharpe_ratio)==='number'?Sharpe_ratio.toFixed(2):'NaN'}</td>
                                            <td>{(typeof holding_time_ratio)==='number'?holding_time_ratio.toFixed(2):'NaN'}</td>
                                            <td>{capital}</td>
                                            <td>{nwinner}</td>
                                            <td>{nloser}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table" cellPadding="0" cellSpacing="0">
                                    <tbody className="t-body">
                                        <tr className="table-header">
                                            <td>连续盈利次数</td>
                                            <td>连续亏损次数</td>
                                            <td>平仓盈利总和</td>
                                            <td>平仓亏损总和</td>
                                            <td>每笔交易平均盈亏</td>
                                            <td>平均盈利</td>
                                            <td>平均亏损</td>
                                            <td>持仓时间</td>
                                        </tr>
                                        <tr className="table-item">
                                            <td>{max_nwinner}</td>
                                            <td>{max_nloser}</td>
                                            <td>{(typeof totalwinner)==='number'?totalwinner.toFixed(2):'NaN'}</td>
                                            <td>{(typeof totalloser)==='number'?totalloser.toFixed(2):'NaN'}</td>
                                            <td>{(typeof profit_avg)==='number'?profit_avg.toFixed(2):'NaN'}</td>
                                            <td>{(typeof winner_avg)==='number'?winner_avg.toFixed(2):'NaN'}</td>
                                            <td>{(typeof loser_avg)==='number'?loser_avg.toFixed(2):'NaN'}</td>
                                            <td>{totalholdtime}</td>
                                        </tr>

                                    </tbody>
                                </table>

                                <table className="table" cellPadding="0" cellSpacing="0">
                                    <tbody className="t-body">
                                        <tr className="table-header">
                                            <td>盈利交易持仓时间</td>
                                            <td>亏损交易持仓时间</td>
                                            <td>平均盈利入场效率</td>
                                            <td>平均盈利出场效率</td>
                                            <td>平均盈利交易效率</td>
                                            <td>盈亏进场效率比</td>
                                            <td>盈亏出场效率比</td>
                                            <td>盈亏交易效率比</td>
                                        </tr>
                                        <tr className="table-item">
                                            <td>{winnerholdtime}</td>
                                            <td>{loserholdtime}</td>
                                            <td>{(typeof entry_eff_winner)==='number'?entry_eff_winner.toFixed(2):'NaN'}</td>
                                            <td>{(typeof exit_eff_winner)==='number'?exit_eff_winner.toFixed(2):'NaN'}</td>
                                            <td>{(typeof trade_eff_winner)==='number'?trade_eff_winner.toFixed(2):'NaN'}</td>
                                            <td>{(typeof entry_eff_ratio)==='number'?entry_eff_ratio.toFixed(2):'NaN'}</td>
                                            <td>{(typeof exit_eff_ratio)==='number'?exit_eff_ratio.toFixed(2):'NaN'}</td>
                                            <td>{(typeof trade_eff_ratio)==='number'?trade_eff_ratio.toFixed(2):'NaN'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>


                            <div className="content-item">
                                <div className="title">净值曲线</div>
                                <Chart height={400} data={dv} scale={cols} forceFit>
                                    <Legend textStyle={{ fontSize: '14' }} marker="square" />
                                    <Axis name="date" />
                                    <Axis line={{ stroke: "#ccc" }} name="净值" />
                                    <Tooltip crosshairs={{ type: "y" }} />
                                    <Geom
                                        type="line"
                                        position="date*净值"
                                        size={2}
                                        color={["types", ['#3E6ECF', '#E5364F']]}
                                    />
                                </Chart>
                            </div>

                            <div className="content-item">
                                <div className="title">月度总结</div>
                                <table className="table" cellPadding="0" cellSpacing="0">
                                    <tbody className="t-body">
                                        <tr className="table-header">
                                            <td>时间区间</td>
                                            <td>期末净值</td>
                                            <td>净利润</td>
                                            <td>收益率%</td>
                                            <td>最大回撤</td>
                                            <td>最大回撤率%</td>
                                            <td>风险收益比</td>
                                            <td>交易次数</td>
                                            <td>胜率</td>
                                            <td>盈亏比</td>
                                            <td>手续费</td>
                                        </tr>


                                        {monthStat.map((item, index) => {
                                            return (
                                                <tr className="table-item" key={index}>
                                                    <td>{item.time_section}</td>
                                                    <td>{item.final_net_value.toFixed(2)}</td>
                                                    <td>{item.net_profit.toFixed(2)}</td>
                                                    <td>{(item.return_rate * 100).toFixed(2)}</td>
                                                    <td>{item.maximum_retracement.toFixed(2)}</td>
                                                    <td>{(item.maximum_retracement_rate * 100).toFixed(2)}</td>
                                                    <td>{(typeof item.revenue_risk_ratio)==='number'?item.revenue_risk_ratio.toFixed(2):item.revenue_risk_ratio}</td>
                                                    <td>{item.trade_count}</td>
                                                    <td>{(item.winning_probability * 100).toFixed(2)}</td>
                                                    <td>{(typeof item.profit_and_loss_ratio)==='number'?item.profit_and_loss_ratio.toFixed(2):item.profit_and_loss_ratio}</td>
                                                    <td>{item.service_charge.toFixed(2)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>

                                <div className="title">年度总结</div>
                                <table className="table" cellPadding="0" cellSpacing="0">
                                    <tbody className="t-body">
                                        <tr className="table-header">
                                            <td>时间区间</td>
                                            <td>期末净值</td>
                                            <td>净利润</td>
                                            <td>收益率%</td>
                                            <td>最大回撤</td>
                                            <td>最大回撤率%</td>
                                            <td>风险收益比</td>
                                            <td>交易次数</td>
                                            <td>胜率%</td>
                                            <td>盈亏比</td>
                                            <td>手续费</td>
                                        </tr>


                                        {yearStat.map((item, index) => {
                                            return (
                                                <tr className="table-item" key={index}>
                                                    <td>{item.time_section}</td>
                                                    <td>{item.final_net_value.toFixed(2)}</td>
                                                    <td>{item.net_profit.toFixed(2)}</td>
                                                    <td>{(item.return_rate * 100).toFixed(2)}</td>
                                                    <td>{item.maximum_retracement.toFixed(2)}</td>
                                                    <td>{(item.maximum_retracement_rate * 100).toFixed(2)}</td>
                                                    <td>{(typeof item.revenue_risk_ratio)==='number'?item.revenue_risk_ratio.toFixed(2):item.revenue_risk_ratio}</td>
                                                    <td>{item.trade_count}</td>
                                                    <td>{(item.winning_probability * 100).toFixed(2)}</td>
                                                    <td>{(typeof item.profit_and_loss_ratio)==='number'?item.profit_and_loss_ratio.toFixed(2):item.profit_and_loss_ratio}</td>
                                                    <td>{item.service_charge.toFixed(2)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>


                                <div className="title">交易记录</div>
                                <table className="table" cellPadding="0" cellSpacing="0">
                                    <tbody className="t-body">
                                        <tr className="table-header">
                                            <td>股票</td>
                                            <td>买卖方向</td>
                                            <td>成交价</td>
                                            <td>股数</td>
                                            <td>交易时间</td>

                                        </tr>
                                        {tradeRecord.map((item, index) => {
                                            return (
                                                <tr className="table-item" key={index}>
                                                    <td>{item.stockName}({item.stockCode})</td>
                                                    <td style={item.direction === 48 ?{color:'red'}:{color:'green'}}>{item.direction === 48 ? '买' : '卖'}</td>
                                                    <td>{item.tradePrice.toFixed(2)}</td>
                                                    <td>{item.tradeQty}</td>
                                                  
                                                    <td>{moment(item.gmtCreate,'YYYYMMDD').format('YYYY-MM-DD')}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }

    }
}