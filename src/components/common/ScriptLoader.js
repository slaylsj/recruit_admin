import React from 'react';
import Script from 'react-load-script';
import PropTypes from 'prop-types'

class ScriptLoader extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            error : false
        } 
    }

    handleScriptCreate() {
        this.setState({ loading: false })
    }
    
    handleScriptError() {
        this.setState({ error: true })
    }
    
    handleScriptLoad() {
        this.setState({ loading: true })
    }

    render(){
        const { url, loading, errror } = this.props;
        return(
            <div>
                <Script
                    url={url}
                    onCreate={this.handleScriptCreate.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                    onLoad={this.handleScriptLoad.bind(this)}
                />
                { this.state.loading ? this.props.children : loading }
                { this.state.error ? errror : null }
            </div>
        )
    }
}

ScriptLoader.propTypes = {
    url: PropTypes.string,
    loading: PropTypes.node,
    error: PropTypes.node,
}

ScriptLoader.defaultProps = {
    loading: null,
    error: null,
}

export default ScriptLoader;