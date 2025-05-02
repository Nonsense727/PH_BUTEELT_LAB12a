import React from 'react';
import './App.css';
import { GameState as GameStateType, Cell } from './game';
import BoardCell from './Cell';

const playWinSound = () => {
  const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/win.ogg');
  audio.play();
};

const playDrawSound = () => {
  const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/lose.ogg');
  audio.play().catch(e => console.log("Audio play failed:", e));
};

interface Props { }

interface State {
  cells: Cell[];
  currentPlayer: string;
  winner: string;
  isDraw: boolean;
}

class App extends React.Component<Props, State> {
  private initialized: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = { 
      cells: [],
      currentPlayer: '',
      winner: '',
      isDraw: false
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Check for new winner
    if (!prevState.winner && this.state.winner) {
      playWinSound();
    }
    // Check for new draw
    if (!prevState.isDraw && this.state.isDraw) {
      playDrawSound();
    }
  }

  newGame = async () => {
    const response = await fetch('/newgame');
    const json = await response.json();
    this.setState({ 
      cells: json.cells,
      currentPlayer: json.currentPlayer,
      winner: json.winner,
      isDraw: json.isDraw
    });
  }

  play = (x: number, y: number): React.MouseEventHandler => {
    return async (e) => {
      e.preventDefault();
      const response = await fetch(`/play?x=${x}&y=${y}`);
      const json = await response.json();
      this.setState({ 
        cells: json.cells,
        currentPlayer: json.currentPlayer,
        winner: json.winner,
        isDraw: json.isDraw
      });
    };
  }

  undo = async () => {
    const response = await fetch('/undo');
    const json = await response.json();
    this.setState({ 
      cells: json.cells,
      currentPlayer: json.currentPlayer,
      winner: json.winner,
      isDraw: json.isDraw
    });
  }

  createCell(cell: Cell, index: number): React.ReactNode {
    if (cell.playable && !this.state.winner && !this.state.isDraw) {
      return (
        <div key={index}>
          <a href='/' onClick={this.play(cell.x, cell.y)}>
            <BoardCell cell={cell}></BoardCell>
          </a>
        </div>
      );
    } else {
      return (
        <div key={index}><BoardCell cell={cell}></BoardCell></div>
      );
    }
  }

  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  render(): React.ReactNode {
    return (
      <div>
        <div id="instructions">
          {this.state.isDraw ? (
            <div className="draw-message">
              <h2>Game Drawn!</h2>
              <p>It's a tie! 🤝</p>
            </div>
          ) : this.state.winner ? (
            <div className="celebration">
              <h2>{this.state.winner}</h2>
              <p>Congratulations! 🎉</p>
            </div>
          ) : (
            `Current Player: ${this.state.currentPlayer}`
          )}
        </div>
        <div id="board">
          {this.state.cells.map((cell, i) => this.createCell(cell, i))}
        </div>
        <div id="bottombar">
          <button onClick={this.newGame}>New Game</button>
          <button onClick={this.undo}>Undo</button>
        </div>
      </div>
    );
  }
}

export default App;