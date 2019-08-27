import React, { Component } from 'react'
import './index.scss'

import sure_icon from '../../../../../assets/sure.png'
import delete_icon from '../../../../../assets/dele.png'

import { Radio, Checkbox, Select, Tabs, message } from 'antd'
import Loading from '../../../../../components/Loading/index'
import {
    getMyStockPool, getPoolStock, getStockData, stockIndicate, stockIndicateList,
    assignMarket, industryMarket, conceptBlock, regionBlock, beginSelect, editCompose, editStep1
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
            stockPool: [],
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
            selectStockParameter: "",
            selectAgain: false,

        }
    }

    componentWillMount() {

        let data = localStorage.getItem('selectStock')
        if (data) {
            data = JSON.parse(data)
            this.setState({ ...data })
        } else {

            this.onGetMyPool()
            const p5 = this.onStockIndicate()
            const p1 = this.onAssignMarket()  //指定市场列表
            const p2 = this.onIndustryMarket() //行业市场列表
            const p3 = this.onConceptBlock()
            const p4 = this.onRegionBlock()
            this.setState({ status: 'loading' })
            Promise.all([p1, p2, p3, p4, p5]).then(res => {
                const composeId = this.props.match.params.id
                editCompose({ id: composeId }).then(ret => {
                    this.setState({ status: 'success' })
                    if (ret.selectStockParameter.selectType === 1) {
                        let dataList = JSON.parse(ret.selectStockParameter.selectCondition)

                        const { assignMarketList, industryMarketList, conceptBlockList, regionBlockList } = this.state
                        const list = this.state.dataList

                        let assignMarketSelect = []
                        let industryMarketSelect = []
                        let conceptBlockSelect = []
                        let regionBlockSelect = []
                        let selectList = []
                        dataList.forEach((item, index) => {
                            if (item.pId >= 54 && item.pId <= 58) {
                                assignMarketSelect.push(item)
                            } else if (item.pId === 59) {
                                industryMarketSelect.push(item)
                            } else if (item.pId === 61) {
                                conceptBlockSelect.push(item)
                            } else if (item.pId === 60) {
                                regionBlockSelect.push(item)
                            } else if (item.tId >= 2 && item.tId <= 6) {
                                selectList.push(item)
                            }
                        })
                        assignMarketSelect = assignMarketSelect.map((item) => {
                            let result = ""
                            assignMarketList.forEach(item1 => {
                                if (item1.pId === item.pId) {
                                    result = item1
                                }
                            })
                            return result
                        })
                        industryMarketSelect = industryMarketSelect.map((item) => {
                            let result = ""
                            industryMarketList.forEach(item1 => {
                                if (item1.value === item.value) {
                                    result = item1
                                }
                            })
                            return result
                        })
                        conceptBlockSelect = conceptBlockSelect.map((item) => {
                            let result = ""
                            conceptBlockList.forEach(item1 => {
                                if (item1.value === item.value) {
                                    result = item1
                                }
                            })
                            return result
                        })
                        regionBlockSelect = regionBlockSelect.map((item) => {
                            let result = ""
                            regionBlockList.forEach(item1 => {
                                if (item1.value === item.value) {
                                    result = item1
                                }
                            })
                            return result
                        })

                        selectList = selectList.map(item => {
                            let result = ""
                            list.forEach(item1 => {
                                if (item1.tId === item.tId) {
                                    item1.list.forEach(item2 => {
                                        if (item2.pId === item.pId) {
                                            item2.isSelect = true
                                            result = item2
                                            if (item.value.includes('>')) {
                                                result.type = 0
                                                if (result.value === '流通市值' || result.value === '总市值' || result.value === '流通股本' || result.value === '总股本'){
                                                    result.value1 = Number(item.value.substring(1))/100000000
                                                }else{
                                                    result.value1 = item.value.substring(1)
                                                }
                                               
                                                result.value2 = ""
                                            } else if (item.value.includes('<')) {
                                                result.type = 1
                                                if (result.value === '流通市值' || result.value === '总市值' || result.value === '流通股本' || result.value === '总股本'){
                                                    result.value1 = Number(item.value.substring(1))/100000000
                                                }else{
                                                    result.value1 = item.value.substring(1)
                                                }
                                                result.value2 = ""
                                            } else {
                                                result.type = 2
                                                let arr = item.value.split('-')
                                                if (result.value === '流通市值' || result.value === '总市值' || result.value === '流通股本' || result.value === '总股本'){
                                                    result.value1 = Number(arr[0])/100000000
                                                    result.value2 = Number(arr[1])/100000000
                                                }else{
                                                    result.value1 = arr[0]
                                                    result.value2 = arr[1]
                                                }
                                               
                                            }

                                        }
                                    })
                                }
                            })
                            return result
                        })
                        this.setState({
                            rankIndex: 1, assignMarketSelect, industryMarketSelect, conceptBlockSelect, hasSelectStockList: ret.stockPools,
                            regionBlockSelect, dataList: list, selectList, isFinishSelect: true
                        })
                    }else{
                        const selectPools = ret.selectStockParameter.mySelectStockName.split(',')
                        const {stockPool} = this.state
                        selectPools.forEach((item,index)=>{
                            stockPool.forEach((value,valueIndex)=>{
                                if(value.name===item){
                                    this.onSelectPool({target:{checked:true}},valueIndex)
                                }
                            })
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        }

    }

    componentWillUnmount() {
        localStorage.setItem('selectStock', JSON.stringify(this.state))
    }

    //股票池列表
    onGetMyPool() {
        const id = this.props.userId
        let { stockPoolSelected } = this.state
        getMyStockPool({ id }).then(res => {
            const composeId = this.props.match.params.id
            editCompose({ id: composeId }).then(ret => {
                if (ret.selectStockParameter.selectType === 0) {
                    let arr = ret.selectStockParameter.mySelectStockName.split(',')
                    res.forEach((item, index) => {
                        if (arr.includes(item)) {
                            stockPoolSelected.push(index)
                            this.onGetPoolStock(item)
                        }
                    })
                    this.setState({ stockPool: res, stockPoolSelected, rankIndex: 0 })
                } else {
                    this.setState({ stockPool: res })
                }

            }).catch(err => {
                console.log(err)
            })

        })
    }
    //选择股票池
    onSelectPool(e, index) {
        let { stockPool, stockPoolSelected } = this.state
        if (e.target.checked) {
            this.onGetPoolStock(stockPool[index])
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
            poolName: stock.name
        }
        this.setState({ status: 'loading' })
        getPoolStock(data).then(res => {
            let stockCodeList = ""
            res.forEach(item => {
                stockCodeList = stockCodeList + item.stockCode + ','
            })
            getStockData({ code: stockCodeList }).then(res => {
                poolStockList[stock.name] = res
                this.setState({ status: 'success' })
            }).catch(err => {
                this.setState({ status: 'success' })
            })
        })
    }

    //获取指定市场列表
    onAssignMarket() {
        return new Promise((resolve, reject) => {
            assignMarket({}).then(res => {
                this.setState({ assignMarketList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }

    //获取行业市场列表
    onIndustryMarket() {
        return new Promise((resolve, reject) => {
            industryMarket({}).then(res => {
                this.setState({ industryMarketList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }
    //获取概念板块列表
    onConceptBlock() {
        return new Promise((resolve, reject) => {
            conceptBlock({}).then(res => {
                this.setState({ conceptBlockList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }
    //获取地区板块列表
    onRegionBlock() {
        return new Promise((resolve, reject) => {
            regionBlock({}).then(res => {
                this.setState({ regionBlockList: res })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }

    //获取指标列表
    onStockIndicate() {
        return new Promise((resolve, reject) => {
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
                    resolve()
                }).then(err => {
                    reject(err)
                })
            })
        })

    }

    //处理数据用于提交
    dealData() {
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
        return arr
    }

    //开始选股
    beginSelectStock() {
        const arr = this.dealData()
        const id = this.props.userId
        const data = {
            reqParameter: JSON.stringify(arr),
            userId: id,
            selectType: 1,

        }
        this.setState({ status: 'loading' })
        beginSelect(data).then(res => {
            this.setState({ hasSelectStockList: res, isFinishSelect: true, selectAgain: true })
            this.setState({ status: 'success' })
            message.success('选择成功');

        }).catch(err => {
            this.setState({ status: 'success' })
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



    onToNext() {
        const id = this.props.match.params.id
        const { poolStockList, rankIndex } = this.state
        let data = {}
        if (rankIndex === 0) {
            data = {
                selectType: 0,
                comboId: id,
                poolName: Object.keys(poolStockList).join(',')
            }
        } else {
            let submitArr = this.dealData()
            submitArr = JSON.stringify(submitArr)
            data = {
                selectType: 1,
                comboId: id,
                reqParameter: submitArr
            }
        }
        this.setState({ status: 'loading' })
        editStep1(data).then(res => {
            this.setState({ status: 'success' })
            this.props.changeStep(1)
        }).catch(err => {
            this.setState({ status: 'success' })
            console.log(err)
        })
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
            <div className="edit-select-wrapper">
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
                            {stockList.length > 0 ? <div className="next-btn" onClick={this.onToNext.bind(this)}>下一步</div> : null}

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
                                        <span className="next-btns" onClick={this.onToNext.bind(this)}>下一步</span>
                                    </div>
                                    <div className="stock-list">
                                        {hasSelectStockList.map((item, index) => {
                                            return (
                                                <div className="stock-item" key={index}>
                                                    <span className="name">{item.stockName}</span>
                                                    <span className="code">({item.stockCode.substring(0, 6)})</span>
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