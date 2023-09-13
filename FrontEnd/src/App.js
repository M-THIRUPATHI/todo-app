import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Game from "./Game";
import "./App.css";

import ProtectedRoute from "./ProtectedRoute";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/game" component={Game} />
    </Switch>
  </BrowserRouter>
);

export default App;
