import React, { Component } from 'react'
import './index.scss'
import { Radio, message } from 'antd'
import { saveMarketScab } from '../../../serivce'
import Strategy from './components/Strategy'

export default class Create extends Component {
    constructor() {
        super()
        this.state = {
            tabIndex: 0
        }
    }
    changeMethod(e) {
        this.setState({ tabIndex: e.target.value })
    }
    //保存
    onSubmit() {
        const { tabIndex } = this.state
        let strategyComponent = this.refs.strategy
        let { initCaptital, strategyId, strategyList, scanTypeIndex, selectMarket, selectRegion, selectConcept, selectIndustry,
            selectMyStock, release_id, id
        } = strategyComponent.state
        const token = localStorage.getItem("token")
        let name = ""
        strategyList.forEach((item) => {
            if (item.id === strategyId) {
                name = item.name
            }
        })
        let param = {}
        param.initCaptital = initCaptital
        selectMarket = selectMarket.map(item =>`'${item.prod_code}'`).join(',')
        selectRegion = selectRegion.map(item =>`'${item.prod_code}'`).join(',')
        selectConcept = selectConcept.map(item =>`'${item.prod_code}'`).join(',')
        selectIndustry = selectIndustry.map(item =>`'${item.prod_code}'`).join(',')
        selectMyStock = selectMyStock.map(item => `'${item.id}'`).join(',')

        const data = {
            token,
            strategy_id: strategyId,
            period: 6,
            name,
            market: selectMarket,
            area: selectRegion,
            concept: selectConcept,
            industry: selectIndustry,
            favorite: selectMyStock,
            param: JSON.stringify(param),
            mark: tabIndex === 0 ? "strategy" : "stock",
            scan_method: scanTypeIndex === 0 ? "deploy" : "single",
        }

        if (release_id && id) {
            data.release_id = release_id
            data.id = id
        }
        saveMarketScab(data).then(res => {
            if (res.success) {
                message.success("保存成功")
                setTimeout(() => {
                    this.props.history.push({ pathname: '/scanning/list', state: { type: scanTypeIndex } })
                }, 1000)
            }
        })


    }
    render() {
        const { tabIndex } = this.state
        return (
            <div className="scan-create-wrapper">
                <div className="nav-title">
                    <span >市场扫描</span>
                    <span>></span>
                    <span className="current">新建市场扫描</span>
                </div>
                <div className="title">扫描类型：</div>
                <div className="scan-type-wrapper">
                    <Radio.Group onChange={this.changeMethod.bind(this)} value={tabIndex}>
                        <Radio value={0} style={{ marginRight: 100 }}>策略扫描</Radio>
                        {/* <Radio value={1}>选股条件</Radio> */}
                    </Radio.Group>
                    <Strategy  {...this.state} ref="strategy" {...this.props} />
                </div>
                <div className="save-btn" onClick={this.onSubmit.bind(this)}>保存</div>
            </div>
        )
    }
}