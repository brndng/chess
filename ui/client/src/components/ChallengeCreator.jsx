import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal.jsx';

axios.defaults.withCredentials = true;

class ChallengeCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      gameId: null,
      black: null,
      white: null,
      whiteUsername: '',
      blackUsername: '',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.createGame = this.createGame.bind(this);
  }

  showModal() {
    this.setState({
      showModal: true,
    });
  }
  
  hideModal() {
    this.setState({
      showModal: false,
    });
  }

  redirectToGame(id) {
    const { history } = this.props;
    history.push(`/game/${id}`);
  }

  setMatchup(color) {
    const { user, opponent, whiteUsername, blackUsername } = this.props;
    if (color === 'white') {
      this.setState({ 
        white: user.id, 
        black: opponent.id,
        whiteUsername: user.username,
        blackUsername: opponent.username,
      });
    } else {
      this.setState({ 
        white: opponent.id, 
        black: user.id, 
        whiteUsername: opponent.username,
        blackUsername: user.username,
      });
    }
  }


  async createGame() {
    const { white, black, whiteUsername, blackUsername } = this.state;
    const newGame = await axios.post('http://localhost:3000/games/challenge', { 
      white, 
      black,
      whiteUsername,
      blackUsername,
    });
    if (newGame) {
      this.setState({
        gameId: newGame.data.id,
      });
      this.showModal();
    }
  }

  render() {
    const { showModal, gameId, white, black } = this.state;
    const { opponent, selectedPlayer } = this.props;
    console.log('white, black', white, black)
    const createGame = white !== null && black !== null
      ? () => this.createGame()
      : null;
    const modal = showModal
      && <div >
           <Modal>
             <div className="modal"> 
               <div className="modal-btn-container">
                 <button onClick={() => this.hideModal()}>╳</button> 
               </div>
               <div className="modal-dialogue">
                 <p> New game created! Go to game {gameId}:</p>
                 <div className="modal-dialogue-btn-container">
                   <button onClick={() => this.redirectToGame(gameId)}>➤</button>
                 </div>
               </div>
             </div>
           </Modal>
         </div>;
    
    return (
      <div className="challenge-creator">  
        <div className="challenge-creator-content">
          <div className="slct-container">
            <select className="slct" onChange={(e) => this.setMatchup(e.target.value)}>
              <option value={null} defaultValue>SELECT COLOR</option>
              <option value="white">♔ WHITE</option>
              <option value="black">♚ BLACK</option>
            </select>
          </div>
          <div>
            <button className="btn btn-challenge" onClick={createGame}>CHALLENGE</button>
          </div>
        </div>
        {modal}
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return { user }
}

export default withRouter(connect(mapStateToProps)(ChallengeCreator));