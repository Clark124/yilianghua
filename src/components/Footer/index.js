import React, { Component } from 'react'
import './index.scss'
import ylh_img from '../../assets/ylh.png'
import hcp_img from '../../assets/hcp.png'

export default class Footer extends Component {
    render() {
        return (
            <div className="footer-wrapper">
                <div className="footer">
                    <div className="footer-info">
                        <div className="link">
                            <div className="title">相关链接</div>
                            <div className="info">谱数科技 &nbsp;&nbsp;&nbsp;&nbsp;<a href="http://www.pushutech.com/site/index" target="_blank" style={{color:'#fff'}} rel="nofollow me noopener noreferrer">集金融技术服务、金融操盘技术与金融交易平台于一体</a></div>
                            <div className="info">练盘宝 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://www.pushutech.com/product/lpb/download" target="_blank" style={{color:'#fff'}} rel="nofollow me noopener noreferrer">你与大师只差一万盘训练，专业炒股训练工具与股民成长平台</a></div>
                            <div className="info">慧操盘 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://www.pushutech.com/product/hcp/download" target="_blank" style={{color:'#fff'}} rel="nofollow me noopener noreferrer">像高手一样炒股，专业操盘工具与盈利流程</a></div>
                        </div>
                        <div className="right">
                            <div className="contact">
                                <div className="title">联系我们</div>
                                <div className="info">QQ：3312543143</div>
                                <div className="info">邮箱：info@spd9.com</div>
                                <div className="info">电话：027－87001455</div>
                            </div>
                            <div className="attation">
                                <div className="title">关注易量化</div>
                                <img src={ylh_img} alt="" />
                            </div>
                            <div className="download">
                                <div className="title">下载易量化</div>
                                <div className="info">手机端“会操盘”</div>
                                <img src={hcp_img} alt="" />
                            </div>


                        </div>
                    </div>
                    <div className="mark">
                        <span className="company">©武汉谱数科技有限公司 鄂ICP备17022385</span> <span className="xieyi">用户协议</span> 风险提示：投资有风险，请自主决策。上述信息供交流使用，仅供参考，不对您构成任何投资建议，据此操作，风险自担。
                    </div>
                </div>
            </div>
        )
    }
}