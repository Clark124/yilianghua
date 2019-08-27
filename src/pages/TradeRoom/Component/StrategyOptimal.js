import React, { Component } from 'react'
import { strategyOptimallist,optimalStock } from '../../../serivce'
import icon_down from '../../../assets/icon_arrow_down.png'

export default class StrategyOptimal extends Component {
    constructor() {
        super()
        this.state = {
            code:"",
            strategyList: []
        }
    }
    refreshStrategy(code){
        const token = localStorage.getItem('token')
        if(token){
            strategyOptimallist({ code, token }).then(res => {
                let list = res.data
                list = list.map(item => {
                    item.showDetail = false
                    item.introduce = ""
                    item.strategyList = []
                    return item
                })
                this.setState({ strategyList: list ,code})
            })
        }
    }
    componentWillMount() {
        const code = this.props.code
        const token = localStorage.getItem('token')
        if(token){
            strategyOptimallist({ code, token }).then(res => {
                let list = res.data
                list = list.map(item => {
                    item.showDetail = false
                    item.introduce = ""
                    item.strategyList = []
                    return item
                })
                this.setState({ strategyList: list ,code})
            })
        }
    }
    

    showBuyPoint(item) {
        this.props.setBuyPoint(item)
    }
    showStrategyDetail(index,data) {
        let { strategyList } = this.state
        strategyList[index].showDetail = !strategyList[index].showDetail
        this.setState({ strategyList })
        if(strategyList[index].showDetail){
            optimalStock({release_id:data.release_id}).then(res=>{
                strategyList[index].strategyList = res.data
                this.setState({strategyList})
            })
        }
    }
    //更换股票
    changeStock(item){
        this.props.changeStock(item)
    }
    render() {
        const { strategyList } = this.state
        return (
            <div className="strategy-optimal">
                {/* <div className="strategy-btn">策略选股</div> */}
                {strategyList.length > 0 ?
                    <div className="strategy-list">
                        {strategyList.map((item, index) => {
                            return (
                                <div className="strategy-item" key={index}>
                                    <div className="strategy-data">
                                        <div className="left" onClick={this.showBuyPoint.bind(this, item)}>
                                            <span className="name">{(index + 1) + '、' + item.strategy_name}</span>
                                            <span className={item.return_ratio >= 0 ? "rate red" : 'rate'}>{(item.return_ratio * 100).toFixed(2)}%</span>
                                        </div>
                                        <img src={icon_down} alt="" className={item.showDetail ? "icon detail" : 'icon'} onClick={this.showStrategyDetail.bind(this, index,item)} />
                                    </div>
                                    {item.showDetail ?
                                        <div className="strategy-detail">
                                            {/* <div className="detail-title">策略说明：暂无说明</div> */}
                                            <div className="name-profit-title">
                                                <span>最优股票</span>
                                                <span>收益</span>
                                            </div>
                                            {item.strategyList.length===0?
                                            <div className="load">正在加载中...</div>:
                                            <div className="list">
                                                {item.strategyList.map((item,index)=>{
                                                    return(
                                                        <div className="optimal-item" key={index} onClick={this.changeStock.bind(this,item)}>
                                                            <span>{item.stock_name}({item.stock_code.substring(0,6)})</span>
                                                            <span className="num">{(item.return_ratio*100).toFixed(2)}%</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            }
                                        </div> : null
                                    }
                                     

                                </div>
                            )
                        })}
                    </div> :
                    <div className="no-data">暂无最优策略</div>
                }
            </div>
        )
    }
}