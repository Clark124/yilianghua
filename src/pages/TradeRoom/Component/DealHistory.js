import React,{Component} from 'react'
import {dealHistory} from '../../../serivce'
import moment from 'moment'

export default class EntrustList extends Component{
    constructor(){
        super()
        this.state = {
            dealList:[]
        }
    }
    componentWillMount(){
        const token = localStorage.getItem('token')
        this.getDealList(token)
    }
    getDealList(token){
        dealHistory({token}).then(res=>{
            this.setState({dealList:res.data.data})
        })
    }
    render(){
        let {dealList} = this.state
        
        return (
            <div className="detail-list">
            <div className="title">历史成交</div>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr className="header">
                            <td>成交时间</td>
                            <td>证券代码</td>
                            <td>证券名称</td>
                            <td>操作</td>
                            <td>成交数量</td>
                            <td>成交价格</td>
                            <td>合同编号</td>
                            <td>成交编号</td>
                            <td>交易市场</td>
                        </tr>
                    </thead>
                    <tbody >
                    {dealList.map((item, index) => {
                            return (
                                <tr className="item" key={index}>
                                    <td>{moment(item.init_date,'YYYYMMDD').format('MM-DD')+' '+moment(item.business_time,'hhmmss').format('hh:mm:ss')}</td>
                                    <td>{item.stock_code}</td>
                                    <td>{item.stock_name}</td>
                                    <td>{item.entrust_bs==='1'?'买':'卖'}</td>
                                    <td>{item.occur_amount}</td>
                                    <td>{item.business_price}</td>
                                    <td>{item.entrust_no}</td>
                                    <td>{item.serial_no}</td>
                                    <td>{item.exchange_type==='1'?'上海':"深圳"}</td>
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