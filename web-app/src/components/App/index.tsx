import "./style.css";

import React from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Dashboard } from "../Dashboard";
import { DndExample } from "../DndExample";

const App: React.FC = () => {
    return (
        <CookiesProvider>
            <Router>
                <Route
                    exact={true}
                    path="/"
                    render={(props) => <Dashboard {...props} />}
                />
                <Route path="/Other">
                    <DndExample />
                </Route>
            </Router>
        </CookiesProvider>
    );
};

export { App };
