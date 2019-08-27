import React, { Component } from 'react'
import './index.scss'

import { strategyVersion, deleteStrategy } from '../../../serivce'
import { Checkbox, Modal, message } from 'antd'

export default class Version extends Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            checkIndex: -1,
        }
    }
    componentWillMount() {
        const id = this.props.match.params.id
        strategyVersion({ id }).then(res => {
            let data = res.result.version
            data.forEach(item => {
                item.checked = false
            })
            this.setState({ dataList: data })
        })
    }
    selectVersion(e, index) {
        if (!e.target.checked) {
            this.setState({ checkIndex: -1 })
        } else {
            this.setState({ checkIndex: index })
        }
    }
    recoverVersion() {
        const { checkIndex, dataList } = this.state
        if (checkIndex === -1) {
            Modal.info({
                title: "提示",
                content: "请选择一个版本"
            })
            return
        }
        const id = dataList[checkIndex].id
        this.props.history.push('/strategy/edit/' + id)

    }
    deleteStrategy(item, index) {
        Modal.confirm({
            title: "提示",
            content: "确定要删除这条记录吗",
            onOk: () => {
                deleteStrategy({ id: item.id }).then(res => {
                    message.success('删除成功')
                    let { dataList } = this.state
                    dataList = dataList.filter((item, itemIndex) => {
                        return itemIndex !== index
                    })
                    this.setState({ dataList, checkIndex: -1 })
                })
            }
        })
    }
    render() {
        const { dataList, checkIndex } = this.state
        return (
            <div className="strategy-version-wrapper">
                <div className="nav-title">
                    <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                    <span>></span>
                    <span onClick={()=>this.props.history.push('/strategy/list')}>我的策略</span>
                    <span>></span>
                    <span className="current">版本列表</span>
                </div>
                <div>
                    <span className="recover" onClick={this.recoverVersion.bind(this)}>恢复版本</span>
                </div>
                <div className="table-wrapper">
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>选择</td>
                                <td>版本号</td>
                                <td>策略名称</td>
                                <td>版本时间</td>
                                <td className="operate">操作</td>

                            </tr>
                            {dataList.map((item, index) => {
                                return (
                                    <tr className="table-item" key={index}>
                                        <td><Checkbox checked={checkIndex === index} onChange={(e) => this.selectVersion(e, index)} /></td>
                                        <td >{item.version}</td>
                                        <td className="click">{item.name}</td>
                                        <td>{item.update_date}</td>
                                        <td className="operate">
                                            {/* <span className="btn" onClick={() => this.props.history.push(`/strategy/backtest/${item.id}`)} >查看</span> */}
                                            <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>删除</span>
                                        </td>
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