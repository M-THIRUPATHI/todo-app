import Popup from "reactjs-popup";
import { AiFillCloseCircle } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import "./index.css";
const Home = () => {
  const history = useHistory();
  const onClickStartGame = () => {
    history.replace("/game");
  };
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-card-container">
          <div className="home-button-container">
            <Popup
              modal
              trigger={
                <button type="button" className="home-button home-button-hover">
                  Zig Zag English Words
                </button>
              }
            >
              {(close) => (
                <div className="home-pop-up-container">
                  <button
                    type="button"
                    className="pop-up-close-button"
                    onClick={() => close()}
                  >
                    <AiFillCloseCircle />
                  </button>
                  <div className="pop-up-container">
                    <h1 className="pop-up-title">Instructions</h1>
                    <p className="pop-up-description">
                      The Zigzag English Word Game is a word-building game where
                      players take turns forming words by connecting letters in
                      a zigzag pattern. This game can be a fun way to improve
                      vocabulary and spelling
                    </p>
                    <button
                      type="button"
                      className="pop-up-start-button"
                      onClick={onClickStartGame}
                    >
                      Start Game
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;

/*
<div className="home-button-container">
            <button type="button" className="home-button home-button-hover">
              Zig Zag English Words
            </button>
          </div>
          <div className="home-button-container">
            <button type="button" className="home-button home-button-hover">
              English Synonyms
            </button>
          </div>
          <div className="home-button-container">
            <button type="button" className="home-button home-button-hover">
              English Antonyms
            </button>
          </div>
*/
// <AiFillCloseCircle />
