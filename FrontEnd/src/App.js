import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import "./App.css";

import ProtectedRoute from "./ProtectedRoute";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/signup" component={Register} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
    </Switch>
  </BrowserRouter>
);

export default App;
