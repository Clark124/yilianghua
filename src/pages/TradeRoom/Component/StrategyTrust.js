import React, { Component } from 'react'

import { trustStrategyStock, getSellPoint } from '../../../serivce'
import Momonet from 'moment'

export default class TrustList extends Component {
    constructor() {
        super()
        this.state = {
            strategyList: [],
            strategyInfo: "",
        }
    }
    componentWillMount() {
        this.getTrustList()
    }
    getTrustList() {
        const code = this.props.code
        const token = localStorage.getItem('token')
        if (token) {
            trustStrategyStock({ code, token, type: 'deploy' }).then(res => {
                this.setState({ strategyList: res })
            })
        }
    }
    getStrategyDetail(item) {
        console.log(item)
        const data = {
            strategyId: item.strategy_id,
            period: 6,
            code: item.stock_code,
            funds: 100000,
            startTime: Momonet().subtract(1, 'years').format('YYYY-MM-DD'),
            endTime: Momonet().format('YYYY-MM-DD'),
            strategy_params: item.strategy_params,
            strategy_name: item.strategy_name,
            strategy_version: item.strategy_version,
        }
        getSellPoint(data).then(res => {
            const { perform, alerts } = res.result
            let obj = {}
            obj.return_ratio = (perform.return_ratio * 100).toFixed(2)
            obj.timing_raio = (Number(perform.timing_raio) * 100).toFixed(2)
            obj.maxDD = (Number(perform.MaxDD) * 100).toFixed(2)
            obj.winning_ratio = (Number(perform.winning_ratio) * 100).toFixed(2)
            let num = 0
            alerts.forEach(item => {
                if (item.signal.type === 1) {
                    num += 1
                }
            })
            obj.tradeNum = num
            obj.id = item.release_id
            obj.name = item.strategy_name
            this.setState({strategyInfo:obj})
            this.props.setSignal(alerts)
        })
    }
    render() {
        const { strategyList, strategyInfo } = this.state
        
        return (
            <div className="strategy-trust">
                <div className="strategy-trust-list">
                    {
                        strategyList.map((item, index) => {
                            return (
                                <div className="strategy-item" key={index} onClick={this.getStrategyDetail.bind(this, item)}>
                                    <span className="name">{index + 1}、{item.name.slice(0, -11)}</span>
                                    <span className={item.return_ratio >= 0 ? "profit" : "profit green"}>{(item.return_ratio * 100).toFixed(2)}%</span>
                                </div>
                            )
                        })
                    }
                    {strategyList.length===0?<div className="no-data">暂无策略</div>:null}
                </div>
                {
                    strategyInfo ?
                        <div className="strategy-info">
                            <div className="strategy-name">{strategyInfo.name}</div>
                            <div className="info-list">
                                <div className="info-item">
                                    <div className="name">收益率</div>
                                    <div className={strategyInfo.return_ratio>=0?"number":"number green"}>{strategyInfo.return_ratio}%</div>
                                </div>
                                <div className="info-item">
                                    <div className="name">择时收益率</div>
                                    <div className={strategyInfo.timing_raio>=0?"number":"number green"}>{strategyInfo.timing_raio}%</div>
                                </div>
                                <div className="info-item">
                                    <div className="name">最大回测</div>
                                    <div className={"number"}>{strategyInfo.maxDD}%</div>
                                </div>
                            </div>
                            <div className="info-list">
                                <div className="info-item">
                                    <div className="name">交易次数</div>
                                    <div className="number">{strategyInfo.tradeNum}</div>
                                </div>
                                <div className="info-item">
                                    <div className="name">盈率</div>
                                    <div className={strategyInfo.winning_ratio>=0?"number":"number green"}>{strategyInfo.winning_ratio}%</div>
                                </div>
                                <span className="more" onClick={()=>{
                                        window.open("/#/strategy/detail/"+strategyInfo.id, "_blank");
                                }}>更多</span>
                            </div>
                        </div> : null
                }

            </div>
        )
    }
}