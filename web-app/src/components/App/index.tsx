import "./style.css";

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { PostLogin } from "../auth/PostLogin";
import { Dashboard } from "../Dashboard";
import { DndExample } from "../DndExample";

const App: React.FC = () => {
    return (
        <Router>
            <Route exact={true} path="/">
                <Dashboard />
            </Route>
            <Route path="/Other">
                <DndExample />
            </Route>
            <Route
                path="/PostLogin"
                render={(props) => <PostLogin {...props} />}
            />
        </Router>
    );
};

export { App };
