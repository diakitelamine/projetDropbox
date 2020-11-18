import * as React from 'react';
import { Grid, withStyles, WithStyles } from '@material-ui/core';
import styles, { Styles } from './styles';

interface P { logo: ()=> React.ReactNode, menu: ()=> React.ReactNode, name: React.ReactNode}
// interface S {}

export class HeaderBar extends React.PureComponent<P & WithStyles<Styles> >{

    public static Display = withStyles(styles as any)(HeaderBar) as React.ComponentType<P>

    render(){
        const { classes, logo, name, menu } = this.props;
        return(
            <Grid container className={classes.headerBar}>
                <Grid item>
                    {logo()}
                </Grid>
                <Grid item>
                    <Grid item>
                        Utilisé cette partie pour les menus 
                    </Grid>
                    {name}
                </Grid>
            </Grid>
        )
    }

}