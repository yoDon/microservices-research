import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

const ProfileButtonImpl: React.FC<RouteComponentProps> = (props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const openEl = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const doLogout = () => {
        // NOTE: use window.location not history.push
        //       because the browser needs to go outside
        //       the router's set of routes
        window.location.href = "http://localhost:3001/api/auth/prelogout";
    };

    return (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={openEl}
                onClose={handleClose}
            >
                <MenuItem onClick={() => alert("Profile")}>Profile</MenuItem>
                <MenuItem onClick={() => alert("My Account")}>
                    My account
                </MenuItem>
                <MenuItem onClick={doLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
};

const ProfileButton = withRouter(ProfileButtonImpl);

export { ProfileButton };
