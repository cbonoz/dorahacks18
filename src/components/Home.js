import React, { Component } from 'react'
import { Grid, Row, Col, ListGroupItem, ListGroup, Button } from 'react-bootstrap'
import { getCachedCoins, getCoins, getCoinInfo, getCoinPrices } from '../helper/api'
import helper from '../helper/helper'
import Select from 'react-select';
import NotificationSystem from 'react-notification-system'
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'
import cx from 'classnames';

import loading from '../assets/loading.gif'


ReactChartkick.addAdapter(Chart)

const SEARCH = true

class Home extends Component {

    constructor() {
        super()
        this.state = {
            coinList: [],
            currentCoin: null,
            graphData: {},
            priceData: null,
            simulations: [],
            recommendation: null
        }

        const self = this
        getCachedCoins().then(resp => {
            console.log(resp)
            const data = resp['data']['Data']
            console.log(data)
            const keys = Object.keys(data)
            const coinList = keys.map(key => {
                const coin = data[key]
                return {
                    value: coin,
                    label: coin.CoinName
                }
            })
            this.setState({ coinList: coinList })
            self.readyNotification()

        })
    }

    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
    }

    readyNotification() {
        this._notificationSystem.addNotification({
            title: 'HypeFactors',
            message: 'Projects Loaded',
            level: 'success',
            position: 'tr'
        });
    }

    recomputeSimulation() {
        const { priceData, currentCoin, graphData } = this.state
        const hasData = priceData != null
        if (!hasData) {
            console.log('recompute called without priceData - noop')
        }

        // TODO: compute different simulations and render.
        const simulations = []

        const recommendation = helper.getRecommendation(currentCoin, priceData, graphData)
        this.setState({ recommendation, simulations })
    }

    handleChange = (selectedOption) => {
        const self = this;
        const currentCoin = selectedOption.value
        self.setState({ currentCoin: currentCoin, graphData: {}});
        console.log(`Option selected:`, currentCoin);

        if (SEARCH) {
            getCoinInfo(currentCoin.Id).then(resp => {
                const data = resp['data']['Data']
                console.log('graphData', data)
                const graphData = helper.getGraphData(data)
                self.setState({ graphData })
            })
        }

        if (SEARCH) {
            getCoinPrices(currentCoin.Symbol).then(resp => {
                const data = resp['data']['Data']
                // TODO: compute 4 simulated trajectories for the coin price.
                const priceData = {}
                data.map(p => {
                    const currentDate = new Date(p.time * 1000)
                    const formattedDate = helper.formatDate(currentDate)
                    priceData[formattedDate] = p.close
                })

                console.log('priceData', priceData)

                self.setState({ priceData })
                self.recomputeSimulation()
            })
        }
    }

    selectRandomProject() {
        const { coinList } = this.state
        if (coinList == undefined || coinList.length == 0) {
            alert('data not ready yet, please wait')
            return
        }
        const coin = helper.getRandom(coinList)
        this.handleChange(coin)
    }

    render() {
        const { coinList, currentCoin, graphData, priceData, simulations, recommendation } = this.state
        const hasData = (Object.keys(graphData).length > 0)
        const hasPriceData = priceData != null
        return (
            <div className="home-content">
                {/* <Grid> */}
                <Row>
                    <Col xs={3} md={4}  >

                        <div className="home-select-area">
                            {!hasData && <div>
                                {/* <h4>Welcome</h4> */}
                                <h4>To Begin,</h4>
                            </div>}
                            <p className="help-text">Find a Project</p>

                            <div className="select-bar">
                            <Select
                                value={currentCoin}
                                onChange={this.handleChange}
                                options={coinList}
                            />
                            </div>
                            <p className="white">or</p>

                            <Button bsStyle='warning' className="random-button" onClick={() => this.selectRandomProject()}>
                                Discover New Project
                            </Button>

                            <br/>

                            <div className="coin-result-area">
                                {currentCoin &&
                                    <div>

                                        <ListGroupItem bsStyle="success" header={currentCoin.CoinName} />
                                        <ListGroupItem>
                                            {Object.keys(currentCoin).map((key, i) => {
                                                if (key === 'Id' || key === 'CoinName' || key.indexOf('Url') != -1) {
                                                    return
                                                }
                                                let value = currentCoin[key]
                                                let numValue = parseInt(currentCoin[key])
                                                if (!isNaN(numValue)) {
                                                    value = numValue
                                                }
                                                return <li key={i}>{key}: {value}</li>
                                            })}

                                        </ListGroupItem>
                                    </div>
                                }

                            </div>
                        </div>
                    </Col>
                    <Col xs={9} md={6}>
                        {!hasData && currentCoin && 
                            <div>
                                <img src={loading}/>
                            </div>
                        
                        }
                        {hasData && <div>
                            <h2 className="social-header-text">{currentCoin.CoinName} Social Graph</h2>
                            <ForceGraph3D
                                graphData={graphData}
                                nodeLabel="id"
                                nodeAutoColorBy="group"
                                width="850"
                                height="600"
                                // backgroundColor="dark"
                                linkWidth={2}
                                linkColor="#fff"
                                nodeLabel="id"
                                linkDirectionalParticles="value"
                                linkDirectionalParticleSpeed={d => d.value * 0.001}
                            />
                        </div>
                        }
                    </Col>

                    <Col xs={12} md={2} >
                        {graphData.infoMap && Object.keys(graphData.infoMap).map(key => {
                            if (graphData.infoMap[key].length === 0) {
                                return
                            }
                            return (<div>
                                <h4>{key}</h4>
                                {graphData.infoMap[key].map(val => {
                                    return <li>{val}</li>
                                })}
                            </div>)
                        })}
                    </Col>
                </Row>

                <br />
                <hr />
                <br />

                <Row>
                    <div className='white'>
                    {hasPriceData && <Col xs={6} md={6}>
                        <LineChart
                            prefix="$"
                            thousands=","
                            curve={false}
                            xtitle="Date"
                            ytitle="Price"
                            messages={{ empty: `No ${currentCoin.CoinName || 'Coin'} data` }}
                            data={priceData}
                        />
                    </Col>}
                    </div>
                    {hasPriceData && <Col xs={6} md={6}>

                        {/* <h3 className="centered">HypeFactors</h3> */}
                        {recommendation && <div className="black">
                            <ListGroupItem bsStyle="success" header={'HypeFactors'} />

                            <ListGroupItem>
                                <h2>Recommendation: <span className={cx({
                                    'green': recommendation.verdict === 'Buy',
                                    'red': recommendation.verdict === 'Sell'
                                })}>{recommendation.verdict}</span></h2>

                                <h3>Reasoning:</h3>

                                {recommendation.reasons && recommendation.reasons.map(reason => {
                                    return <li>{reason}</li>
                                })}
                            </ListGroupItem>
                        </div>}

                    </Col>}

                </Row>

                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    }
}

export default Home;