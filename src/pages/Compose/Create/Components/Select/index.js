import React, { Component } from 'react'
import './index.scss'

import sure_icon from '../../../../../assets/sure.png'
import delete_icon from '../../../../../assets/dele.png'

import { Radio, Checkbox, Select, Tabs, message } from 'antd'
import Loading from '../../../../../components/Loading/index'
import {
    getMyStockPool, getPoolStock, getStockData, stockIndicate, stockIndicateList,
    assignMarket, industryMarket, conceptBlock, regionBlock, beginSelect, selectStockNext
} from '../../../../../serivce'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

export default class SelectStock extends Component {
    constructor() {
        super()
        this.state = {
            status: '',
            rankIndex: 0,
            stockPool: ['自选股'],
            stockPoolSelected: [],
            poolStockList: {}, //股票列表

            dataList: [],
            selectList: [], //选择列表
            showCreateModel: false, //
            assignMarketList: [{ value: '全市场' }], //指定市场列表
            industryMarketList: [{ name: '全部' }], //行业市场
            conceptBlockList: [{ value: "全部" }],  //概念板块
            regionBlockList: [{ value: "全部" }], //地区板块
            assignMarketSelect: [],//已选指定市场列表
            industryMarketSelect: [],//已选指定市场
            conceptBlockSelect: [], //已选概念板块
            regionBlockSelect: [], //已选地区板块
            hasSelectStockList: [],//开始选股后得股票列表
            isFinishSelect: false,
            submitArr: [],

        }
    }

    componentWillMount() {
        let data = localStorage.getItem('selectStock')
        if (data) {
            data = JSON.parse(data)
            this.setState({ ...data })
        } else {
            this.onGetMyPool()
            this.onStockIndicate()
            this.onAssignMarket()  //指定市场列表
            this.onIndustryMarket() //行业市场列表
            this.onConceptBlock()
            this.onRegionBlock()
        }

    }
    componentWillUnmount() {
        localStorage.setItem('selectStock', JSON.stringify(this.state))
    }
    //股票池列表
    onGetMyPool() {
        const id = this.props.userId
        getMyStockPool({ id }).then(res => {
            this.setState({ stockPool: res })
        })
    }
    //选择股票池
    onSelectPool(e, index) {
        let { stockPool, stockPoolSelected } = this.state
        if (e.target.checked) {
            this.onGetPoolStock(stockPool[index].name)
            stockPoolSelected.push(index)
            this.setState({ stockPoolSelected })
        } else {
            let { poolStockList } = this.state
            delete poolStockList[stockPool[index].name]
            stockPoolSelected = stockPoolSelected.filter(item => {
                return item !== index
            })
            this.setState({ poolStockList, stockPoolSelected })
        }
    }
    //股票池内所有股票
    onGetPoolStock(stock) {
        const id = this.props.userId
        let { poolStockList } = this.state
        const data = {
            selectType: 0,
            userId: id,
            poolName: stock
        }
        this.setState({ status: 'loading' })
        getPoolStock(data).then(res => {
            let stockCodeList = ""
            res.forEach(item => {
                stockCodeList = stockCodeList + item.stockCode + ','
            })
            getStockData({ code: stockCodeList }).then(res => {
                poolStockList[stock] = res
                this.setState({ status: 'success' })
            }).catch(err => {
                this.setState({ status: 'success' })
            })
        })
    }

    //获取指定市场列表
    onAssignMarket() {
        assignMarket({}).then(res => {
            this.setState({ assignMarketList: res })
        })
    }

    //获取行业市场列表
    onIndustryMarket() {
        industryMarket({}).then(res => {
            this.setState({ industryMarketList: res })
        })
    }
    //获取概念板块列表
    onConceptBlock() {
        conceptBlock({}).then(res => {
            this.setState({ conceptBlockList: res })
        })
    }
    //获取地区板块列表
    onRegionBlock() {
        regionBlock({}).then(res => {
            this.setState({ regionBlockList: res })
        })
    }

    //获取指标列表
    onStockIndicate() {
        stockIndicate({}).then((res, index) => {
            let indicateList = res
            stockIndicateList({}).then(ret => {
                indicateList = indicateList.map((item, index) => {
                    item.list = []
                    ret.forEach((value, valueIndex) => {
                        if (value.tId === item.tId) {
                            value.isSelect = false
                            value.type = 0
                            item.list.push(value)
                        }
                    })
                    return item
                })
                this.setState({ dataList: indicateList })
            })


        })
    }

