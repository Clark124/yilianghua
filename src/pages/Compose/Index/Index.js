import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';

import './index.scss'
import Header from '../../../components/Header/index'
import Footer from '../../../components/Footer/index'
import Rank from '../Rank/index'
import Detail from '../ComposeDetail/index'
import Create from '../Create/index'
import MyCompose from'../MyCompose/index'
import Edit from '../Edit/index'

export default class Index extends Component {
    constructor() {
        super()
        this.state = {
            profitIndex: 0,
        }
    }
    componentWillMount() {

    }
    onChangeTab(index){
        this.setState({headerIndex:index})
    }
    render() {
        return (
            <div className="wrapper">
                <Header history={this.props.history} />
                <div className="container">
                    <Switch>
                        <Route exact path="/compose/rank" component={Rank} />
                        <Route exact path="/compose/rank/detail/:id" component={Detail} />
                        <Route exact path="/compose/create" component={Create} />
                        <Route exact path="/compose/mine" component={MyCompose} />
                        <Route exact path="/compose/edit/:id" component={Edit} />
                    </Switch>
                </div>
                <Footer />
            </div>
        )
    }
}