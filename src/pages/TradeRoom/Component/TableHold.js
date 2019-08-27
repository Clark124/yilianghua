import React, { Component } from 'react'

export default class TableHold extends Component {
    onChangeStock(item){
        const {type} = this.props
        if(!type){
            return
        }
        let code = item.stock_code
        if(item.exchange_type==='2'){
            code = code + '.SZ'
        }else{
            code = code + '.SS'
        }
        this.props.onChangeStock(code)
    }
    render() {
        const { currentHoldList ,type} = this.props
        return (
            <div className="detail-list">
                <div className="title">持仓</div>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr className="header">
                                <td>证券代码</td>
                                <td>证券名称</td>
                                <td>可用持仓</td>
                                <td>冻结数量</td>
                                <td>盈亏</td>
                                <td>成本价</td>
                                <td>市价</td>
                                <td>市值</td>
                                <td>交易市场</td>
                                <td>实际数量</td>
                            </tr>
                        </thead>
                        <tbody >
                            {currentHoldList.map((item, index) => {
                                return (
                                    <tr className={type?"item trade":"item"} key={index} onClick={this.onChangeStock.bind(this,item)}>
                                        <td>{item.stock_code}</td>
                                        <td>{item.stock_name}</td>
                                        <td>{item.enable_amount}</td>
                                        <td>{item.frozen_amount}</td>
                                        <td>{item.income_balance}</td>
                                        <td>{item.cost_price}</td>
                                        <td>{item.last_price}</td>
                                        <td>{item.market_value}</td>
                                        <td>{item.exchange_type === '1' ? '上海' : "深圳"}</td>
                                        <td>{item.current_amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}