import React, { Component } from 'react'

export default class CompangHeadline extends Component {
    render() {
        let { info } = this.props
        if(!info){
            info = {}
        }
        return (
            <div className="news-list">
                <div className="info-item" >
                    <div className="info-title">可流通股A股</div><div className="info-message">{info.a_floats}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">每股公积金</div><div className="info-message">{info.accumulation_fundps}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">基本每股收益</div><div className="info-message">{info.basic_eps}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">目前可流通股</div><div className="info-message">{info.float_share}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">每股净资产</div><div className="info-message">{info.naps}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">净利润同比增长</div><div className="info-message">{info.net_profit_growrate}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">每股经营性现金流</div><div className="info-message">{info.oper_cash_flowps}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">营业收入同比增长</div><div className="info-message">{info.oper_revenue_growrate}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">市净率(最新)</div><div className="info-message">{info.pb}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">滚动市盈率(最新)</div><div className="info-message">{info.pe}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">净资产收益率ROE(摊薄)</div><div className="info-message">{info.roe}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">总股本</div><div className="info-message">{info.total_shares}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">每股未分配利润</div><div className="info-message">{info.undivided_profit}</div>
                </div>
            </div>
        )
    }
}