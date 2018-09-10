/**
 * create by Algang 2018/09/02
 */

import React from 'react';
import { Timeline, Layout} from 'antd';
import PropTypes from 'prop-types'
import {uuidWithRandom} from '../utils';
const states = ['暂无轨迹信息','未知','在途中','已签收','问题件'];
class TimelineCustom extends React.Component{

    static propTypes = {
        data:PropTypes.object.isRequired

    }
    parseTraces = (Traces,isAccept)=>{
      let length = Traces.length-1;
      return  Traces.map((item,index)=>{

        const color = isAccept?'green':length==index?'red':'green';
        return <Timeline.Item color={color} key={uuidWithRandom()}>
            <div className="pb-m">
                <h3>{item.AcceptTime}</h3>
                <small>{item.AcceptStation}</small>
            </div>
        </Timeline.Item>
      
      });
    }
    render(){
        const {State,Traces} = this.props.data;
        const isAccept = 3==State?true:false;
        
        return(
            <Layout>
                    <div className="pb-m">
                        <h3>物流轨迹</h3>
                        <small>{states[parseInt(State)]}</small>
                    </div>
                    <Timeline>
                        {this.parseTraces(Traces,isAccept)}
                    </Timeline>
            </Layout>
        )
    }
}

export default TimelineCustom;