import { createStyles, Theme } from "@material-ui/core";

export type Styles = "headerBar" ; // add class create
const styles = (theme: Theme) => createStyles<Styles, {}>({
    headerBar:{
        padding: '2% 1%',
        minHeight: '148px',
        alignItems: 'center',
    }
});

export default styles;