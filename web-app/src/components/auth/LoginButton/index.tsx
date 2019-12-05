import React from "react";
import { RouteComponentProps } from "react-router";
import { Button } from "@material-ui/core";

import { auth0audience, auth0client, auth0domain } from "../../../constants";

const loginUrl = auth0domain + "/authorize?audience=" + auth0audience + "&scope=SCOPE&response_type=token&client_id=" + auth0client + "&redirect_uri=http://localhost:3000/postlogin&state=STATE";

const LoginButton: React.FC<RouteComponentProps> = (props) => {

    return ( 
        <Button onClick={() => props.history.push(loginUrl)}>
            Login
        </Button>
    );
};

export { LoginButton };
