import React, { Component } from 'react';
import { connect } from 'react-redux';
import Square from './Square.jsx';
import axios from 'axios';
import { rotateBoard, areEqual } from '../../../../rules/utilities/';

axios.defaults.withCredentials = true;

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.props.currentPosition,
    }
    this.moveSound = new Sound();
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { currentPosition } = this.props;
    const { position } = prevState;
    if (!areEqual(position, currentPosition)) {
      this.setState({ position: currentPosition }, () => {
        this.moveSound.play();
      });
    }
  }

  render() {
    const { user, game, completed, isMyTurn } = this.props;
    const positionRotated = rotateBoard(this.state.position);
    const classes = [
      'board',
      isMyTurn && !completed && 'is-my-turn'
    ].filter(cls => !!cls).join(' ');

    return user.id === game.white 
      ? <div className={classes}>{this.state.position.map((row, i) => 
          <div className="row" key={i}>{row.map((elem, j) => {
            let coords = { row: i, col: j };
            return <Square piece={elem} coords={coords} key={[coords.row, coords.col]} /> })}
          </div>)}
        </div>  
      : <div className={classes}>{positionRotated.map((row, i) => 
          <div className="row" key={i}>{row.map((elem, j) => {
            let coords = { row: positionRotated.length-1-i, col: row.length-1-j };
            return <Square piece={elem} coords={coords} key={[coords.row, coords.col]} /> })}
          </div>)}
        </div>
  }
}

const mapStateToProps = ({ user, game, currentPosition, whiteToMove, completed, isMyTurn }) => {
  return { user, game, currentPosition, whiteToMove, completed, isMyTurn };
}

export default connect(mapStateToProps)(Board);

function Sound() {
  this.sound = document.createElement("audio");
  this.sound.src = "http://freesound.org/data/previews/351/351518_4502687-lq.mp3"
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
      this.sound.play();
  }
}

// class Sound {
//   constructor() {
//     this.sound = document.createElement("audio");
//     this.sound.src = "http://freesound.org/data/previews/351/351518_4502687-lq.mp3"
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.play = this.play.bind(this);
//     this.sound.src = "../../../../../../../Downloads/chess.wav";
//   }

//   play() {
//     this.sound.play();
//   }
// }
