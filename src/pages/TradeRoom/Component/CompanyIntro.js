import React, { Component } from 'react'

export default class CompangIntro extends Component {
    render() {
        let { info } = this.props
        if(!info){
            info = {}
        }
        return (
            <div className="news-list">
                <div className="info-item" >
                    <div className="info-title">公司名称</div><div className="info-message">{info.chi_name}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">公司英文名称</div><div className="info-message">{info.eng_name}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">证券简称</div><div className="info-message">{info.secu_abbr}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">上市日期</div><div className="info-message">{info.list_date}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">省份</div><div className="info-message">{info.state}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">募集资金总额</div><div className="info-message">{info.ipo_proceeds}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">总经理</div><div className="info-message">{info.general_manager}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">法人代表</div><div className="info-message">{info.legal_repr}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">董秘</div><div className="info-message">{info.secretary}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">交易名称</div><div className="info-message">{info.exchange_name}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">证券/股证事物代表</div><div className="info-message">{info.secu_affairs_repr}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">发行日期</div><div className="info-message"></div>
                </div>
                <div className="info-item" >
                    <div className="info-title">发行价</div><div className="info-message">{info.issue_price}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">发行数量</div><div className="info-message">{info.issue_vol}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">主承销商</div><div className="info-message"></div>
                </div>
                <div className="info-item" >
                    <div className="info-title">注册地址</div><div className="info-message">{info.reg_addr}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">公司电子邮箱</div><div className="info-message">{info.email}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">公司网址</div><div className="info-message">{info.website}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">联系电话</div><div className="info-message">{info.tel}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">主营业务</div><div className="info-message">{info.major_business}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">所属行业</div><div className="info-message">{info.indurstry}</div>
                </div>
                <div className="info-item" >
                    <div className="info-title">公司简介</div><div className="info-message">{info.brief_intro}</div>
                </div>
            </div>
        )
    }
}