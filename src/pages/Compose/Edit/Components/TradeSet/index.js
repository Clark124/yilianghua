import React, { Component } from 'react'
import './index.scss'
import { Select, Radio, message ,Modal} from 'antd'
import { oneLevelCondition, twoLevelCondition, strategyList, editStep2, strategyDetail } from '../../../../../serivce'
import Loading from '../../../../../components/Loading/index'
const Option = Select.Option;
const RadioGroup = Radio.Group;



export default class TradeSet extends Component {
    constructor() {
        super()
        this.state = {
            input1: 20, //个股默认买入比例
            input2: 20, //单次买入比例不超过
            input3: 20, //个股最大持仓比例
            input4: 100, //单次卖出比例不超过
            input5: 5, //最大持股数量
            showStrategyModel: false,
            oneLevelConditionList: [{ id: 1, value: "热门概念板块先买" }],//一级优先买入条件
            twoLevelConditionList: [{ id: 1, value: "小市值先买" }],//一级优先买入条件
            oneLevelConditionIndex: 0,
            twoLevelConditionIndex: 0,
            strategyList: [{ strategyId: 20012, strategyName: "MACD交叉系统", params: [] }],//策略列表
            strategyIndex: 0,
            selectStrategyIndex: 0, //保存的策略下标
            frequency: 720,
            execTime: '14:45',
            status: '',
            visibleCode:false,
            express:""

        }
    }
    componentWillMount() {

        let data = localStorage.getItem('tradeSet')
        if (data) {
            data = JSON.parse(data)
            this.setState({ ...data })
        } else {
            const { singlCountBuyRatio, singlCountSellRatio, singlStockBuyRatio, singlStockMaxPositionRatio, maxStockNum } = this.props.tradeSetting
            const { execFrequency, execTime } = this.props.strategySetting
            this.setState({
                input1: singlStockBuyRatio,
                input2: singlCountBuyRatio,
                input3: singlStockMaxPositionRatio,
                input4: singlCountSellRatio,
                input5: maxStockNum,
                frequency: execFrequency,
                execTime: execTime
            })
            this.getOneLevelCondition()
            this.getTwoLevelCondition()
            this.getStrategyList()
        }

    }
    componentWillUnmount() {
        localStorage.setItem('tradeSet', JSON.stringify(this.state))
    }

    //一级优先买入条件
    getOneLevelCondition() {
        const { onePriorityCondition } = this.props.tradeSetting
        oneLevelCondition({}).then(res => {
            let oneLevelConditionIndex = 0
            res.forEach((item, index) => {
                if (item.id === onePriorityCondition) {
                    oneLevelConditionIndex = index
                }
            })
            this.setState({ oneLevelConditionList: res, oneLevelConditionIndex })
        })
    }
    //一级优先买入条件
    getTwoLevelCondition() {
        const { twoPriorityCondition } = this.props.tradeSetting
        twoLevelCondition({}).then(res => {
            let twoLevelConditionIndex = 0
            res.forEach((item, index) => {
                if (item.id === twoPriorityCondition) {
                    twoLevelConditionIndex = index
                }
            })
            this.setState({ twoLevelConditionList: res, twoLevelConditionIndex })
        })
    }
    //获取策略列表
    getStrategyList() {
        const id = this.props.userId
        const { strategyName } = this.props.strategySetting
        strategyList({ id }).then(res => {
            let strategyIndex = 0
            res.forEach((item, index) => {
                if (item.strategyName === strategyName) {
                    strategyIndex = index
                }
            })
            this.setState({ strategyList: res, selectStrategyIndex: strategyIndex })
        })
    }

    //保存策略
    saveStrategy() {
        const { strategyIndex } = this.state
        this.setState({ selectStrategyIndex: strategyIndex, strategyIndex: 0, showStrategyModel: false })
    }
    //选择一级有限买入条件
    changeOneCondition(e) {
        const { oneLevelConditionList } = this.state
        oneLevelConditionList.forEach((item, index) => {
            if (item.value === e) {
                this.setState({ oneLevelConditionIndex: index })
            }
        })
    }
    //选择二级有限买入条件
    changeTwoCondition(e) {
        const { twoLevelConditionList } = this.state
        twoLevelConditionList.forEach((item, index) => {
            if (item.value === e) {
                this.setState({ twoLevelConditionIndex: index })
            }
        })
    }


