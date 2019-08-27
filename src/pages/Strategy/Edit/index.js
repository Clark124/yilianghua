import React, { Component } from 'react'
import './index.scss'
import "./edit_strategy.module.css";


import CodeMirror from '@uiw/react-codemirror';
import { Select, message } from 'antd'
import AddFuncDialog from './Components/AddFuncDialog/AddFuncDialog';
import AddStrategyDialog from './Components/AddStrategyDialog/AddStrategyDialog';
import { compileStrategy, saveStrategy, strategyDetail } from '../../../serivce'

import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/ambiance-mobile.css';
import 'codemirror/theme/base16-dark.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/colorforth.css';

const { Option } = Select;

export default class Edit extends Component {
    constructor() {
        super()
        this.state = {
            code: '',
            theme: 'monokai',
            themeList: ['monokai', '3024-day', 'abcdef', 'ambiance', 'ambiance-mobile', 'base16-dark', 'base16-light', 'bespin', 'blackboard', 'cobalt', 'colorforth'],
            strategy_type: '',
            fncDialog: false,
            straDialog: false,
            paramList: [],
            compileInfo: "", //编译信息
            strategyTitle: "", //策略标题
            strategyDiscibe: "",//策略描述

        }
    }
    componentWillMount() {
        const strategyId = this.props.match.params.id
        if (strategyId) {
            strategyDetail({ id: strategyId }).then(res => {
                const { description, express, name, params } = res.result
                this.setState({
                    code: express,
                    strategyDiscibe: description,
                    strategyTitle: name,
                    paramList: params.map(item => {
                        let type = item.type
                        if (type === 'float') {
                            type = 0
                        } else if (type === 'int') {
                            type = 1
                        } else if (type === 'string') {
                            type = 2
                        }
                        return {
                            name: item.name,
                            discibe: item.description,
                            type: type,
                            defaultValue: item.def_value
                        }
                    })
                })
            })
        }
    }
    //编辑器修改事件
    editorChange({ doc }) {
        if (this.state.strategy_type !== 'build') {
            this.setState({ code: doc.getValue() });
        }
    }
    editorFocus(cm) {
        this.cm = this.cm === null ? cm : this.cm;
    }
    selectTheme(value) {
        this.setState({ theme: value })
    }

    showDialog(dialog) {
        this.setState({ [dialog]: true });
    }

    hideDialog(dialog) {
        this.setState({ [dialog]: false });

    }
    //插入函数
    funcInsert(value) {
        this.setState({ fncDialog: false, code: this.state.code + value + '\n' })
    }

    //插入策略
    straInsert(express) {
        this.setState({ straDialog: false, code: express + '\n' })
    }
    //添加一行参数
    addOneParam() {
        let obj = {
            name: "",
            discibe: "",
            type: 0,
            defaultValue: ""
        }
        let { paramList } = this.state
        paramList.push(obj)
        this.setState({ paramList })
    }

    isInt(str) {
        var reg = /^(-|\+)?\d+$/;
        return reg.test(str);
    }
    isFloat(str) {
        if (this.isInt(str)) return false;
        var reg = /^(-|\+)?\d+\.\d*$/;
        return reg.test(str);
    }
    //点击确认
    addAllParams() {
        let { paramList, code } = this.state
        // if (paramList.length === 0) {
        //     message.error('请添加参数~')
        //     return
        // }
        let isWriteAll = true
        let codeString = "//======此区域请勿编辑=========//\n"
        paramList.forEach(item => {
            if (item.name === "" || item.defaultValue === "") {
                message.error('参数需输入完整~')
                isWriteAll = false
                return
            }
            let type = ""
            if (item.type === 0) {
                type = 'float'
            } else if (item.type === 1) {
                type = 'int'
            } else if (item.type === 2) {
                type = 'string'
            }
            let code = 'param ' + type + ' ' + item.name + '={' + item.name + '}\n'
            codeString = codeString + code
        })
        if (!isWriteAll) {
            return
        }
        codeString = codeString + '//==========================//\n'

        if (code.indexOf('//==========================//\n') > 0) {
            let arr = code.split('//==========================//\n')
            if (arr.length > 1) {
                codeString = codeString + arr[1]
            }
        } else {
            codeString = codeString + code
        }
        this.setState({ code: codeString })
    }

