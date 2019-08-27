import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';

import './index.scss'
import Header from '../../components/Header/index'
import Footer from '../../components/Footer/index'
import Select from './Select/index'
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
                        <Route exact path="/selectStock" component={Select} />
                        <Route exact path="/selectStock/detail/:id" component={Select} />
                        <Route exact path="/selectStock/list" component={List} />
                    </Switch>
                </div>
                <Footer />
            </div>
        )
    }
}