    onChangeStrategy(e) {
        this.setState({
            strategyIndex: e.target.value,
        });
    }

    changeFrequency(e) {
        this.setState({ frequency: Number(e) })
    }

    //查看源码
    showCode() {
        const { strategyList, selectStrategyIndex } = this.state
        const id = strategyList[selectStrategyIndex].strategyId
        strategyDetail({ id }).then(res => {
            this.setState({ express: res.result.express })
        })
        this.setState({ visibleCode: true })
    }


    //提交并跳转至下一页
    onSubmit() {
        const { input1, input2, input3, input4, input5, oneLevelConditionList, twoLevelConditionList, oneLevelConditionIndex, twoLevelConditionIndex,
            strategyList, selectStrategyIndex, frequency, execTime } = this.state
        const id = this.props.match.params.id

        if (input1 === "" || input2 === "" || input3 === "" || input4 === "" || input5 === "") {
            message.error('各项输入内容需填写完整！');
            return
        }
        if (Number(input1) > 100 || Number(input1) < 0 ||
            Number(input2) > 100 || Number(input2) < 0 ||
            Number(input3) > 100 || Number(input3) < 0 ||
            Number(input4) > 100 || Number(input4) < 0
        ) {
            message.error('比例需在0到100之间');
            return
        }
        if (Number(input5) < 0) {
            message.error('持股数量不能为负数');
            return
        }

        const oneLevelId = oneLevelConditionList[oneLevelConditionIndex].id
        const twoLevelId = twoLevelConditionList[twoLevelConditionIndex].id
        const strategyId = strategyList[selectStrategyIndex].strategyId
        const data = {
            comboId: id,
            maxStockNum: Number(input5),
            singlStockBuyRatio: Number(input1),
            singlStockMaxPositionRatio: Number(input3),
            singlCountBuyRatio: Number(input2),
            singlCountSellRatio: Number(input4),
            onePriorityCondition: oneLevelId,
            twoPriorityCondition: twoLevelId,
            strategyId: strategyId,
            execFrequency: frequency,
            execTime: execTime

        }
        this.setState({ status: 'loading' })
        editStep2(data).then(res => {
            this.setState({ status: 'success' })
            this.props.changeStep(2)
        }).catch(err => {
            this.setState({ status: 'success' })
        })
    }

