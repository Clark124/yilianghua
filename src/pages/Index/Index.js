import React, { Component } from 'react'
import Header from '../../components/Header/index'
import Footer from '../../components/Footer/index'
import { Carousel } from 'antd';
import './index.scss'
import banner_1 from '../../assets/banner_index_1.jpg'
import banner_2 from '../../assets/banner_index_2.jpg'
import index_1 from '../../assets/home_index1.jpg'
import index_2 from '../../assets/home_index2.jpg'
import index_3 from '../../assets/home_index3.jpg'
import index_4 from '../../assets/home_index4.jpg'
import decorate from '../../assets/decorate_16.jpg'
import more from '../../assets/More_23.jpg'
import figure1 from '../../assets/figure5.jpg'
import figure2 from '../../assets/figure6.jpg'
import figure3 from '../../assets/figure7.jpg'
import figure4 from '../../assets/figure8.jpg'
import { getRanking } from '../../serivce'

export default class Index extends Component {
    constructor() {
        super()
        this.state = {
            steadyList: [],
            profitList: [],
        }
    }
    componentWillMount() {
        this.onGetRankingSteady()
        this.onGetRankingProfit()
    }
    onGetRankingSteady() {
        const data = {
            type: 'steady',
            page_no: 1,
            page_count: 5
        }
        getRanking(data).then(res => {
            this.setState({ steadyList: res.data.list })
        })
    }
    onGetRankingProfit() {
        const data = {
            type: 'returnRatio',
            page_no: 1,
            page_count: 5
        }
        getRanking(data).then(res => {
            this.setState({ profitList: res.data.list })
        })
    }
    toUser() {
        console.log(123)
    }
    toIntroduce() {
        window.location.href = 'http://www.ezquant.cn/quant/operation/manual'
    }
    render() {
        const { steadyList, profitList } = this.state
        return (
            <div className="home">
                <Header history={this.props.history} />
                <Carousel autoplay>
                    <div onClick={this.toUser.bind(this)}>
                        <img src={banner_1} alt="" className="banner" />
                    </div>
                    <div onClick={this.toIntroduce.bind(this)}>
                        <img src={banner_2} alt="" className="banner" />
                    </div>
                </Carousel>
                <div className="container">
                    <ul className="strategy-list">
                        <li className="strategy-item">
                            <img src={index_1} alt="" />
                            <div className="message">
                                <h3 className="title">策略研究</h3>
                                <p>积木式搭建策略</p>
                                <p>财智编码写策略</p>
                            </div>
                        </li>
                        <li className="strategy-item">
                            <img src={index_2} alt="" />
                            <div className="message">
                                <h3 className="title">选股分析</h3>
                                <p>智能选股</p>
                                <p>K线形态选个</p>
                            </div>
                        </li>
                        <li className="strategy-item">
                            <img src={index_3} alt="" />
                            <div className="message">
                                <h3 className="title">市场扫描</h3>
                                <p>全市场策略扫描</p>
                                <p>时刻抓住交易机会</p>
                            </div>
                        </li>
                        <li className="strategy-item">
                            <img src={index_4} alt="" />
                            <div className="message">
                                <h3 className="title">策略展示</h3>
                                <p>精选策略一键跟单</p>
                                <p>实时接收策略信号</p>
                            </div>
                        </li>
                    </ul>

                    <div className="rank-wrapper">
                        <div className="title">策略排行榜</div>
                        <div className="rank">
                            <div className="left">
                                <img src={decorate} className="decorate" alt="" />
                                <div className="rank-title">
                                    <span>稳健排行榜</span>
                                    <img src={more} alt="" className="more" onClick={()=>this.props.history.push({pathname:'/strategy/rank',state:{type:1}})}/>
                                </div>
                                <ul className="">
                                    <li className="title-name">
                                        <span className="name">托管名称</span>
                                        <span className="profit">收益率</span>
                                        <span className="huice">最大回测</span>
                                        <span className="price">价格</span>
                                    </li>
                                    {steadyList.map((item, index) => {
                                        return (
                                            <li className="strategy-item" key={index} onClick={()=>this.props.history.push('/strategy/detail/'+item.object_id)}>
                                                <span className="name">{item.name}</span>
                                                <span className="profit">{(item.return_ratio * 100).toFixed(2)}%</span>
                                                <span className="huice">{(item.MaxDD * 100).toFixed(2)}</span>
                                                <span className="price">{item.price === 0 ? '免费' : item.price}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="right">
                                <img src={decorate} className='decorate' alt="" />
                                <div className="rank-title">
                                    <span>收益排行榜</span>
                                    <img src={more} alt="" className="more" onClick={()=>this.props.history.push({pathname:'/strategy/rank',state:{type:0}})}/>
                                </div>
                                <ul className="">
                                    <li className="title-name">
                                        <span className="name">托管名称</span>
                                        <span className="profit">收益率</span>
                                        <span className="huice">最大回测</span>
                                        <span className="price">价格</span>
                                    </li>
                                    {profitList.map((item, index) => {
                                        return (
                                            <li className="strategy-item" key={index} onClick={()=>this.props.history.push('/strategy/detail/'+item.object_id)}>
                                                <span className="name">{item.name}</span>
                                                <span className="profit">{(item.return_ratio * 100).toFixed(2)}%</span>
                                                <span className="huice">{(item.MaxDD * 100).toFixed(2)}</span>
                                                <span className="price">{item.price === 0 ? '免费' : item.price}</span>
                                            </li>
                                        )
                                    })}

                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="supply-wrapper">
                        <div className="title">易量化为您提供</div>
                        <ul className="figure-list">
                            <li className="figure-item">
                                <img src={figure1} alt="" />
                                <div className="figure-title">海量大数据</div>
                                <div className="intro">基于2007至今完整的<br />Level-2数据</div>
                            </li>
                            <li className="figure-item">
                                <img src={figure2} alt="" />
                                <div className="figure-title">海量大数据</div>
                                <div className="intro">支持基于日级、分钟级精确回测<br />快速获得回测结果</div>
                            </li>
                            <li className="figure-item">
                                <img src={figure3} alt="" />
                                <div className="figure-title">海量大数据</div>
                                <div className="intro">独创的“财智码”，基于历史<br />和实时的数据<br />建立预警、策略和指标</div>
                            </li>
                            <li className="figure-item">
                                <img src={figure4} alt="" />
                                <div className="figure-title">海量大数据</div>
                                <div className="intro">提供准确、实时的沪深A股<br />创业板模拟交易</div>
                            </li>

                        </ul>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}