import React, { Component } from 'react'
import './index.scss'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import Loading from '../../../components/Loading/index'
import DataSet from "@antv/data-set";
import {
    composeDetail, editCompose, assignMarket, industryMarket, conceptBlock, regionBlock, stockIndicate, stockIndicateList,
    oneLevelCondition, twoLevelCondition, strategyList, strategyDetail
} from '../../../serivce'
// import { DatePicker } from 'antd';

// const { RangePicker } = DatePicker;

export default class Detail extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            profitData: [
                {
                    date: 20190101,
                    '沪深300': 1.3,
                    '实盘收益率': -1.2
                },
                {
                    date: 20190102,
                    '沪深300': 1.5,
                    '实盘收益率': 1.1
                },
                {
                    date: 20190103,
                    '沪深300': 1.8,
                    '实盘收益率': 1.4
                },
            ],
            dataList: {

            },
            indicateList: [],
            selectList: [],
            rankIndex: 0,

            riskSetting: {
                isEnable: 0,
                moveStopProfitRatio: 0,
                stopLossRatio: 0,
                stopProfitRatio: 0,
            },
            selectTimeSetting: {
                isEnable: 0,
                indicators: []

            },
            tradeSetting: {},
            oneLevelConditionValue: "",
            twoLevelConditionValue: "",
            express: "",
            strategyName: "",
            mySelectStockName: "",
            stockPools: []
        }
    }
    componentWillMount() {
        const p6 = this.getComposeDetail()
        const p5 = this.onStockIndicate()
        const p1 = this.onAssignMarket()  //指定市场列表
        const p2 = this.onIndustryMarket() //行业市场列表
        const p3 = this.onConceptBlock()
        const p4 = this.onRegionBlock()
        this.setState({ status: "loading" })
        Promise.all([p1, p2, p3, p4, p5, p6]).then(res => {
            const composeId = this.props.match.params.id
            editCompose({ id: composeId }).then(ret => {
                const { riskSetting, selectStockParameter, selectTimeSetting, strategySetting, tradeSetting, userId, stockPools } = ret
                if (ret.selectStockParameter.selectType === 1) {
                    let dataList = JSON.parse(ret.selectStockParameter.selectCondition)

                    const { assignMarketList, industryMarketList, conceptBlockList, regionBlockList } = this.state
                    const list = this.state.indicateList

                    let assignMarketSelect = []
                    let industryMarketSelect = []
                    let conceptBlockSelect = []
                    let regionBlockSelect = []
                    let selectList = []
                    dataList.forEach((item, index) => {
                        if (item.pId >= 54 && item.pId <= 58) {
                            assignMarketSelect.push(item)
                        } else if (item.pId === 59) {
                            industryMarketSelect.push(item)
                        } else if (item.pId === 61) {
                            conceptBlockSelect.push(item)
                        } else if (item.pId === 60) {
                            regionBlockSelect.push(item)
                        } else if (item.tId >= 2 && item.tId <= 6) {
                            selectList.push(item)
                        }
                    })
                    assignMarketSelect = assignMarketSelect.map((item) => {
                        let result = ""
                        assignMarketList.forEach(item1 => {
                            if (item1.pId === item.pId) {
                                result = item1
                            }
                        })
                        return result
                    })
                    industryMarketSelect = industryMarketSelect.map((item) => {
                        let result = ""
                        industryMarketList.forEach(item1 => {
                            if (item1.value === item.value) {
                                result = item1
                            }
                        })
                        return result
                    })
                    conceptBlockSelect = conceptBlockSelect.map((item) => {
                        let result = ""
                        conceptBlockList.forEach(item1 => {
                            if (item1.value === item.value) {
                                result = item1
                            }
                        })
                        return result
                    })
                    regionBlockSelect = regionBlockSelect.map((item) => {
                        let result = ""
                        regionBlockList.forEach(item1 => {
                            if (item1.value === item.value) {
                                result = item1
                            }
                        })
                        return result
                    })

                    selectList = selectList.map(item => {
                        let result = ""
                        list.forEach(item1 => {
                            if (item1.tId === item.tId) {
                                item1.list.forEach(item2 => {
                                    if (item2.pId === item.pId) {
                                        item2.isSelect = true
                                        result = item2
                                        if (item.value.includes('>')) {
                                            result.type = 0
                                            if (result.value === '流通市值' || result.value === '总市值' || result.value === '流通股本' || result.value === '总股本') {
                                                result.value1 = Number(item.value.substring(1)) / 100000000
                                            } else {
                                                result.value1 = item.value.substring(1)
                                            }
                                            result.value2 = ""
                                        } else if (item.value.includes('<')) {
                                            result.type = 1
                                            if (result.value === '流通市值' || result.value === '总市值' || result.value === '流通股本' || result.value === '总股本') {
                                                result.value1 = Number(item.value.substring(1)) / 100000000
                                            } else {
                                                result.value1 = item.value.substring(1)
                                            }
                                            result.value2 = ""
                                        } else {
                                            result.type = 2
                                            let arr = item.value.split('-')
                                            if (result.value === '流通市值' || result.value === '总市值' || result.value === '流通股本' || result.value === '总股本') {
                                                result.value1 = Number(arr[0]) / 100000000
                                                result.value2 = Number(arr[1]) / 100000000
                                            } else {
                                                result.value1 = arr[0]
                                                result.value2 = arr[1]
                                            }
                                        }

                                    }
                                })
                            }
                        })
                        return result
                    })

                    this.setState({ rankIndex: 1, assignMarketSelect, industryMarketSelect, conceptBlockSelect, regionBlockSelect, selectList })

                }
                selectTimeSetting.indicators = JSON.parse(selectTimeSetting.indicators)
                this.getOneLevelCondition(tradeSetting.onePriorityCondition)
                this.getTwoLevelCondition(tradeSetting.twoPriorityCondition)
                this.getStrategyList(strategySetting.strategyName, userId)
                this.setState({ riskSetting, selectTimeSetting, tradeSetting, mySelectStockName: selectStockParameter.mySelectStockName, stockPools, status: "success" })
            }).catch(err => {
                console.log(err)
            })
        })

    }
    getComposeDetail() {
        return new Promise((resolve, reject) => {
            const id = this.props.match.params.id
            composeDetail({ id }).then(res => {
                this.setState({ dataList: res }, () => {
                    resolve()
                })
            })
        })

    }


    //获取指标列表
    onStockIndicate() {
        return new Promise((resolve, reject) => {
            stockIndicate({}).then((res, index) => {
                let indicateList = res
                stockIndicateList({}).then(ret => {
                    indicateList = indicateList.map((item, index) => {
                        item.list = []
                        ret.forEach((value, valueIndex) => {
                            if (value.tId === item.tId) {
                                value.isSelect = false
                                value.type = 0
                                item.list.push(value)
                            }
                        })
                        return item
                    })
                    this.setState({ indicateList: indicateList })
                    resolve()
                }).then(err => {
                    reject(err)
                })
            })
        })

    }
    //获取指定市场列表
    onAssignMarket() {
        return new Promise((resolve, reject) => {
            assignMarket({}).then(res => {
                this.setState({ assignMarketList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }
    //获取行业市场列表
    onIndustryMarket() {
        return new Promise((resolve, reject) => {
            industryMarket({}).then(res => {
                this.setState({ industryMarketList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }
    //获取概念板块列表
    onConceptBlock() {
        return new Promise((resolve, reject) => {
            conceptBlock({}).then(res => {
                this.setState({ conceptBlockList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }
    //获取地区板块列表
    onRegionBlock() {
        return new Promise((resolve, reject) => {
            regionBlock({}).then(res => {
                this.setState({ regionBlockList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }

    //一级优先买入条件
    getOneLevelCondition(onePriorityCondition) {
        oneLevelCondition({}).then(res => {
            let oneLevelConditionValue = 0
            res.forEach((item, index) => {
                if (item.id === onePriorityCondition) {
                    oneLevelConditionValue = item.value
                }
            })
            this.setState({ oneLevelConditionValue })
        })
    }
    //一级优先买入条件
    getTwoLevelCondition(twoPriorityCondition) {
        twoLevelCondition({}).then(res => {
            let twoLevelConditionValue = 0
            res.forEach((item, index) => {
                if (item.id === twoPriorityCondition) {
                    twoLevelConditionValue = item.value
                }
            })
            this.setState({ twoLevelConditionValue })
        })
    }
    //获取策略列表
    getStrategyList(strategyName, id) {
        strategyList({ id }).then(res => {
            let strategyId = 0
            res.forEach((item, index) => {
                if (item.strategyName === strategyName) {
                    strategyId = item.strategyId
                }
            })
            strategyDetail({ id: strategyId }).then(res => {
                this.setState({ express: res.result.express, strategyName: strategyName })
            })
        })
    }


    render() {
        const { status } = this.state

        if (status === 'success') {
            const { dataList, rankIndex, selectList, assignMarketSelect, industryMarketSelect, conceptBlockSelect, regionBlockSelect,
                riskSetting, selectTimeSetting, tradeSetting, oneLevelConditionValue, twoLevelConditionValue, express, strategyName, stockPools
            } = this.state
            const { comboxListInfo } = dataList
            let stocks300 = JSON.parse(comboxListInfo.stocksThreeHundredRate)
            const profitData = comboxListInfo.yieldRateLines.map((value, index) => {
                if (stocks300) {
                    return {
                        date: value.dataTime,
                        '实盘收益率': value.rate,
                        '沪深300': stocks300.result[index] ? stocks300.result[index].value : ""
                    }
                } else {
                    return {
                        date: value.dataTime,
                        '实盘收益率': value.rate,
                    }
                }

            })
            const ds = new DataSet();
            const dv = ds.createView().source(profitData);
            dv.transform({
                type: "fold",
                fields: ['沪深300', '实盘收益率'],
                // 展开字段集
                key: "types",
                // key字段
                value: "收益率" // value字段
            });
            const cols = {
                date: {
                    range: [0, 1],
                }
            };

            return (
                <div className="compose-detail-wrapper">

                    <div className="header-link">
                        <span>组合</span>
                        <span className="arrow">></span>
                        <span className="rank" onClick={() => this.props.history.push('/compose/rank?userId=' + localStorage.getItem('userId'))}>组合排行</span>
                        <span className="arrow">></span>
                        <span className="title">组合详情</span>
                    </div>
                    <div className="main-message">
                        <div className="first-line">
                            <div className="left">
                                <span className="name">{comboxListInfo.comboName}</span>
                                <span className="text">组合定价:</span><span className="price">{comboxListInfo.payPrice}元/月</span>
                                <span className="text">资金上限:</span><span className="price">{comboxListInfo.initFund / 10000}万</span>
                            </div>
                            <div className="right">
                                {/* <span className="subscrib">立即订阅</span> */}
                            </div>
                        </div>
                        <div className="second-line">
                            <span className="author">作者：{comboxListInfo.userName}</span>
                            <span className="style">风格：{
                                JSON.parse(comboxListInfo.comboStyle).join("，")
                            }</span>
                            <span className="create-time">创建时间：{dataList.gmtCreate.slice(0, -2)}</span>
                        </div>
                        <div className="discrib">策略描述：{dataList.description}</div>
                    </div>

                    <div className="compose-regular">
                        <div className="title">组合规则</div>
                        <div className="content">
                            <div className="sub-title">选择股票池：{rankIndex === 1 ? '选股条件' : "自定义股票池"}</div>
                            {
                                rankIndex === 1 ?
                                    <div className="range-list">
                                        <div className="range-item">
                                            <span>指定市场：</span>
                                            {
                                                assignMarketSelect.length > 0 ?
                                                    <div>
                                                        {assignMarketSelect.map((item, index) => {
                                                            return (
                                                                <span className="rangeitem" key={index}>{item.value}</span>
                                                            )
                                                        })}
                                                    </div> : <span className="rangeitem">全部</span>
                                            }
                                        </div>
                                        <div className="range-item">
                                            <span>行业市场：</span>
                                            {
                                                industryMarketSelect.length > 0 ?
                                                    <div>
                                                        {industryMarketSelect.map((item, index) => {
                                                            return (
                                                                <span className="rangeitem" key={index}>{item.name}</span>
                                                            )
                                                        })}
                                                    </div> : <span className="rangeitem">全部</span>
                                            }
                                        </div>
                                        <div className="range-item">
                                            <span>概念板块：</span>
                                            {
                                                conceptBlockSelect.length > 0 ?
                                                    <div>
                                                        {conceptBlockSelect.map((item, index) => {
                                                            return (
                                                                <span className="rangeitem" key={index}>{item.name}</span>
                                                            )
                                                        })}
                                                    </div> : <span className="rangeitem">全部</span>
                                            }
                                        </div>
                                        <div className="range-item">
                                            <span>地区板块：</span>
                                            {
                                                regionBlockSelect.length > 0 ?
                                                    <div>
                                                        {regionBlockSelect.map((item, index) => {
                                                            return (
                                                                <span className="rangeitem" key={index}>{item.name}</span>
                                                            )
                                                        })}
                                                    </div> : <span className="rangeitem">全部</span>
                                            }
                                        </div>
                                    </div> :
                                    <div className="range-list">
                                        {stockPools.map((item, index) => {
                                            return (
                                                <span key={index} style={{ marginRight: 10 }}>{item.stockName}</span>
                                            )
                                        })}
                                    </div>
                            }

                            <div className="indicate-list">
                                {selectList.map((item, index) => {
                                    if (item.type === 0 || item.type === 1) {
                                        return (
                                            <div className="indicate-item" key={index}>
                                                <span className="name">{item.value}</span>
                                                <span className="range">{item.type === 0 ? '大于' : "小于"}</span>
                                                <span className="value1">{item.value1}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="indicate-item" key={index}>
                                                <span className="name">{item.value}</span>
                                                <span className="range">区间</span>
                                                <span className="value1">{item.value1}</span>
                                                <span >-</span>
                                                <span className="value2">{item.value2}</span>
                                            </div>
                                        )
                                    }

                                })}


                            </div>
                            <div className="sub-title">交易设置</div>
                            <div className="indicate-list">
                                <div className="indicate-item">
                                    <span className="name1">一级优先买入条件：</span>
                                    <span className="value3">{oneLevelConditionValue}</span>
                                </div>
                                <div className="indicate-item">
                                    <span className="name1">二级优先买入条件：</span>
                                    <span className="value3">{twoLevelConditionValue}</span>
                                </div>
                                <div className="indicate-item">
                                    <span className="name1">最大持股数量：</span>
                                    <span className="value3">{tradeSetting.maxStockNum}</span>
                                </div>
                                <div className="indicate-item">
                                    <span className="name1">个股默认买入比例(%)</span>
                                    <span className="value3">{tradeSetting.singlStockBuyRatio}</span>
                                </div>
                                <div className="indicate-item">
                                    <span className="name1">个股最大买入比例(%)</span>
                                    <span className="value3">{tradeSetting.singlStockMaxPositionRatio}</span>
                                </div>
                                <div className="indicate-item">
                                    <span className="name1">单次买入比例不超过(%)</span>
                                    <span className="value3">{tradeSetting.singlCountBuyRatio}</span>
                                </div>
                                <div className="indicate-item">
                                    <span className="name1">单次卖出比例不超过(%)</span>
                                    <span className="value3">{tradeSetting.singlCountSellRatio}</span>
                                </div>
                            </div>

                            <div className="sub-title">买卖策略：{strategyName}</div>
                            <textarea className="strategy-code-input" disabled value={express} onChange={() => null} />

                            <div className="sub-title">大盘择时：{selectTimeSetting.isEnable === 1 ? '使用指标择时' : "不择时"}</div>
                            {selectTimeSetting.isEnable === 1 ?
                                <div className="indicate-list">
                                    {selectTimeSetting.indicators.map((item, index) => {
                                        return (
                                            <div className="indicate-item" key={index}>
                                                {item.indicatorName}({item.symbol})
                                     </div>
                                        )
                                    })}

                                </div> : null
                            }


                            <div className="sub-title">个股风控：{riskSetting.isEnable === 1 ? '开启风控' : '关闭风控'}</div>
                            {
                                riskSetting.isEnable === 1 ?
                                    <div className="indicate-list">
                                        <div className="indicate-item">
                                            <span className="name2">止盈比例：</span>
                                            <span className="value3">{riskSetting.stopProfitRatio}</span>%
                                        </div>
                                        <div className="indicate-item">
                                            <span className="name2">止损比例：</span>
                                            <span className="value3">{riskSetting.stopLossRatio}</span>%
                                        </div>
                                        <div className="indicate-item">
                                            <span className="name2">移动止损比例：</span>
                                            <span className="value3">{riskSetting.moveStopProfitRatio}</span>%
                                        </div>
                                    </div> : null
                            }

                        </div>
                    </div>


                    <div className="statistics">
                        <div className="title">收益统计</div>
                        <div className="table">
                            <div className="profit">
                                <div className="number">{comboxListInfo.totalYieldRate}%</div>
                                <div className="text">收益率</div>
                            </div>
                            <div className="table-item">
                                <div className="item">
                                    <div className="name">年化收益率</div>
                                    <div className="number">{comboxListInfo.yearYieldRate}%</div>
                                </div>
                                <div className="item-1">
                                    <div className="name">收益风险比</div>
                                    <div className="number">{dataList.yieldRiskRate}</div>
                                </div>
                            </div>
                            <div className="table-item">
                                <div className="item">
                                    <div className="name">超额收益</div>
                                    <div className="number">{dataList.excessProfitRate}%</div>
                                </div>
                                <div className="item-1">
                                    <div className="name">最大回测</div>
                                    <div className="number">{dataList.retracement}</div>
                                </div>
                            </div>
                            <div className="table-item">
                                <div className="item">
                                    <div className="name">实盘天数</div>
                                    <div className="number">{comboxListInfo.day}天</div>
                                </div>
                                <div className="item-1">
                                    <div className="name">胜率</div>
                                    <div className="number">{dataList.successRate}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profit-curve">
                        <div className="title">收益曲线</div>
                        <div className="content">
                            <Chart height={350} data={dv} scale={cols} forceFit padding="auto">
                                <Legend textStyle={{ fontSize: '14' }} marker="square" position={'top'} />
                                <Axis name="date" />
                                <Axis name="收益率" line={{ stroke: "#ccc" }} />
                                <Tooltip crosshairs={{ type: "y" }} />
                                <Geom
                                    type="line"
                                    position="date*收益率"
                                    size={2}
                                    color={["types", ['#FF6060', '#0098FD']]}
                                />
                            </Chart>
                            <div className="select-wrapper">
                                {/* <div className="date-range">
                                    <span>展示区间：</span>
                                    <RangePicker />
                                </div> */}
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div className="table-list">
                        <div className="title">当前持仓</div>
                        <table className="table" cellPadding="0" cellSpacing="0">
                            <tbody className="t-body">
                                <tr className="table-header">
                                    <td>股票</td>
                                    <td>买入日期</td>
                                    <td>买入价格</td>
                                    <td>当前仓位</td>
                                    <td>盈亏比例</td>
                                </tr>
                                {dataList.position.map((item, index) => {
                                    return (
                                        <tr className="table-item" key={index}>
                                            <td>{item.stockName}({item.stockCode.substring(0, 6)})</td>
                                            <td>{item.gmtCreate.slice(0, -5)}</td>
                                            <td>{item.positionAveragePrice}</td>
                                            <td>{item.thisPositionQty + item.lastPositionQty}</td>
                                            <td>{item.lossProfit}%</td>
                                        </tr>
                                    )
                                })}



                            </tbody>
                        </table>
                    </div>

                    <div className="table-list">
                        <div className="title">历史记录</div>
                        <table className="table" cellPadding="0" cellSpacing="0">
                            <tbody className="t-body">
                                <tr className="table-header">
                                    <td>股票</td>
                                    <td>成交日期</td>
                                    <td>买卖方向</td>
                                    <td>成交价格</td>
                                    <td>成交数量</td>
                                    <td>盈亏比例</td>
                                </tr>
                                {dataList.tradeRecord.map((item, index) => {
                                    return (
                                        <tr className="table-item" key={index}>
                                            <td>{item.stockName}({item.stockCode})</td>
                                            <td>{item.gmtCreate.slice(0, -5)}</td>
                                            <td>{item.direction === 48 ? '买' : '卖'}</td>
                                            <td>{item.tradePrice}</td>
                                            <td>{item.tradeQty}</td>
                                            <td>{item.direction === 48 ? "--" : item.upRate + '%'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            )
        } else {
            return (
                <div className="compose-detail-wrapper-loading">
                    <Loading />
                </div>
            )
        }

    }
}