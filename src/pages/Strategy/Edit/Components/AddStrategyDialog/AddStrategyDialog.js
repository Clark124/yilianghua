import React, { Component } from 'react';
import { Modal, Checkbox } from 'antd';
import { fetchStategyList ,strategyDetail} from '../../../../../serivce'
import './AddStrategyDialog.scss';
class AddStrategyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strategyList: [],
      strategyIndex: 0,
      title: '我的策略',
    };
  }
  componentWillMount() {
    this.fetchStrategyist()
  }
  fetchStrategyist() {
    const token = localStorage.getItem('token')
    fetchStategyList({ flag: true, token }).then(res => {
      this.setState({ strategyList: res.result.strategy })
    })
  }


  cancel() {
    this.props.onCancel('straDialog');
  }
  insert() {
    const {strategyList,strategyIndex} = this.state 
    strategyDetail({id:strategyList[strategyIndex].id}).then(res=>{
      const result = res.result.express
      this.props.onInsert(result)
    })
  }

  selectStrategy(index){
    this.setState({strategyIndex:index})
  }


  render() {
    const { strategyList ,strategyIndex} = this.state;

    return (
      <Modal
        visible={this.props.visible}
        title={this.state.title}
        onCancel={this.cancel.bind(this)}
        width="640px"
        onOk={this.insert.bind(this)}
        centered
        closable
      >
        <div className="add-strategy-wrapper">
          <table className="table">
            <tbody>
              <tr>
                <td>策略名称</td>
                <td>类型</td>
                <td>最后修改时间</td>
                <td>选择</td>
              </tr>
              {
                strategyList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.type==='build'?"搭建":"编写"}</td>
                      <td>{item.update_date}</td>
                      <td>
                        <Checkbox onChange={this.selectStrategy.bind(this,index)} checked={strategyIndex===index}/>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }
}

export default AddStrategyDialog;
