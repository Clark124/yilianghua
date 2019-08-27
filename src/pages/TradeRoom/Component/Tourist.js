import React, { Component } from 'react'

export default class Tourist extends Component {
    render() {
        const { userInfo ,balance} = this.props
        let {asset_balance,enable_balance,market_value,floatProfit} = balance
        let totalProfit=0 
        let profitRate = 0
        if(asset_balance){
            asset_balance = Number(asset_balance) 
          
            enable_balance =  Number(enable_balance)
        
        
          
            market_value = Number(market_value)
            totalProfit = asset_balance-1000000
            profitRate = (totalProfit/1000000)*100
        }
        return (
            <div className="tourist">
                <div className="avatar-wrapper">
                    <img src={userInfo ? userInfo.portrait : 'http://www.spd9.com/images/tou4_106.png'} alt="" />
                </div>

                <div className="message-wrapper">
                    <div className="title">
                        <div className="name">{userInfo ? userInfo.nickname : '游客的交易室'}</div>
                        <div className="mark">
                            {userInfo ? userInfo.personal_profile : '游客需知：您可以在交易室图表上进行相关操作，若要记录相关数据，请注册登录后进行：）'}

                        </div>
                    </div>
                    <div className="message">
                        <div className="message-header">
                            <span>总盈亏：<span className={totalProfit>=0?"number red":"number green"}>{totalProfit.toFixed(2)}</span></span>
                            <span>浮动盈亏：<span className={floatProfit>=0?"number red":"number green"}>{floatProfit.toFixed(2)}</span></span>
                            <span>总收益：<span className={profitRate>=0?"number red":"number green"}>{profitRate.toFixed(2)+'%'}</span></span>
                            <span>资产总额：<span className="number">{asset_balance?(asset_balance/10000).toFixed(2)+'万':'--'}</span></span>
                            {/* {!userInfo ? <div className="login-btn">登录交易室</div> : null} */}

                        </div>
                        <div className="info-list">
                            <div className="info-item">
                                <div className="number">{market_value?(market_value/10000).toFixed(2)+'万':'--'}</div>
                                <div>市值</div>
                            </div>
                            <div className="info-item">
                                <div className="number">{enable_balance?(enable_balance/10000).toFixed(2)+'万':'--'}</div>
                                <div>可用资金</div>
                            </div>
                            <div className="info-item">
                                <div className="number">--</div>
                                <div>30天收益率</div>
                            </div>
                            <div className="info-item">
                                <div className="number">--</div>
                                <div>最大盈利</div>
                            </div>
                            <div className="info-item">
                                <div className="number">--</div>
                                <div>最大亏损</div>
                            </div>
                            <div className="info-item">
                                <div className="number">--</div>
                                <div>最大回测</div>
                            </div>
                            <div className="info-item">
                                <div className="number">--</div>
                                <div>交易次数</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}