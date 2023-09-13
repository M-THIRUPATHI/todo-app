import { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header";
import "./index.css";

class Game extends Component {
  state = { userInput: "", zigzagWord: {}, check: "", score: 0 };

  onClickUserInput = (event) => {
    this.setState({ userInput: event.target.value });
  };

  componentDidMount = () => {
    this.getZigzagWord();
  };

  getZigzagWord = () => {
    const { score } = this.state;
    const jwtToken = Cookies.get("jwt_token");
    const api = axios.create({
      baseURL: "http://localhost:4000",
    });
    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    api
      .put("/game", { score })
      .then((response) => {
        this.setState({ zigzagWord: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onClickNext = () => {
    this.getZigzagWord();
    this.setState({ check: "", userInput: "" });
  };

  onClickCheck = () => {
    const { userInput, zigzagWord } = this.state;
    const check = userInput === zigzagWord.correctWord ? "correct" : "wrong";
    if (userInput === zigzagWord.correctWord) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
      }));
    }
    this.setState({ check });
  };

  render() {
    const { userInput, zigzagWord, check, score } = this.state;
    return (
      <>
        <Header />
        <div className="game-container">
          <h1 className="header-title">
            Top Score: <span className="header-score">{score}</span>
          </h1>
          <div className="game-card-container">
            <p className="game-zigzag-word">{zigzagWord.zigzagWord}</p>
            <input
              type="text"
              value={userInput}
              onChange={this.onClickUserInput}
              className="game-input"
            />
            <div>
              <button
                type="button"
                onClick={this.onClickCheck}
                className="game-check-button"
              >
                Check
              </button>
              <button
                type="button"
                onClick={this.onClickNext}
                className="game-next-button"
              >
                Next
              </button>
              <p className="game-check">{check}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Game;
