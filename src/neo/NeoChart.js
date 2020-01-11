import React from 'react';
import {withStyles, Card, CircularProgress, CardHeader, IconButton} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import dataProvider from "../provider/dataProvider";

const styles = () => ({
    graphBlock: {
        backgroundColor: 'transparent'
    },
    styleAdnCardHeader: {
        borderBottom: '1px #e8e8e8 solid',
        padding: '20px 30px',

        '@media (max-width: 600px)': {
            padding: '16px !important',
            fontSize: '20px',
            lineHeight: '1.2'
        }
    },
    section: {
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        backgroundColor: 'white',
        padding: '24px',
        position: 'relative',
        marginBottom: '24px'
    },
});

class NeoChart extends React.PureComponent {
    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            componentState: 'loading' // loading => successed, error
        };
    }

    fetchData = () => {
        dataProvider('GET', 'neo/rest/v1/neo/browse', {
            'api_key': 'DEMO_KEY'
        })
            .then(({data}) => {
                console.log('data', data);
                if (this._isMounted) {
                    this.setState({componentState: 'successed'});
                }
            })
            .catch(() => {
                if (this._isMounted) {
                    this.setState({componentState: 'error'});
                }
            })
    };

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    refreshData = () => {
        if (this._isMounted) {
            this.setState({componentState: 'loading'});
        }

        setTimeout(() => {
            this.fetchData()
        }, 500);
    };

    render() {
        const {componentState} = this.state;
        const {classes} = this.props;

        let infoChart = '';

        if (componentState === 'loading') {
            infoChart = (<div className={classes.BackgroundLoad}><CircularProgress/></div>);
        } else if (componentState === 'error') {
            infoChart = (<div className={classes.BackgroundLoad}>Server communication error</div>);
        } else if (componentState === 'successed') {
            infoChart = (
                <div>
                    CHART BAR GOOGLE
                </div>
            )
        }

        return (
            <Card className={classes.graphBlock}>
                <CardHeader
                    title='Step 1: Data Visualization'
                    className={classes.styleAdnCardHeader}
                    action={
                        <IconButton aria-label="settings" onClick={this.refreshData}>
                            <RefreshIcon/>
                        </IconButton>
                    }
                />
                <div className={classes.section}>
                    {infoChart}
                </div>
            </Card>
        )
    }
}

export default withStyles(styles)(NeoChart);
