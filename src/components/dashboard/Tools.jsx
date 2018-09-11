/**
 * create by Algang 2018/08/28
 */
import React from 'react';
import { Row, Col,Tag, Card, Icon  ,Spin,Layout,Popconfirm,Tabs,Breadcrumb} from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import expressCompany from '../../resource/express.json';
import {randomNum,checkCharacter,uuidWithRandom,hideNum,getNowFormatDate} from '../../utils';
import NumericInput from '../NumericInput';
import TimelineCustom from '../TimelineCustom';
import { expressInfoChange } from '../../actions';
const TabPane   = Tabs.TabPane;
const ColorArr  = ['pink','orange','green','cyan','blue','purple'];
function handleChange(value) {
    console.log(`selected ${value}`);
  }
  
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
function log(e) {
    console.log(e);
}
let code        = '';
let dataBase    = null;

class Tools extends React.Component{
    state = {
        tabPosition: 'right',
        tabName:'',
        value:'',
        loading:false,
        express:this.props.express
    }
    changeTabPosition = (tabPosition) => {
        this.setState({ tabPosition });
    }
    handleChange(tag, checked) {
        const { CN,EN } = tag;
                    code= EN;
        this.setState({ tabName: CN });
    }
   
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
            console.log('Received values of form: ', values);
            }
        });
    }
    praseTagElem = (tags)=>{

     return Object.keys(tags).map(key=>(
        <div style={{margin:5}} key={uuidWithRandom()}>
            <strong>{key}</strong>
            <div>
                {tags[key].map(item => (
                <Tag
                    style={{margin:5}}
                    key={item.EN}
                    color={ColorArr[randomNum(ColorArr.length)]}
                    onClick={()=>this.handleChange(item)}
                >
                    {checkCharacter(item.CN)?item.CN:item.EN+item.CN}
                </Tag>
                ))}
            </div>
        </div>
     ))
    }
    onChange = (value) => {
        this.setState({ value });
    }
    /**
     * @param value 输入框的快递单号 
     * 
     */
    onSearch = (value) => {
        if(!code){
            this.props.showInfo('请先选择快递公司，如果快递公司未知，系统会根据快递单号进行判断属于哪一家快递公司',3,1);
        }
        
        let requestData = {};
        requestData.OrderCode       = value;
        requestData.ShipperCode     = code;
        requestData.LogisticCode    = value;
        
        this.setState({loading:true},this.doPost(requestData));
        //this.setState({loading:true},this.props.dispatch(loadExpressInfo(escape(JSON.stringify(requestData)))));
    }
    doPost = (requestData,ShipperName=this.state.tabName)=>{
        this.props.jsonp(this.props.source,escape(JSON.stringify(requestData)),'callback',(data)=>{

            let obj = null;
            //判断数据返回成功
            if(data.status) { 
                let res = data.data;
                console.log(res);
                if(requestData.ShipperCode){
                    if(res.Success){

                        dataBase = res;
                   
                        obj = {};
                        obj.LogisticCode = dataBase.LogisticCode
                        obj.ShipperCode  = dataBase.ShipperCode
                        obj.ShipperName  = ShipperName
                        obj.State        = dataBase.State
                        obj.IsRefresh    = false;
                        if(res.Traces.length){
                            obj.Traces       = dataBase.Traces[dataBase.Traces.length-1]
                        }else{
                            obj.Traces       = {AcceptStation:dataBase.Reason,AcceptTime:getNowFormatDate()}
                        }
                    }else{
                        this.props.showInfo(res.Reason,3,2);
                    }
                }else{

                    const {Shippers,Code} = res;

                    if( '100' === Code){
                        
                        Shippers.map(item=>{
                            let {ShipperCode,ShipperName} = item;
                            
                            requestData.ShipperCode = ShipperCode;
                           
                            this.doPost(requestData,ShipperName);
                        });
                    }
                }
            }else{
                this.props.showInfo(data.msg,3,2);
            }
            if(obj){
                let express    = this.state.express || {};
                          
                express[obj.LogisticCode] = obj;
                // if(dataBase.State < 3){
                   
                // }else{
                //     delete express[LogisticCode];
                // }
                this.setState({express,loading:false});
                this.props.dispatch(expressInfoChange(express))
            }
            //隐藏正在加载图标
            if(!obj&&this.state.loading){
                this.setState({loading:false});
            }
        });
    }
    confirm = (key)=>{
        let express    = this.state.express || {};
       
        delete express[key]
        this.setState({express})

        this.props.dispatch(expressInfoChange(express))
    }
    cancel = ()=>{
       
    }
    cardToolMenu= (key)=>{
      return  <Popconfirm title="确定删除这条记录吗?" onConfirm={()=>this.confirm(key)} onCancel={()=>this.cancel()} okText="确定" cancelText="取消">
                    <Icon type="delete" className={'text-danger'} />
             </Popconfirm>
    }
    onRefesh = (key)=>{
        let express = this.state.express;
        express[key].IsRefresh = true;

        let requestData = {};
        requestData.OrderCode       = express[key].LogisticCode;
        requestData.ShipperCode     = express[key].ShipperCode;
        requestData.LogisticCode    = express[key].LogisticCode;

        this.setState({express},this.doPost(requestData,express[key].ShipperName))
    }
    getRandomNum = (length)=>{
       
       return ColorArr[randomNum(length)];
    }
    render(){
    
        // Only show error after a field is touched.
        let length = ColorArr.length;
        const tagElem = expressCompany.commonly_used.map(item=>(
            <Tag style={{margin:15,fontSize:13}} color={this.getRandomNum(length)} key={item.EN} onClick={()=>this.handleChange(item)}>
                {checkCharacter(item.CN)?item.CN:item.EN+item.CN}
            </Tag>
        
        ));
        const tagState = this.state.tabName?
        <Breadcrumb style={{ margin: 15 }}>
            <Breadcrumb.Item>已选择</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.tabName}</Breadcrumb.Item>
        </Breadcrumb>:'';
        // <Tag style={{margin:15}} color="red" closable onClose={log}>
        // <span><Icon type="exclamation-circle"/>&nbsp;请选择快递公司后查询,如快递公司未知系统会根据快递单号进行判断属于哪一家快递公司</span>
        // </Tag>
        const container = dataBase?<TimelineCustom data={dataBase}/>:'';
        //显示历史记录
        const expressHistory = this.state.express?Object.keys(this.state.express).reverse().map(key=>(
            <Col span="8" key={uuidWithRandom()}>
                <Card style={{height:'192px'}}>
                    <div className="pb-m">
                        <h2>{hideNum(key)}</h2>
                        <small>{this.state.express[key].ShipperName}</small>
                    </div>
                    <span className="card-tool">
                        
                        {this.state.express[key].State<3?<a href='javascript:void(0);'><Icon type="sync" onClick={()=>this.onRefesh(key)} className={'text-info'}/></a>:<small>已签收</small>}
                        &nbsp;<a href='javascript:void(0);'>{this.cardToolMenu(key)}</a>
                    </span>
                    <Spin size='small' spinning={this.state.express[key].IsRefresh}>
                            <h3>{this.state.express[key].Traces.AcceptTime}</h3>
                            <small>{this.state.express[key].Traces.AcceptStation}</small>
                    </Spin>
                </Card>
            </Col>
        )):'';
        
        return(
            <Layout>
                <Tabs tabPosition={this.state.tabPosition}>
                    <TabPane tab="常用" key="1">
                        {tagElem}
                    </TabPane>
                    <TabPane tab="国内" key="2">
                    <Layout 
                      style={{ overflowY: 'auto' ,height:300}}      
                    >{this.praseTagElem(expressCompany.domestic)}</Layout></TabPane>
                    <TabPane tab="国外" key="3">
                    <Layout 
                      style={{ overflowY: 'auto' ,height:300}}      
                    >{this.praseTagElem(expressCompany.foreign)}</Layout>
                    </TabPane>
                    <TabPane tab="转运" key="4">
                    <Layout 
                      style={{ overflowY: 'auto' ,height:300}}      
                    >{this.praseTagElem(expressCompany.transshipment)}</Layout>
                    </TabPane>
                </Tabs>
                {tagState}
                <Layout
                    style={{margin:15}}
                >
                    
                    <Row type="flex" gutter={0} justify="center">
                        <Col className="gutter-row" md={20}>
                            <NumericInput value={this.state.value} onChange={this.onChange} onSearch={this.onSearch} />   
                        </Col>    
                    </Row>
                </Layout>
                <Layout>
                    <div>
                        <Spin spinning={this.state.loading}>
                            <Row type="flex" gutter={0} style={{margin:15,padding:15}} justify="center">
                                <Col className="gutter-row" md={20}>
                                    {container}
                                </Col>
                            </Row>
                        </Spin>
                    </div>
                </Layout>
               {expressHistory.length?<Layout>
                    <div style={{ background: '#ECECEC', padding: '15px' }}>
                        <Row>
                            {expressHistory}
                        </Row>
                    </div>
                </Layout>:''} 
            </Layout>
        )

    }
}
const mapStateToProps = state => {
    const {color,express } = state.reducer;
   
    return {color,express};
};

export default withRouter(connect(mapStateToProps)(Tools));