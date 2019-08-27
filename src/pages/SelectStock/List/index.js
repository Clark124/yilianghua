import React, { Component } from 'react'
import './index.scss'
import { selectStockList, deleteSelectStock, deploySelectStock, canceldeploySelectStock } from '../../../serivce'
import { Pagination, Modal, message } from 'antd'

export default class List extends Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            total_size: 0,
            page: 1,
        }
    }
    componentWillMount() {
        this.getDataList(1)
    }
    getDataList(page) {
        const id = localStorage.getItem('userId')
        selectStockList({ userId: id, page, size: 10 }).then(res => {
            this.setState({ dataList: res.data, total_size: res.total_size })
        })
    }
    deleteItem(item) {
        Modal.confirm({
            title: "提示",
            content: "确定要删除吗？",
            onOk: () => {
                deleteSelectStock({ id: item.id }).then(res => {
                    const { page } = this.state
                    this.getDataList(page)
                    message.success('删除成功')
                })
            }
        })


    }
    deployItem(id, type, index) {
        const { dataList } = this.state
        if (type === 0) {
            deploySelectStock({ id }).then(res => {
                dataList[index].isCloud = 1
                this.setState({ dataList })
            })
        } else {
            canceldeploySelectStock({ id }).then(res => {
                dataList[index].isCloud = 0
                this.setState({ dataList })
            })
        }

    }

    //切换页面
    onChangePage(e) {
        this.getDataList(e)
    }

    navToDetail(item) {
        localStorage.setItem("selectStockDetail",JSON.stringify(item))
        this.props.history.push('/selectStock/detail/' + item.id)
    }

    render() {
        const { dataList, total_size } = this.state
        return (
            <div className="select-stock-list">
                <div className="nav-title">
                    <span >选股</span>
                    <span>></span>
                    <span className="current">我的选股条件</span>
                </div>
                <div className="table-wrapper">
                    <div className="head">
                        <span className="create-select-btn" onClick={() => this.props.history.push('/selectStock')}>新建智能选股</span>
                    </div>
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>选股条件</td>
                                <td>类型</td>
                                <td>选股日期</td>
                                <td className="operate">操作</td>
                            </tr>
                            {dataList.map((item, index) => {
                                return (
                                    <tr className="table-item" key={index}>
                                        <td>{item.selectName}</td>
                                        <td>智能选股</td>
                                        <td>{item.gmtCreate.slice(0, -2)}</td>
                                        <td className="operate">
                                            <span className="btn" onClick={this.navToDetail.bind(this, item)}>查看结果</span>
                                            <span className="btn" onClick={this.deployItem.bind(this, item.id, item.isCloud, index)}>{item.isCloud === 0 ? "托管" : "取消托管"}</span>
                                            <span className="btn delete" onClick={this.deleteItem.bind(this, item)}>删除</span>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>

                    {dataList.length === 0 ?
                        <div className="no-data">暂无数据</div> : null
                    }
                </div>
                <div className="pagination-wrapper">
                    <Pagination defaultCurrent={1} total={total_size} onChange={this.onChangePage.bind(this)} />
                </div>
            </div>
        )
    }
}