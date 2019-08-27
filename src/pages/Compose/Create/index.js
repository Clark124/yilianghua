import React, { Component } from 'react'
import './index.scss'
import step_1 from '../../../assets/step01.png'
import step_2 from '../../../assets/step02.png'
import step_3 from '../../../assets/step03.png'
import step_4 from '../../../assets/step04.png'

import Select from './Components/Select/index'
import TradeSet from './Components/TradeSet/index'
import SelectTime from './Components/SelectTime/index'
import RiskSet from './Components/RiskSet/index'

export default class CreateCompose extends Component {
    constructor() {
        super()
        this.state = {
            userId: "",
            step: 0,
        }
    }
    componentWillMount() {
        const id = this.props.location.search.split('=')[1]
        this.setState({ userId: id })
        this.clearlocalStorage()
    }
    changeStep(index) {
        this.setState({ step: index })
    }
    clearlocalStorage(){
        localStorage.removeItem('selectStock')
        localStorage.removeItem('selectTime')
        localStorage.removeItem('tradeSet')
        localStorage.removeItem('riskSet')
    }
    render() {
        const { step, userId } = this.state
        return (
            <div className="create-wrapper">
                <div className="header-link">
                    <span>组合</span>
                    <span className="arrow">></span>
                    <span>创建组合</span>
                    <span className="arrow">></span>
                    {step === 0 ? <span className="title">选择股票池</span> : null}
                    {step === 1 ? <span className="title">交易设置</span> : null}
                    {step === 2 ? <span className="title">大盘择时</span> : null}
                    {step === 3 ? <span className="title">风险控制</span> : null}
                </div>
                <div className="step-img-wrapper">
                    {step === 0 ? <img src={step_1} alt="" /> : null}
                    {step === 1 ? <img src={step_2} alt="" /> : null}
                    {step === 2 ? <img src={step_3} alt="" /> : null}
                    {step === 3 ? <img src={step_4} alt="" /> : null}
                    <span className={step === 0 ? "step-1 active" : 'step-1'} >1、选择股票池</span>
                    <span className={step === 1 ? "step-2 active" : 'step-2'} >2、交易设置</span>
                    <span className={step === 2 ? "step-3 active" : 'step-3'} >3、大盘择时</span>
                    <span className={step === 3 ? "step-4 active" : 'step-4'} >4、风险设置</span>
                    {/* <span className={step === 0 ? "step-1 active" : 'step-1'} onClick={this.changeStep.bind(this, 0)}>1、选择股票池</span>
                    <span className={step === 1 ? "step-2 active" : 'step-2'} onClick={this.changeStep.bind(this, 1)}>2、交易设置</span>
                    <span className={step === 2 ? "step-3 active" : 'step-3'} onClick={this.changeStep.bind(this, 2)}>3、大盘择时</span>
                    <span className={step === 3 ? "step-4 active" : 'step-4'} onClick={this.changeStep.bind(this, 3)}>4、风险设置</span> */}
                </div>
                {step === 0 ?
                    <Select
                        history={this.props.history}
                        userId={userId}
                        changeStep={this.changeStep.bind(this)}
                    /> : null}
                {step === 1 ? <TradeSet  userId={userId} changeStep={this.changeStep.bind(this)} /> : null}
                {step === 2 ? <SelectTime userId={userId} changeStep={this.changeStep.bind(this)} /> : null}
                {step === 3 ? <RiskSet userId={userId} history={this.props.history} changeStep={this.changeStep.bind(this)} /> : null}
            </div>
        )
    }
}