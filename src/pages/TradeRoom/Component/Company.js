import React, { Component } from 'react'
import {
    companyNew, companyIntroduction, companySenior, companyNotice, companyReport, moneyFlow,
    stockTrade, headlines, distribution,distributionEc
} from '../../../serivce'
import Loading from '../../../components/Loading/index'
import CompangIntro from './CompanyIntro'
import CompanySenior from './CompanySenior'
import MoneyFlow from './Moneyflow'
import CompanyStockTrade from './CompanyStockTrade'
import CompangHeadline from './CompanyHeadline'
import CompangDistribute from './CompanyDistribute'
import CompangDistributeEc from './CompangDistributeEc'

import { message } from 'antd'

export default class Company extends Component {
    constructor() {
        super()
        this.state = {
            status: '',
            tabList: [
                { name: '公司概况', list: ['公司简介', '公司高管', '公司新闻', '公司公告', '公司研报'], show: false },
                { name: '股权信息', list: [], show: false },
                { name: '股票交易', list: ['证券信息', '操盘必读'], show: false },
                { name: '公司运作', list: ['分红送转', '分红配股增发'], show: false },
                { name: '财务数据', list: [], show: false },
                { name: '资金分析', list: ['资金流走向'], show: false }
            ],
            index1: 0,
            index2: 2,
            stockCode: "",
            title: '公司新闻',
            dataList: [], //公司新闻列表
            companyIntro: {}, //公司简介
            companyLeaderList: [], //公司高管
            noticeList: [], //公司通告
            reportList: [], //公司研报
            stockTrade: {}, //证券交易
            headlines: {},//操盘必读
            flowData: {
                date: {},
                flow: {},
                margin: [],
            },  //资金流向
            distributionList: [], //分红送转
            distributionListEc:[],//分红配股增发
            page: 1,
        }
    }
    componentWillMount() {
        let code = ""
        //判断是否有查询的股票
        const search = this.props.location.search
        if (search) {
            code = search.split('=')[1]
        }
        if (code) {
            this.getCompanyNew(code, 1)
            this.setState({ stockCode: code })
        }
    }
    showTabList(index) {
        let { tabList } = this.state
        tabList[index].show = true
        this.setState({ tabList })
    }
    hideTabList(index) {
        let { tabList } = this.state
        tabList[index].show = false
        this.setState({ tabList })
    }
    //切换股票，重新切换到股票的公司新闻
    changeCode(code) {
        this.getCompanyNew(code, 1)
        this.setState({ page: 1, index1: 0, index2: 2, title: '公司新闻', stockCode: code })
    }

    //公司新闻
    getCompanyNew(code, page) {
        this.setState({ status: 'loading' })
        const data = {
            page_no: page,
            page_count: 15,
            prod_code: code,
        }
        companyNew(data).then(res => {
            if (res.info) {
                this.setState({ status: "success" })
            } else if (res.data) {
                this.setState({ dataList: res.data, status: "success" })
            }


        })
    }
    //公司新闻上一页
    toPrePage() {
        let { page, stockCode } = this.state
        if (page === 1) {
            return
        }
        this.setState({ page: this.state.page - 1 }, () => {
            this.getCompanyNew(stockCode, page - 1)
        })
    }
    //公司新闻下一页
    toNextPage() {
        let { page, stockCode } = this.state
        this.setState({ page: this.state.page + 1 }, () => {
            this.getCompanyNew(stockCode, page + 1)
        })
    }

    //公司高管上一页
    toLeaderPrePage() {
        let { page, stockCode } = this.state
        if (page === 1) {
            return
        }
        this.setState({ page: this.state.page - 1 }, () => {
            this.getCompanySenior(stockCode, page - 1)
        })
    }
    //公司高管下一页
    toLeaderNextPage() {
        let { page, stockCode } = this.state
        this.setState({ page: this.state.page + 1 }, () => {
            this.getCompanySenior(stockCode, page + 1)
        })
    }


