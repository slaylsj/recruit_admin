import React from 'react';
import { Segment, Sidebar, Icon } from 'semantic-ui-react';
import { menuRoutes, sideMenus } from "./common/SideMenu";
import SideMenubar from './common/SideMenubar';
import { Route, Switch, Redirect } from "react-router-dom";
import Utils from '../utils/Utils';
import { inject, observer } from 'mobx-react';

@inject("sessionStore")
@observer
class Layout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            animation: 'slide along',  // overlay, push, scale down, uncover, slide along, slide out ...
            dimmed: false, // content영역 dimmed처리
            visible: true,
            sideMenuAnimation: 'off',
            contentsWidth: window.innerWidth - 300+"px"
        }
        this.sessionPing = () => this.props.sessionStore.sessionPing();
        this.intervalPing = null;
    }
    componentDidMount(){
        // 로그인정보가 없는경우.
        console.log("Layout componentDidMount " ,window.location.pathname);
        if( window.location.pathname !== "/" &&  window.location.pathname !== "/index"){
            if( localStorage.getItem("userID") === null || localStorage.getItem("userID") === ""){
                window.location.href = "/";
            };
        }
        this.intervalPing = setInterval(this.sessionPing, 300000); // sesseion유지를 위해 5분에 한번씩 ping 

        window.addEventListener('resize', this.handleAnimationResize);
    }

    // Resize Event
    handleAnimationResize = () => {
        const contentWidth = this.state.visible ?  window.innerWidth - 300+"px" : window.innerWidth - 50+"px";
        this.setState({ ...this.state, sideMenuAnimation: 'on', contentsWidth: contentWidth})
    }

    componentWillUnmount(){
        clearInterval(this.intervalPing);
    }
    
    handleAnimationChange = () => {
        const contentWidth = !this.state.visible ?  window.innerWidth - 300+"px" : window.innerWidth - 50+"px";
        this.setState({ ...this.state, visible: !this.state.visible, sideMenuAnimation: 'on', contentsWidth: contentWidth})
    }
    handleDimmedChange = (e, { checked }) => this.setState({ dimmed: checked })

    render(){
        const { animation, dimmed, visible, sideMenuAnimation, contentsWidth } = this.state

        return (
            <Sidebar.Pushable as={Segment} className="side-menu" >
                <SideMenubar animation={animation} direction={'left'} visible={visible} routes={sideMenus} />

                {visible ? <div className={`side-menu-btn show ${sideMenuAnimation}`} onClick={this.handleAnimationChange}><Icon name='triangle left' size='big'/></div> 
                  : <div className={`side-menu-btn hide ${sideMenuAnimation}`} onClick={this.handleAnimationChange}><Icon name='triangle right' size='big'/></div>
                }

                <Sidebar.Pusher dimmed={dimmed && visible}>
                    <Segment basic className="contents" style={{width: contentsWidth}}>
                        <Switch>
                            {menuRoutes.map((prop, key) => {
                            if (prop.pro) {
                                return null;
                            }
                            if (prop.redirect) {
                                return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
                            }
                            return prop.exact? <Route exact path={prop.path} component={prop.component} key={key} /> :  <Route path={prop.path} component={prop.component} key={key} /> 
                            })}
                        </Switch>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

export default Layout;