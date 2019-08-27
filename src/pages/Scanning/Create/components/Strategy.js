import React, { Component } from 'react'
import { Select, Tabs, Modal, Radio } from 'antd'

import gougou_icon from '../../images/chacha_07.png'
import chacha_icon from '../../images/gogo_03.png'
import { myStockPool, marketList, conceptBlockAll, fetchStategyList, strategyScanDetail } from '../../../../serivce'

const Option = Select.Option;
const TabPane = Tabs.TabPane;


export default class Strategy extends Component {
    constructor() {
        super()
        this.state = {
            initCaptital: 100000,
            tabIndex: 1,
            strategyList: [],
            strategyId: "",
            marketList: [], //市场
            regionList: [], //地域
            conceptList: [],//概念
            conceptListAll: [],
            industryList: [], //行业
            myStockPoolList: [],//我的股票池列表
            selectMarket: [],
            selectRegion: [],
            selectConcept: [],
            selectIndustry: [],
            selectMyStock: [],
            showAllConceptModal: false,
            scanTypeIndex: 0,
            release_id:"",
            id:"",


        }
    }
    async componentWillMount() {
        const token = localStorage.getItem('token')
        const id = this.props.match.params.id

        this.onFetchStategyList(token)
        if (id) {
            await this.getMyStockPool(token)
            await this.getMarketList(token, 'market')
            await this.getMarketList(token, 'dy')
            await this.getMarketList(token, 'hy')
            await this.getMarketList(token, 'gn')
            await this.getAllConceptBlock()
            this.getStrategyScanDetail(id)
        } else {
            this.getMyStockPool(token)
            this.getMarketList(token, 'market')
            this.getMarketList(token, 'dy')
            this.getMarketList(token, 'hy')
            this.getMarketList(token, 'gn')
            this.getAllConceptBlock()
        }
    }
    //切换选股范围
    changeTab(e) {
        this.setState({ tabIndex: parseInt(e) })
    }
    //策略扫描详情
    getStrategyScanDetail(id) {
        strategyScanDetail({ id }).then(res => {
            const { market, area, concept, industry, favorite, strategy_id, strategy_params, scan_method ,release_id,id} = res.result
            let {marketList,regionList,conceptListAll,industryList,myStockPoolList} = this.state
            let marketArr = [],areatArr = [],conceptArr = [],industryArr = [],favoriteArr = []
            if(market){
                marketArr = market.split(',')
            }
            if(area){
                areatArr = area.split(',')
            }
            if(concept){
                conceptArr = concept.split(',')
            }
            if(industry){
                industryArr = industry.split(',')
            }
            if(favorite){
                favoriteArr = favorite.split(',')
            }
            marketArr = marketArr.map(item=>{
                let res = ""
                marketList.forEach(value=>{
                    if(`'${value.prod_code}'`===item){
                        res = value
                    }
                })
                return res
            })
            areatArr = areatArr.map(item=>{
                let res = ""
                regionList.forEach(value=>{
                    if(`'${value.prod_code}'`===item){
                        res = value
                    }
                })
                return res
            })
            conceptArr = conceptArr.map(item=>{
                let res = ""
                conceptListAll.forEach(value=>{
                    if(`'${value.prod_code}'`===item){
                        res = value
                    }
                })
                return res
            })
            industryArr = industryArr.map(item=>{
                let res = ""
                industryList.forEach(value=>{
                    if(`'${value.prod_code}'`===item){
                        res = value
                    }
                })
                return res
            })

            favoriteArr = favoriteArr.map(item=>{
                let res = ""
                myStockPoolList.forEach(value=>{
                    if(`'${value.id}'`===item){
                        res = value
                    }
                })
                return res
            })

            this.setState({
                strategyId: strategy_id,
                initCaptital: strategy_params?JSON.parse(strategy_params).initCaptital:"",
                scanTypeIndex: scan_method === 'deploy' ? 0 : 1,
                selectMarket:marketArr,
                selectRegion:areatArr,
                selectConcept:conceptArr,
                selectIndustry:industryArr,
                selectMyStock:favoriteArr,
                release_id,id
            })
        })
    }
    //策略列表
    onFetchStategyList(token) {
        fetchStategyList({ token, flag: true }).then(res => {
            let arr = res.result.strategy
            this.setState({
                strategyList: arr,
                strategyId: this.state.strategyId ? this.state.strategyId : arr[0].id
            })

        })
    }
    //我的股票池列表
    getMyStockPool(token) {
        return new Promise((resolve, reject) => {
            myStockPool({ token }).then(res => {
                this.setState({ myStockPoolList: res.data })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })

    }

    getMarketList(token, type) {
        return new Promise((resolve, reject) => {
            marketList({ token, type }).then(res => {
                if (type === 'market') {
                    this.setState({ marketList: res })
                } else if (type === 'dy') {
                    this.setState({ regionList: res })
                } else if (type === 'gn') {
                    this.setState({ conceptList: res })
                } else if (type === 'hy') {
                    this.setState({ industryList: res })
                }
                resolve()
            }).catch(err => {
                reject(err)
            })
        })

    }

    //所有概念板块
    getAllConceptBlock() {
        return new Promise((resolve, reject) => {
            const data = {
                sort_field: 'px_change_rate',
                sort_type: 1,
                page_count: 1000,
                stock_type: 'gn',
            }
            conceptBlockAll(data).then(res => {
                this.setState({ conceptListAll: res.data })
                resolve()
            }).catch(err => {
                reject(err)
            })
        })

    }

    //选择策略
    changeStrategy(e) {
        this.setState({ strategyId: e })
    }

    //选择市场
    selectMarket(item) {
        let { selectMarket } = this.state
        if (!selectMarket.includes(item)) {
            selectMarket.push(item)
        } else {
            selectMarket = selectMarket.filter(value => value !== item)
        }
        this.setState({ selectMarket })

    }
    //选择所有市场
    selectMarketAll() {
        const { marketList, selectMarket } = this.state
        if (marketList.length !== selectMarket.length) {
            this.setState({ selectMarket: marketList })
        } else {
            this.setState({ selectMarket: [] })
        }
    }
    //选择地域
    selectRegion(item) {
        let { selectRegion } = this.state
        if (!selectRegion.includes(item)) {
            selectRegion.push(item)
        } else {
            selectRegion = selectRegion.filter(value => value !== item)
        }
        this.setState({ selectRegion })
    }
    selectRegionAll() {
        const { regionList, selectRegion } = this.state
        if (regionList.length !== selectRegion.length) {
            this.setState({ selectRegion: regionList })
        } else {
            this.setState({ selectRegion: [] })
        }
    }
    selectConcept(item) {
        let { selectConcept } = this.state
        let isIncludes = false
        selectConcept.forEach(value => {
            if (value.prod_name === item.prod_name) {
                isIncludes = true
            }
        })
        if (!isIncludes) {
            selectConcept.push(item)
        } else {
            selectConcept = selectConcept.filter(value => value.prod_name !== item.prod_name)
        }
        this.setState({ selectConcept })
    }
    selectIndustry(item) {
        let { selectIndustry } = this.state
        if (!selectIndustry.includes(item)) {
            selectIndustry.push(item)
        } else {
            selectIndustry = selectIndustry.filter(value => value !== item)
        }
        this.setState({ selectIndustry })
    }
    selectIndustryAll() {
        const { industryList, selectIndustry } = this.state
        if (industryList.length !== selectIndustry.length) {
            this.setState({ selectIndustry: industryList })
        } else {
            this.setState({ selectIndustry: [] })
        }
    }
    selectMyStock(item) {
        let { selectMyStock } = this.state
        if (!selectMyStock.includes(item)) {
            selectMyStock.push(item)
        } else {
            selectMyStock = selectMyStock.filter(value => value !== item)
        }
        this.setState({ selectMyStock })
    }
    selectMyStockAll() {
        const { myStockPoolList, selectMyStock } = this.state
        if (myStockPoolList.length !== selectMyStock.length) {
            this.setState({ selectMyStock: myStockPoolList })
        } else {
            this.setState({ selectMyStock: [] })
        }
    }

    changeMethod(e) {
        console.log(e)
        this.setState({ scanTypeIndex: e.target.value })
    }

    render() {
        const { initCaptital, tabIndex, marketList, regionList, conceptList, industryList, myStockPoolList,
            selectMarket, selectRegion, selectConcept, selectIndustry, selectMyStock, conceptListAll, strategyList, strategyId,
            scanTypeIndex,
        } = this.state

        let strategyValue = ""
        strategyList.forEach(item => {
            if (item.id === strategyId) {
                strategyValue = item.name
            }
        })

        return (
            <div className="strategy-scan">
                <div className="scan-item">
                    <span className="item-name">
                        选择策略:
                        </span>
                    <Select value={strategyValue} style={{ width: 200 }} onChange={(e) => this.changeStrategy(e)}>
                        {strategyList.map((item, index) => {
                            return (
                                <Option key={index} value={item.id}>{item.name}</Option>
                            )
                        })}

                    </Select>
                </div>
                <div className="scan-item">
                    <span className="item-name">扫描k线频率：</span>
                    <Select value={'1日'} style={{ width: 200 }}>
                        <Option value={'1日'}>1日</Option>
                    </Select>
                </div>
                <div className="scan-item">
                    <span className="item-name">策略参数信息：</span>
                    <div>
                        <span>initCaptital：</span>
                        <input type="number" className="captital-input" value={initCaptital} onChange={(e) => this.setState({ initCaptital: e.target.value })} />
                    </div>
                </div>
                <div className="strategy-scan-title">选股范围：</div>
                <Tabs type="card" onChange={this.changeTab.bind(this)} activeKey={tabIndex.toString()}>
                    <TabPane tab="市场" key="1">
                        <div className="range-list">
                            <div className={marketList.length === selectMarket.length ? "select-item active" : "select-item"} onClick={this.selectMarketAll.bind(this)}>
                                <span>全选</span>
                                {marketList.length === selectMarket.length ? <img src={gougou_icon} alt="" /> : null}

                            </div>
                            {marketList.map((item, index) => {
                                return (
                                    <div className={selectMarket.includes(item) ? "select-item active" : "select-item"} key={index} onClick={this.selectMarket.bind(this, item)}>
                                        <span>{item.prod_name}</span>
                                        {selectMarket.includes(item) ? <img src={gougou_icon} alt="" /> : null}
                                    </div>
                                )
                            })}

                        </div>
                    </TabPane>
                    <TabPane tab="地域板块" key="2">
                        <div className="range-list">
                            <div className={regionList.length === selectRegion.length ? "select-item active" : "select-item"} onClick={this.selectRegionAll.bind(this)}>
                                <span>全选</span>
                                {regionList.length === selectRegion.length ? <img src={gougou_icon} alt="" /> : null}
                            </div>
                            {regionList.map((item, index) => {
                                return (
                                    <div className={selectRegion.includes(item) ? "select-item active" : "select-item"} key={index} onClick={this.selectRegion.bind(this, item)}>
                                        <span>{item.prod_name}</span>
                                        {selectRegion.includes(item) ? <img src={gougou_icon} alt="" /> : null}
                                    </div>
                                )
                            })}

                        </div>
                    </TabPane>
                    <TabPane tab="概念板块" key="3">
                        <div className="range-list">
                            {conceptList.map((item, index) => {
                                let isIncludes = false
                                selectConcept.forEach(value => {
                                    if (value.prod_name === item.prod_name) {
                                        isIncludes = true
                                    }
                                })
                                return (
                                    <div className={isIncludes ? "select-item active" : "select-item"} key={index} onClick={this.selectConcept.bind(this, item)}>
                                        <span>{item.prod_name}（{item.px_change_rate}%）</span>
                                        {isIncludes ? <img src={gougou_icon} alt="" /> : null}
                                    </div>
                                )
                            })}
                            <span className="for-more" onClick={() => this.setState({ showAllConceptModal: true })}>查看更多</span>

                        </div>
                    </TabPane>
                    <TabPane tab="行业板块" key="4">
                        <div className="range-list">
                            <div className={industryList.length === selectIndustry.length ? "select-item active" : "select-item"} onClick={this.selectIndustryAll.bind(this)}>
                                <span>全选</span>
                                {industryList.length === selectIndustry.length ? <img src={gougou_icon} alt="" /> : null}
                            </div>
                            {industryList.map((item, index) => {
                                return (
                                    <div className={selectIndustry.includes(item) ? "select-item active" : "select-item"} key={index} onClick={this.selectIndustry.bind(this, item)}>
                                        <span>{item.prod_name}</span>
                                        {selectIndustry.includes(item) ? <img src={gougou_icon} alt="" /> : null}
                                    </div>
                                )
                            })}

                        </div>
                    </TabPane>
                    <TabPane tab="我的股票" key="5">
                        <div className="range-list">
                            <div className={myStockPoolList.length === selectMyStock.length ? "select-item active" : "select-item"} onClick={this.selectMyStockAll.bind(this)}>
                                <span>全选</span>
                                {myStockPoolList.length === selectMyStock.length ? <img src={gougou_icon} alt="" /> : null}
                            </div>
                            {myStockPoolList.map((item, index) => {
                                return (
                                    <div className={selectMyStock.includes(item) ? "select-item active" : "select-item"} key={index} onClick={this.selectMyStock.bind(this, item)}>
                                        <span>{item.name}</span>
                                        {selectMyStock.includes(item) ? <img src={gougou_icon} alt="" /> : null}
                                    </div>
                                )
                            })}

                        </div>
                    </TabPane>

                </Tabs>

                <div className="strategy-scan-title has">已选范围：</div>
                <div className="has-select-list">
                    {selectMarket.map((item, index) => {
                        return (
                            <div className="select-item list" onClick={this.selectMarket.bind(this, item)} key={index}>
                                <span>{item.prod_name}</span>
                                <img src={chacha_icon} alt="" />
                            </div>
                        )
                    })}
                    {selectRegion.map((item, index) => {
                        return (
                            <div className="select-item list" onClick={this.selectRegion.bind(this, item)} key={index}>
                                <span>{item.prod_name}</span>
                                <img src={chacha_icon} alt="" />
                            </div>
                        )
                    })}
                    {selectConcept.map((item, index) => {
                        return (
                            <div className="select-item list" onClick={this.selectConcept.bind(this, item)} key={index}>
                                <span>{item.prod_name}（{item.px_change_rate}%）</span>
                                <img src={chacha_icon} alt="" />
                            </div>
                        )
                    })}
                    {selectIndustry.map((item, index) => {
                        return (
                            <div className="select-item list" onClick={this.selectIndustry.bind(this, item)} key={index}>
                                <span>{item.prod_name}</span>
                                <img src={chacha_icon} alt="" />
                            </div>
                        )
                    })}
                    {selectMyStock.map((item, index) => {
                        return (
                            <div className="select-item list" onClick={this.selectMyStock.bind(this, item)} key={index}>
                                <span>{item.name}</span>
                                <img src={chacha_icon} alt="" />
                            </div>
                        )
                    })}
                </div>

                <Radio.Group onChange={this.changeMethod.bind(this)} value={scanTypeIndex} style={{ marginTop: 30 }}>
                    <Radio value={0} style={{ marginRight: 100 }}>托管扫描</Radio>
                    <Radio value={1}>单次扫描</Radio>
                </Radio.Group>
                <Modal
                    title="概念板块"
                    footer={null}
                    visible={this.state.showAllConceptModal}
                    onCancel={() => this.setState({ showAllConceptModal: false })}
                >
                    <div className="all-concept-model">
                        {conceptListAll.map((item, index) => {
                            let isIncludes = false
                            selectConcept.forEach(value => {
                                if (value.prod_name === item.prod_name) {
                                    isIncludes = true
                                }
                            })
                            return (
                                <div className={isIncludes ? "select-item active" : "select-item"} key={index} onClick={this.selectConcept.bind(this, item)}>
                                    <span>{item.prod_name}（{item.px_change_rate}%）</span>
                                    {isIncludes ? <img src={gougou_icon} alt="" /> : null}
                                </div>
                            )
                        })}

                    </div>
                </Modal>
            </div>
        )
    }
}