    //选择公司信息
    selectCompanyInfo(index1, index2) {
        const { stockCode, tabList } = this.state
        tabList[index1].show = false
        this.setState({ tabList })

        if (index1 === 0) {
            switch (index2) {
                case 0: {
                    this.setState({ index1: 0, index2: 0, title: "公司简介" })
                    this.getCompanyIntro()
                    break;
                }
                case 1: {
                    this.setState({ page: 1, index1: 0, index2: 1, title: "公司高管" })
                    this.getCompanySenior(stockCode, 1)
                    break;
                }
                case 2: {
                    this.setState({ page: 1, title: '公司新闻', index1: 0, index2: 2 }, () => {
                        this.getCompanyNew(stockCode, 1)
                    })
                    break;
                }
                case 3: {
                    this.setState({ page: 1, title: '公司公告', index1: 0, index2: 3 }, () => {
                        this.getCompanyNotice(stockCode, 1)
                    })
                    break;
                }
                case 4: {
                    this.setState({ page: 1, title: '公司研报', index1: 0, index2: 4 }, () => {
                        this.getCompanyReport(stockCode, 1)
                    })
                    break;
                }
                default: {
                    break;
                }
            }
        }
        if (index1 === 2) {
            switch (index2) {
                case 0: {
                    this.setState({ index1: 2, index2: 0, title: "证券交易" })
                    this.getStockTrade()
                    break;
                }
                case 1: {
                    this.setState({ index1: 2, index2: 1, title: "操盘必读" })
                    this.getHeadlines()
                    break;
                }
                default: {
                    break;
                }
            }
        }
        if (index1 === 3) {
            switch (index2) {
                case 0: {
                    this.setState({ page: 1, index1: 3, index2: 0, title: "分红送转" })
                    this.getDistribution(stockCode, 1)
                    break;
                }
                case 1: {
                    this.setState({ page: 1, index1: 3, index2: 1, title: "分红配股增发" })
                    this.getDistributionEc(stockCode, 1)
                    break;
                }
                default: {
                    break;
                }
            }
        }
        if (index1 === 5) {
            switch (index2) {
                case 0: {
                    this.setState({ index1: 5, index2: 0, title: "资金流向" })
                    this.getMoneyFlow()
                    break;
                }
                default: {
                    break;
                }
            }
        }



    }

    //公司简介
    getCompanyIntro() {
        const code = this.state.stockCode
        companyIntroduction({ en_prod_code: code }).then(res => {
            if (res === {}) {
                return
            }
            this.setState({ companyIntro: res.data })
        })

    }
    //公司高管
    getCompanySenior(code, page) {
        this.setState({ status: 'loading' })
        const data = {
            page_no: page,
            page_count: 2,
            en_prod_code: code,
        }
        companySenior(data).then(res => {
            if (res.info) {
                this.setState({ page: this.state.page - 1, status: "success" })
                message.info('没有数据了~')
                return
            }
            this.setState({ companyLeaderList: res.data, status: "success" })
        })
    }
    //公司通告
    getCompanyNotice(code, page) {
        this.setState({ status: 'loading' })
        const data = {
            page_no: page,
            page_count: 15,
            prod_code: code,
        }
        companyNotice(data).then(res => {
            if (res.info) {
                this.setState({ page: this.state.page - 1, status: "success" })
                message.info('没有数据了~')
                return
            }
            this.setState({ noticeList: res.data, status: "success" })
        })
    }
    //公司通告上一页
    toNoticePrePage() {
        let { page, stockCode } = this.state
        if (page === 1) {
            return
        }
        this.setState({ page: this.state.page - 1 }, () => {
            this.getCompanyNotice(stockCode, page - 1)
        })
    }
    //公司通告下一页
    toNoticeNextPage() {
        let { page, stockCode } = this.state
        this.setState({ page: this.state.page + 1 }, () => {
            this.getCompanyNotice(stockCode, page + 1)
        })
    }

