import React, { Component } from 'react'
import './index.scss'
import { strategyCompare } from '../../../serivce'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import Moment from 'moment'

export default class Compare extends Component {
    constructor() {
        super()
        this.state = {
            dataList: []
        }
    }
    componentWillMount() {
        const idList = this.props.match.params.idList
        strategyCompare({ id: idList }).then(res => {
            // console.log(res)
            let arr1 = res[0]
            let arr2 = res[1]
            arr1.forEach(item => {
                item.type = '策略1'

            })
            arr2.forEach(item => {
                item.type = '策略2'

            })

            let arr = [...arr1, ...arr2]
            arr = arr.map(item => {
                item.date = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                item.value = Number(item.value.toFixed(2))
                return item
            })
            this.setState({ dataList: arr })
        })
    }

    render() {
        const { dataList } = this.state
        const cols = {
            date: {
                // range: [0, 1],
                tickCount: 8,
            }
        };
        return (
            <div className="strategy-compare-wrapper">
                <div className="nav-title">
                    <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                    <span>></span>
                    <span onClick={()=>this.props.history.push('/strategy/list')}>我的策略</span>
                    <span>></span>
                    <span className="current">绩效对比</span>
                </div>
                <div style={{ background: '#fff', marginTop: 10, marginBottom: 30, height: 450 }}>
                    <Chart height={400} data={dataList} scale={cols} forceFit>
                        <Legend textStyle={{ fontSize: '14' }} marker="square" />
                        <Axis name="date" />
                        <Axis line={{ stroke: "#ccc" }} name="value" />
                        <Tooltip crosshairs={{ type: "y" }} />
                       
                        <Geom
                            type="line"
                            position="date*value"
                            size={2}
                            color={"type"}
                            // shape={"smooth"}
                        />

                    </Chart>
                </div>
            </div>
        )
    }
}