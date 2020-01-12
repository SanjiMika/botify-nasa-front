import React from "react";
import {Card, CardHeader, IconButton, LinearProgress, withStyles} from "@material-ui/core";
import dataProvider from "../provider/dataProvider";
import RefreshIcon from "@material-ui/icons/Refresh";
import NeoChart from "./NeoChart";

const styles = {
    graphBlock: {
        backgroundColor: 'transparent'
    },
    cardHeader: {
        textAlign: "left",
        borderBottom: '1px #e8e8e8 solid',

        '@media (max-width: 600px)': {
            padding: '16px !important',
            fontSize: '20px',
            lineHeight: '1.2'
        }
    },
};

class NeoDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            componentState: 'loading', // loading => successed, error
            computedData: []
        };
    };

    fetchData = () => {
        dataProvider('GET', 'neo/rest/v1/neo/browse', {
            'api_key': 'DEMO_KEY'
        })
            .then(({data}) => {
                if (this._isMounted) {
                    let computedData = [];
                    computedData.push(['Neo Name', 'Min Estimated Diameter (km)', 'Max Estimated Diameter (km)']);

                    const rawData = data['near_earth_objects'];
                    for (let i = 0; i < rawData.length; i++) {
                        let ele = rawData[i];
                        computedData.push([ele.name, ele.estimated_diameter.kilometers.estimated_diameter_min, ele.estimated_diameter.kilometers.estimated_diameter_max]);
                    }
                    // sorted by average estimated diameter descending
                    computedData.sort(function (a, b) {
                        return b[1] + b[2] - (a[1] + a[2]);
                    });
                    this.setState({componentState: 'successed', computedData: computedData});
                }
            })
            .catch(() => {
                if (this._isMounted) {
                    this.setState({componentState: 'error', computedData: []});
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
        const {componentState, computedData} = this.state;
        const {classes} = this.props;

        let infoChart = '';

        if (componentState === 'loading') {
            infoChart = (<div className={classes.BackgroundLoad}><LinearProgress/></div>);
        } else if (componentState === 'error') {
            infoChart = (<div className={classes.BackgroundLoad}>Server communication error</div>);
        }

        return (
            <Card className={classes.graphBlock}>
                <CardHeader
                    title='Step 1: Data Visualization'
                    className={classes.cardHeader}
                    action={
                        <IconButton aria-label="refresh" onClick={this.refreshData}>
                            <RefreshIcon/>
                        </IconButton>
                    }
                />
                <div>
                    {infoChart}
                    <NeoChart computedData={computedData}/>
                </div>
            </Card>
        )
    }
}

export default withStyles(styles)(NeoDisplay);
