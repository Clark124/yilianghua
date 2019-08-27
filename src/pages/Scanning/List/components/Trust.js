import React, { Component } from 'react'

import { Switch, Modal, message } from 'antd'
import { strategyNotice, suspendDeploy, deleteScanStrategy ,trustScan} from '../../../../serivce'
import Loading from '../../../../components/Loading/index'

export default class Trust extends Component {
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
        trustScan({ release_id: item.id }).then(res => {
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

    //系统通知开关
    changeSysNotice(e, index, item) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            id: item.id,
            system_notice: e ? 1 : 0,
            weixin_notice: item.weixin_notice ? 1 : 0,
            sms_notice: 0,
        }
        strategyNotice(data).then(res => {
            if (res.success) {
                this.props.changeNotice(e, item.weixin_notice, index)
            }
        })
    }

    //微信通知开关
    changeWxNotice(e, index, item) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            id: item.id,
            system_notice: item.system_notice ? 1 : 0,
            weixin_notice: e ? 1 : 0,
            sms_notice: 0,
        }
        strategyNotice(data).then(res => {
            if (res.success) {
                this.props.changeNotice(item.system_notice, e, index)
            }
        })
    }

    //暂停
    suspendWork(item, index) {
        suspendDeploy({ id: item.id }).then(res => {
            if (res.message === 'success') {

            }

        })
        this.props.suspendWork(index)
    }
    //删除
    onDeleteScan(item, index) {
        Modal.confirm({
            title: "提示",
            content: "确定要删除吗？",
            onOk: () => {
                this.setState({ status: "loading" })
                deleteScanStrategy({ id: item.id }).then(res => {
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
        const { status , scanList, scanStatus } = this.state
        let { dataList, tabIndex } = this.props
        if (parseInt(tabIndex) !== 1) {
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
                            <td>状态</td>
                            <td className="operate">操作</td>
                            <td>通知方式</td>
                        </tr>
                        {
                            dataList.map((item, index) => {
                                return (
                                    <tr className="table-item  trust" key={index}>
                                        <td>{item.mark === 'strategy' ? '扫描策略' : "选股条件"}</td>
                                        <td>{item.name}</td>
                                        <td>1日</td>
                                        <td className={item.status === '1' ? 'status' : "status green"}>{item.status === '1' ? "已开启" : "已暂停"}</td>
                                        <td className="operate">
                                            <span className="btn" onClick={() => this.props.history.push('/scanning/create/' + item.id)}>详情</span>
                                            <span className="btn" onClick={this.showScanModal.bind(this, item)}>结果</span>
                                            <span className="btn" onClick={this.suspendWork.bind(this, item, index)}>{item.status === '1' ? '暂停' : '开启'}</span>
                                            <span className="btn delete" onClick={this.onDeleteScan.bind(this, item, index)}>删除</span>
                                        </td>
                                        <td className="notice-method">
                                            <div>系统 <Switch size={'small'} checked={item.system_notice} onChange={(e) => this.changeSysNotice(e, index, item)} /></div>
                                            <div>微信 <Switch size={'small'} checked={item.weixin_notice} onChange={(e) => this.changeWxNotice(e, index, item)} /></div>
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
                                                    <td>{item.time.substring(0,10)}</td>
                                                    <td>{item.security_name}（{item.security}）</td>
                                                    <td>{item.price.toFixed(2)}</td>
                                                    <td className={item.type === 1 ? "buy" : "sell"}>{item.type === 1 ? "买入" : "卖出"}</td>
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