    render() {
        const { showStrategyModel, oneLevelConditionList, twoLevelConditionList, strategyList, strategyIndex, selectStrategyIndex, status, oneLevelConditionIndex, twoLevelConditionIndex,
            input1, input2, input3, input4, input5, frequency, execTime,express
        } = this.state
        let frequencyValue = ""
        if (frequency === 30) {
            frequencyValue = '30分钟'
        } else if (frequency === 15) {
            frequencyValue = '15分钟'
        } else if (frequency === 60) {
            frequencyValue = '1小时'
        } else if (frequency === 720) {
            frequencyValue = '1天'
        }
        return (
            <div className="trade-set-wrapper">
                {status === 'loading' ? <Loading /> : null}
                <div className="setTitle">交易设置</div>
                <div className="set-list">
                    <div className="set-item">
                        <span>一级优先买入条件：</span>
                        <Select value={oneLevelConditionList[oneLevelConditionIndex].value} style={{ width: 200, marginLeft: 10 }} onChange={this.changeOneCondition.bind(this)}>
                            {oneLevelConditionList.map((item, index) => {
                                return (
                                    <Option value={item.value} key={index}>{item.value}</Option>
                                )
                            })}

                        </Select>
                    </div>
                    <div className="set-item">
                        <span>个股默认买入比例：</span>
                        <input type="number" value={input1} className="input-ratio" onChange={(e) => this.setState({ input1: e.target.value })} />%
                    </div>
                    <div className="set-item">
                        <span>单次买入比例不超过：</span>
                        <input type="number" value={input2} className="input-ratio" onChange={(e) => this.setState({ input2: e.target.value })} />%
                    </div>
                </div>

                <div className="set-list">
                    <div className="set-item">
                        <span>二级优先买入条件：</span>
                        <Select value={twoLevelConditionList[twoLevelConditionIndex].value} style={{ width: 200, marginLeft: 10 }} onChange={this.changeTwoCondition.bind(this)}>
                            {twoLevelConditionList.map((item, index) => {
                                return (
                                    <Option value={item.value} key={index}>{item.value}</Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="set-item">
                        <span>个股最大持仓比例：</span>
                        <input type="number" value={input3} className="input-ratio" onChange={(e) => this.setState({ input3: e.target.value })} />%
                    </div>
                    <div className="set-item">
                        <span>单次卖出比例不超过：</span>
                        <input type="number" value={input4} className="input-ratio" onChange={(e) => this.setState({ input4: e.target.value })} />%
                    </div>
                </div>

                <div className="max-hold">
                    <span>最大持股数量：</span>
                    <input type="number" value={input5} className="input" onChange={(e) => this.setState({ input5: e.target.value })} />
                </div>

                <div className="strategy">
                    <div>买卖策略</div>
                    <div className="change-strategy">
                        <input type="text" placeholder="请选择策略" disabled value={strategyList[selectStrategyIndex].strategyName} />
                        <span className="change-strategy-btn" onClick={() => this.setState({ showStrategyModel: true })}>更换策略</span>
                        <span className="change-strategy-btn" style={{ marginLeft: 20 }} onClick={this.showCode.bind(this)}>查看源码</span>
                    </div>
                    <div className="input-some" >
                        {
                            strategyList[selectStrategyIndex].params.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <span>{item.paramName}：</span>
                                        <input type="number" disabled value={item.paramValue} />
                                    </div>
                                )
                            })
                        }
                    </div>


                    <div className="implement">
                        <span className="title">策略执行频率：</span>
                        <Select value={frequencyValue} style={{ width: 200, marginLeft: 10 }} onChange={this.changeFrequency.bind(this)}>
                            {/* <Option value="15">15分钟</Option>
                            <Option value="30">30分钟</Option>
                            <Option value="60">1小时</Option> */}
                            <Option value="720">1天</Option>

                        </Select>
                        <span className="title-1">执行时间：</span>
                        <Select value={execTime} style={{ width: 200, marginLeft: 10 }} onChange={(e) => this.setState({ execTime: e })}>
                            <Option value="13:30">13:30</Option>
                            <Option value="14:00">14:00</Option>
                            <Option value="14:30">14:30</Option>
                            <Option value="14:45">14:45</Option>
                        </Select>
                    </div>
                </div>

                <div className="bottom-btn">
                    <span className="btn pre" onClick={() => this.props.changeStep(0)}>上一步</span>
                    <span className="btn next" onClick={this.onSubmit.bind(this)}>下一步</span>
                </div>
                {
                    showStrategyModel ?
                        <div className="edit-model">
                            <div className="model-wrapper">
                                <div className="cancel-model" onClick={() => this.setState({ showStrategyModel: false })}>×</div>
                                <div className="model-title">更换策略</div>
                                <div className="intro">我的策略列表</div>
                                <div className="strategy-list">

                                    <RadioGroup value={this.state.strategyIndex} onChange={this.onChangeStrategy.bind(this)}>
                                        {strategyList.map((item, index) => {
                                            return (
                                                <div className="strategy-item" key={index}>
                                                    <Radio value={index}>{item.strategyName}</Radio>
                                                </div>
                                            )
                                        })}

                                    </RadioGroup>

                                </div>
                                <div className="strategy-params">策略参数</div>
                                <div className="params">
                                    {
                                        strategyList[strategyIndex].params.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <span>{item.paramName}：</span>
                                                    <input type="number" disabled value={item.paramValue} />
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                                <div className="btn-confirm">
                                    <span className="save" onClick={this.saveStrategy.bind(this)}>保存</span>
                                    <span className="cancel" onClick={() => this.setState({ showStrategyModel: false })}>取消</span>
                                </div>
                            </div>
                        </div> : null

                }
                <Modal
                    title="策略源码"
                    visible={this.state.visibleCode}
                    width={500}
                    height={500}
                    footer={null}
                    onCancel={() => this.setState({ visibleCode: false })}
                >
                    <div className="code-wrapper">
                        <textarea value={express} onChange={() => { }} />
                    </div>

                </Modal>

            </div>
        )
    }
}