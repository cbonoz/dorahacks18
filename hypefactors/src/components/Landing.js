
import React, { Component } from 'react'
import { SLOGAN } from '../helper/constants'
import { Row, Button, Col, Jumbotron } from 'react-bootstrap'
import logo from '../assets/hype_logo.png'

class Landing extends Component {
    render() {
        return (
            <div className="landing-content">
                <div className="jumbo-padding">
                <Row>
                    <Col md={8}>

                        <img src={logo} width="400"/>
                        <p className='header-text'>
                            { SLOGAN }
  </p>
                        <p>
                            <Button bsStyle="success" href="/dashboard" className="start-button">Get Started</Button>
                        </p>
                    </Col>

                    <Col md={4}>
                        <iframe src="https://giphy.com/embed/LukAHGCMfxMbK" width="360" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                    </Col>
                </Row>
</div>
            </div>
        );
    }
}

export default Landing;