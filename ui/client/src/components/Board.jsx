import React, { Component } from 'react';
import { connect } from 'react-redux';
import Square from './Square.jsx';
import axios from 'axios';
import { rotateBoard } from '../../rules/helpers/';
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.props.currentPosition,
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    // console.log('prevProps, this.props', prevProps.currentPosition, this.props.currentPosition);
    const { currentPosition } = this.props;
    const { position } = prevState;
    if (JSON.stringify(position) !== JSON.stringify(currentPosition)) {
      this.setState({ position: currentPosition });
    }
  }

  render() {
    const { currentPosition, userId, game } = this.props;
    const positionRotated = rotateBoard(this.state.position);

    return userId === game.white 
      ? <div>
          <div className="board">{this.state.position.map((row, i) => 
            <div className="row" key={i}>{row.map((elem, j) => {
              let coords = { row: i, col: j };
              return <Square piece={elem} coords={coords} key={[coords.row, coords.col]} /> })}
            </div>)}
          </div>
        </div> 
      : <div>
          <div className="board">{positionRotated.map((row, i) => 
            <div className="row" key={i}>{row.map((elem, j) => {
              let coords = { row: positionRotated.length-1-i, col: row.length-1-j };
              return <Square piece={elem} coords={coords} key={[coords.row, coords.col]} /> })}
            </div>)}
          </div>
        </div> 
  }
}

const mapStateToProps = (state) => {
  return {
    currentPosition: state.currentPosition,
    userId: state.userId,
    game: state.game
  }
}

export default connect(mapStateToProps)(Board);