    //开始选股
    beginSelectStock() {
        let { assignMarketSelect, industryMarketSelect, conceptBlockSelect, regionBlockSelect, selectList } = this.state
        if (selectList.length === 0) {
            message.error('请选择指标');
            return
        }
        let isDataRight = true
        selectList.forEach(item => {
            if (item.value !== '创历史新高' && item.value !== '创历史新低' && item.tId !== 6) {
                if (item.value1 === "" && (item.type === 0 || item.type === 1)) {
                    message.error('请输入已选指标的值');
                    isDataRight = false
                    return
                }
                if ((item.value2 === "" || item.value1 === "") && (item.type === 2)) {
                    message.error('请输入完整的指标值');
                    isDataRight = false
                    return
                }
                if (item.type === 2 && (item.value1 >= item.value2)) {
                    isDataRight = false
                    message.error('请输入正确的指标区间');
                    return
                }
            }

        })
        if (!isDataRight) {
            return
        }
        let assignMarketSelect1 = []
        assignMarketSelect.forEach(item => {
            let data = { ...item, value: 1 }
            assignMarketSelect1.push(data)
        })
        industryMarketSelect = industryMarketSelect.map(item => {
            return {
                tId: 8,
                pId: item.pId,
                value: item.value

            }
        })
        conceptBlockSelect = conceptBlockSelect.map(item => {
            return {
                tId: 10,
                pId: item.pId,
                value: item.value
            }
        })
        regionBlockSelect = regionBlockSelect.map(item => {
            return {
                tId: 9,
                pId: item.pId,
                value: item.value
            }
        })
        selectList = selectList.map(item => {
            let value = ""
            
            if (item.type === 0) {
                if (item.value === '流通市值' || item.value === '总市值' || item.value === '流通股本' || item.value === '总股本'){
                    value = '>' + item.value1*100000000
                }else{
                    value = '>' + item.value1
                }
            } else if (item.type === 1) {
                if (item.value === '流通市值' || item.value === '总市值' || item.value === '流通股本' || item.value === '总股本'){
                    value = '<' + item.value1*100000000
                }else{
                    value = '<' + item.value1
                }
            } else if (item.type === 2) {
                if (item.value === '流通市值' || item.value === '总市值' || item.value === '流通股本' || item.value === '总股本'){
                    value = item.value1*100000000 + '-' + item.value2*100000000
                }else{
                    value = item.value1 + '-' + item.value2
                }
            }
            if(item.value === '创历史新高' || item.value === '创历史新低' || item.tId === 6 ){
                value = 1
            }
            return {
                tId: item.tId,
                pId: item.pId,
                value
            }
        })

        let arr = [...assignMarketSelect1, ...industryMarketSelect, ...conceptBlockSelect, ...regionBlockSelect, ...selectList]
        const id = this.props.userId
        const data = {
            reqParameter: JSON.stringify(arr),
            userId: id,
            selectType: 1,

        }
        this.setState({ status: 'loading', submitArr: JSON.stringify(arr) })
        beginSelect(data).then(res => {
            this.setState({ hasSelectStockList: res, isFinishSelect: true })
            this.setState({ status: 'success' })
            message.success('选择成功');

        }).catch(err => {
            this.setState({ status: 'success' })
        })

    }

    //选择股票值下一步
    onSelectStockNext() {
        const id = this.props.userId
        const { poolStockList, rankIndex, submitArr } = this.state
        let data = {}
        if (rankIndex === 0) {
            data = {
                selectType: 0,
                userId: id,
                poolName: Object.keys(poolStockList).join(',')
            }
        } else {
            data = {
                selectType: 1,
                userId: id,
                reqParameter: submitArr
            }
        }
        this.setState({ status: 'loading' })
        selectStockNext(data).then(res => {
            this.setState({ status: 'success' })
            this.props.changeStep(1)
        }).catch(err => {
            this.setState({ status: 'success' })
            console.log(err)
        })

    }

