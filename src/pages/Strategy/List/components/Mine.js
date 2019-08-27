import React, { Component } from 'react'
import {Modal,message} from 'antd'
import {deleteStrategy} from '../../../../serivce'

export default class Mine extends Component {
    constructor() {
        super()
        this.state = {
            visible:false,
        }
    }
    //删除策略
    deleteStrategy(item, index) {
       
        Modal.confirm({
            title:'提示',
            content:"确定要删除这条记录吗？",
            
            okText:"确定",
            onOk:()=>{
                const token = localStorage.getItem('token')
                deleteStrategy({token,id:item.id}).then(res=>{
                    console.log(res)
                    if(res.success){
                        message.success('删除成功~')
                        this.props.refresh()
                    }else{
                        message.success('删除失败~')
                    }
                })
            }

            
        })
    }
    render() {
        const { dataList } = this.props
        return (
            <div className="list-wrapper">
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header">
                            <td>策略名称</td>
                            <td>类型</td>
                            <td>历史版本</td>
                            <td>回测次数</td>
                            <td>最后修改时间</td>
                            <td>发布状态</td>
                            <td className="operate">操作</td>
                        </tr>
                        {dataList.map((item, index) => {
                            return (
                                <tr className="table-item" key={index}>
                                    <td className="item-name click" onClick={()=>this.props.history.push(`/strategy/edit/${item.id}`)}>{item.name}</td>
                                    <td className="click" onClick={()=>this.props.history.push(`/strategy/edit/${item.id}`)}>{item.type === "build" ? "搭建" : "自编"}</td>
                                    <td className="click" onClick={()=>this.props.history.push(`/strategy/version/${item.id}`)}>{item.version_count}</td>
                                    <td className="click" onClick={()=>this.props.history.push(`/strategy/backtest/list/${item.id}`)}>{item.backtest_count}</td>
                                    <td>{item.update_date}</td>
                                    <td>{item.is_publish ? "已发布" : "未发布"}</td>
                                    <td className="operate">
                                        {item.is_publish ?
                                            <span className="btn deploy">发布详情</span> :
                                            <span onClick={() => this.props.history.push(`/strategy/backtest/${item.id}`)} className="btn deploy">托管并发布</span>}

                                        <span className="btn" onClick={() => this.props.history.push(`/strategy/backtest/${item.id}`)} >回测</span>
                                        <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>删除</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {dataList.length === 0 ? <div className="no-data">暂无数据</div> : null}

        
            </div>
        )
    }
}