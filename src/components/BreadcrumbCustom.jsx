/**
 * Created by hao.cheng on 2017/4/22.
 */
import React from 'react';
import { Breadcrumb, Switch, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import themes from '../style/theme';

import {changeThemeColor} from '../actions'

let ThemeColor = [
    {type: 'info', checked: false},
    {type: 'grey', checked: false},
    {type: 'danger', checked: false},
    {type: 'warn', checked: false},
    {type: 'white', checked: false},
];
//'pink','red','orange','green','cyan','blue','purple'
class BreadcrumbCustom extends React.Component {
    state = {
        switcherOn: false,
    };
    componentDidMount(){
        this.resetThemeColor(this.props.color);
    }
    switcherOn = () => {
        this.setState({
            switcherOn: !this.state.switcherOn
        })
    };
    resetThemeColor = (color)=>{
        ThemeColor.map((t, i) => {
            (t.type === color && (t.checked = !t.checked)) || (t.checked = false);
            return t;
        })
    }
    themeChange = (v) => {

        this.resetThemeColor(v.type);
        this.props.dispatch(changeThemeColor(v.type))
        
    };
    render() {

        const themesTag = ThemeColor.map((v, i) => (
            <div className="pull-left y-center mr-m mb-s" key={i}>
                <i className={`w-24 mr-s b-a ${v.type}`} />
                <Switch checked={v.checked} onChange={() => this.themeChange(v)} />
            </div>
        ));
         const theme =   themes['theme'+this.props.color];

         const background = theme?theme.header.background:'';

        // const first = <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item> || '';
        // const second = <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item> || '';
        return (
            <span>
                {/* <Breadcrumb style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item><Link to={'/app/dashboard/index'}>首页</Link></Breadcrumb.Item>
                        {first}
                        {second}
                </Breadcrumb> */}
                <div className={`switcher dark-white ${this.state.switcherOn ? 'active' : ''}`}>
                    <a className="sw-btn dark-grey" onClick={this.switcherOn}>
                        <Icon type="skin" className="text-white" title="换肤" />
                    </a>
                    <div style={{padding: '1rem'}} className="clear">
                        { themesTag }
                    </div>
                </div>
                <style>{`
                    ${this.props.color ?
                    `
                    .custom-theme {
                        // background: ${background} !important;
                        background: linear-gradient(to right,${background} 0,${background}90 100%) !important;
                        color: #fff !important;
                    }
                    
                    .custom-theme .ant-menu {
                        background: transparent !important;
                        color: #fff !important;
                    }
                    .custom-theme .ant-menu-item-group-title {
                        color: #fff !important;
                    }
                    .text-white{
                        background: -webkit-linear-gradient(left bottom, ${background} , ${background}); 
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    ` : ''
                    }
                `}</style>
            </span>
        )
    }
}
const mapStateToProps = state => {
    const {color } = state.reducer;
   
    return {color};
};

export default withRouter(connect(mapStateToProps)(BreadcrumbCustom));
