import React,{Component} from 'react'
import Company from './Company'

export default class Quote extends Component{
    changeCode(code){
        this.refs.company.changeCode(code)
    }
    render(){
        const quote = this.props.quote
        return (
            <div className="quote-news">
            <div className="left">
                <div className="stock-name">{quote.prod_name}（{quote.prod_code}）</div>
                <div className="quote-wrapper">
                    <div className="price">
                        <div className={quote.px_change >= 0 ? "price-num" : 'price-num green'}>￥{quote.last_px.toFixed(2)}</div>
                        <div className={quote.px_change >= 0 ? "change-rate" : "change-rate green"}>{quote.px_change.toFixed(2)}（{quote.px_change_rate.toFixed(2)}%）</div>
                    </div>
                    <div className="quote">
                        <div className="list">
                            <div className="item">今开：{quote.open_px.toFixed(2)}</div>
                            <div className="item">涨停：{quote.up_px.toFixed(2)}</div>
                            <div className="item">52周最高：{quote.w52_high_px.toFixed(2)}</div>
                            <div className="item">总成交：{(quote.business_amount / 10000).toFixed(2)}万股</div>
                            <div className="item">总市值：{(quote.market_value / 100000000).toFixed(2)}亿</div>
                        </div>

                        <div className="list">
                            <div className="item">昨收：{quote.preclose_px.toFixed(2)}</div>
                            <div className="item">跌停：{quote.down_px.toFixed(2)}</div>
                            <div className="item">52周最低：{quote.w52_low_px.toFixed(2)}</div>
                            <div className="item">成交额：{(quote.business_balance / 100000000).toFixed(2)}亿</div>
                            <div className="item">流通市值：{(quote.circulation_value / 100000000).toFixed(2)}亿</div>
                        </div>
                        <div className="list">
                            <div className="item">最高：{quote.high_px.toFixed(2)}</div>
                            <div className="item">市盈率：{quote.pe_rate.toFixed(2)}</div>
                            <div className="item">每股净值产：{quote.bps.toFixed(2)}</div>
                            <div className="item">换手：{quote.turnover_ratio.toFixed(2)}</div>
                            <div className="item">量比：{quote.vol_ratio.toFixed(2)}</div>
                        </div>
                        <div className="list">
                            <div className="item">最低：{quote.low_px.toFixed(2)}</div>
                            <div className="item">市净：{quote.dyn_pb_rate.toFixed(2)}</div>
                            <div className="item">每股收益：{quote.eps.toFixed(2)}</div>
                            <div className="item">振幅：{quote.amplitude.toFixed(2)}</div>
                        </div>

                    </div>
                </div>
                <Company {...this.props} ref="company"/>
            </div>
            {/* <div className="right"></div> */}
        </div>
        )
    }
}