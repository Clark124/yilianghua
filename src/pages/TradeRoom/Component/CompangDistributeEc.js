import React, { Component } from 'react'

export default class CompangDistributeEc extends Component {
    toPrePage() {
        this.props.toDistEcPrePage()
    }
    toNextPage() {
        this.props.toDistEcNextPage()
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
                                <div className="info-title">提示类型</div><div className="info-message">{item._id}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">公告内容</div><div className="info-message">{item.content}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">事件日期</div><div className="info-message">{item.notice_date}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">券商类型</div><div className="info-message">{item.secu_info}</div>
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