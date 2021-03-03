import React, { Component } from 'react'
import Layout from 'UI/Layout'
import Field from 'UI/Field'
import ControllPanel from 'UI/ControllPanel'
import Footer from 'UI/Footer'
import Button from 'UI/Button'
import Score from 'UI/Score'
import {
  increaseAndRemoveCells,
  getInitCells,
  direction,
  moveCells,
  populateCells,
} from 'logic'

const gameStates = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitState()
  }

  mapKeyCodesToDirections = {
    KeyA: direction.LEFT,
    KeyS: direction.DOWN,
    KeyD: direction.RIGHT,
    KeyW: direction.UP,
    ArrowLeft: direction.LEFT,
    ArrowDown: direction.DOWN,
    ArrowRight: direction.RIGHT,
    ArrowUp: direction.UP,
  }

  getInitState = () => ({
    cells: getInitCells(),
    gameState: gameStates.IDLE,
    moveDirection: null,
    score: 0,
    theme: true,
    sound: true,
    music: true
  })

  startNewGame = () => {
    this.setState(this.getInitState())
  }

  sound = () => {
    this.setState(state => ({
      ...state,
      sound: !this.state.sound,
    }))
  }
  
  music = () => {
       this.setState(state => ({
      ...state,
      music: !this.state.music,
    }))
  }
  themeSwitch = () => {
       this.setState(state => ({
      ...state,
      theme: !this.state.theme,
    }))
  }

  scoreDialog = () => {
       this.setState(state => ({
      ...state,
      music: !this.state.music,
    }))
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.gameState !== this.state.gameState &&
      this.state.gameState === gameStates.PROCESSING
    ) {
      this.processGame()
    }
  }

  async processGame() {
    console.log('processGame')

    this.setState(state => ({
      ...state,
      cells: moveCells(state.cells, state.moveDirection),
    }))
    await delay(150)

    this.setState(state => ({
      ...state,
      ...increaseAndRemoveCells(state.cells, state.score),
    }))

    this.setState(state => ({
      ...state,
      cells: [...state.cells, ...populateCells(state.cells)],
    }))

    this.setState(state => ({
      ...state,
      gameState: gameStates.IDLE,
      moveDirection: null,
    }))
  }

  handleKeyPress = event => {
    if (['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyS', 'KeyD', 'KeyW'].includes(event.code)) {
      this.setState(state => {
        if (state.gameState === gameStates.IDLE) {
          return {
            ...state,
            gameState: gameStates.PROCESSING,
            moveDirection: this.mapKeyCodesToDirections[event.code],
          }
        }
        return undefined
      })
    }
  }

  render() {
    const { cells, score } = this.state
    return (
      <Layout>
        <ControllPanel>
          <Button onClick={this.startNewGame}>New</Button>
          <Button onClick={this.sound}>{this.state.sound ? "Sound Off" : "Sound On"}</Button>
          <Button onClick={this.music}>{this.state.music ? "Music Off" : "Music On"}</Button>
          <Score onClick={this.scoreDialog}>{score}</Score>
        </ControllPanel>
        <Field cells={cells} />
        <Footer>
            <Button onClick={this.themeSwitch}>{this.state.theme ? "Dark" : "Light"}</Button>
            <Button onClick={this.themeSwitch}>{this.state.theme ? "Dark" : "Light"}</Button>
     <div className="footer">
    <a href="https://github.com/dzmitrynz" target="_blank" rel="noopener noreferrer">dzmitryNz</a>
      <a className='footer__school' href="https://rs.school/js/">
        <img src="https://rollingscopes.com/images/logo_rs2.svg" alt="rsschool" />
      </a>
    </div>
     </Footer>
      </Layout>
    )
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default App
