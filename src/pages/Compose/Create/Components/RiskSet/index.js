import React, { Component } from 'react'
import './index.scss'
import { Radio, Checkbox, message, DatePicker, Select } from 'antd'
import { submitRiskSet, testBack } from '../../../../../serivce'
import Loading from '../../../../../components/Loading/index'
import Moment from 'moment'

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;


export default class RiskSet extends Component {
    constructor() {
        super()
        this.state = {
            status: '',
            styleList: ['大盘', '小盘', '次新', '价值', '成长', '震荡', '趋势'],
            slectStyleList: [],
            selectRiskIndex: 1,
            stopProfit: 20,//止盈比例
            stopLoss: 20, //止损比例
            moveStopProfit: 20,//移动止盈比例
            composeName: "",//组合名称
            capital: 10, //资金容量
            price: 0, //跟单价格
            introduce: "", //策略说明
            beginTime: Moment().subtract(1, 'years'),
            endTime: Moment(),
            cost: 0.0005

        }
    }
    componentWillMount() {
        let data = localStorage.getItem('riskSet')
        if (data) {
            data = JSON.parse(data)
            this.setState({ ...data, beginTime: Moment(data.beginTime), endTime: Moment(data.endTime) })
        }
    }
    componentWillUnmount() {
        localStorage.setItem('riskSet', JSON.stringify(this.state))
    }

    onChangeRadio(e) {
        this.setState({
            selectRiskIndex: e.target.value,
        });
    }
    //选择组合风格
    onSelectStyle(e) {
        this.setState({ slectStyleList: e })
    }

    onSubmit() {
        let { selectRiskIndex, slectStyleList, stopProfit, stopLoss, moveStopProfit, composeName, capital, price, introduce } = this.state
        const userId = this.props.userId

        if (slectStyleList.length === 0 || composeName === "" || capital === "" || price === "" || introduce === "") {
            message.error('各项输入内容需填写完整！')
            return
        }
        if (selectRiskIndex === 1 && (stopProfit === "" || stopLoss === "" || moveStopProfit === "")) {
            message.error('各项输入内容需填写完整！')
            return
        }
        let isEnable = 1
        if (selectRiskIndex === 0) {
            stopProfit = ""
            stopLoss = ""
            moveStopProfit = ""
            isEnable = 0
        }
        let data = {}
        if (selectRiskIndex === 0) {
            data = {
                userId,
                comboName: composeName,
                initFund: Number(capital) * 10000,
                payPrice: Number(price),
                description: introduce,
                comboStyle: JSON.stringify(slectStyleList),
                isEnable,
            }
        } else {
            data = {
                userId,
                stopProfitRatio: stopProfit ? Number(stopProfit) : "",
                stopLossRatio: stopLoss ? Number(stopLoss) : "",
                moveStopProfitRatio: moveStopProfit ? Number(moveStopProfit) : "",
                comboName: composeName,
                initFund: Number(capital) * 10000,
                payPrice: Number(price),
                description: introduce,
                comboStyle: JSON.stringify(slectStyleList),
                isEnable,
            }
        }

        this.setState({ status: 'loading' })
        submitRiskSet(data).then(res => {
            this.setState({ status: 'success' })
            localStorage.removeItem('selectStock')
            localStorage.removeItem('selectTime')
            localStorage.removeItem('tradeSet')
            localStorage.removeItem('riskSet')
            this.setState({
                slectStyleList: [],
                selectRiskIndex: 1,
                stopProfit: "",//止盈比例
                stopLoss: "", //止损比例
                moveStopProfit: "",//移动止盈比例
                composeName: "",//组合名称
                capital: "", //资金容量
                price: "", //跟单价格
                introduce: "", //策略说明
            })
            message.success('提交成功')
            setTimeout(() => {
                this.props.history.replace('/compose/mine?userId=' + userId)
            }, 1500)
        }).catch(err => {
            this.setState({ status: 'success' })
            message.error('提交失败')
        })


    }
    //选择回测时间
    onChangeDate(e1, e2) {
        const beginTime = e1[0]
        const endTime = e1[1]
        this.setState({ beginTime, endTime })
    }
    //选择收益基准
    selectIndicate(e) {
        console.log(e)
    }
    //选择交易成本
    selectCost(e) {
        this.setState({ cost: e })
    }