    onChangeRadio(e) {

        this.setState({
            rankIndex: e.target.value,
        });
    }
    //选择指定市场
    onChangeMarket(e) {
        const { assignMarketList } = this.state
        const arr = e.map(item => {
            let value = ""
            assignMarketList.forEach(data => {
                if (data.value === item) {
                    value = data

                }
            })
            return value
        })
        this.setState({ assignMarketSelect: arr })
    }
    //选择行业市场
    onChangeIndustry(e) {
        const { industryMarketList } = this.state
        const arr = e.map(item => {
            let value = ""
            industryMarketList.forEach(data => {
                if (data.name === item) {
                    value = data
                }
            })
            return value
        })
        this.setState({ industryMarketSelect: arr })
    }
    //选择概念板块
    onChangeConcept(e) {
        const { conceptBlockList } = this.state
        const arr = e.map(item => {
            let value = ""
            conceptBlockList.forEach(data => {
                if (data.name === item) {
                    value = data
                }
            })
            return value
        })
        this.setState({ conceptBlockSelect: arr })
    }
    //选择地区板块
    onChangeRegion(e) {
        const { regionBlockList } = this.state
        const arr = e.map(item => {
            let value = ""
            regionBlockList.forEach(data => {
                if (data.name === item) {
                    value = data
                }
            })
            return value
        })
        this.setState({ regionBlockSelect: arr })
    }

    //选择财务指标
    selectFinance(index, indicateIndex) {
        let dataList = this.state.dataList
        let list = dataList[index + 1].list
        let selectList = this.state.selectList
        if (selectList.length > 9) {
            return
        }
        list.forEach((item, itemIndex) => {
            if (itemIndex === indicateIndex) {
                dataList[index + 1].list[indicateIndex].isSelect = !dataList[index + 1].list[indicateIndex].isSelect
                if (list[indicateIndex].isSelect) {
                   
                    item.value1 = ""
                    item.value2 = ""
                    selectList.push(item)
                } else {
                    selectList = selectList.filter((value) => {
                        return value.value !== item.value
                    })
                }
            }
        })
        this.setState({ dataList, selectList })
    }
    //选择比较符
    changeCompare(e, index) {
        let { selectList } = this.state
        selectList[index].type = Number(e)
        this.setState({ selectList })
    }

    //删除选择的指标
    deleteSelect(index) {
        let { selectList, dataList } = this.state
        dataList.forEach((item, itemIndex) => {
            if (item.tId === selectList[index].tId) {
                item.list.forEach(value => {
                    if (value.pId === selectList[index].pId) {
                        value.isSelect = !value.isSelect
                    }
                })
            }
        })
        selectList = selectList.filter((item, itemIndex) => {
            return itemIndex !== index
        })
        this.setState({ dataList, selectList })
    }
    inputValue1(e, index) {
        let { selectList } = this.state
        selectList[index].value1 = e.target.value === "" ? "" : Number(e.target.value)
        this.setState({ selectList })
    }
    inputValue2(e, index) {
        let { selectList } = this.state
        selectList[index].value2 = e.target.value === "" ? "" : Number(e.target.value)
        this.setState({ selectList })
    }