    //公司研报
    getCompanyReport(code, page) {
        this.setState({ status: 'loading' })
        const data = {
            page_no: page,
            page_count: 15,
            prod_code: code,
            start_id: 0,
        }
        companyReport(data).then(res => {
            if (res.info) {
                this.setState({ page: this.state.page - 1, status: "success" })
                message.info('没有数据了~')
                return
            }
            this.setState({ reportList: res.data, status: "success" })
        })
    }

    //公司通告上一页
    toReportPrePage() {
        let { page, stockCode } = this.state
        if (page === 1) {
            return
        }
        this.setState({ page: this.state.page - 1 }, () => {
            this.getCompanyReport(stockCode, page - 1)
        })
    }
    //公司通告下一页
    toReportNextPage() {
        let { page, stockCode } = this.state
        this.setState({ page: this.state.page + 1 }, () => {
            this.getCompanyReport(stockCode, page + 1)
        })
    }

    //资金流向
    getMoneyFlow() {
        let { stockCode } = this.state
        moneyFlow({ stock: stockCode }).then(res => {
            if(res.date){
                this.setState({ flowData: res })
            }
          
        })
    }

    //证券交易
    getStockTrade() {
        let { stockCode } = this.state
        stockTrade({ en_prod_code: stockCode }).then(res => {
            this.setState({ stockTrade: res.data })
        })
    }

    //操盘必读
    getHeadlines() {
        let { stockCode } = this.state
        headlines({ en_prod_code: stockCode }).then(res => {
            this.setState({ headlines: res.data })
        })
    }
    //分红送转
    getDistribution(code, page) {
        this.setState({ status: 'loading' })
        const data = {
            page_no: page,
            page_count: 2,
            en_prod_code: code,
            start_id: ""
        }
        distribution(data).then(res => {
            if (res.info) {
                this.setState({ page: this.state.page - 1, status: "success" })
                message.info('没有数据了~')
                return
            }
            this.setState({ distributionList: res.data, status: "success" })
        })
    }
    toDistPrePage(){
        let { page, stockCode } = this.state
        if (page === 1) {
            return
        }
        this.setState({ page: this.state.page - 1 }, () => {
            this.getDistribution(stockCode, page - 1)
        })
    }
    toDistNextPage(){
        let { page, stockCode } = this.state
        this.setState({ page: this.state.page + 1 }, () => {
            this.getDistribution(stockCode, page + 1)
        })
    }
    //分红配股增发
    getDistributionEc(code,page){
        this.setState({ status: 'loading' })
        const data = {
            page_no: page,
            page_count: 2,
            en_prod_code: code,
            start_id: ""
        }
        distributionEc(data).then(res => {
            if (res.info) {
                this.setState({ page: this.state.page - 1, status: "success" })
                message.info('没有数据了~')
                return
            }
            this.setState({ distributionListEc: res.data, status: "success" })
        })
    }
    toDistEcPrePage(){
        let { page, stockCode } = this.state
        if (page === 1) {
            return
        }
        this.setState({ page: this.state.page - 1 }, () => {
            this.getDistributionEc(stockCode, page - 1)
        })
    }
    toDistEcNextPage(){
        let { page, stockCode } = this.state
        this.setState({ page: this.state.page + 1 }, () => {
            this.getDistributionEc(stockCode, page + 1)
        })
    }

