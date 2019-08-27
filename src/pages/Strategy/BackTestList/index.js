import React, { Component } from 'react'
import './index.scss'
import { backtestList, deleteBacktestRecord } from '../../../serivce'
import { Checkbox, Modal } from 'antd'
import Loading from '../../../components/Loading/index'


export default class BackTestList extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            dataList: [],
            selectList: [],
        }
    }
    componentWillMount() {
        this.getBacktestList()

    }
    getBacktestList() {
        const id = this.props.match.params.id
        const token = localStorage.getItem('token')
        if (id && token) {
            backtestList({ id, token }).then(res => {
                this.setState({ dataList: res.result.backtest })
            })
        }
    }
    selectItem(index) {
        let { selectList } = this.state
        if (selectList.includes(index)) {
            selectList = selectList.filter((item) => item !== index)
        } else {
            selectList.push(index)
        }
        this.setState({ selectList })
    }
    //新建回测
    createBacktest() {

        const id = this.props.match.params.id
        this.props.history.push('/strategy/backtest/' + id)

    }
    //绩效对比
    comparative() {
        const { selectList, dataList } = this.state
        if (selectList.length !== 2) {
            Modal.error({
                title: "提示",
                content: "请选择2个版本"
            })
            return
        }
        const id_1 = dataList[selectList[0]].id
        const id_2 = dataList[selectList[1]].id

        this.props.history.push('/strategy/compare/' + id_1 + ',' + id_2)
    }
    //删除
    deleteItem() {
        let { selectList, dataList } = this.state
        if (selectList.length !== 1) {
            Modal.error({
                title: "提示",
                content: "请先选择要删除的1条回测记录"
            })
            return
        }
        Modal.confirm({
            title: "提示",
            content: "确定要删除选择的记录吗",
            onOk: () => {
                let id = ""
                selectList.forEach(item => {
                    id = id + dataList[item].id + ','
                })
                id = id.slice(0, -1)
                this.setState({ status: 'loading' })
                deleteBacktestRecord({ id }).then(res => {
                    if (res.success) {
                        Modal.success({
                            title: "提示",
                            content: "删除成功"
                        })
                        dataList = dataList.filter((item, index) => {
                            return !selectList.includes(index)
                        })
                        this.setState({ dataList, selectList: [], status: "success" })
                    }
                }).catch(err => {
                    this.setState({ status: "success" })
                })
            }
        })
    }

    render() {
        const { dataList, selectList, status } = this.state
        return (
            <div className="backtest-list-wrapper">
                <div className="nav-title">
                    <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                    <span>></span>
                    <span onClick={()=>this.props.history.push('/strategy/list')}>我的策略</span>
                    <span>></span>
                    <span className="current">回测列表</span>
                </div>
                <div className="btn-wrapper">
                    <div>共1次回测：</div>
                    <div className="operate">
                        <span onClick={this.createBacktest.bind(this)}>新建回测</span>
                        <span onClick={this.comparative.bind(this)}>绩效对比</span>
                        <span className="delete" onClick={this.deleteItem.bind(this)}>删除</span>
                    </div>
                </div>
                <div className="table-wrapper">
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>选择</td>
                                <td>策略名称</td>
                                <td>标的</td>
                                <td>开始时间</td>
                                <td>结束时间</td>
                                <td>频率</td>
                                <td >收益</td>
                                <td >最大回测</td>
                            </tr>
                            {dataList.map((item, index) => {
                                return (
                                    <tr className="table-item" key={index}>
                                        <td><Checkbox checked={selectList.includes(index)} onChange={this.selectItem.bind(this, index)} /></td>
                                        <td className="click" onClick={() => this.props.history.push(`/strategy/backtest/report/${item.id}`)}>{item.name}</td>
                                        <td className="click" onClick={() => this.props.history.push('/traderoom?code=' + item.code)}>{item.prod_name}</td>
                                        <td>{item.time_start}</td>
                                        <td>{item.time_end}</td>
                                        <td>1日</td>
                                        <td className={item.return_ratio >= 0 ? "profit" : "profit green"}>{(item.return_ratio * 100).toFixed(2)}%</td>
                                        <td>{(item.MaxDD * 100).toFixed(2)}%</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {status === 'loading' ? <Loading text="删除中..." /> : null}
            </div>
        )
    }
}