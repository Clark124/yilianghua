import React, { Component } from 'react'
import './index.scss'
import sure_icon from '../../../../../assets/sure.png'
import delete_icon from '../../../../../assets/dele.png'
import edit_icon from '../../../../../assets/bj.png'


import { getIndicateList, indicateStockList,editStep3 } from '../../../../../serivce'
import { Radio, Select, Tabs } from 'antd'

import Loading from '../../../../../components/Loading/index'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

export default class SelectTime extends Component {
    constructor() {
        super()
        this.state = {
            status: '',
            selectTimeIndex: 0,
            indicateList: {
                selectTime: [   //财务
                    { name: '价格下穿均线', isSelect: false, type: 0, },
                ],
            },
            selectList: [], //选择列表
            indicateStockList: [],
            inputParamsList: {},
            conditionNum: 1,//同时满足条件
            storePosition: 0, //熊市仓位


        }
    }
    componentWillMount() {
        let data = localStorage.getItem('selectTime')
        if (data) {
            data = JSON.parse(data)
            this.setState({ ...data })
        } else {
            if (this.props.selectTimeSetting.isEnable) {
                let { closePostionRatio, count } = this.props.selectTimeSetting
                this.setState({
                    selectTimeIndex: 1,
                    conditionNum: count,
                    storePosition: closePostionRatio
                })
            }

           
            this.onIndicateStockList(()=>{
                this.onGetIndicateList()
            })
        }

    }
    
    componentWillUnmount() {
        localStorage.setItem('selectTime', JSON.stringify(this.state))
    }
    onChangeRadio(e) {
        this.setState({
            selectTimeIndex: e.target.value,
        });
    }

    //选择满足几个条件
    changeConditionNum(e) {
        this.setState({ conditionNum: Number(e) })
    }
    //选择熊市仓位
    changeStorePosition(e) {
        this.setState({ storePosition: Number(e) })
    }

    //获取指标数
    onGetIndicateList() {
        const { indicateList } = this.state
        let indicators = ""
        if( this.props.selectTimeSetting){
            indicators = this.props.selectTimeSetting.indicators
        }
       
        let selectList = []
        getIndicateList({}).then(res => {
            const datas = res.map((item, index) => {
                item.name = item.strategyName
                item.isSelect = false

                if (indicators) {
                    JSON.parse(indicators).forEach((selected, selectedIndex) => {
                        if (selected.indicatorName === item.strategyName) {
                            item.isSelect = true
                            item.showModel = false
                            const {indicateStockList} = this.state
                            indicateStockList.forEach(indicate=>{
                                if(indicate.stockCode===selected.symbol){
                                    item.indicate = indicate
                                }
                            })
                           
                            // item.params = []
                            selectList.push(item)
                        }
                    })
                }
                
                if (item.indicatorParams) {
                    item.indicatorParams = JSON.parse(item.indicatorParams)
                    item.params = item.indicatorParams.map(param => {
                        let obj = {}
                        obj[param.paramName] = ""
                        return obj
                    })
                } else {
                    item.params = []
                    item.indicatorParams = []
                }
                return item
            })
            indicateList.selectTime = datas
            this.setState({ indicateList ,selectList})

        })
    }
    onIndicateStockList(callback) {
        indicateStockList({}).then(res => {
            this.setState({ indicateStockList: res },()=>{
                if(callback&&typeof callback==='function'){
                    callback()
                }
            })
        })
    }

    onSelectTime(index) {
        let selectTime = this.state.indicateList.selectTime
        let selectList = this.state.selectList
        selectTime.forEach((item, itemIndex) => {
            if (itemIndex === index) {
                selectTime[index].isSelect = !selectTime[index].isSelect
                if (selectTime[index].isSelect) {
                    item.showModel = false
                    item.indicate = { stockName: '上证指数', stockCode: "000001.SS" }
                    // item.params = []
                    selectList.push(item)
                } else {
                    selectList = selectList.filter((value) => {
                        return value.name !== item.name
                    })
                }
            }
        })
        this.setState({ indicateList: { ...this.state.indicateList, selectTime }, selectList })
    }
    //删除选择的指标
    deleteSelect(index) {
        let { selectList } = this.state
        let selectTime = this.state.indicateList.selectTime
        selectTime.forEach((item, itemIndex) => {
            if (item.name === selectList[index].name) {
                selectTime[itemIndex].isSelect = false
            }
        })
        selectList = selectList.filter((item, itemIndex) => {
            return itemIndex !== index
        })

        this.setState({ indicateList: { ...this.state.indicateList, selectTime }, selectList })
    }

