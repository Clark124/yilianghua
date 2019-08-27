import React, { Component } from 'react'
import TableHold from './TableHold'
import { searchStcok,entrustBuy } from '../../../serivce'
import { message } from 'antd';
export default class BuyModal extends Component {
    constructor() {
        super()
        this.state = {
            stockCode: "",
            code: "",
            price: "",
            count: "",
            searchList: [],
            showBuyModal: false,
        }
    }
    componentWillMount() {
        this.setInput()
    }
    componentDidUpdate() {
        const nextCode = this.props.quote.prod_code
        if (this.state.stockCode !== nextCode) {
            this.setState({ stockCode: nextCode }, () => {
                this.setInput()
            })
        }
    }
    setInput() {
        const { quote, balance } = this.props
        const code = quote.prod_code.substring(0, 6)
        const price = quote.last_px
        const enable_balance = balance.enable_balance
        let count = 0
        if ((enable_balance / price) >= 100) {
            count = 100
        }
        this.setState({ code, price, count, stockCode: quote.prod_code })
    }
    //搜索股票
    onSearchStock(e) {
        const code = e.target.value

        this.setState({ code })
        if (code === "") {
            this.setState({ searchList: [], code: "" })
        } else {
            searchStcok({ prod_code: code }).then(res => {
                this.setState({ searchList: res.data })
            })
        }
    }
    onChangePrice(e) {
        this.setState({ price: Number(e.target.value) })
    }
    onChangeCount(e) {
        this.setState({ count: e.target.value })
    }
    //点击加好增加买入数量
    addHouseStore() {
        this.setState({ count: this.state.count + 100 })
    }
    //点击减号减少买入数量
    reduceHouseStore() {
        if (this.state.count <= 100) {
            return
        }
        this.setState({ count: this.state.count - 100 })
    }
    addPrice() {
        this.setState({ price: (Number(this.state.price) + 0.01).toFixed(2) })
    }
    reducePrice() {
        if (this.state.price <= 0.01) {
            return
        }
        this.setState({ price: (Number(this.state.price) - 0.01).toFixed(2) })
    }
    onChangeStock(item) {
        this.props.onChangeStock(item.prod_code)
        this.setState({ searchList: [] })
    }

