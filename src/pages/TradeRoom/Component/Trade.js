import React, { Component } from 'react'
import close_icon from '../../../assets/close1.jpg'
import buy_icon from '../images/buy_icon.png'
import sell_icon from '../images/sell_icon.png'
import search_icon from '../images/query_icon.png'
import withdraw_icon from '../images/withdraw_icon.png'

import TableHold from './TableHold'
import EntrustList from './EntrustList'
import EntrustListCurrent from './EntrustListCurrent'
import DealCurrent from './DealCurrent'
import DealHistory from './DealHistory'
import CancelOrder from './CancelOrder'
import BuyModal from './BuyModal'
import SellModal from './SellModal'

export default class Trade extends Component {
    constructor() {
        super()
        this.state = {
            tabIndex: 0,

        }
    }
    onChangeTab(index) {
        this.setState({ tabIndex: index })
    }
    render() {
        const { tabIndex } = this.state
        const { balance, currentHoldList, quote } = this.props
        return (
            <div className="trade-component">
                <img className="close-icon" src={close_icon} alt="" onClick={() => this.props.closeTradeModal()} />
                <div className="tab">
                    <div className={tabIndex === 0 ? "tab-item active" : 'tab-item'} onClick={this.onChangeTab.bind(this, 0)}>
                        <img src={buy_icon} alt="" />
                        <span>买入</span>
                    </div>
                    <div className={tabIndex === 1 ? "tab-item active" : 'tab-item'} onClick={this.onChangeTab.bind(this, 1)}>
                        <img src={sell_icon} alt="" />
                        <span>卖出</span>
                    </div>
                    <div className={tabIndex === 2 ? "tab-item active" : 'tab-item'} onClick={this.onChangeTab.bind(this, 2)}>
                        <img src={withdraw_icon} alt="" />
                        <span>撤单</span>
                    </div>
                    <div className="query-list">
                        <div className="query-title">
                            <img src={search_icon} alt="" />
                            <span>查询</span>
                        </div>
                        <div className={tabIndex === 3 ? "query-item active" : 'query-item'} onClick={this.onChangeTab.bind(this, 3)}>当日成交</div>
                        <div className={tabIndex === 4 ? "query-item active" : 'query-item'} onClick={this.onChangeTab.bind(this, 4)}>当日委托</div>
                        <div className={tabIndex === 5 ? "query-item active" : 'query-item'} onClick={this.onChangeTab.bind(this, 5)}>历史成交</div>
                        <div className={tabIndex === 6 ? "query-item active" : 'query-item'} onClick={this.onChangeTab.bind(this, 6)}>历史委托</div>
                        <div className={tabIndex === 7 ? "query-item active" : 'query-item'} onClick={this.onChangeTab.bind(this, 7)}>持仓股票</div>
                    </div>
                </div>
                {
                    tabIndex > 1 ?
                        <div className="balance-list">
                            <div className="balance-item">
                                <span>可用：</span><span className="number">{balance.enable_balance}</span>
                            </div>
                            <div className="balance-item">
                                <span>市值：</span><span className="number">{balance.market_value}</span>
                            </div>
                            <div className="balance-item">
                                <span>冻结：</span><span className="number">{balance.frozen_balance}</span>
                            </div>
                            <div className="balance-item">
                                <span>资产：</span><span className="number">{balance.asset_balance}</span>
                            </div>
                        </div> : null
                }
                {
                    tabIndex > 1 ?
                        <div className="trade-content">
                            {tabIndex === 7 ? <TableHold currentHoldList={currentHoldList} /> : null}
                            {tabIndex === 6 ? <EntrustList /> : null}
                            {tabIndex === 4 ? <EntrustListCurrent /> : null}
                            {tabIndex === 3 ? <DealCurrent /> : null}
                            {tabIndex === 5 ? <DealHistory /> : null}
                            {tabIndex === 2 ? <CancelOrder /> : null}
                        </div> : null
                }

                {tabIndex === 0 ? <BuyModal
                    currentHoldList={currentHoldList}
                    balance={balance}
                    quote={quote}
                    onChangeStock={(code)=>this.props.onChangeStock(code)}
                /> : null}
                {tabIndex === 1 ? <SellModal
                    currentHoldList={currentHoldList}
                    balance={balance}
                    quote={quote}
                    onChangeStock={(code)=>this.props.onChangeStock(code)}
                /> : null}

            </div>
        )
    }
}