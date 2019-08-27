import React, { Component } from 'react'

export default class CompangStockTrade extends Component {
    render() {
        let { info } = this.props
        if(!info){
            info = {}
        }
        return (
            <div className="news-list">
                <div className="info-item" >
                    <div className="info-title">发行价</div><div className="info-message">{info.issue_price}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">上市日期</div><div className="info-message">{info.listed_date}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">上市板块</div><div className="info-message">{info.listed_sector}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">每股面值</div><div className="info-message">{info.pervalue}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">证券简称</div><div className="info-message">{info.secu_abbr}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">证券类型</div><div className="info-message">{info.secu_category}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">证券代码</div><div className="info-message">{info.secu_code}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">证券市场</div><div className="info-message">{info.secu_market}</div>
                </div>
            </div>
        )
    }
}