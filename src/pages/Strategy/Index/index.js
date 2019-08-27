import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';

import './index.scss'
import Header from '../../../components/Header/index'
import Footer from '../../../components/Footer/index'
import Edit from '../Edit/index'
import BackTest from '../BackTest/index'
import BackTestReport from '../BackTestReport/index'
import List from '../List/index'
import Rank from '../Rank/index'
import Detail from '../Detail/index'
import DetailReport from '../DetailReport/index'
import BackTestList from '../BackTestList/index'
import Compare from '../compare/index'
import Version from '../Version/index'
import Create from '../Create/index'

export default class Index extends Component {
    constructor() {
        super()
        this.state = {

        }
    }
    componentWillMount() {

    }

    render() {
        return (
            <div className="wrapper">
                <Header history={this.props.history} />
                <div className="container">
                    <Switch>
                        <Route exact path="/strategy/create" component={Create} />
                        <Route exact path="/strategy/edit" component={Edit} />
                        <Route exact path="/strategy/edit/:id" component={Edit} />
                        <Route exact path="/strategy/backtest/:id" component={BackTest} />
                        <Route exact path="/strategy/backtest/list/:id" component={BackTestList} />
                        <Route exact path="/strategy/backtest/report/:id" component={BackTestReport} />
                        <Route exact path="/strategy/list" component={List} />
                        <Route exact path="/strategy/rank" component={Rank} />
                        <Route exact path="/strategy/detail/:id" component={Detail} />
                        <Route exact path="/strategy/detail/report/:id" component={DetailReport} />
                        <Route exact path="/strategy/compare/:idList" component={Compare} />
                        <Route exact path="/strategy/version/:id" component={Version} />
                    </Switch>
                </div>
                <Footer />
            </div>
        )
    }
}