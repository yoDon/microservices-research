import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";

import { auth0Client } from "../auth0Client";

const PostLogin: React.FC<RouteComponentProps> = (props) => {
    useEffect(() => {
        auth0Client
            .handleAuthentication()
            .then(() => {
                props.history.replace("/");
            })
            .catch(() => {
                console.log("DONTODO handle exception while logging in");
            });
    }, [props.history]);

    return <p>Loading profile...</p>;
};

export { PostLogin };
