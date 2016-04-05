/**
 * Created by chenchaochao on 16/4/2.
 */
import React, { PropTypes, Component } from 'react'
import { render } from 'react-dom'
import classnames from 'classnames'
import '../../../css/index.scss'

class Light extends Component{
    render(){
        let color = this.props.light.color;
        return(
            <div className="traffic-light">
            <span className={classnames('light',color)} />
            </div>
        )
    }
}

Light.propTypes = {
    light: PropTypes.object.isRequired
}

Light.defaultProps = {
    light : {color:'red',time:'4'}
}

export default Light