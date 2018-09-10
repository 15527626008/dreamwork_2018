/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import { Row, Col, Card, Timeline, Icon ,Layout,Tabs,message} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import routes from '../../routes/config';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Routes from '../../routes';

let   jsonp     = require('../../utils/jsonp.js');
const {menus}   = routes;
const TabPane   = Tabs.TabPane;

class DashBoard extends React.Component{

    constructor(){
        super()
    }
    
    renderMenuItem = item =>(
        <TabPane tab={<Link to={item.route || item.key}><span style={{fontSize:16}}><Icon type={`${item.icon}`} className={`${item.className}`} />{item.title}</span></Link>}  key={item.key}></TabPane>
    )
    callback= (key) => {
        console.log(key);
    }
    
    /**
     * 顶部信息提示
     * @param msg :提示消息
     * @param lastTime :消息持续时间(默认为5秒)
     * @param level :消息提示等级 1、提示 2、警告 3、错误 默认 成功
     */
    info = (msg,lastTime = 5,level) => {

        switch(level){
            case 1: 
                message.info(msg,lastTime);
                break;
            case 2:
                message.warning(msg,lastTime);
                break;
            case 3:
                message.error(msg,lastTime);
                break;
            default:
                message.success(msg,lastTime);
        }
        
    };
    render(){

        const tabMenu = menus.map(item=>
            this.renderMenuItem(item)
        );
        const location = this.props.location;
    
        return(
            <div className="gutter-example button-demo">
                <BreadcrumbCustom/>
                <Row type="flex" gutter={10} justify="center">
                    <Col  className="gutter-row" md={12}>
                        <Tabs activeKey={`${location.pathname}`}  onChange={this.callback}>
                            {tabMenu}
                        </Tabs>
                        <div className="gutter-box">
                       
                            <Routes showInfo={this.info} jsonp={jsonp}/>
                            
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = state => {
    const { users,repos  } = state.entities;
    return {users,repos};
};
export default withRouter(connect(mapStateToProps)(DashBoard));