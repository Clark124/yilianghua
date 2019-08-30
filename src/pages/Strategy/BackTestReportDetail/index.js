import React, { Component } from 'react'
import './index.scss'
import Loading from '../../../components/Loading/index'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import { Table } from 'antd'
import Moment from 'moment'
import DataSet from "@antv/data-set";
import TradeRoomChart from '../../../components/traderoomchart/traderoomchart'
import { changeNumber } from '../../../utils/utils'

const minuteData = [
    // { title: '1 minute', value: '1 m', period: 1 },
    // { title: '5 minute', value: '5 m', period: 2 },
    // { title: '15 minute', value: '15 m', period: 3 },
    // { title: '30 minute', value: '30m', period: 4 },
    // { title: '1 Hour', value: '1 H', period: 5 },
    // { title: '1 Day', value: '1 D', period: 6 },
    // { title: '7 Day', value: '7 D', period: 7 },
    // { title: '1 Month', value: '1 M', period: 8 },
]

const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '股数',
        dataIndex: 'count',
        key: 'count',
    },
    {
        title: '买卖方向',
        dataIndex: 'direct',
        key: 'direct',
        render: text => <span style={text === '买入' ? { color: 'red' } : { color: 'green' }}>{text}</span>,
    },
];


export default class BackTestReport extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            data: {}
        }
    }
    componentWillMount() {
        let data = localStorage.getItem("backTestDetail")
        if (data) {
            data = JSON.parse(data)
            const { dataList } = data
            let { stockData, alerts } = dataList
            stockData = changeNumber(stockData, 2)
            stockData = this.setSignal(stockData, alerts)
            this.setState({ data, status: "success", stockData })
        }
    }
    //设置回测买卖点
    setSignal(stockData, alerts) {
        stockData = stockData.map(dataItem => {
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
        return stockData
    }

    periodCallback() {

    }
    render() {
        const { status } = this.state
        if (status === 'success') {
            const { data, stockData } = this.state
            const { name, prod_name, prod_code, time_start, time_end } = data.info
            const { trade_number, return_ratio, timing_return, Sharpe_ratio, holding_time_ratio, capital, nwinner, nloser,
                max_nwinner, max_nloser, totalwinner, totalloser, profit_avg, winner_avg, loser_avg, totalholdtime,
                winnerholdtime, loserholdtime, entry_eff_winner, exit_eff_winner, trade_eff_winner, entry_eff_ratio, exit_eff_ratio, trade_eff_ratio,
                dataList
            } = data
            let { curveDatas, tradeRecords, quote } = dataList
            console.log(tradeRecords)


            //收益率数据
            let dataCurve = []
            curveDatas.forEach((item, index) => {
                let date = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                let obj = {}
                obj.date = date
                obj['策略'] = item.value1
                obj['沪深300'] = item.value
                dataCurve.push(obj)
            })

            const ds = new DataSet();
            const dv = ds.createView().source(dataCurve);

            dv.transform({
                type: "fold",
                fields: ['策略', '沪深300'],
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
                <div className="back-test-report">
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
                                <td>交易次数</td>
                                <td>收益率</td>
                                <td>择时收益率</td>
                                <td>夏普率</td>
                                <td>平均盈亏持仓时间比</td>
                                <td>初始资金</td>
                                <td>盈利次数</td>
                                <td>亏损次数</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{trade_number}</td>
                                <td>{(typeof return_ratio) === 'number' ? (return_ratio * 100).toFixed(2) : 'NaN'}%</td>
                                <td>{(typeof timing_return) === 'number' ? (timing_return * 100).toFixed(2) : 'NaN'}%</td>
                                <td>{(typeof Sharpe_ratio) === 'number' ? (Sharpe_ratio * 100).toFixed(2) : 'NaN'}%</td>
                                <td>{(typeof holding_time_ratio) === 'number' ? holding_time_ratio.toFixed(2) : 'NaN'}</td>
                                <td>{capital}</td>
                                <td>{nwinner}</td>
                                <td>{nloser}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table item" cellPadding="0" cellSpacing="0">
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
                            <tr className="table-item" >
                                <td>{max_nwinner}</td>
                                <td>{max_nloser}</td>
                                <td>{(typeof totalwinner) === 'number' ? totalwinner.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof totalloser) === 'number' ? totalloser.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof profit_avg) === 'number' ? profit_avg.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof winner_avg) === 'number' ? winner_avg.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof loser_avg) === 'number' ? loser_avg.toFixed(2) : 'NaN'}</td>
                                <td>{totalholdtime}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table item" cellPadding="0" cellSpacing="0">
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
                            <tr className="table-item" >
                                <td>{winnerholdtime}</td>
                                <td>{loserholdtime}</td>
                                <td>{(typeof entry_eff_winner) === 'number' ? entry_eff_winner.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof exit_eff_winner) === 'number' ? exit_eff_winner.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof trade_eff_winner) === 'number' ? trade_eff_winner.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof entry_eff_ratio) === 'number' ? entry_eff_ratio.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof exit_eff_ratio) === 'number' ? exit_eff_ratio.toFixed(2) : 'NaN'}</td>
                                <td>{(typeof trade_eff_ratio) === 'number' ? trade_eff_ratio.toFixed(2) : 'NaN'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="backtest-title">收益率（%）</div>
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
                        {stockData.length > 0 ?
                            <TradeRoomChart
                                data={stockData}
                                width={1200}
                                height={565}
                                minuteData={minuteData}  //可根据股票或者外汇来设定
                                periodCallback={this.periodCallback.bind(this)} //周期回调
                                quote={quote}
                            /> : null
                        }
                    </div>
                    <div className="backtest-title">交易记录</div>
                    <Table columns={columns} dataSource={tradeRecords} />
                </div >
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