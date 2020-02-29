import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { RouteComponentProps } from "react-router";

import { AuthButtons } from "../auth/AuthButtons";
import { DndExample } from "../DndExample";
import { OrderList } from "../OrderList";
import { MainListItems, SecondaryListItems } from "./leftItems";

const Copyright: React.FC = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            {new Date().getFullYear()} Don Alvarez
        </Typography>
    );
};

const drawerWidth = 240;

const useStyles = makeStyles((theme:any) => {
    return {
        root: {
            display: "flex",
        },
        toolbar: theme.mixins.toolbar,
        toolbarIcon: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 8px",
            ...theme.mixins.toolbar,
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
        },
        title: {
            flexGrow: 1,
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
              width: drawerWidth,
              flexShrink: 0,
            },
        },
        drawerPaper: {
            width: drawerWidth,
        },
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        paper: {
            padding: theme.spacing(2),
            display: "flex",
            overflow: "auto",
            flexDirection: "column",
        },
    };
});

const DrawerContents: React.FC = () => {
    return (
        <>
            <Divider />
            <MainListItems />
            <Divider />
            <SecondaryListItems />
        </>
    );
}

const ResponsiveDrawer: React.FC<{ mobileOpen: boolean, handleDrawerToggle: () => void }> = (props) => {
    const classes = useStyles();
    return (
        <nav className={classes.drawer}>
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    open={props.mobileOpen}
                    onClose={props.handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={props.handleDrawerToggle}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <>
                        {props.children}
                    </>
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {props.children}
                </Drawer>
            </Hidden>
        </nav>
    );
}

const Layout: React.FC<{ title: string }> = (props) => {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        aria-label="open drawer"
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        {props.title}
                    </Typography>
                    <AuthButtons />
                </Toolbar>
            </AppBar>
            <ResponsiveDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}>
                <DrawerContents />
            </ResponsiveDrawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {props.children}
                </Container>
                <Copyright />
            </main>
        </div>
    );
};

const DashboardContents: React.FC = () => {
    const classes = useStyles();
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <OrderList />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <DndExample />
                </Paper>
            </Grid>
        </Grid>
    );
}

const Dashboard: React.FC<RouteComponentProps> = (props) => {
    return (
        <Layout title={"Dashboard"}>
            <DashboardContents />
        </Layout>
    )
}

export { Dashboard };
