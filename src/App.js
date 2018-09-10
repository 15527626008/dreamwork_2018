import React, { Component } from 'react';
import { Layout, notification, Icon} from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import DashBoard from './components/dashboard/DashBoard';
const { Content, Footer } = Layout;

class App extends Component {
  state = {
    collapsed: true,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  
  
  render() {
    
    return (
      <Layout>
          <SiderCustom collapsed={this.state.collapsed} />
          <Layout style={{flexDirection: 'column'}}>
              
              <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed}/>
              <Content style={{ margin: '24px 16px 0',overflow: 'initial',flex: '1 1 0' }}>
                  <DashBoard/>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                DreamWork Design OpenSource ©{new Date().getFullYear()} Created by ShuGang Liu, Email: 863209181@qq.com
              </Footer>
          </Layout>
          
      </Layout>
    );
  }
}

export default App;
