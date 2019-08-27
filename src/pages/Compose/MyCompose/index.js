import React, { Component } from 'react'
import { myCompose, deleteCompose, publishCompose } from '../../../serivce'
import './index.scss'
import { Modal, message } from 'antd';


export default class MyCompose extends Component {
    constructor() {
        super()
        this.state = {
            dataList: []
        }
    }
    componentWillMount() {
        const id = this.props.location.search.split('=')[1]
        this.getMyCompose(id)
    }
    getMyCompose(id) {
        myCompose({ id }).then(res => {
            this.setState({ dataList: res })
        })
    }
    onDeleteCompose(id) {
        Modal.confirm({
            title: '提示',
            content: '确定要删除该组合吗',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                deleteCompose({ id }).then(res => {
                    let { dataList } = this.state
                    dataList = dataList.filter((item) => {
                        return item.id !== id
                    })
                    this.setState({ dataList })
                    message.success('删除成功')
                })
            }
        });
    }
    onPublishCompose(id, type) {
        publishCompose({ id, type }).then(res => {
            let { dataList } = this.state
            dataList.forEach(item => {
                if (item.id === id) {
                    item.isPub = type
                }
            })
            if (type === 0) {
                message.success('取消成功')
            } else {
                message.success('公开成功')
            }
            this.setState({ dataList })
        })
    }

    onEditCompose(id) {
        this.props.history.push('/compose/edit/' + id)
    }
    render() {
        const { dataList } = this.state
        return (
            <div className="my-compose-wrapper">
                <div className="create-wrapper">
                    <span className="create"
                        onClick={() => this.props.history.push('/compose/create?userId=' + localStorage.getItem('userId'))}
                    >创建组合</span>
                </div>
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header">
                            <td>组合名称</td>
                            <td>净值</td>
                            <td>日收益</td>
                            <td>月收益</td>
                            <td>总收益</td>
                            <td className="operate">操作</td>
                        </tr>
                        {dataList.map((item, index) => {
                            return (
                                <tr className="table-item" key={index}>
                                    <td className="name" onClick={() => this.props.history.push('/compose/rank/detail/' + item.id)}>{item.comboName}</td>
                                    <td>{item.netValue.toFixed(2)}</td>
                                    <td className={item.dayYieldRate >= 0 ? 'red' : 'green'}>{item.dayYieldRate}%</td>
                                    <td className={item.monthYieldRate >= 0 ? 'red' : 'green'}>{item.monthYieldRate}%</td>
                                    <td>{item.totalYieldRate}%</td>
                                    <td className="operate">
                                        <span className="edit" onClick={this.onEditCompose.bind(this, item.id)}>编辑</span>
                                        {item.isPub ? <span className="publish cancel" onClick={this.onPublishCompose.bind(this, item.id, 0)}>取消公开</span> :
                                            <span className="publish" onClick={this.onPublishCompose.bind(this, item.id, 1)}>公开组合</span>
                                        }
                                        <span className="delete" onClick={this.onDeleteCompose.bind(this, item.id)}>删除</span>


                                    </td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            </div>
        )
    }
}