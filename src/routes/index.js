/**
 * Created by 叶子 on 2017/8/13.
 */
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import AllComponents from '../components'
import routesConfig from './config';



class Routes extends Component{
    
    render(){
        const {showInfo,jsonp} = this.props;
        return(
            <Switch>
                {
                     Object.keys(routesConfig).map(key => 
                        routesConfig[key].map(r => {
                            const route = r => {
                                const Component = AllComponents[r.component];
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        component={props => 
                                            
                                            <Component {...props} showInfo={showInfo} jsonp={jsonp} source={r.source}/>
                                        }
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r));
                        })
                    )
                }
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}

export default Routes