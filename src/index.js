import React ,{Component}from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './static/css/common.css'
import './css/iconfont.css';
import './css/common.css';
import 'antd/dist/antd.css';

import store from './store'
import { Provider } from 'react-redux'

import Routers from '../src/router/router';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
// import moment from 'moment';
import 'moment/locale/zh-cn';
import { addLocaleData, IntlProvider } from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';

import * as serviceWorker from './serviceWorker';
import zh_CN from './locale/zh_CN';
import zh_TW from './locale/zh_TW';
import en_US from './locale/en_US';
//如果浏览器没有自带intl，则需要在使用npm安装intl之后添加如下代码

const messages = {};
messages["en-US"] = en_US;
messages["zh-CN"] = zh_CN;
messages["zh-TW"] = zh_TW;
addLocaleData([...zh, ...en]);

class LocaleIndex extends Component {
    constructor(props) {
        super(props);
        // console.log(navigator.language);
        this.state = {
            locale: navigator.language.split('_')[0],
            messages: messages[navigator.language],
        };
        this.changeLanguage = this.changeLanguage.bind(this);
    }
    getChildContext() {
        return {
            changeLanguage: (language) => {
                this.changeLanguage(language)
            },
        };
    }
    render() {
        return (
            <IntlProvider
                locale={this.state.locale}
                messages={this.state.messages}>
                <LocaleProvider locale={zhCN}>
                    <Provider store={store}>
                        <Routers />
                    </Provider>
                </LocaleProvider>
            </IntlProvider>
        );
    }

    componentDidMount() {
        let language = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : navigator.language;
        this.changeLanguage(language);
    }
    changeLanguage(language) {
        switch (language) {
            case 'en-US':
                this.setState({
                    locale: 'en',
                    messages: en_US,
                });
                break;
            case 'zh-CN':
                this.setState({
                    locale: 'zh',
                    messages: zh_CN,
                });
                break;
            case 'zh-TW':
                this.setState({
                    locale: 'zh',
                    messages: zh_TW,
                });
                break;
            default:
                this.setState({
                    locale: 'en',
                    messages: en_US,
                });
                break;
        }
    }
}

LocaleIndex.childContextTypes = {
    changeLanguage: PropTypes.func.isRequired,
};

ReactDOM.render(
    <LocaleIndex/>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

