import React, { Component } from 'react'
import { message } from 'antd';
export default class CreatePool extends Component {
    constructor() {
        super()
        this.state = {
            text: ""
        }
    }
    onSubmit(){
        const {text} = this.state
        if(text.trim()===""){
            return
        }
        if(text.length>10){
            message.warning('不能超过10个字~')
            return 
        }
        this.props.createPool(text)
    }
    render() {
        return (
            <div className="create-pool-wrapper">
                <div className="create-pool">
                    <div className="title">新建股票池</div>
                    <div className="input-wrapper">
                        <span className="text">股票池名称：</span>
                        <input className="input" placeholder="不超过10个字" type="text"
                            value={this.state.text} onChange={e => this.setState({ text: e.target.value })} />
                    </div>
                    <div className="btn-wrapper">
                        <span className="btn cancel" onClick={() => this.props.cancelCreatePool()}>取消</span>
                        <span className="btn confirm" onClick={this.onSubmit.bind(this)}>确定</span>
                    </div>
                </div>
            </div>
        )
    }
}