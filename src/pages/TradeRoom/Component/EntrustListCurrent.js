import React,{Component} from 'react'
import {currentEntrust} from '../../../serivce'
import moment from 'moment'

export default class EntrustList extends Component{
    constructor(){
        super()
        this.state = {
            entrustList:[]
        }
    }
    componentWillMount(){
        const token = localStorage.getItem('token')
        this.getEntrustList(token)
    }
    getEntrustList(token){
        currentEntrust({token}).then(res=>{
            this.setState({entrustList:res.data.data})
        })
    }
    render(){
        let {entrustList} = this.state
        entrustList.map((item)=>{
            if(item.entrust_status==='8'){
                item.status = '已成'
            }else if(item.entrust_status==='1'){
                item.status = '待报'
            }else if(item.entrust_status==='2'){
                item.status = '已报'
            }else if(item.entrust_status==='3'){
                item.status = '已报待撤'
            }else if(item.entrust_status==='4'){
                item.status = '部成待撤'
            }else if(item.entrust_status==='6'){
                item.status = '已撤'
            }else if(item.entrust_status==='7'){
                item.status = '部成'
            }else if(item.entrust_status==='9'){
                item.status = '废单'
            }else if(item.entrust_status==='0'){
                item.status = '未报'
            }
            return item
        })
        return (
            <div className="detail-list">
            <div className="title">当日委托</div>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr className="header">
                            <td>证券代码</td>
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
                                    <td>{item.stock_code}</td>
                                    <td>{item.stock_name}</td>
                                    <td>{item.status}</td>
                                    <td>{item.entrust_amount}</td>
                                    <td>{item.business_amount}</td>
                                    <td>{Number(item.entrust_price).toFixed(2)}</td>
                                    <td>{Number(item.business_price).toFixed(2)}</td>
                                    <td>{item.entrust_bs==='1'?'买入':'卖出'}</td>
                                    <td>{moment(item.entrust_date,'YYYYMMDD').format('YYYY-MM-DD')+' '+moment(item.entrust_time,'hhmmss').format('hh:mm:ss')}</td>
                                    <td>{item.entrust_no}</td>
                                    <td>{item.exchange_type==='1'?'上海':"深圳"}</td>
                                    <td>{item.entrust_type==='0'?'限价委托':'撤单'}</td>
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