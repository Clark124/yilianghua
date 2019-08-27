import React, { Component } from 'react'

import './index.scss'
import index_img from './images/strategy_rank.jpg'
import index_img_2 from './images/strategy_rank2.jpg'
import { Pagination } from 'antd'
import { rankData, standardCurve } from '../../../serivce'

import Moment from 'moment'
import { Chart, Geom, Axis, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";
import Loading from '../../../components/Loading/index'

export default class Rank extends Component {
    constructor() {
        super()
        this.state = {
            tabItem: ['收益排行榜', '稳健排行榜', '昨日收益率', '最新上架'],
            tabIndex: 0,
            dataList: [],
            status: "",
            totalRow: 1,
            page: 1,

        }
    }
    componentWillMount() {
        if (this.props.location.state) {
            let type = this.props.location.state.type
            this.setState({ tabIndex: type }, () => this.getRankData(1))
        } else {
            this.getRankData(1)
        }


    }
    //切换
    changeTab(index) {
        this.setState({ tabIndex: index, page: 1 }, () => {
            this.getRankData(1)
        })
    }
    //获取排行榜数据
    getRankData(page) {
        const { tabIndex } = this.state
        let type = ''
        if (tabIndex === 0) {
            type = 'returnRatio'
        } else if (tabIndex === 1) {
            type = 'steady'
        } else if (tabIndex === 2) {
            type = 'daliy'
        } else if (tabIndex === 3) {
            type = 'createDate'
        }
        const data = {
            type,
            page_no: page,
            page_count: 10,
        }
        this.setState({ status: 'loading' })
        rankData(data).then(async res => {
            for (let i = 0; i < res.data.list.length; i++) {
                let item = res.data.list[i]
                if (item.capital_curve) {
                    let curve = JSON.parse(item.capital_curve)
                    let len = curve.length

                    const startTime = Moment(curve[0].date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                    const endTime = Moment(curve[len - 1].date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')

                    let standData = await this.getStandardData(startTime, endTime)

                    let datas = standData.map((item, index) => {
                        for (let i = 0; i < curve.length; i++) {
                            if (item.date === curve[i].date) {
                                item.value = Number(item.value.toFixed(2))
                                item.value1 = Number(curve[i].value.toFixed(2))
                                curve.splice(i, 1)
                            }
                        }
                        return item
                    })
                    res.data.list[i].capital_curve = datas
                }

            }

            this.setState({ dataList: res.data.list, totalRow: res.data.totalRow, status: "success" })

        })
    }
    //获取沪深300数据
    getStandardData(start, end) {
        return new Promise((resolve, reject) => {
            const data = {
                period: 6,
                code: '000300.SS',
                startTime: start,
                endTime: end,
            }
            standardCurve(data).then(res => {
                resolve(res.result)
            })
        })

    }

    onChangePage(e) {
        this.setState({ page: e })
        this.getRankData(e)
    }

    render() {
        const { status, tabItem, tabIndex, dataList, totalRow, page } = this.state
        return (
            <div className="rank-wrapper">
                <div className="tab-header">
                    <span>排行：</span>
                    {
                        tabItem.map((item, index) => {
                            return (
                                <span className={tabIndex === index ? "tab-item active" : 'tab-item'}
                                    key={index}
                                    onClick={this.changeTab.bind(this, index)}
                                >{item}</span>
                            )
                        })
                    }

                </div>
                <div className="data-list">
                    {dataList.map((item, index) => {
                        let data = []
                        if (item.capital_curve) {
                            let curveDatas = item.capital_curve
                            curveDatas.forEach((item, index) => {
                                let date = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                                let obj = {}
                                obj.date = date
                                obj['用户收益'] = item.value1
                                obj['沪深300'] = item.value
                                data.push(obj)
                            })
                        }

                        const ds = new DataSet();
                        const dv = ds.createView().source(data);

                        dv.transform({
                            type: "fold",
                            fields: ['用户收益', '沪深300'],
                            key: "types",
                            value: "收益率"
                        });
                        const cols = {
                            date: {
                                // range: [0, 1],
                                tickCount: 5,
                            }
                        };

                        return (
                            <div className="data-item" key={index}>
                                <div className="item-index">
                                    <img src={(page - 1) * 10 + index + 1 < 4 ? index_img : index_img_2} alt="" className="index-img" />
                                    <span className={(page - 1) * 10 + index + 1 < 4 ? "index first" : 'index'}>{(page - 1) * 10 + index + 1}</span>
                                </div>
                                <div className="content">
                                    <div className="stock-name" onClick={() => this.props.history.push(`/strategy/detail/${item.object_id}`)}>
                                        <span>{item.name}</span>
                                        <span></span>
                                    </div>
                                    <div className="info-list">
                                        <span>收益率</span>
                                        <span>年化收益</span>
                                        <span>一日收益</span>
                                        <span>本月收益</span>
                                        <span>最大回测</span>
                                        <span>上架时间</span>
                                    </div>
                                    <div className="info-data">
                                        <span>{item.return_ratio ? (item.return_ratio * 100).toFixed(2) : "--"}%</span>
                                        <span>{item.yearly_return_ratio ? (item.yearly_return_ratio * 100).toFixed(2) : "--"}%</span>
                                        <span>{item.daliy_return_ratio ? (item.daliy_return_ratio * 100).toFixed(2) : "--"}%</span>
                                        <span>{item.month_return_ratio ? (item.month_return_ratio * 100).toFixed(2) : "--"}%</span>
                                        <span>{item.MaxDD ? (item.MaxDD * 100).toFixed(2) : "--"}%</span>
                                        <span>{item.create_date.substring(0, 10)}</span>
                                    </div>
                                    <div className="intro">创建人：{item.nickname}</div>
                                    <div className="intro">策略介绍：{item.description ? item.description : '暂无介绍'}</div>
                                </div>
                                <div className="chart-wrapper">
                                    <Chart height={280} data={dv} scale={cols} forceFit animate={true}>
                                        <Axis name="date" />
                                        <Axis line={{ stroke: "#ccc" }} name="收益率" />
                                        <Tooltip crosshairs={{ type: "y" }} />
                                        <Geom
                                            type="line"
                                            position="date*收益率"
                                            size={2}
                                            color={["types", ['#3E6ECF', '#E5364F']]}
                                        />
                                    </Chart>
                                </div>
                            </div>
                        )
                    })}

                    {
                        dataList.length === 0 ?
                            <div className="no-data">
                                暂无数据
                            </div> : null
                    }

                </div>

                <div className="pagination-wrapper">
                    <Pagination defaultCurrent={1} current={page} total={totalRow} onChange={this.onChangePage.bind(this)} />
                </div>
                {status === 'loading' ? <Loading text="加载中..." /> : null}
            </div>
        )
    }
}