    //输入参数名称
    inputParamName(e, index) {
        let { paramList } = this.state
        paramList[index].name = e.target.value
        this.setState({ paramList })
    }
    //输入名称说明
    inputDiscrib(e, index) {
        let { paramList } = this.state
        paramList[index].discibe = e.target.value
        this.setState({ paramList })
    }
    //选择参数类型
    selectParamType(e, index) {
        let { paramList } = this.state
        paramList[index].type = e
        this.setState({ paramList })
    }
    //输入默认值
    inputDefaultValue(e, index) {
        let { paramList } = this.state
        paramList[index].defaultValue = e.target.value
        this.setState({ paramList })
    }
    //删除参数操作
    deleteParam(index) {
        let { paramList } = this.state
        paramList = paramList.filter((item, itemIndex) => {
            return index !== itemIndex
        })
        this.setState({ paramList }, () => {
            this.addAllParams()
        })
    }

    //点击编译
    onCompile(callback) {
        let { paramList, code } = this.state
        let strategy_params = {}
        if (paramList.length > 0) {
            paramList.forEach(item => {
                strategy_params[item.name] = item.defaultValue
            })
        }
        const data = {
            strategy_params: JSON.stringify(strategy_params),
            express: code
        }
        compileStrategy(data).then(res => {
            if (!res.error) {
                if (callback && (typeof callback === 'function')) {
                    callback()
                    return
                }
                message.success('策略编译成功！')
                this.setState({ compileInfo: "策略编译成功！" })
            } else {
                let info = '错误：' + res.line + '行，' + res.column + '列<br/>' + res.error
                this.setState({ compileInfo: info })
                message.error('策略编译失败！')
            }
        })

    }
    //点击保存
    saveStrategy(type) {
        const { strategyTitle, paramList, code, strategyDiscibe } = this.state
        if (!strategyTitle.trim()) {
            message.error('请输入策略名称~')
            return
        }
        this.onCompile(() => {
            const token = localStorage.getItem("token")
            let param = paramList.map((item) => {
                let type = item.type
                if (type === 0) {
                    type = 'float'
                } else if (type === 1) {
                    type = 'int'
                } else if (type === 2) {
                    type = 'string'
                }
                return {
                    name: item.name,
                    type,
                    def_value: item.defaultValue,
                    description: item.discibe
                }
            })
            const strategyId = this.props.match.params.id
            let data = {}
            if (type && type === 'edition') {
                data = {
                    token,
                    type: 'strategy',
                    name: strategyTitle,
                    description: strategyDiscibe,
                    express: code,
                    module: 'quant',
                    param: param.length === 0 ? "" : JSON.stringify(param),
                    strategy_id: strategyId ? strategyId : "",
                    flag: true
                }
            } else {
                data = {
                    token,
                    type: 'strategy',
                    name: strategyTitle,
                    description: strategyDiscibe,
                    express: code,
                    module: 'quant',
                    param: param.length === 0 ? "" : JSON.stringify(param),
                    strategy_id: strategyId ? strategyId : "",
                }
            }

            saveStrategy(data).then(res => {
                if (res.success) {
                    message.success('保存成功！')
                    this.setState({ compileInfo: "" })
                    setTimeout(() => {
                        this.props.history.push('/strategy/edit/' + res.id)
                    }, 1000)
                } else if (res.fail) {
                    message.error('策略名称重复！')
                }
            })

        })

    }

    //跳转回测页面
    toBackTest() {
        const strategyId = this.props.match.params.id
        if (!strategyId) {
            message.error('请先保存策略，才能开始回测')
            return
        }
        this.props.history.push('/strategy/backtest/' + strategyId)
    }

