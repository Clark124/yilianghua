import React, { Component } from 'react'
import { Chart, Geom, Axis, Tooltip } from 'bizcharts'

export default class MoneyFlow extends Component {
    render() {
        const { flowData } = this.props
        console.log(flowData)
        const { date, flow, margin } = flowData
        let chartData = []
        if (flow&&flow.netinflow3) {
            chartData = [
                { days: '3日', '资金流向': flow.netinflow3 },
                { days: '5日', '资金流向': flow.netinflow5 },
                { days: '10日', '资金流向': flow.netinflow10 },
                { days: '20日', '资金流向': flow.netinflow20 },
                { days: '30日', '资金流向': flow.netinflow30 },
                { days: '60日', '资金流向': flow.netinflow60 },
            ]
        }
        let chart2Data = margin
        if(margin.length>0){
            return (
                <div className="money-flow">
                    <div className="money-flow-title">
                        今日资金流向（万元）
                    </div>
                    <div className="data-list">
                        <div className="flow-data-item">
                            <span>主力流入：</span>
                            <span className="number">{date.inflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>主力流出：</span>
                            <span className="number">{date.outflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>主力净流入：</span>
                            <span className="number">{date.netinflow}</span>
                        </div>
                    </div>
                    <div className="data-list">
                        <div className="flow-data-item">
                            <span>大单流入：</span>
                            <span className="number">{date.biginflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>大单流出：</span>
                            <span className="number">{date.bigoutflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>大单净流入：</span>
                            <span className={date.biginflowrate >= 0 ? "number" : "number green"}>{date.biginflowrate}</span>
                        </div>
                    </div>
                    <div className="data-list">
                        <div className="flow-data-item">
                            <span>中单流入：</span>
                            <span className="number">{date.midinflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>中单流出：</span>
                            <span className="number">{date.midoutflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>中单净流入：</span>
                            <span className={date.midinflowrate >= 0 ? "number" : "number green"}>{date.midinflowrate}</span>
                        </div>
                    </div>
                    <div className="data-list">
                        <div className="flow-data-item">
                            <span>小单流入：</span>
                            <span className="number">{date.smallinflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>小单流出：</span>
                            <span className="number">{date.smalloutflow}</span>
                        </div>
                        <div className="flow-data-item">
                            <span>小单净流入：</span>
                            <span className={date.smallinflowrate >= 0 ? "number" : "number green"}>{date.smallinflowrate}</span>
                        </div>
                    </div>
                    <div className="money-flow-title">
                        多日资金流向 更新时间：{date.date}
                    </div>
                    <div className="chart-1">
                        <Chart padding="auto" height={300} data={chartData} forceFit>
                            <Axis name='days' />
                            <Axis name='资金流向' />
                            <Tooltip />
                            <Geom type='interval' position='days*资金流向' color={['资金流向', (value) => {
                                if (value > 0)
                                    return '#f55454';
                                else
                                    return 'green';
                            }]} />
                        </Chart>
                    </div>
                    <div className="money-flow-title">
                        融资融券余额曲线
                    </div>
                    <div className="chart-2">
                        <Chart height={300} data={chart2Data}  forceFit padding="auto">
                            <Axis name="date" />
                            <Axis line={{ stroke: "#ccc" }} name="marginbalance" />
                            <Tooltip />
                            <Geom
                                type="line"
                                position="date*marginbalance"
                                color='orange'
                                tooltip={['date*marginbalance', (date, marginbalance) => {
                                    return {
                                      name: '融资融券余额',
                                      title: date,
                                      value: marginbalance?marginbalance:""
                                    };
                                  }]}
                            />
                        </Chart>
                    </div>
    
                </div>
            )
        }else{
            return (
                <div style={{textAlign:"center",height:300,}}>暂无数据</div>
            )
        }

    }
}