    handleData(time) {
        if (!time) {
            return false
        } else {
            // 大于当前日期不能选 time > moment()
            // 小于当前日期不能选 time < moment().subtract(1, "days")
            // 只能选前7后7 time < moment().subtract(7, "days") || time > moment().add(7, 'd')
            return time > Moment()
        }
    }
    //点击开始回撤
    onBackTest() {
        let { selectRiskIndex, slectStyleList, stopProfit, stopLoss, moveStopProfit, composeName, capital, price, introduce,
            cost, beginTime, endTime
        } = this.state
        const userId = this.props.userId

        if (slectStyleList.length === 0 || composeName === "" || capital === "" || price === "" || introduce === "") {
            message.error('各项输入内容需填写完整！')
            return
        }
        if (selectRiskIndex === 1 && (stopProfit === "" || stopLoss === "" || moveStopProfit === "")) {
            message.error('各项输入内容需填写完整！')
            return
        }
        let isEnable = 1
        if (selectRiskIndex === 0) {
            stopProfit = ""
            stopLoss = ""
            moveStopProfit = ""
            isEnable = 0
        }

        let data = {}
        if (selectRiskIndex === 0) {
            data = {
                userId,
                comboName: composeName,
                initFund: Number(capital) * 10000,
                payPrice: Number(price),
                description: introduce,
                comboStyle: JSON.stringify(slectStyleList),
                isEnable,
                isNew: 1,
                startTime: beginTime.format('YYYYMMDD'),
                endTime: endTime.format('YYYYMMDD'),
                commission: cost,
                comboId: 0
            }
        } else {
            data = {
                userId,
                stopProfitRatio: stopProfit ? Number(stopProfit) : "",
                stopLossRatio: stopLoss ? Number(stopLoss) : "",
                moveStopProfitRatio: moveStopProfit ? Number(moveStopProfit) : "",
                comboName: composeName,
                initFund: Number(capital) * 10000,
                payPrice: Number(price),
                description: introduce,
                comboStyle: JSON.stringify(slectStyleList),
                isEnable,
                isNew: 1,
                startTime: beginTime.format('YYYYMMDD'),
                endTime: endTime.format('YYYYMMDD'),
                commission: cost,
                comboId: 0
            }
        }

        this.setState({ status: 'loading' })
        testBack(data).then(res => {

            this.setState({ status: 'success' })
            res.information = {
                composeName: composeName,
                comboStyle: slectStyleList,
                startTime: beginTime.format('YYYY-MM-DD'),
                endTime: endTime.format('YYYY-MM-DD'),
                description: introduce,
            }
            message.success('回测完成~')
            localStorage.setItem("report", JSON.stringify(res))
            window.open("/#/report", "_blank");
        }).catch(err => {
            message.error('回测失败~')
            this.setState({ status: 'success' })
        })

    }



    render() {
        const { styleList, slectStyleList, selectRiskIndex, stopProfit, stopLoss, moveStopProfit, composeName, capital, price, introduce, status,
            beginTime, endTime, cost
        } = this.state
        let costValue = ""
        if (cost === 0.0005) {
            costValue = '万分之五'
        } else if (cost === 0.0008) {
            costValue = '万分之八'
        } else if (cost === 0.001) {
            costValue = '千分之一'
        } else if (cost === 0.0015) {
            costValue = '千分之一点五'
        }
        return (
            <div className="risk-set-wrapper">
                {status === 'loading' ? <Loading /> : null}
                <div className="select-radio">
                    <span className="title">个股风控：</span>
                    <RadioGroup onChange={this.onChangeRadio.bind(this)} value={this.state.selectRiskIndex}>
                        <Radio value={0}><span className={selectRiskIndex === 0 ? 'radio active' : "radio"}>关闭风控</span></Radio>
                        <Radio value={1}><span className={selectRiskIndex === 1 ? 'radio active' : "radio"}>开启风控</span></Radio>
                    </RadioGroup>
                </div>

                {selectRiskIndex === 1 ?
                    <div className="ratio">
                        <span >止盈比例：</span>
                        <input type='number' className="input" onChange={(e) => this.setState({ stopProfit: e.target.value })} value={stopProfit} />%
                        <span className="title-2">止损比例：</span>
                        <input type='number' className="input" onChange={(e) => this.setState({ stopLoss: e.target.value })} value={stopLoss} />%
                        <span className="title-2">移动止盈比例：</span>
                        <input type='number' className="input" onChange={(e) => this.setState({ moveStopProfit: e.target.value })} value={moveStopProfit} />%
                    </div> : null
                }


                <div className="compose-name">
                    <span className="title">组合名称：</span>
                    <input type='text' className="input" onChange={(e) => this.setState({ composeName: e.target.value })} value={composeName} />
                </div>

                <div className="checkbox">
                    <span className="title">组合风格：</span>
                    <CheckboxGroup
                        options={styleList}
                        onChange={this.onSelectStyle.bind(this)}
                        value={slectStyleList}
                    />
                </div>

                <div className="price">
                    <span className="title">资金容量：</span>
                    <input className="input" type="number" onChange={(e) => this.setState({ capital: e.target.value })} value={capital} />万
                    <span className="title-1">跟单价格：</span>
                    <input className="input" type="number" onChange={(e) => this.setState({ price: e.target.value })} value={price} />元/月
                </div>

                <div className="introduce">
                    <span className="title">策略说明：</span>
                    <textarea className="text" onChange={(e) => this.setState({ introduce: e.target.value })} value={introduce} />
                </div>

                <div className="bottom-btn">
                    <span className="btn pre" onClick={() => this.props.changeStep(2)}>上一步</span>
                    <span className="btn next" onClick={this.onSubmit.bind(this)}>完成</span>
                </div>
                <div className="back-test-wrapper">
                    <div className="title">策略回测</div>
                    <div className="select">
                        <span>回测时间：</span>
                        <RangePicker onChange={this.onChangeDate.bind(this)}
                            defaultValue={[beginTime, endTime]}
                            format={'YYYY-MM-DD'}
                            disabledDate={this.handleData.bind(this)}
                        />
                        <span className="select-indicate">收益基准：</span>
                        <Select value="沪深300指数" onChange={this.selectIndicate.bind(this)} style={{ width: 150 }}>
                            <Option value={'沪深300指数'}>沪深300指数</Option>
                        </Select>
                        <span className="select-indicate">交易成本（单边）：</span>
                        <Select value={costValue} onChange={this.selectCost.bind(this)} style={{ width: 150 }}>
                            <Option value={0.0005}>万分之五</Option>
                            <Option value={0.0008}>万分之八</Option>
                            <Option value={0.001}>千分之一</Option>
                            <Option value={0.0015}>千分之一点五</Option>
                        </Select>
                    </div>
                    <div className="begin-backg-test" onClick={this.onBackTest.bind(this)}>开始回测</div>

                </div>

            </div>
        )
    }
}