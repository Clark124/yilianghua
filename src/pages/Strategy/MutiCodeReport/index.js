import React, { Component } from 'react'
import './index.scss'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";

export default class Index extends Component {
    render() {
        const { datas } = this.props

        const { basicinfo, trade, month, year, curve } = datas

        let { ref_curve, target_curve, ref_name, target_name } = curve
        target_name = target_name.substring(0, 4)
        let data = []

        target_curve.forEach((item, index) => {
            let obj = {}
            obj.date = item[0]
            // obj.date = item[0].substring(0,10)
            obj[target_name] = Number(item[1])
            data.push(obj)
        })
        if (ref_curve) {
            ref_curve.forEach((item, index) => {
                data[index][ref_name] = Number(item[1])
            })
        }

        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: "fold",
            fields: [ref_name, target_name],
            // 展开字段集
            key: "types",
            // key字段
            value: "净值" // value字段
        });
        const cols = {
            date: {
                range: [0, 1],
                tickCount: 8,
            }
        };

        return (
            <div className="report-wrapper">
                <div className="container">
                    <div className="content">
                        <div className="content-item">
                            <div className="title">绩效报告</div>
                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {basicinfo.names.map((item, index) => {
                                            if (index > 1 && index < 9) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}

                                    </tr>
                                    <tr className="table-item">
                                        {basicinfo.values.map((item, index) => {
                                            if (index > 1 && index < 9) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {basicinfo.names.map((item, index) => {
                                            if (index > 8 && index <= 16) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}

                                    </tr>
                                    <tr className="table-item">
                                        {basicinfo.values.map((item, index) => {
                                            if (index > 8 && index <= 16) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {basicinfo.names.map((item, index) => {
                                            if (index > 16 && index <= 24) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}

                                    </tr>
                                    <tr className="table-item">
                                        {basicinfo.values.map((item, index) => {
                                            if (index > 16 && index <= 24) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {basicinfo.names.map((item, index) => {
                                            if (index > 24 && index <= 32) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}

                                    </tr>
                                    <tr className="table-item">
                                        {basicinfo.values.map((item, index) => {
                                            if (index > 24 && index <= 32) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {basicinfo.names.map((item, index) => {
                                            if (index > 32 && index <= 40) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}

                                    </tr>
                                    <tr className="table-item">
                                        {basicinfo.values.map((item, index) => {
                                            if (index > 32 && index <= 40) {
                                                return (
                                                    <td key={index}>{item}</td>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="content-item">
                            <div className="title">净值曲线</div>
                            <Chart height={400} data={dv} scale={cols} forceFit>
                                <Legend textStyle={{ fontSize: '14' }} marker="square" />
                                <Axis name="date" />
                                <Axis line={{ stroke: "#ccc" }} name="净值" />
                                <Tooltip crosshairs={{ type: "y" }} />
                                <Geom
                                    type="line"
                                    position="date*净值"
                                    size={2}
                                    color={["types", ['#3E6ECF', '#E5364F']]}
                                />
                            </Chart>
                        </div>

                        <div className="content-item">
                            <div className="title">月度总结</div>
                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {month.names.map((item, index) => {
                                            return (
                                                <td key={index}>{item}</td>
                                            )
                                        })}
                                    </tr>
                                    {month.list1.map((item, index) => {
                                        return (
                                            <tr className="table-item" key={index}>
                                                {item.map((value, valueIndex) => {
                                                    return (
                                                        <td key={valueIndex}>{value}</td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            <div className="title">年度总结</div>
                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {year.names.map((item, index) => {
                                            return (
                                                <td key={index}>{item}</td>
                                            )
                                        })}
                                    </tr>
                                    {year.list1.map((item, index) => {
                                        return (
                                            <tr className="table-item" key={index}>
                                                {item.map((value, valueIndex) => {
                                                    return (
                                                        <td key={valueIndex}>{value}</td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            <div className="title">交易记录</div>
                            <table className="table" cellPadding="0" cellSpacing="0">
                                <tbody className="t-body">
                                    <tr className="table-header">
                                        {trade.names.map((item, index) => {
                                            return (
                                                <td key={index}>{item}</td>
                                            )
                                        })}



                                    </tr>
                                    {trade.list1.map((item, index) => {
                                        return (
                                            <tr className="table-item" key={index}>
                                                {item.map((value, valueIndex) => {
                                                    return (<td className="trade-report" key={valueIndex}>{value}</td>)
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        )


    }
}