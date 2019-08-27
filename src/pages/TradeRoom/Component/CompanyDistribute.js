import React, { Component } from 'react'

export default class CompangDistribute extends Component {
    toPrePage() {
        this.props.toDistPrePage()
    }
    toNextPage() {
        this.props.toDistNextPage()
    }
    render() {
        let { distList } = this.props
        if (!distList) {
            distList = []
        }
        return (
            <div>
                {distList.length === 0 ? <div className="no-data">暂无数据</div> : null}
                {distList.map((item, index) => {
                    return (
                        <div className="news-list leader" key={index}>
                            <div className="info-item" >
                                <div className="info-title">申报日期</div><div className="info-message">{item.report_date}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">送股</div><div className="info-message">{item.bonus_share_ratio}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">转增</div><div className="info-message">{item.tranadd_share_ratio}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">派息(税前)</div><div className="info-message">{item.cash_divi}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">基准股本</div><div className="info-message">{item.divi_base}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">除权除息日</div><div className="info-message">{item.ex_divi_date}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">股权登记日</div><div className="info-message">{item.right_reg_date}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">红股上市日</div><div className="info-message">{item.bonus_share_list_date}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">分红对象</div><div className="info-message">{item.divi_object}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">方案进度</div><div className="info-message">{item.procedure_desc}</div>
                            </div>
                        </div>
                    )
                })}
                {distList.length > 0 ?
                    <div className="btn-change-page">
                        <span className="btn pre" onClick={this.toPrePage.bind(this)}>上一页</span>
                        <span className="btn next" onClick={this.toNextPage.bind(this)}>下一页</span>
                    </div> : null
                }

            </div>

        )
    }
}