    //显示编辑模块
    showEditModel(index) {
        let { selectList, inputParamsList } = this.state
        selectList[index].showModel = true
        selectList[index].params.forEach(item => {
            inputParamsList[Object.keys(item)[0]] = item[Object.keys(item)[0]]
        })
        this.setState({ selectList, inputParamsList })
    }
    cancelEditModel(index) {
        let { selectList } = this.state
        selectList[index].showModel = false
        this.setState({ selectList, inputParamsList: {} })
    }
    //保存编辑
    saveEditModel(index) {
        const { selectList, inputParamsList } = this.state
        let arr = []
        Object.keys(inputParamsList).forEach(key => {
            if (key !== 'stock') {
                let obj = {}
                obj[key] = inputParamsList[key]
                arr.push(obj)
            }
        })
        if (inputParamsList.stock) {
            selectList[index].indicate = inputParamsList.stock
        }
        selectList[index].params = arr
        selectList[index].showModel = false
        this.setState({ selectList, inputParamsList: {} })
    }

    inputParams(e, name) {
        const { inputParamsList } = this.state
        inputParamsList[name] = e.target.value
        this.setState({ inputParamsList })
    }
    changeStock(e) {
        const { indicateStockList, inputParamsList } = this.state
        indicateStockList.forEach(item => {
            if (item.stockName === e) {
                inputParamsList.stock = item
            }
        })
        this.setState({ inputParamsList })
    }

    onSubmit() {
        const { selectTimeIndex, selectList, conditionNum, storePosition } = this.state
        const id = this.props.match.params.id
        if (selectTimeIndex === 0) {
            this.setState({ status: 'loading' })
            editStep3({
                comboId:id,
                isEnable:0,
            }).then(res => {
                this.setState({ status: 'success' })
                this.props.changeStep(3)
            }).catch(err => {
                this.setState({ status: 'success' })
            })
        } else {
            let indicators = []
            let param = []
            selectList.forEach(item => {
                let obj = {}
                obj.indicatorId = item.strategyId
                obj.symbol = item.indicate.stockCode
                indicators.push(obj)
                item.params.forEach(paramItem => {
                    let obj1 = {}
                    obj1.paramName = Object.keys(paramItem)[0]
                    obj1.paramValue = paramItem[Object.keys(paramItem)[0]]
                    param.push(obj1)
                })
            })

            const data = {
                comboId:id,
                closePostionRatio: storePosition,
                indicators: JSON.stringify(indicators),
                param: JSON.stringify(param),
                count: conditionNum,
                isEnable:1,
            }
            this.setState({ status: 'loading' })
            editStep3(data).then(res => {
                this.setState({ status: 'success' })
                this.props.changeStep(3)
            }).catch(err => {
                this.setState({ status: 'success' })
            })
        }
    }

