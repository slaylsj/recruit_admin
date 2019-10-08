import PropTypes from 'prop-types';
import React from 'react';
import { Image, Icon, Menu, Sidebar, Accordion } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import Utils from '../../utils/Utils';
import { inject, observer} from 'mobx-react';

@inject("loginStore")
@observer
class SideMenubar extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            activeIndex: -1 ,
            activeSubIndex : -1
        }
        this.logoutProcess = (params, fCallback) => this.props.loginStore.logoutProcess(params, fCallback);
    }

    componentDidMount(){
        // URL로 바로 접속 시 side menu 처리.
        if( window.location.pathname !== "/"){
            let nData = {};
            this.props.routes.forEach(data => {
                if(data.path === window.location.pathname) nData = data;
                data.child.forEach(cdata => {
                    if(cdata.path === window.location.pathname){
                        nData = cdata;
                        nData.pId = data.id;
                    }
                });
            })
            const pId = typeof nData.pId === "undefined" ? nData.id : nData.pId;
            this.setState({ ...this.state, activeIndex: pId, activeSubIndex : nData.id })
        }
    }

    handleMenuClick = (e, titleProps) => {
        const { index } = titleProps
        // const { activeIndex } = this.state
        // const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ ...this.state, activeIndex: index, activeSubIndex : '' })
    }

    handleSubMenuClick = (e, titleProps) => {
        const { index } = titleProps
        this.setState({ activeSubIndex: index })
    }

    handleLogOut = () => {
        const login_token = localStorage.getItem("login_token") !== null ? localStorage.getItem("login_token") : "";
        const params = {
            "sID": "logout",
            "sPW": "logout",
            "btoken": 0,
            "sCToken": login_token,
            "sIP": this.props.loginStore.clientIP,
            "sMacAddress": "B8:97:5A:EF:8E:F0"
        };
        this.logoutProcess(params, (data) => {
            Utils.removeToken();
            window.location.href = "/";
        });
    }

    render(){
        const { animation, visible, routes } = this.props;
        const { activeIndex, activeSubIndex } = this.state;
        return(
            <Sidebar
                as={Menu}
                animation={animation}
                direction={'left'}
                icon='labeled'
                vertical
                visible={visible}
                className="left-menu"
                // width='thin'
                // className="left-menu"
            >
                <div className="sub-side-top">
                    <Image src='/img/common/logo.png' size='small' centered/>
                    <p>채용 관리자 시스템</p>
                    <p><b>{localStorage.getItem("userNm")}</b>님 안녕하세요.</p>
                </div>

                <Accordion as={Menu} vertical>
                    { routes.map((prop, key) => {
                        const childMenu = prop.child.map((cprop, ckey) => {
                            return <Menu.Item as={ Link } to={cprop.path} key={`link_${ckey}`} active={activeSubIndex === cprop.id} index={cprop.id} className="menu-sub-item" onClick={this.handleSubMenuClick}> {cprop.name}</Menu.Item>
                        });
                        return (prop.child.length > 0 ? 
                                <Menu.Item className="menu-item" active={activeIndex === prop.id} key={`menu_${key}`}>
                                    <Accordion.Title active={activeIndex === key} index={prop.id} onClick={this.handleMenuClick} className="menu-title">
                                        <Icon name={prop.icon}/> {prop.name}   { prop.child.length > 0 ? <Icon name='dropdown' /> : null }
                                    </Accordion.Title>
                                    { prop.child.length > 0 ? <Accordion.Content active={activeIndex === prop.id}>{childMenu}</Accordion.Content> : null }
                                </Menu.Item> 
                            :
                                <Menu.Item as={ Link } to={prop.path} active={activeIndex === prop.id} className="menu-item link" key={`menu_${key}`}>
                                    <Accordion.Title active={activeIndex === prop.id} index={prop.id} onClick={this.handleMenuClick} className="menu-title">
                                        <Icon name={prop.icon}/> {prop.name}  
                                    </Accordion.Title>
                                </Menu.Item>)
                    })}

                    {/* <Menu.Item as='a' className="menu-item">
                        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick} className="menu-title">
                            <Icon name='group'/> 채용공고관리  <Icon name='dropdown' />
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 1}>
                            <Menu.Item className="menu-sub-item"> 공고 관리</Menu.Item>
                            <Menu.Item className="menu-sub-item"> 공고 등록</Menu.Item>
                        </Accordion.Content>
                    </Menu.Item>
                    <Menu.Item as='a' className="menu-item">
                        <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick} className="menu-title">
                            <Icon name='wordpress forms' /> 채용절차관리 
                        </Accordion.Title>
                    </Menu.Item> */}
                </Accordion>
                
                {/* 로그아웃 */}
                <Menu.Item className="menu-item menu-logout" key={'menu_logout'}>
                    <Accordion.Title onClick={this.handleLogOut} className="menu-title">
                        <Icon name={"power off"}/> 로그아웃
                    </Accordion.Title>
                </Menu.Item> 
            </Sidebar>
        )
    }
}
  
SideMenubar.propTypes = {
    animation: PropTypes.string,
    visible: PropTypes.bool,
}
  
export default SideMenubar;