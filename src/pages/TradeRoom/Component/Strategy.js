import React, { Component } from 'react'
import Optimal from './StrategyOptimal'
import TrustList from './StrategyTrust'
import FollowList from './StrategyFollow'


export default class Strategy extends Component {
    constructor() {
        super()
        this.state = {
            tabList: ['最优', '托管', '跟单',
                 '收藏'
            ],
            tabIndex: 0,
        }
    }
    onChangeTab(index) {
        this.setState({
            tabIndex: index
        })
    }
    refreshStrategy(code) {
        this.refs.strategy.refreshStrategy(code)

    }
    render() {
        const { tabList, tabIndex } = this.state
        return (
            <div className='strategy'>
                <div className="tab">
                    {tabList.map((item, index) => {
                        return (<span key={index}
                            onClick={this.onChangeTab.bind(this, index)}
                            className={tabIndex === index ? "tab-name active" : 'tab-name'}>{item}</span>)
                    })}

                </div>
                <div className="strategy-content">
                    {tabIndex === 0 ? <Optimal code={this.props.code}
                        ref="strategy"
                        setBuyPoint={(item) => this.props.setBuyPoint(item)}
                        changeStock={(item) => this.props.changeStock(item)}
                    /> : null}
                    {tabIndex === 1 ? <TrustList code={this.props.code}
                        ref="trustList"
                        {...this.props}
                    /> : null}
                    {tabIndex === 2 ? <FollowList code={this.props.code}
                        ref="trustList"
                        {...this.props}
                    /> : null}
                     {tabIndex === 3 ? <FollowList code={this.props.code}
                        ref="trustList"
                        type={'collection'}
                        {...this.props}
                    /> : null}
                </div>

            </div>
        )
    }
}