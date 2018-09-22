import React, { Component } from 'react'
import { Grid, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap'
import { getCoins, getCoinInfo, getCoinPrices } from '../helper/api'
// import SearchComponent from './SearchComponent';
import Select from 'react-select';
import NotificationSystem from 'react-notification-system'
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'

ReactChartkick.addAdapter(Chart)

const SEARCH = true

class Home extends Component {

    constructor() {
        super()
        this.state = {
            coinList: [],
            currentCoin: null,
            data: {},
            priceData: []
        }

        const self = this
        if (SEARCH) {
            getCoins().then(resp => {
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

    handleChange = (selectedOption) => {
        const currentCoin = selectedOption.value
        this.setState({ currentCoin });
        console.log(`Option selected:`, currentCoin);

        getCoinInfo(currentCoin.Id).then(resp => {
            const data = resp['data']['Data']
            console.log('coinInfo', data)
        })

        getCoinPrices(currentCoin.Symbol).then(resp => {
            const data = resp['data']['Data']
            console.log('coinPrices', data)
        })
    }

    render() {
        const { coinList, currentCoin, data } = this.state
        const hasData = (Object.keys(data).length > 0)
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

                                        <ListGroupItem bsStyle="info" header={currentCoin.CoinName}/>
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

                <br/>
                <hr/>
                <br/>

                {hasData && <Row>

                    <Col xs={6} md={6}>
                    <PieChart data={[["Blueberry", 44], ["Strawberry", 23]]} />
                    
                    </Col>


                    <Col xs={6} md={6}>

                        <h3 className="centered">HypeFactors</h3>





                    </Col>


                </Row>
                }

                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    }
}

export default Home;