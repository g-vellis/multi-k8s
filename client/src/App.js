import React from "react";
// import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

function App() {
   return (
      <Router>
         <div>
            {/* <div className="App"> */}
            <header>
               {/* <header className="App-header"> */}
               {/* <img src={logo} className="App-logo" alt="logo" /> */}
               <h1>Fib Calculator version KUBERNETES!</h1>
               <Link to="/">Home</Link>
               <Link to="/otherpage">Other Page</Link>
            </header>

            <div className="formBody">
               <Switch>
                  <Route exact path="/" component={Fib} />
                  <Route exact path="/otherpage" component={OtherPage} />
               </Switch>
            </div>
         </div>
      </Router>
   );
}

export default App;
