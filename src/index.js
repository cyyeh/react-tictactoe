import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      style={props.isWinner ? {background: 'green'} : {}}
      className="square" 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  ); 
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinner={this.props.winner && this.props.winner.includes(i) ? true : false}
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderSquares() {
    let rows = []

    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3 * i + j));
      }
      rows.push(<div className="board-row" key={i}>{squares}</div>)
    }

    return rows
  }

  render() {
    return (
      <div>
        {this.renderSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        positions: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const positions = this.squareIndexToColRow(i);
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        positions: positions
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  squareIndexToColRow(i) {
    return `(${Math.floor(i / 3) + 1}, ${i % 3 + 1})`
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  showHistoryMoves(history) {
    return history.map((value, move) => {
      const desc = move ?
        'Go to move #' + move + " with (row, col): " + value.positions:
        'GO to game start';

      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)} 
            style={move === this.state.stepNumber ? {fontWeight: 'bold'} : {}}
          >
            {desc}
          </button>
        </li>
      );
    });
  }

  showGameStatus(currentSquares, isWinner, xIsNext, stepNumber) {
    let status;
    if (isWinner) {
      status = 'Winner: ' + currentSquares[isWinner[0]];
    } else if (stepNumber === currentSquares.length) {
      status = 'Tie!';
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return status;
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  }

  render() {
    const history = this.state.history;
    const currentSquares = history[this.state.stepNumber].squares;
    const winner = this.calculateWinner(currentSquares);
    const moves = this.showHistoryMoves(history);
    let status = this.showGameStatus(currentSquares, winner, this.state.xIsNext, this.state.stepNumber);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner} 
            squares={currentSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
