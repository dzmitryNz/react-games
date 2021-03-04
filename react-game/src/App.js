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

  getInitState = () => {
    const localState = localStorage.getItem("2048state");
    const state = !localState ? this.getNewState() : JSON.parse(localState)
    return state
  }

  getNewState = () => ({
    cells: getInitCells(),
    gameState: gameStates.IDLE,
    moveDirection: null,
    score: 0,
    fullscreen: false,
    theme: true,
    sound: true,
    music: true
  })

  startNewGame = () => {
    this.setState(this.getNewState())
  }

  toggleSound = () => {
    this.setState(state => ({
      ...state,
      sound: !this.state.sound,
    }))
    localStorage.setItem("2048state", JSON.stringify(this.state))
  }
  
  toggleMusic = () => {
       this.setState(state => ({
      ...state,
      music: !this.state.music,
    }))
    localStorage.setItem("2048state", JSON.stringify(this.state))
  }

  toggleTheme = () => {
       this.setState(state => ({
      ...state,
      theme: !this.state.theme,
    }))
    localStorage.setItem("2048state", JSON.stringify(this.state))
  }

  toggleFullscreen = () => {
       this.setState(state => ({
      ...state,
      fullscreen: !this.state.fullscreen,
    }))
    localStorage.setItem("2048state", JSON.stringify(this.state))
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
    localStorage.setItem("2048state", JSON.stringify(this.state))
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
    const { cells, score, theme } = this.state;
    const themeClass = theme ? "dark" : "light"
    return (
      <Layout className={themeClass}>
        <ControllPanel>
          <Button onClick={this.startNewGame}>New</Button>
          <Button onClick={this.toggleSound}><i className="material-icons">{this.state.sound ? "notifications_off" : "notifications"}</i></Button>
          <Button onClick={this.toggleMusic}><i className="material-icons">{this.state.music ? "music_off" : "music_note"}</i></Button>
          <Button onClick={this.toggleTheme}><i className="material-icons">{this.state.theme ? "dark_mode" : "light_mode"}</i></Button>
          <Button onClick={this.toggleFullscreen}><i className="material-icons">{this.state.fullscreen ? "fullscreen_exit" : "fullscreen"}</i></Button>
          <Score onClick={this.scoreDialog}>{score}</Score>
        </ControllPanel>
        <Field cells={cells} />
        <Footer />
    </Layout>
    )
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default App
