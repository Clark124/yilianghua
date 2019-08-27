import React, { Component } from 'react'
import search_icon from '../../../../assets/search_icon.jpg'
import { Link } from 'react-router-dom';
// import { Modal } from 'antd'

export default class Search extends Component {
    constructor() {
        super()
        this.state = {
            searchText: ""
        }
    }
    onSearch() {
        const { searchText } = this.state
        this.props.searchStrategy(searchText)
    }
    render() {
        const { searchText } = this.state
        const tabIndex = this.props.tabIndex
        return (
            <div className="tab-search">
                <div className="search">
                    <input type="text" className="input" placeholder="请输入要搜索的策略名称"
                        onChange={(e) => this.setState({ searchText: e.target.value })}
                        value={searchText}
                    />
                    <img src={search_icon} className="search-icon" onClick={this.onSearch.bind(this)} alt="" />
                </div>
                {tabIndex === 1 ?
                    <div className="btn-wrapper">
                        <span className="btn"><Link to="/strategy/create">搭建择时策略</Link></span>
                        <span className="btn"><Link to="/strategy/edit">新建策略</Link></span>
                    </div> : null
                }
                {tabIndex === 2 ?
                    <div className="btn-wrapper">
                        <span className="btn"><Link to="/strategy/backtest/0">添加托管策略</Link></span>
                    </div> : null
                }
                {tabIndex === 3 || tabIndex === 4 || tabIndex === 5 ?
                    <div className="btn-wrapper">
                        <span className="btn"><Link to="/strategy/rank">更多策略</Link></span>
                    </div> : null
                }

            </div>
        )

    }
}