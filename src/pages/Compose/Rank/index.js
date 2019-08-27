import React, { Component } from 'react'
import './index.scss'
import banner from '../../../assets/banner.png'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import icon_cx from '../../../assets/cx.png'
import icon_xp from '../../../assets/xp.png'
import { Pagination } from 'antd';
import { compostList, todayProfit, monthProfit } from '../../../serivce'
import Loading from '../../../components/Loading/index'

export default class Rank extends Component {
    constructor() {
        super()
        this.state = {
            status:"",
            style: ['不限', '小盘', '次新', '价格', '成长', '择时', '趋势'],
            styleIndex: 0,
            order: ['实盘年华', '实盘收益', '一季收益', '近一月收益', '历史最大回测', '上架日期'],
            orderIndex: 0,
            dataList: [], //组合列表
            page: 1,  //当前页
            total_page: 1, //总页数
            total_size: 1, //列表总数量
            todayProfitList: [],//今日收益排行
            monthProfitList: [], //当月收益排名
        }
    }
    componentWillMount() {
        this.onCompostList(1)
        this.onTodayProfit()
        this.onMonthProfit()
    }
    //组合列表
    onCompostList(page) {
        const data = {
            page,
            size: 9
        }
        this.setState({ status: 'loading' })
        compostList(data).then(res => {
            let dataList = res.data.map((item, index) => {
                item.type = 0
                let stocks300 = JSON.parse(item.stocksThreeHundredRate)
                item.yieldRateLines = item.yieldRateLines?item.yieldRateLines:[]
                item.profit_datas = item.yieldRateLines.map((value,index) => {
                    if(stocks300){
                        return {
                            date: value.dataTime,
                            '实盘收益率': value.rate,
                            '沪深300':stocks300.result[index]?Number(stocks300.result[index].value.toFixed(2)):""
                        }
                    }else{
                        return {
                            date: value.dataTime,
                            '实盘收益率': value.rate,
                        }
                    }
                })
                return item
            })
            this.setState({ dataList, total_page: res.total_page, total_size: res.total_size ,status: 'success'})
        }).catch(err=>{
            console.log(err)
            this.setState({ status: 'success' })
        })
    }
    //今日收益排名
    onTodayProfit() {
        todayProfit({}).then(res => {
            this.setState({ todayProfitList: res })
        })
    }
    //当月收益排名
    onMonthProfit() {
        monthProfit({}).then(res => {
            this.setState({ monthProfitList: res })
        })
    }
    //选择风格
    onSelectStyle(index) {
        this.setState({ styleIndex: index })
    }
    //选择排序
    onSelectOrder(index) {
        this.setState({ orderIndex: index })
    }
    onChangePage(e) {
        this.setState({ page: e })
        this.onCompostList(e)
    }
    //跳转至详情页面
    toDetail(id) {
        this.props.history.push('/compose/rank/detail/'+id)
    }
    render() {
        const {status, dataList, page, total_size, todayProfitList, monthProfitList } = this.state
        // const {style,styleIndex,order,orderIndex} = this.state
        return (
            <div className="rank-wrapper">
                {status === 'loading' ? <Loading /> : null}
                <div className="header-link">
                    <span>组合</span>
                    <span className="arrow">></span>
                    <span className="title">组合排行</span>
                </div>
                <img className="banner" src={banner} alt="" />
                {/* <div className="select-wrapper">
                    <span className="title">风格：</span>

                    {style.map((item, index) => {
                        return (
                            <span className={styleIndex === index ? "select-item active" : "select-item"}
                                onClick={this.onSelectStyle.bind(this, index)}
                                key={index}>{item}</span>
                        )
                    })}

                </div>
                <div className="select-wrapper">
                    <span className="title">排序：</span>
                    {order.map((item, index) => {
                        return (
                            <span className={orderIndex === index ? "select-item active" : "select-item"}
                                onClick={this.onSelectOrder.bind(this, index)}
                                key={index}>{item}</span>
                        )
                    })}
                </div> */}
                <div className="compose-container">
                    <div className="compose-list">
                        {dataList.map((item, index) => {
                            const ds = new DataSet();
                            const dv = ds.createView().source(item.profit_datas);
                            dv.transform({
                                type: "fold",
                                fields: ['沪深300', '实盘收益率'],
                                // 展开字段集
                                key: "types",
                                // key字段
                                value: "收益率" // value字段
                            });
                            const cols = {
                                date: {
                                    range: [0, 1],
                                }
                            };
                            return (
                                <div className="compose-item" key={index}>
                                    {item.type === 1 ? <img className="type" src={icon_cx} alt="" /> : null}
                                    {item.type === 2 ? <img className="type" src={icon_xp} alt="" /> : null}
                                    <div className="header">
                                        <span className="title">{item.comboName}</span>
                                        <span className="username">{item.userName}</span>
                                    </div>
                                    <div className="chart">
                                        <Chart height={170} data={dv} scale={cols} forceFit padding="auto">
                                            <Legend textStyle={{ fontSize: '14' }} marker="square" position={'top'} />
                                            <Axis name="date" visible={false} />
                                            <Axis name="收益率" visible={false} />
                                            <Tooltip crosshairs={{ type: "y" }} />
                                            <Geom
                                                type="line"
                                                position="date*收益率"
                                                size={2}
                                                color={["types", ['#FF6060', '#0098FD']]}
                                            />
                                        </Chart>
                                    </div>
                                    <div className="info-list">
                                        <div className="info">
                                            <div className="text">实盘收益</div>
                                            <div>{item.totalYieldRate}%</div>
                                        </div>
                                        <div className="info">
                                            <div className="text">实盘天数</div>
                                            <div>{item.day}天</div>
                                        </div>
                                        <div className="info">
                                            <div className="text">实盘年化</div>
                                            <div>{item.yearYieldRate}%</div>
                                        </div>
                                    </div>
                                    <div className="compose-bottom">
                                        <div>
                                            <span className="price">{item.payPrice}元</span><span className="per-month">/月</span>
                                        </div>

                                        <span className="price-up">资金上限{item.initFund / 10000}万</span>
                                        <span className="detail-btn" onClick={this.toDetail.bind(this,item.id)}>详情</span>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="page-wrapper">
                            <Pagination current={page} total={total_size} pageSize={9} onChange={this.onChangePage.bind(this)} />
                        </div>

                    </div>

                    <div className="right">
                        <div className="title">今日投资收益</div>
                        <div className="list-wrapper">
                            <div className="list">
                                {todayProfitList.map((item, index) => {
                                    if (index < 5) {
                                        return (
                                            <div className="list-item" key={index} onClick={this.toDetail.bind(this,item.id)}>
                                                <span className="name">{index + 1}. {item.name}</span>
                                                <span className={item.yieldRate>=0?"profit":"profit green"}>{item.yieldRate}%</span>
                                            </div>
                                        )
                                    } else {
                                        return null
                                    }
                                })}


                            </div>
                        </div>
                        <div className="list-wrapper-1">
                            <div className="list">
                                {todayProfitList.map((item, index) => {
                                    if (index > 4) {
                                        return (
                                            <div className="list-item" key={index} onClick={this.toDetail.bind(this,item.id)}>
                                                <span className="name">{index + 1}. {item.name}</span>
                                                <span className={item.yieldRate>=0?"profit":"profit green"}>{item.yieldRate}%</span>
                                            </div>
                                        )
                                    } else {
                                        return null
                                    }
                                })}
                            </div>
                        </div>
                        <div className="title">当月战报</div>
                        <div className="list-wrapper-1">
                            <div className="list">
                                {monthProfitList.map((item, index) => {
                                    if(index<5){
                                        return (
                                            <div className="list-item" key={index} onClick={this.toDetail.bind(this,item.id)}>
                                                <span className="name">{index + 1}. {item.name}</span>
                                                <span className={item.yieldRate>=0?"profit":"profit green"}>{item.yieldRate}%</span>
                                            </div>
                                        )
                                    }else{
                                        return null
                                    }
                                    
                                })}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        )
    }
}