import React, { Component } from 'react'
import { Modal, Checkbox } from 'antd';
import './index.scss'

export default class TrustModal extends Component {
    constructor() {
        super()
        this.state = {
            discrib: "",
            checked_1: true,
            checked_2: true,
            checked_3: true,
        }
    }
    onSubmit() {
        const { discrib, checked_1, checked_2,checked_3 } = this.state
        const { quote } = this.props
        const data = {
            name: this.props.strategyName + '_' + quote.prod_name + '(' + quote.prod_code + ')',
            description: discrib,
            is_publish: checked_1 ? 1 : 0,
            price: 0,
            is_announce_source: checked_3 ? 1 : 0, //开放源码
            is_system_use: checked_2 ? 1 : 0, //允许系统调用
            system_use_price: 0,
        }
        this.props.deployStrategy(data)
    }
    render() {
        const { discrib, checked_1, checked_2 ,checked_3} = this.state
        const { quote } = this.props
        return (
            <Modal
                visible={this.props.visible}
                title={'策略托管及发布'}
                onCancel={() => this.props.hideModal()}
                onOk={this.onSubmit.bind(this)}
                okText={'确定'}
                width="500px"
                centered
                closable
                className="trust-modal"
            >
                <div className="info1">策略发布后，将在策略排行中展示</div>
                <div className="info2">托管条件名称：</div>
                <div className="strategy-name">{this.props.strategyName}_{quote.prod_name}({quote.prod_code})</div>
                <div className="info3">托管条件描述</div>
                <textarea className="discrib" value={discrib} onChange={(e) => this.setState({ discrib: e.target.value })} />
                <div className="select">
                    <Checkbox checked={checked_1} onChange={(e) => this.setState({ checked_1: e.target.checked })} />
                    <span>发布策略：策略发布后，将在策略超市中展示</span>
                </div>
                <div className="select">
                    <Checkbox checked={checked_2} onChange={(e) => this.setState({ checked_2: e.target.checked })} />
                    <span>允许体统调用该策略并可以绑定其他股票产生交易信号</span>
                </div>
                <div className="select">
                    <Checkbox checked={checked_3} onChange={(e) => this.setState({ checked_3: e.target.checked })} />
                    <span>开放源码</span>
                </div>
            </Modal>
        )
    }
}