    render() {
        const { rankIndex, selectList, stockPool, status, poolStockList, dataList, isFinishSelect, hasSelectStockList, stockPoolSelected,
            assignMarketList, industryMarketList, conceptBlockList, regionBlockList, assignMarketSelect, industryMarketSelect, conceptBlockSelect, regionBlockSelect } = this.state
        let rangeList = []
        if (dataList.length > 0) {
            rangeList = dataList[0].list
        }

        let indicateValues = []
        dataList.forEach((item, index) => {
            if (index > 0) {
                indicateValues.push(item)
            }
        })
        let stockList = []
        for (let key in poolStockList) {
            stockList = [...stockList, ...poolStockList[key]]
        }
        return (
            <div className="create-select-wrapper">
                {status === 'loading' ? <Loading /> : null}
                <div className="select-type">
                    <span className="title">选择股票池：&nbsp;</span>
                    <RadioGroup onChange={this.onChangeRadio.bind(this)} value={this.state.rankIndex}>
                        <Radio value={0}><span className={rankIndex === 0 ? 'radio active' : "radio"}>自定义股票池</span></Radio>
                        <Radio value={1}><span className={rankIndex === 1 ? 'radio active' : "radio"}>选股条件</span></Radio>
                    </RadioGroup>
                </div>
                {
                    rankIndex === 0 ?
                        <div>

                            <div className="select-type">
                                <span className="title"></span>
                                {stockPool.map((item, index) => {
                                    return (
                                        <Checkbox checked={stockPoolSelected.includes(index)} key={index} onChange={(e) => this.onSelectPool(e, index)}>{item.name}</Checkbox>
                                    )
                                })}

                            </div>
                            {/* <div className="create-new">
                                <div className="create-new-btn" onClick={this.onShowCreateModel.bind(this)}>+ 创建股票池</div>
                            </div> */}
                            <div className="stock-list">
                                <div className="title">股票列表<span>（一共{stockList.length}只股票）</span></div>
                                <div className="stock-list-wrapper">
                                    <div className="header">
                                        <span className="header-item">序号</span>
                                        <span className="header-item">股票名称</span>
                                        <span className="header-item">股票代码</span>
                                        <span className="header-item">涨跌幅</span>
                                        <span className="header-item">现价</span>
                                    </div>
                                    <div className="stock">
                                        {stockList.map((item, index) => {
                                            return (
                                                <div className="stock-item-wrapper" key={index}>
                                                    <span className="stock-item index">{index + 1}</span>
                                                    <span className="stock-item">{item.prod_name}</span>
                                                    <span className="stock-item">{item.prod_code}</span>
                                                    <span className={item.px_change_rate >= 0 ? "stock-item red" : "stock-item green"}>{item.px_change_rate}%</span>
                                                    <span className="stock-item">{item.last_px}</span>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>
                            </div>
                            {stockList.length > 0 ? <div className="next-btn" onClick={this.onSelectStockNext.bind(this)}>下一步</div> : null}

                        </div>
                        :
                        <div className="condition-wrapper">
                            <div className="range-title">选股范围</div>
                            <div className="range-list">
                                {rangeList.map((item, index) => {
                                    const assignMarket = assignMarketSelect.map(item => {
                                        return item.value
                                    })
                                    const industryMarket = industryMarketSelect.map(item => {
                                        return item.name
                                    })
                                    const conceptBlock = conceptBlockSelect.map(item => {
                                        return item.name
                                    })
                                    const regionBlock = regionBlockSelect.map(item => {
                                        return item.name
                                    })

                                    if (index > 0) {
                                        return (
                                            <div key={index} className="range-list-item">
                                                <span>{item.value}：</span>
                                                {
                                                    index === 1 ?
                                                        <Select value={assignMarket} mode="multiple" placeholder="全部" style={{ width: 190, marginLeft: 10 }} onChange={this.onChangeMarket.bind(this)}>
                                                            {assignMarketList.map((item, index) => {
                                                                if (index > 0) {
                                                                    return (
                                                                        <Option key={index} value={item.value}>{item.value}</Option>
                                                                    )
                                                                } else {
                                                                    return null
                                                                }

                                                            })}
                                                        </Select> : null
                                                }
                                                {
                                                    index === 2 ?
                                                        <Select value={industryMarket} mode="multiple" placeholder="全部" style={{ width: 190, marginLeft: 10 }} onChange={this.onChangeIndustry.bind(this)}>
                                                            {industryMarketList.map((item, index) => {
                                                                return (
                                                                    <Option key={index} value={item.name}>{item.name}</Option>
                                                                )
                                                            })}
                                                        </Select> : null
                                                }
                                                {
                                                    index === 3 ?
                                                        <Select value={conceptBlock} mode="multiple" placeholder="全部" style={{ width: 190, marginLeft: 10 }} onChange={this.onChangeConcept.bind(this)}>
                                                            {conceptBlockList.map((item, index) => {
                                                                return (
                                                                    <Option key={index} value={item.name}>{item.name}</Option>
                                                                )
                                                            })}
                                                        </Select> : null
                                                }
                                                {
                                                    index === 4 ?
                                                        <Select value={regionBlock} mode="multiple" placeholder="全部" style={{ width: 210, marginLeft: 10 }} onChange={this.onChangeRegion.bind(this)}>
                                                            {regionBlockList.map((item, index) => {
                                                                return (
                                                                    <Option key={index} value={item.name}>{item.name}</Option>
                                                                )
                                                            })}
                                                        </Select> : null
                                                }

                                            </div>
                                        )
                                    } else {
                                        return null
                                    }

                                })}
                            </div>

                            {/* <div className="select-indicate">
                                选股指标：
                                <input className="input" type="text" placeholder="输入财务选项或指标" />
                            </div> */}
                            <div className="tab-indicate">
                                <Tabs type="card">
                                    {indicateValues.map((item, index) => {
                                        return (
                                            <TabPane tab={item.value} key={index + 1}>
                                                <div className="finance">
                                                    {item.list.map((item, itemIndex) => {
                                                        return (
                                                            <div className={item.isSelect ? "select-item active" : 'select-item'} key={itemIndex} onClick={this.selectFinance.bind(this, index, itemIndex)}>
                                                                <span>{item.value}</span>
                                                                {item.isSelect ? <img src={sure_icon} alt="" className="icon-sure" /> : null}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </TabPane>
                                        )
                                    })
                                    }
                                </Tabs>
                            </div>

                            <div className="has-select">
                                <div>已选指标</div>
                                <div className="select-list">
                                    <div className="select-list-header">
                                        <span>指标</span>
                                        <span>比较符</span>
                                        <span style={{ marginRight: '100px' }}>值</span>
                                        <span>操作</span>
                                    </div>
                                    {selectList.map((item, index) => {
                                        let compareValue = ""
                                        if (item.type === 0) {
                                            compareValue = '大于'
                                        } else if (item.type === 1) {
                                            compareValue = '小于'
                                        } else if (item.type === 2) {
                                            compareValue = "区间"
                                        }
                                        // let unit = '%'
                                        // if(item.value==='流通市值'||item.value==='总市值'||item.value==='流通股本'||item.value==='总股本'){
                                        //     unit = '亿'
                                        // }
                                        // if(item.value===''){
                                        //     unit = ''
                                        // }
                                        return (
                                            <div className="indicate-item" key={index}>
                                                <span className="name">{item.value}</span>
                                                {item.value !== '创历史新高' && item.value !== '创历史新低' && item.tId !== 6 ?
                                                    <Select value={compareValue} style={{ width: 180 }} onChange={(e) => this.changeCompare(e, index)}>
                                                        <Option value="0">大于</Option>
                                                        <Option value="1">小于</Option>
                                                        <Option value="2">区间</Option>
                                                    </Select> : <div style={{ width: 180 }} ></div>
                                                }

                                                {item.value !== '创历史新高' && item.value !== '创历史新低' && item.tId !== 6 ?
                                                    <div className="value">
                                                        {
                                                            item.type === 0 || item.type === 1 ?
                                                                <input type="number" value={item.value1} className="has-select-input" onChange={(e) => this.inputValue1(e, index)} /> : null
                                                        }
                                                        {
                                                            item.type === 2 ?
                                                                <div>
                                                                    <input type="number" value={item.value1} className="has-select-input" onChange={(e) => this.inputValue1(e, index)} /> ~ <input type="number" value={item.value2} onChange={(e) => this.inputValue2(e, index)} className="has-select-input" />
                                                                </div> : null
                                                        }
                                                    </div> : <div className="blank"></div>
                                                }

                                                <img src={delete_icon} alt="" className="delete" onClick={this.deleteSelect.bind(this, index)} />
                                            </div>
                                        )
                                    })}
                                    <div className="mark">注：最多可以添加10个条件</div>
                                </div>
                            </div>
                            <div className="begin-select" onClick={this.beginSelectStock.bind(this)}>开始选股</div>
                            {isFinishSelect ?
                                <div className="bottom">
                                    <div className="bottom-number">
                                        <span>选出股票数量为：{hasSelectStockList.length}只</span>
                                        <span className="next-btns" onClick={this.onSelectStockNext.bind(this)}>下一步</span>
                                    </div>
                                    <div className="stock-list">
                                        {hasSelectStockList.map((item, index) => {
                                            return (
                                                <div className="stock-item" key={index} onClick={()=> this.props.history.push('/traderoom?code=' + item.stockCode)}>
                                                    <span className="name">{item.stockName}</span>
                                                    <span className="code">({item.stockCode.substring(0,6)})</span>
                                                </div>
                                            )
                                        })}

                                    </div>

                                </div> : null
                            }

                        </div>
                }
            </div>
        )
    }
}