    onSubmit() {
        const checkResult = this.checkInput()
        if(checkResult){
            this.setState({showBuyModal:true})
        }
       
    }
    confirmBuy(){
        const {stockCode,count,price} = this.state
        let type = stockCode.substring(7)
        if(type==='SZ'){
            type=2
        }else{
            type=1
        }
        const token = localStorage.getItem('token')
        const data = {
            stock_code:stockCode,
            exchange_type:type,
            entrust_price:price,
            entrust_amount:count,
            entrust_bs:2
        }
        entrustBuy(data,token).then(res=>{
            if(res.data.error_info){
                message.error(res.data.error_info)
            }else{
                message.success('委托卖出成功')
            }
            this.setState({showBuyModal:false,count:0})
        })
    }
    //验证输入信息
    checkInput() {
        const { quote ,currentHoldList} = this.props
        const { price, count } = this.state
      
        let enable_sell = 0
        const currentCodeName = quote.prod_name
        currentHoldList.forEach(item=>{
            if(item.stock_name===currentCodeName){
                enable_sell = Number(item.enable_amount)
            }
        })

        if(enable_sell===0){
            message.error('当前股票无法卖出')
            return
        }

        if (price <= 0) {
            message.error('输入的价格不合规')
            return
        }
        if (count % 100 !== 0) {
            message.error('卖出数量必须为100的整数倍')
            return
        }
        if (count <= 0) {
            message.error('输入的卖出数量不合规')
            return
        }
        if (count > enable_sell) {
            message.error('卖出数量不可超过最大可卖数')
            return
        }
        return 1
    }
    render() {
        const { currentHoldList, quote, balance } = this.props
        const { code, price, count, searchList, showBuyModal } = this.state
       
        let enable_sell = 0
        const currentCodeName = quote.prod_name
        currentHoldList.forEach(item=>{
            if(item.stock_name===currentCodeName){
                enable_sell = Number(item.enable_amount)
            }
        })
      
        let arr1 = []
        let arr2 = []
        if (quote.bid_grp) {
            let buyGrp = quote.bid_grp
            let sellGrp = quote.offer_grp
            sellGrp = sellGrp.split(',').slice(0, 15)
            buyGrp = buyGrp.split(',').slice(0, 15)
            for (let i = sellGrp.length - 1; i >= 0; i = i - 3) {
                let obj = {
                    price: sellGrp[i - 2],
                    value: sellGrp[i - 1]
                }
                arr1.push(obj)
            }
            for (let i = 0; i < buyGrp.length; i = i + 3) {
                let obj = {
                    price: buyGrp[i],
                    value: buyGrp[i + 1]
                }
                arr2.push(obj)
            }
        }


        return (
            <div className="buy-modal">
                <div className="buy-input-wrapper">
                    <div className="input-item">
                        <span className="title  sell">证券代码：</span>
                        <input type="number" className="input-code"
                            value={code} onChange={this.onSearchStock.bind(this)}
                        />
                        {searchList.length > 0 ?
                            <div className="search-list">
                                {searchList.map((item, index) => {
                                    return (
                                        <div className="search-item" key={index} onClick={this.onChangeStock.bind(this, item)}>
                                            <span className="code">{item.prod_code.substring(0, 6)}</span>
                                            <span className="name">{item.prod_name}</span>
                                        </div>
                                    )
                                })}
                            </div> : null
                        }
                    </div>
                    <div className="input-item">
                        <span className="title sell">卖出价格：</span>
                        <div className="number-operate">
                            <div className="btn-operate" onClick={this.reducePrice.bind(this)}>-</div>
                            <input type="number" className="input-code" value={price} onChange={this.onChangePrice.bind(this)} />
                            <div className="btn-operate" onClick={this.addPrice.bind(this)}>+</div>
                        </div>
                    </div>
                    <div className="input-item">
                        <span className="title  sell">最大可卖：</span>
                        <span className="count">{enable_sell}</span>
                    </div>
                    <div className="input-item">
                        <span className="title  sell">卖出数量：</span>
                        <div className="number-operate">
                            <span className="btn-operate" onClick={this.reduceHouseStore.bind(this)}>-</span>
                            <input type="number" className="input-code" value={count} onChange={this.onChangeCount.bind(this)} />
                            <span className="btn-operate" onClick={this.addHouseStore.bind(this)}>+</span>
                        </div>
                    </div>
                    <div className="input-item">
                        <span className="title  sell">卖出金额：</span>
                        <span className="count">{(Number(price) * Number(count)).toFixed(2)}</span>
                    </div>
                    <div className="reset-buy">
                        {/* <span className="btn reset" onClick={()=>this.setState({isReset:true})}>重置</span> */}
                        <span className="btn sell" onClick={this.onSubmit.bind(this)}>卖出委托</span>
                    </div>
                    <div className="balance-current">
                        <div className="balance-line">
                            <div className="balance-item">
                                <span>可用：</span>
                                <span className="count">{balance.enable_balance}</span>
                            </div>
                            <div className="balance-item">
                                <span>市值：</span>
                                <span className="count">{balance.market_value}</span>
                            </div>
                        </div>
                        <div className="balance-line">
                            <div className="balance-item">
                                <span>冻结：</span>
                                <span className="count">{balance.frozen_balance}</span>
                            </div>
                            <div className="balance-item">
                                <span>资产：</span>
                                <span className="count">{balance.asset_balance}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="real-quote-list">
                    <div className="sell-list">
                        {arr1.map((item, index) => {
                            return (
                                <div className="list-item" key={index}>
                                    <span className="name">卖{5 - index}</span>
                                    <span className="price">{item.price}</span>
                                    <span className="number">{Math.ceil(Number(item.value) / 100)}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="message">
                        <div className="">
                            <span className="name">最新</span>
                            <span className={quote.px_change >= 0 ? quote.px_change > 0 ? 'number red' : 'number' : 'number green'}>{quote.last_px}</span>
                        </div>
                        <div className="">
                            <span className="name">涨幅</span>
                            <span className={quote.px_change >= 0 ? quote.px_change > 0 ? 'number red' : 'number' : 'number green'}>{quote.px_change_rate}%</span>
                        </div>
                    </div>
                    <div className="sell-list">
                        {arr2.map((item, index) => {
                            return (
                                <div className="list-item" key={index}>
                                    <span className="name">买{index + 1}</span>
                                    <span className="price">{item.price}</span>
                                    <span className="number">{Math.ceil(Number(item.value) / 100)}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="message">
                        <div className="">
                            <span className="name">涨停</span>
                            <span className="number red">{quote.up_px}</span>
                        </div>
                        <div className="">
                            <span className="name">跌停</span>
                            <span className="number green">{quote.down_px}</span>
                        </div>
                    </div>
                </div>
                <div className="current-hold">
                    <TableHold currentHoldList={currentHoldList} onChangeStock={(code) => this.props.onChangeStock(code)} type={'trade'} />
                </div>
                {showBuyModal ? <div className="buy-modal-fixed">
                    <div className="pannel">
                        <div className="title">委托确认 卖出</div>
                        <div className="info">证券代码：{code}</div>
                        <div className="info">证券名称：{quote.prod_name}</div>
                        <div className="info">委托价格：{price}</div>
                        <div className="info">委托数量：{count}</div>
                        <div className="info">预估金额：{(Number(price) * Number(count)).toFixed(2)}</div>
                        <div className="btn-wrapper">
                            <span className="btn confirm" onClick={this.confirmBuy.bind(this)}>确定</span>
                            <span className="btn cancel" onClick={()=>this.setState({showBuyModal:false})}>取消</span>
                        </div>
                    </div>
                </div> : null}

            </div>
        )
    }
}