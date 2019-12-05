import React from "react";
import { RouteComponentProps } from "react-router";

const PostLogout: React.FC<RouteComponentProps> = (props) => {
    props.history.replace("/");
    return <p>logging out...</p>;
};

export { PostLogout };
