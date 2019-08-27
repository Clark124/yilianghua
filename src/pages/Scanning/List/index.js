import React, { Component } from 'react'
import './index.scss'
import { Tabs, Pagination } from 'antd'
import Trust from './components/Trust'
import Single from './components/Single'
import { trustScanList, singleScanList } from '../../../serivce'
import Loading from '../../../components/Loading/index'

const TabPane = Tabs.TabPane;

export default class List extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            tabIndex: 1,
            totalRow: 0,
            dataList: [],
            page:1,
        }
    }
    componentWillMount() {
        if(this.props.location.state&&this.props.location.state.type){
            if(this.props.location.state.type===0){
                this.setState({tabIndex:1})
                this.getTrustList(1)
            }else{
                this.setState({tabIndex:2})
                this.getSingleScanList(1)
            }
        }else{
            this.getTrustList(1)
        }
       
    }
    changeTab(e) {
        this.setState({ tabIndex: parseInt(e), page: 1, dataList: [] }, () => {
            if (parseInt(e) === 1) {
                this.getTrustList(1)
            } else if (parseInt(e) === 2) {
                this.getSingleScanList(1)
            }
        })
    }
    //托管扫描策略列表
    getTrustList(page) {
        const data = {
            token: localStorage.getItem('token'),
            page_no: page,
            page_count: 10,
        }
        this.setState({ status: 'loading' })
        trustScanList(data).then(res => {
            const { total_row, scanning } = res.result
            this.setState({
                dataList: scanning,
                totalRow: total_row,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }
    //单次扫描列表
    getSingleScanList(page) {
        const data = {
            token: localStorage.getItem('token'),
            page_no: page,
            page_count: 10,
        }
        this.setState({ status: 'loading' })
        singleScanList(data).then(res => {
            const { total_row, scanning } = res.result
            this.setState({
                dataList: scanning,
                totalRow: total_row,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }

    //分页
    onChangePage(e) {
        const { tabIndex } = this.state
        if (tabIndex === 1) {
            this.getTrustList(e)
        } else if (tabIndex === 2) {
            this.getSingleScanList(e)
        }
        this.setState({ page: e })
    }


    changeNotice(sys, wx, index) {
        let { dataList } = this.state
        dataList[index].system_notice = sys
        dataList[index].weixin_notice = wx
        this.setState({ dataList })
    }

    suspendWork(index) {
        let { dataList } = this.state
        if (dataList[index].status === '1') {
            dataList[index].status = '0'
        } else {
            dataList[index].status = '1'
        }
        this.setState({ dataList })
    }

    //刷新数据
    refreshData() {
        const { page, tabIndex } = this.state
        if (tabIndex === 1) {
            this.getTrustList(page)
        } else if (tabIndex === 2) {
            this.getSingleScanList(page)
        } 
    }
    render() {
        const { status, totalRow, tabIndex } = this.state
        return (
            <div className="scan-list-wrapper">
                <div className="nav-title">
                    <span >市场扫描</span>
                    <span>></span>
                    <span className="current">扫描列表</span>
                </div>
                <div className="list-title">
                    <span>扫描策略列表（托管扫描策略列表选中某一行显示扫描结果）：</span>
                    <span className="create-btn" onClick={()=>this.props.history.push('/scanning/create')}>新建市场扫描</span>
                </div>
                <div className="tab-wrapper">
                    <Tabs type="card" onChange={this.changeTab.bind(this)} activeKey={tabIndex.toString()}>

                        <TabPane tab="托管扫描策略列表" key="1">
                            <Trust {...this.state} {...this.props}
                                changeNotice={this.changeNotice.bind(this)}
                                suspendWork={this.suspendWork.bind(this)}
                                refresh={this.refreshData.bind(this)}
                            />
                        </TabPane>
                        <TabPane tab="单次扫描列表" key="2">
                            <Single {...this.state} {...this.props} 
                              refresh={this.refreshData.bind(this)}
                            />
                        </TabPane>


                    </Tabs>
                </div>

                <div className="pagination-wrapper">
                    <Pagination defaultCurrent={1} total={totalRow} onChange={this.onChangePage.bind(this)} />
                </div>
                {status === 'loading' ? <Loading text="加载中..." /> : null}
            </div>
        )
    }
}