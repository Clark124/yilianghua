import React, { Component } from 'react'
import { upDownNumber, changereal } from '../../../serivce'

export default class Handicap extends Component {
    constructor() {
        super()
        this.state = {
            up: 0,
            down: 0,
            flat: 0,
            changerealList: [], //实时的交易记录
        }
    }
    componentWillMount() {
        const code = this.props.code
        this.getData(code)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    getData(code){
        if(this.timer){
            clearInterval(this.timer)
        }
        const isHoliday = this.props.isHoliday
        this.getUpDown(code)
        this.getChangerealList(code)
        const currentTime = new Date().toTimeString()
        if (!isHoliday) {
            if ((currentTime >= '09:00:00' && currentTime <= '11:30:00') || (currentTime >= '13:00:00' && currentTime <= '15:00:00')) {
                this.timer = setInterval(() => {
                    this.getUpDown(code)
                    this.getChangerealList(code)
                }, 3000)
            }
        }
    }
    getUpDown(code) {
        const type = code.substring(7)
        upDownNumber({ typecode: type }).then(res => {
            this.setState({ up: res[0].up, down: res[0].down, flat: res[0].flat })
        })
    }
    //实时交易记录
    getChangerealList(code) {
        changereal({ code }).then(res => {
            this.setState({ changerealList: res })
        })
    }

    render() {
        const { up, down, flat, changerealList } = this.state
        const { quote } = this.props
        let business_amount = quote.business_amount
        if (business_amount > 100000000) {
            business_amount = (quote.business_amount / 100000000).toFixed(2) + '亿'
        } else {
            business_amount = (quote.business_amount / 10000).toFixed(2) + '万'
        }
        return (
            <div className="handicap-wrapper">
                <div className="info">
                    <div className="info-item-left">
                        <div className="info-item"><span className="name">最新</span><span className="number">{quote.last_px.toFixed(2)}</span></div>
                        <div className="info-item"><span className="name">涨跌</span><span className="number">{quote.px_change.toFixed(2)}</span></div>
                        <div className="info-item"><span className="name">涨幅</span><span className="number">{quote.px_change_rate.toFixed(2)}%</span></div>
                        <div className="info-item"><span className="name">振幅</span><span className="number-1">{quote.amplitude.toFixed(2)}%</span></div>
                        <div className="info-item"><span className="name">成交量</span><span className="number-1">{business_amount}</span></div>
                    </div>
                    <div className="info-item-right">
                        <div className="info-item"><span className="name">开盘</span><span className="number">{quote.open_px.toFixed(2)}</span></div>
                        <div className="info-item"><span className="name">最高</span><span className="number">{quote.high_px.toFixed(2)}</span></div>
                        <div className="info-item"><span className="name">最低</span><span className="number">{quote.low_px.toFixed(2)}</span></div>
                        <div className="info-item"><span className="name">成交额</span><span className="number-1">{(quote.business_balance / 100000000).toFixed(2)}亿</span></div>
                    </div>
                </div>

                <div className="up-down-number">
                    <div className="item">
                        <div>上涨家数</div>
                        <div className="number red">{up}</div>
                    </div>
                    <div className="item">
                        <div>平盘家数</div>
                        <div className="number yellow">{flat}</div>
                    </div>
                    <div className="item">
                        <div>下跌家数</div>
                        <div className="number green">{down}</div>
                    </div>
                </div>

                <div className="changereal-list">
                    {changerealList.map((item, index) => {
                        return (
                            <div className="changereal-item" key={index}>
                                <span className="time">{item.business_time}</span>
                                <span className="price">{Number(item.hq_px).toFixed(2)}</span>
                                <span className="amount">{item.business_amount}</span>
                            </div>
                        )
                    })}

                </div>
            </div>
        )
    }
}