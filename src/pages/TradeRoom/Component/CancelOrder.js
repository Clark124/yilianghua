import React, { Component } from 'react'
import { cancelOrderList, cancelOrder } from '../../../serivce'
import moment from 'moment'
import { Checkbox, message } from 'antd';

export default class EntrustList extends Component {
    constructor() {
        super()
        this.state = {
            entrustList: []
        }
    }
    componentWillMount() {
        const token = localStorage.getItem('token')
        this.getEntrustList(token)
    }
    getEntrustList(token) {
        cancelOrderList({ actionIn: 1 }, token).then(res => {
            let data = res.data.data
            data = data.map(item => {
                item.isSelect = false
                return item
            })
            this.setState({ entrustList: data })
        })
    }

    onChangeItem(e, index) {
        let { entrustList } = this.state
        entrustList[index].isSelect = e.target.checked
        this.setState({ entrustList })
    }
    onChangeAll(e) {
        let { entrustList } = this.state
        if (e.target.checked) {
            entrustList = entrustList.map(item => {
                item.isSelect = true
                return item
            })
        } else {
            entrustList = entrustList.map(item => {
                item.isSelect = false
                return item
            })
        }
        this.setState({ entrustList })
    }
    onCancelOrder() {
        let { entrustList } = this.state
        let arr = []
        entrustList.forEach(item => {
            if (item.isSelect) {
                arr.push(item.entrust_no)
            }
        })
        if (arr.length === 0) {
            return
        }
        const token = localStorage.getItem('token')
        let numberList = ""
        arr.forEach(item => {
            numberList = numberList + item + ','
        })
        numberList = numberList.slice(0, -1)
        const data = {
            entrustNo: numberList
        }
        cancelOrder(data, token).then(res => {
            if (res.data.error_no) {
                message.error(res.data.error_info)
            } else {
                entrustList = entrustList.filter(item => {
                    return !arr.includes(item.entrust_no)
                })
                this.setState({ entrustList })
                message.success('撤单成功~')
            }
        })
    }

    render() {
        let { entrustList } = this.state
        let checkedAll = true
        entrustList.map((item) => {
            if (item.entrust_status === '8') {
                item.status = '已成'
            } else if (item.entrust_status === '1') {
                item.status = '待报'
            } else if (item.entrust_status === '2') {
                item.status = '已报'
            } else if (item.entrust_status === '3') {
                item.status = '已报待撤'
            } else if (item.entrust_status === '4') {
                item.status = '部成待撤'
            } else if (item.entrust_status === '6') {
                item.status = '已撤'
            } else if (item.entrust_status === '7') {
                item.status = '部成'
            } else if (item.entrust_status === '9') {
                item.status = '废单'
            } else if (item.entrust_status === '0') {
                item.status = '未报'
            }
            if (item.isSelect === false) {
                checkedAll = false
            }
            return item
        })
        return (
            <div className="detail-list">
                <div className="title">
                    <span>挂单</span>
                    <span className="btn" onClick={this.onCancelOrder.bind(this)}>撤单</span>
                </div>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr className="header">
                                <td><Checkbox style={{ marginRight: 5 }} onChange={this.onChangeAll.bind(this)} checked={checkedAll} />证券代码</td>
                                <td>证券名称</td>
                                <td>状态</td>
                                <td>委托数量</td>
                                <td>成交数量</td>
                                <td>委托价格</td>
                                <td>成交价格</td>
                                <td>操作</td>
                                <td>委托时间</td>
                                <td>合同编号</td>
                                <td>交易市场</td>
                                <td>订单类型</td>
                            </tr>
                        </thead>
                        <tbody >
                            {entrustList.map((item, index) => {
                                return (
                                    <tr className="item" key={index}>
                                        <td><Checkbox style={{ marginRight: 5 }} checked={item.isSelect} onChange={(e) => this.onChangeItem(e, index)} />{item.stock_code}</td>
                                        <td>{item.stock_name}</td>
                                        <td>{item.status}</td>
                                        <td>{item.entrust_amount}</td>
                                        <td>{item.business_amount}</td>
                                        <td>{Number(item.entrust_price).toFixed(2)}</td>
                                        <td>{Number(item.business_price).toFixed(2)}</td>
                                        <td>{item.entrust_bs === '1' ? '买入' : '卖出'}</td>
                                        <td>{moment(item.entrust_date, 'YYYYMMDD').format('YYYY-MM-DD') + ' ' + moment(item.entrust_time, 'hhmmss').format('hh:mm:ss')}</td>
                                        <td>{item.entrust_no}</td>
                                        <td>{item.exchange_type === '1' ? '上海' : "深圳"}</td>
                                        <td>{item.entrust_type === '0' ? '限价委托' : '撤单'}</td>
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