    render() {
        const { selectTimeIndex, indicateList, selectList, indicateStockList, status, storePosition, conditionNum } = this.state
        let positionValue = ""
        if (storePosition === 0) {
            positionValue = '空仓'
        } else if (storePosition === 30) {
            positionValue = '30%'
        } else if (storePosition === 50) {
            positionValue = '50%'
        }
        return (
            <div className="select-time">
                {status === 'loading' ? <Loading /> : null}
                <div className="select-radio">
                    <span className="title">大盘择时：</span>
                    <RadioGroup onChange={this.onChangeRadio.bind(this)} value={this.state.selectTimeIndex}>
                        <Radio value={0}><span className={selectTimeIndex === 0 ? 'radio active' : "radio"}>不择时</span></Radio>
                        <Radio value={1}><span className={selectTimeIndex === 1 ? 'radio active' : "radio"}>使用指标择时</span></Radio>
                    </RadioGroup>
                </div>
                {selectTimeIndex ?
                    <div>
                        <div className="select-condition">
                            <span className="title">同时满足：</span>
                            <Select value={conditionNum} style={{ width: 180, marginLeft: 10, marginRight: 5 }} onChange={this.changeConditionNum.bind(this)}>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                            </Select>
                            <span className="text">条件时由牛变熊。</span>
                            <span className="title-1">熊市仓位：</span>
                            <Select value={positionValue} style={{ width: 180, marginLeft: 10, marginRight: 5 }} onChange={this.changeStorePosition.bind(this)}>
                                <Option value="0">空仓</Option>
                                <Option value="30">30%</Option>
                                <Option value="50">50%</Option>

                            </Select>
                        </div>

                        <div className="tab-indicate">
                            <Tabs type="card" style={{ width: '587px' }}>
                                <TabPane tab="择时指标" key="1">
                                    <div className="finance">
                                        {indicateList.selectTime.map((item, index) => {
                                            return (
                                                <div className={item.isSelect ? "select-item active" : 'select-item'} key={index} onClick={this.onSelectTime.bind(this, index)}>
                                                    <span>{item.name}</span>
                                                    {item.isSelect ? <img src={sure_icon} alt="" className="icon-sure" /> : null}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </TabPane>
                                {/* <TabPane tab="自定义条件" key="2">
                                    <p>Content of Tab Pane 2</p>
                                    <p>Content of Tab Pane 2</p>
                                    <p>Content of Tab Pane 2</p>
                                </TabPane> */}
                            </Tabs>

                            <div className="has-select">
                                <div className="title">已选指标</div>
                                <div className="select-list">
                                    <div className="select-list-header">
                                        <span>指标</span>
                                        <span>编辑</span>
                                        <span>删除</span>
                                    </div>
                                    {selectList.map((item, index) => {
                                        return (
                                            <div className="indicate-item" key={index}>
                                                <span className="name">{item.name}({item.indicate.stockName}
                                                    {item.params.map((paramsItem) => {
                                                        if (paramsItem[Object.keys(paramsItem)[0]]) {
                                                            return (',' + Object.keys(paramsItem)[0] + ',' + paramsItem[Object.keys(paramsItem)[0]])
                                                        } else {
                                                            return null
                                                        }

                                                    })}
                                                    )</span>
                                                <img src={edit_icon} alt="" className="edit" onClick={this.showEditModel.bind(this, index)} />
                                                <img src={delete_icon} alt="" className="delete" onClick={this.deleteSelect.bind(this, index)} />
                                                {item.showModel ?
                                                    <div className="edit-model">
                                                        <div className="model-wrapper">
                                                            <div className="cancel-model" onClick={this.cancelEditModel.bind(this, index)}>×</div>
                                                            <div className="model-title">条件设定</div>
                                                            <div className="intro">{item.name}</div>
                                                            <div className="indicates">
                                                                <span>牛熊判断的指数：</span>
                                                                <Select defaultValue={item.indicate.stockName} style={{ width: 260, marginLeft: 10, marginRight: 5, fontSize: 13 }} onChange={this.changeStock.bind(this)}>
                                                                    {indicateStockList.map((item, index) => {
                                                                        return (
                                                                            <Option value={item.stockName} key={index}>{item.stockName}</Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </div>

                                                            {item.params.map((item, index) => {
                                                                return (
                                                                    <div className="ma" key={index}>
                                                                        <span className="title">{Object.keys(item)[0]}：</span>
                                                                        <input className="input" defaultValue={item[Object.keys(item)[0]]} type="number" onChange={(e) => this.inputParams(e, Object.keys(item)[0])} />
                                                                    </div>
                                                                )
                                                            })}


                                                            <div className="btn-confirm">
                                                                <span className="save" onClick={this.saveEditModel.bind(this, index)}>保存</span>
                                                                <span className="cancel" onClick={this.cancelEditModel.bind(this, index)}>取消</span>
                                                            </div>
                                                        </div>
                                                    </div> : null
                                                }

                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                    </div> :
                    <div className="no-select-time-wrapper">

                    </div>
                }


                <div className="bottom-btn">
                    <span className="btn pre" onClick={() => this.props.changeStep(1)}>上一步</span>
                    <span className="btn next" onClick={this.onSubmit.bind(this)}>下一步</span>
                </div>



            </div>
        )
    }
}