    render() {
        const { theme, themeList, paramList, compileInfo, strategyDiscibe, strategyTitle } = this.state
        return (
            <div className="strategy-edit-wrapper">
                <AddFuncDialog visible={this.state.fncDialog} onCancel={this.hideDialog.bind(this)} onInsert={this.funcInsert.bind(this)} />
                <AddStrategyDialog visible={this.state.straDialog} onCancel={this.hideDialog.bind(this)} onInsert={this.straInsert.bind(this)} />
                <div className="nav-title">
                    <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                    <span>></span>
                    <span onClick={()=>this.props.history.push('/strategy/list')}>我的策略</span>
                    <span>></span>
                    <span className="current">策略编辑器</span>
                </div>
                <div className="edit-wraper">
                    <div className="title">编辑器</div>
                    <div className="edit-body">
                        <div className="edit-code">
                            <div className="select-theme">
                                <span className="title-text">策略名称：</span>
                                <input placeholder="请输入策略名称" onChange={(e) => this.setState({ strategyTitle: e.target.value })} value={strategyTitle} />
                                <span className="title-text">主题：</span>
                                <Select value={theme} onChange={this.selectTheme.bind(this)} style={{ width: 150 }}>
                                    {themeList.map((item, index) => {
                                        return (
                                            <Option value={item} key={index}>{item}</Option>
                                        )
                                    })}
                                </Select>
                            </div>
                            <div className="code-mirror-wrapper">
                                <CodeMirror
                                    height='450px'
                                    value={this.state.code}
                                    onChange={this.editorChange.bind(this)}
                                    onFocus={this.editorFocus.bind(this)}
                                    options={{
                                        theme: this.state.theme,
                                        keyMap: 'sublime',
                                        mode: 'jsx',
                                        readOnly: this.state.strategy_type === 'build' ? 'nocursor' : false
                                    }}
                                />
                            </div>

                            <div className="operate-btn">
                                <span onClick={this.onCompile.bind(this)}>编译</span>
                                <span onClick={this.saveStrategy.bind(this)}>保存</span>
                                <span onClick={this.saveStrategy.bind(this, 'edition')}>保存版本</span>
                                <span onClick={this.toBackTest.bind(this)}>回测</span>
                                <span onClick={() => { this.showDialog('fncDialog') }} >添加函数</span>
                                <span onClick={() => { this.showDialog('straDialog') }}>导入策略</span>

                            </div>
                        </div>
                        <div className="param-list-wrapper">
                            <div className="param-head">
                                <span>参数列表</span>
                                <div>
                                    <span className="btn" onClick={this.addOneParam.bind(this)}>添加一行</span>
                                    <span className="btn" onClick={this.addAllParams.bind(this)}>确认</span>
                                </div>
                            </div>
                            <div className="param-names">
                                <span>参数名称</span>
                                <span>名称说明</span>
                                <span>类型</span>
                                <span>默认值</span>
                                <span>操作</span>
                            </div>
                            <div className="param-list">
                                {paramList.map((item, index) => {
                                    let type = item.type
                                    if (type === 0) {
                                        type = 'float'
                                    } else if (type === 1) {
                                        type = 'int'
                                    } else if (type === 2) {
                                        type = 'string'
                                    }
                                    return (
                                        <div className="param-names" key={index}>
                                            <input type="text" value={item.name} onChange={(e) => this.inputParamName(e, index)} />
                                            <input type="text" value={item.discibe} onChange={(e) => this.inputDiscrib(e, index)} />
                                            <Select style={{ width: 68 }} value={type} onChange={(e) => this.selectParamType(e, index)}>
                                                <Option value={0} >float</Option>
                                                <Option value={1} >int</Option>
                                                {/* <Option value={2} >string</Option> */}
                                            </Select>
                                            <input type={item.type === 2 ? "text" : "number"} value={item.defaultValue} onChange={(e) => this.inputDefaultValue(e, index)} />
                                            <span className="delete" onClick={this.deleteParam.bind(this, index)}>删除</span>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                    <div className="info-log" dangerouslySetInnerHTML={{ __html: compileInfo }}>
                    </div>
                </div>
                <div className="discrib">
                    <div className="title">策略描述：</div>
                    <textarea className="edit-discrib"
                        value={strategyDiscibe}
                        onChange={(e) => this.setState({ strategyDiscibe: e.target.value })}
                    />


                </div>
            </div>
        )
    }
}