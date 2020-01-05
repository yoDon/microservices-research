import React from "react";
import { useCookies } from "react-cookie";

import { LoginButton } from "../LoginButton";
import { ProfileButton } from "../ProfileButton";
import { RegisterButton } from "../RegisterButton";

const AuthButtons: React.FC = () => {
    const [
        cookies,
        // setCookie,
        // removeCookie
    ] = useCookies(["user"]);

    if (cookies.user) {
        return <ProfileButton />;
    } else {
        return (
            <>
                <RegisterButton />
                <LoginButton />
            </>
        );
    }
};

export { AuthButtons };
