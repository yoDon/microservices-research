import React from "react";
import { RouteComponentProps } from "react-router";
import { Button } from "@material-ui/core";

import { auth0client, auth0domain } from "../../../constants";

const logoutUrl = auth0domain + "/v2/logout?client_id=" + auth0client + "&returnTo=http://localhost:3000/postlogout";

const LogoutButton: React.FC<RouteComponentProps> = (props) => {

    return ( 
        <Button onClick={() => props.history.push(logoutUrl)}>
            Logout
        </Button>
    );
};

export { LogoutButton };
