import React, { Component } from 'react'
import { deleteScanStrategy, singleScan } from '../../../../serivce'
import { Modal, message } from 'antd'
import Loading from '../../../../components/Loading/index'

export default class Single extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            visible: false,
            scanList: [],
            scanStatus: "",
        }
    }
    showScanModal(item) {
        this.setState({ visible: true, scanStatus: "loading" })
        singleScan({ id: item.id }).then(res => {
            if (res.result.length > 0) {
                this.setState({ scanList: res.result, scanStatus: "success" })
            } else {
                this.setState({ scanStatus: "noData" })
            }
        }).catch(err=>{
            this.setState({ scanStatus: "noData" })
        })
    }
    closeModal() {
        this.setState({ visible: false, scanList: [] ,scanStatus:""})
    }

    //删除
    onDeleteScan(item, index) {
        Modal.confirm({
            title: "提示",
            content: "确定要删除吗？",
            onOk: () => {
                this.setState({ status: "loading" })
                deleteScanStrategy({ id: item.release_id }).then(res => {
                    if (res.success) {
                        message.success('删除成功~')
                        this.props.refresh()
                    } else {
                        message.error('删除失败~')
                    }
                    this.setState({ status: "success" })
                })
            }
        })
    }
    render() {
        const { status, scanList, scanStatus } = this.state
        let { dataList, tabIndex } = this.props
        if (parseInt(tabIndex) !== 2) {
            dataList = []
        }
        return (
            <div className="list-wrapper">
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header trust">
                            <td>扫描类型</td>
                            <td>扫描名称</td>
                            <td>周期</td>
                            <td className="operate">操作</td>
                        </tr>
                        {
                            dataList.map((item, index) => {
                                return (
                                    <tr className="table-item  trust" key={index}>
                                        <td>{item.mark === 'strategy' ? '扫描策略' : "选股条件"}</td>
                                        <td>{item.name}</td>
                                        <td>1日</td>
                                        <td className="operate">
                                            <span className="btn" onClick={this.showScanModal.bind(this, item)}>扫描</span>
                                            <span className="btn" onClick={() => this.props.history.push('/scanning/create/' + item.release_id)}>详情</span>
                                            <span className="btn delete" onClick={this.onDeleteScan.bind(this, item, index)}>删除</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                {status === 'loading' ? <Loading text="删除中..." /> : null}
                {dataList.length === 0 ? <div className="no-data">暂无数据</div> : null}
                <Modal
                    visible={this.state.visible}
                    title={'扫描结果列表：'}
                    onCancel={this.closeModal.bind(this)}
                    onOk={this.closeModal.bind(this)}
                    width="800px"
                >
                    <div className="scan-data-list">
                        {scanStatus === 'loading' ? <div className="data-loading">数据加载中...</div> : null}
                        {scanStatus === 'noData' ? <div className="no-data">暂无结果</div> : null}
                        {scanList.length > 0 ?
                            <div className="table-scan">
                                <table>
                                    <tbody>
                                        <tr className='table-head'>
                                            <td>时间</td>
                                            <td>股票</td>
                                            <td>价格</td>
                                            <td>买卖方向</td>
                                        </tr>
                                        {scanList.map((item, index) => {
                                            return (
                                                <tr className='table-item' key={index}>
                                                    <td>{item.time}</td>
                                                    <td>{item.security_name}（{item.security}）</td>
                                                    <td>{item.price.toFixed(2)}</td>
                                                    <td className={item.type===1?"buy":"sell"}>{item.type===1?"买入":"卖出"}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div> : null
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}