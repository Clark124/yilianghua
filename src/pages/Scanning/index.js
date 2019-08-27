import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';

import './index.scss'
import Header from '../../components/Header/index'
import Footer from '../../components/Footer/index'
import Create from './Create/index'
import List from './List/index'

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
                        <Route exact path="/scanning/create" component={Create} />
                        <Route exact path="/scanning/create/:id" component={Create} />
                        <Route exact path="/scanning/list" component={List} />
                        
                    </Switch>
                </div>
                <Footer />
            </div>
        )
    }
}