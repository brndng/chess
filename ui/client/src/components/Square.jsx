import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Piece from './Piece.jsx';
import { selectPiece, updatePosition, updatePromotionStatus } from '../actions/'; 
import verifyLegalSquare from '../../rules/movement/';
import { isWhite, convertToChessNotation, setSquareColor } from '../../rules/utilities/'
import { 
  isKingInCheck, 
  isGivingCheck,
  willMoveExposeKing,
  willMoveGiveCheck,
  isPawnPromoting, } from '../../rules/interactions/';

class Square extends Component {
  constructor(props) {
    super(props);
  }

  initSquareColor() {
    const { coords } = this.props;
    return setSquareColor(coords);
  }

  isSelected() {
    const { coords, selection } = this.props;
    if (selection !== null) {
      const { origin } = selection;
      return (coords.row === origin.row && coords.col === origin.col);
    }
  }

  handleSquareClick() {
    const { userId, game, selection, selectPiece, coords, piece, whiteToMove, currentPosition, moves } = this.props;

    if ((userId === game.white) === whiteToMove) {
      if ((isWhite(piece) === whiteToMove)) { 
        selectPiece(coords, piece);
      }
      if (selection !== null && (isWhite(piece) !== isWhite(selection.piece))) {
        const _isLegalSquare = verifyLegalSquare(selection.piece, selection.origin, coords, currentPosition, moves);
        if (_isLegalSquare) {
          this.placeSelectedPiece(); 
        }
      }
    }
  }

  placeSelectedPiece() {
    const { userId, selectPiece, updatePosition, selection, currentPosition, game, moves, coords, piece, updatePromotionStatus } = this.props;
    const _willMoveExposeKing = willMoveExposeKing(userId, game.white, selection, coords, currentPosition, moves);
    const _check = willMoveGiveCheck(userId, game.white, selection, coords, currentPosition, moves);
    const _notation = convertToChessNotation(selection.origin, coords, selection.piece, piece, _check);
    const _isPawnPromoting = isPawnPromoting(selection, coords);

    if (!_willMoveExposeKing) {
      if (_isPawnPromoting) {
        updatePromotionStatus([selection.origin, coords, selection.piece, piece, _notation, moves]);  
      } else {
        updatePosition(selection.origin, coords, selection.piece, piece, _notation, moves);
        selectPiece(null, null);
      }
      
    } 
  }

  render() {
    const classes = [
      'square',
      this.isSelected() ? 'is-selected' : null
    ].filter(cls => !!cls).join(' ');

    const onClick = this.props.completed 
      ? null
      : () => this.handleSquareClick();
    return (
      <div id={this.initSquareColor()} className={classes} onClick={onClick}>
        {this.props.piece === null ? null : <Piece piece={this.props.piece} />}
      </div>
    )
  }
}

const mapStateToProps = ({ selection, currentPosition, whiteToMove, moves, userId, game, completed }) => { 
  return { selection, currentPosition, whiteToMove, moves, userId, game, completed };
}

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ selectPiece, updatePosition, updatePromotionStatus }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Square);