import React from "react";
import {Card, CardHeader, IconButton, LinearProgress, withStyles} from "@material-ui/core";
import dataProvider from "../provider/dataProvider";
import RefreshIcon from "@material-ui/icons/Refresh";
import NeoChart from "./NeoChart";
import NeoFilter from "./utils/NeoFilter";
import NeoTable from "./NeoTable";
import NeoDisplayType from "./utils/NeoDisplayType";

const styles = {
    cardHeader: {
        textAlign: "left",
        borderBottom: '2px #e8e8e8 solid',
    },
};

class NeoDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            componentState: 'loading', // loading => successed, error
            computedData: [],
            neoDisplayType: 'chart',
        };
        this.neoFilterValue = '';
        this.rawData = [];
    };

    fetchData = () => {
        dataProvider('GET', 'neo/rest/v1/neo/browse', {
            'api_key': 'DEMO_KEY'
        })
            .then(({data}) => {
                if (this._isMounted) {
                    this.rawData = [];
                    const rawData = data['near_earth_objects'];
                    for (let i = 0; i < rawData.length; i++) {
                        let ele = rawData[i];
                        this.rawData.push([
                            ele.name,
                            ele.estimated_diameter.kilometers.estimated_diameter_min,
                            ele.estimated_diameter.kilometers.estimated_diameter_max,
                            ele.close_approach_data[0] ? ele.close_approach_data[0].orbiting_body : null]);
                    }
                    // sorted by average estimated diameter descending
                    this.rawData.sort(function (a, b) {
                        return b[1] + b[2] - (a[1] + a[2]);
                    });

                    this.setState({componentState: 'successed', computedData: this.createComputedData()});
                }
            })
            .catch((e) => {
                console.warn('error', e);
                if (this._isMounted) {
                    this.rawData = [];
                    this.setState({componentState: 'error', computedData: []});
                }
            })
    };

    createComputedData = () => {
        let computedData = [];
        computedData.push(['Neo Name', 'Min Estimated Diameter (km)', 'Max Estimated Diameter (km)']);
        for (let i = 0; i < this.rawData.length; i++) {
            let ele = this.rawData[i];
            if (this.neoFilterValue) {
                if (ele[3] === this.neoFilterValue) {
                    computedData.push([ele[0], ele[1], ele[2]]);
                }
            } else {
                computedData.push([ele[0], ele[1], ele[2]]);
            }
        }

        return computedData;
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

    changeNeoFilterValue = (neoFilterValue) => {
        this.neoFilterValue = neoFilterValue;
        this.setState({computedData: this.createComputedData()});
    };

    changeNeoDisplayType = (neoDisplayType) => {
        this.setState({neoDisplayType: neoDisplayType});
    };

    render() {
        const {componentState, computedData, neoDisplayType} = this.state;
        const {classes} = this.props;

        let infoChart = '';

        if (componentState === 'loading') {
            infoChart = (<div><LinearProgress/></div>);
        } else if (componentState === 'error') {
            infoChart = (<div style={{backgroundColor: "red", fontStyle: "italic"}}>Server communication error</div>);
        }

        return (
            <Card className={classes.graphBlock}>
                <CardHeader
                    title='Data Visualization'
                    className={classes.cardHeader}
                    action={
                        <div>
                            <NeoDisplayType changeNeoDisplayType={this.changeNeoDisplayType}/>
                            &nbsp;&nbsp;&nbsp;
                            <NeoFilter changeNeoFilterValue={this.changeNeoFilterValue}/>
                            <IconButton aria-label="refresh" onClick={this.refreshData}>
                                <RefreshIcon/>
                            </IconButton>
                        </div>
                    }
                />
                <div>
                    {infoChart}
                    <br/>
                    {(neoDisplayType === "table" || neoDisplayType === "all") &&
                    <NeoTable computedData={computedData}/>}
                    <br/>
                    {(neoDisplayType === "chart" || neoDisplayType === "all") &&
                    <NeoChart computedData={computedData}/>}
                </div>
            </Card>
        )
    }
}

export default withStyles(styles)(NeoDisplay);
