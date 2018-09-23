import React, { Component } from 'react'
import { Grid, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap'
import { getCoins, getCoinInfo, getCoinPrices } from '../helper/api'
// import SearchComponent from './SearchComponent';
import Select from 'react-select';
import NotificationSystem from 'react-notification-system'
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import helper from '../helper/helper'
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'
import fs from 'fs'

ReactChartkick.addAdapter(Chart)

const SEARCH = true

class Home extends Component {

    constructor() {
        super()
        this.state = {
            coinList: [],
            currentCoin: null,
            data: {},
            priceData: [],
            simulations: [],
            recommendation: null
        }

        const self = this
        if (SEARCH) {
            const resp = fs.readFileSync('../assets/coins.json')
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
        } else {
            // DEMO
            fetch('https://raw.githubusercontent.com/vasturiano/react-force-graph/master/example/datasets/miserables.json').then(res => {
                console.log('res', res)
                return res.json()
            }).then(data => {
                console.log(data)
                self.setState({ data: data })
            })

        }
    }

    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
    }

    readyNotification() {
        this._notificationSystem.addNotification({
            message: 'Coins Loaded',
            level: 'success'
        });
    }

    recomputeSimulation() {
        const { priceData } = this.state
        const hasData = priceData instanceof Array && priceData.length > 0
        if (!hasData) {
            console.log('recompute called without priceData - noop')
        }

        // TODO: compute different simulations and render


    }

    handleChange = (selectedOption) => {
        const self = this;
        const currentCoin = selectedOption.value
        self.setState({ currentCoin });
        console.log(`Option selected:`, currentCoin);

        getCoinInfo(currentCoin.Id).then(resp => {
            const data = resp['data']['Data']
            console.log('coinInfo', data)
        })

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

            self.setState( {priceData} )
            self.recomputeSimulation()


        })
    }

    render() {
        const { coinList, currentCoin, data, priceData, simulations, recommendation } = this.state
        const hasData = (Object.keys(data).length > 0)
        const hasPriceData = priceData instanceof Array && priceData.length > 0
        return (
            <div className="home-content">
                {/* <Grid> */}
                <Row>
                    <Col xs={6} md={6}  >

                        <div className="home-select-area">
                            <Select
                                value={currentCoin}
                                onChange={this.handleChange}
                                options={coinList}
                            />

                            <div className="coin-result-area">

                                {
                                    currentCoin &&
                                    <div>

                                        <ListGroupItem bsStyle="info" header={currentCoin.CoinName} />
                                        <ListGroupItem>


                                            {Object.keys(currentCoin).map((key, i) => {
                                                if (key === 'Id' || key === 'CoinName' || key.indexOf('Url') != -1) {
                                                    return
                                                }
                                                return <li key={i}>{key}: {JSON.stringify(currentCoin[key])}</li>
                                            })}

                                        </ListGroupItem>
                                    </div>
                                }

                            </div>
                        </div>
                    </Col>
                    <Col xs={6} md={6}  >

                        {hasData && <ForceGraph3D
                            graphData={data}
                            nodeLabel="id"
                            nodeAutoColorBy="group"
                            width="600"
                            height="600"
                            backgroundColor="light"
                            linkWidth={2}
                            linkColor="#fff"
                            nodeLabel="id"
                            linkDirectionalParticles="value"
                            linkDirectionalParticleSpeed={d => d.value * 0.001}
                        />}


                    </Col>
                </Row>

                <br />
                <hr />
                <br />

                {hasData && <Row>

                    <Col xs={6} md={6}>
                        {hasPriceData && <PieChart 
                            data={priceData} 

                            />
                            }
                    </Col>


                    <Col xs={6} md={6}>

                        {/* <h3 className="centered">HypeFactors</h3> */}
                        <ListGroupItem bsStyle="success" header={'HypeFactors'} />

                        <ListGroupItem>

                            Recommendation: {recommendation && { recommendation }}
                        </ListGroupItem>>

                    </Col>
                </Row>
                }

                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    }
}

export default Home;