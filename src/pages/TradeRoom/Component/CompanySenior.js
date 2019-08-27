import React, { Component } from 'react'

export default class CompangSenior extends Component {
    toPrePage() {
        this.props.toLeaderPrePage()
    }
    toNextPage() {
        this.props.toLeaderNextPage()
    }
    render() {
        let { personList } = this.props
        if (!personList) {
            personList = []
        }
        return (
            <div>
                {personList.length === 0 ? <div className="no-data">暂无数据</div> : null}
                {personList.map((item, index) => {
                    return (
                        <div className="news-list leader" key={index}>
                            <div className="info-item" >
                                <div className="info-title">姓名</div><div className="info-message">{item.leader_name}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">职位</div><div className="info-message">{item.leader_title}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">年龄</div><div className="info-message">{item.leader_age}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">学位</div><div className="info-message">{item.leader_degree}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">性别</div><div className="info-message">{item.leader_gender}</div>
                            </div>
                            <div className="info-item" >
                                <div className="info-title">日期</div><div className="info-message">{item.earliestindate}</div>
                            </div>
                        </div>
                    )
                })}
                {personList.length > 0 ?
                    <div className="btn-change-page">
                        <span className="btn pre" onClick={this.toPrePage.bind(this)}>上一页</span>
                        <span className="btn next" onClick={this.toNextPage.bind(this)}>下一页</span>
                    </div> : null
                }

            </div>

        )
    }
}