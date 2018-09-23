
import React, { Component } from 'react'
import { SLOGAN } from '../helper/constants'
import ShareComponent from './ShareComponent'
import { Row, Button, Col, Jumbotron } from 'react-bootstrap'
import logo from '../assets/hype_logo_white.png'
import btc from '../assets/btc2.png'
import StarfieldAnimation from 'react-starfield-animation'

// import ReactRain from 'react-rain-animation';
// import "react-rain-animation/lib/style.css";

class Landing extends Component {
    render() {
        return (
            <div className="landing-content">
                {/* <ReactRain numDrops="12" /> */}
                {/* <StarfieldAnimation
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      /> */}
                <div className="jumbo-padding">
                    <Row>
                        <Col md={8}>

                            <img src={logo} width="400" />
                            <p className='header-text'>
                                {SLOGAN}
                            </p>

                            <ShareComponent/>
                            <p>
                                <Button bsStyle="success" href="/dashboard" className="start-button">Discover Projects</Button>
                            </p>
                        </Col>

                        <Col md={4}>
                        <img src={btc} className='hero-image'/>
                            {/* <iframe src="https://giphy.com/embed/LukAHGCMfxMbK" width="360" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe> */}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Landing;