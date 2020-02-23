import Button from "@material-ui/core/Button";
import React from "react";

const LoginButton: React.FC = () => {
    const doLogin = () => {
        // NOTE: use window.location not history.push
        //       because the browser needs to go outside
        //       the router's set of routes
        window.location.href = "http://localhost:3001/api/login/prelogin";
    };

    return (
        <Button color="inherit" onClick={doLogin}>
            Login
        </Button>
    );
};

export { LoginButton };