    render() {
        const { status, tabList, title, dataList, index1, index2, companyIntro,
            companyLeaderList, noticeList, reportList, flowData, stockTrade,
            headlines, distributionList,distributionListEc
        } = this.state
        return (
            <div className="company-wrapper">
                {status === 'loading' ? <Loading /> : null}
                <div className="tab-header">
                    {tabList.map((item, index) => {
                        return (
                            <div className="tab-item" key={index}
                                onMouseEnter={this.showTabList.bind(this, index)}
                                onMouseLeave={this.hideTabList.bind(this, index)}
                            >
                                <div className="name">{item.name}</div>
                                {item.show ?
                                    <div className="tab-list">
                                        {item.list.map((tabItem, tabIndex) => {
                                            return (
                                                <div className="tab-list-item" key={tabIndex}
                                                    onClick={this.selectCompanyInfo.bind(this, index, tabIndex)}
                                                >{tabItem}</div>
                                            )
                                        })}
                                    </div> : null
                                }

                            </div>
                        )
                    })}
                </div>

                <div className="title">
                    {title}
                </div>
                {index1 === 0 && index2 === 2 ?
                    <div className="news-list">
                        {dataList.length === 0 ? <div className="no-data">暂无新闻</div> : null}
                        {dataList.map((item, index) => {
                            return (
                                <div className="data-item" key={index}>
                                    <div className="new-title">{item.title}</div>
                                    <div className="from-date">
                                        <span className="from">来源：{item.media}</span>
                                        <span className="data">[{item.date}]</span>
                                    </div>
                                </div>
                            )
                        })}
                        {
                            dataList.length > 0 ?
                                <div className="btn-change-page">
                                    <span className="btn pre" onClick={this.toPrePage.bind(this)}>上一页</span>
                                    <span className="btn next" onClick={this.toNextPage.bind(this)}>下一页</span>
                                </div> : null
                        }

                    </div> : null
                }
                {index1 === 0 && index2 === 0 ?
                    <CompangIntro info={companyIntro} /> : null
                }
                {index1 === 0 && index2 === 1 ?
                    <CompanySenior
                        personList={companyLeaderList}
                        toLeaderPrePage={this.toLeaderPrePage.bind(this)}
                        toLeaderNextPage={this.toLeaderNextPage.bind(this)}
                    /> : null
                }
                {index1 === 0 && index2 === 3 ?
                    <div className="news-list">
                        {noticeList.length === 0 ? <div className="no-data">暂无数据</div> : null}
                        {noticeList.map((item, index) => {
                            return (
                                <div className="data-item" key={index}>
                                    <div className="new-title">{item.title}</div>
                                    <div className="from-date">
                                        <span className="data">[{item.date}]</span>
                                    </div>
                                </div>
                            )
                        })}
                        {
                            noticeList.length > 0 ?
                                <div className="btn-change-page">
                                    <span className="btn pre" onClick={this.toNoticePrePage.bind(this)}>上一页</span>
                                    <span className="btn next" onClick={this.toNoticeNextPage.bind(this)}>下一页</span>
                                </div> : null
                        }

                    </div> : null
                }
                {index1 === 0 && index2 === 4 ?
                    <div className="news-list">
                        {reportList.length === 0 ? <div className="no-data">暂无数据</div> : null}
                        {reportList.map((item, index) => {
                            return (
                                <div className="data-item" key={index}>
                                    <div className="new-title">{item.title}</div>
                                    <div className="from-date">
                                        <span className="data">[{item.date}]</span>
                                    </div>
                                </div>
                            )
                        })}
                        {
                            reportList.length > 0 ?
                                <div className="btn-change-page">
                                    <span className="btn pre" onClick={this.toReportPrePage.bind(this)}>上一页</span>
                                    <span className="btn next" onClick={this.toReportNextPage.bind(this)}>下一页</span>
                                </div> : null
                        }

                    </div> : null
                }
                {index1 === 5 && index2 === 0 ? <MoneyFlow flowData={flowData} /> : null}
                {index1 === 2 && index2 === 0 ? <CompanyStockTrade info={stockTrade} /> : null}
                {index1 === 2 && index2 === 1 ? <CompangHeadline info={headlines} /> : null}
                {index1 === 3 && index2 === 0 ?
                    <CompangDistribute
                        distList={distributionList}
                        toDistPrePage={this.toDistPrePage.bind(this)}
                        toDistNextPage={this.toDistNextPage.bind(this)}
                    /> : null}
                {index1 === 3 && index2 === 1 ?
                    <CompangDistributeEc
                        distList={distributionListEc}
                        toDistEcPrePage={this.toDistEcPrePage.bind(this)}
                        toDistEcNextPage={this.toDistEcNextPage.bind(this)}
                    /> : null}

            </div>
        )
    }
}