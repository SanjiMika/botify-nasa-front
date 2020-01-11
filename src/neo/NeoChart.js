import React from 'react';
import {withStyles, Card, LinearProgress, CardHeader, IconButton} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import dataProvider from "../provider/dataProvider";
import {GoogleCharts} from 'google-charts';

const styles = () => ({
    graphBlock: {
        backgroundColor: 'transparent'
    },
    styleAdnCardHeader: {
        textAlign: "left",
        borderBottom: '1px #e8e8e8 solid',

        '@media (max-width: 600px)': {
            padding: '16px !important',
            fontSize: '20px',
            lineHeight: '1.2'
        }
    },
    section: {
        backgroundColor: 'white',
        position: 'relative',
    },
});

class NeoChart extends React.PureComponent {
    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            componentState: 'loading', // loading => successed, error
            computedData: []
        };

        // Object neoChart with element div with id='neo_chart'
        this.neoChart = null;
        // Meta for neoChart
        this.chartOptions = {
            chart: {
                title: 'Population of Largest U.S. Cities',
                subtitle: 'Based on most recent and previous census data'
            },
            hAxis: {
                title: 'Estimated Diameter (km)',
                minValue: 0,
            },
            vAxis: {
                title: 'Neo Name'
            },
            bars: 'horizontal',
            legend: {position: 'top'}
        };
    }

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
                    this.setState({componentState: 'successed', computedData: computedData}, this.drawChart);
                }
            })
            .catch(() => {
                if (this._isMounted) {
                    this.setState({componentState: 'error', computedData: []}, this.drawChart);
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

    drawChartCallBack = () => {
        const {computedData} = this.state;

        if (computedData.length > 0) { // neoChart with data
            if (!this.neoChart) { // Init neoChart
                this.neoChart = new GoogleCharts.api.visualization.BarChart(document.getElementById('neo_chart'));
            }
            // Update neoChart
            let data = GoogleCharts.api.visualization.arrayToDataTable(computedData);
            this.neoChart.draw(data, this.chartOptions);
        } else { // Empty data
            if (this.neoChart) {
                this.neoChart.clearChart();
            }
        }
    };

    drawChart = () => {
        if (!this.neoChart) { // Init neoChart
            GoogleCharts.load(this.drawChartCallBack, {packages: ['corechart', 'bar']});
        } else { // Update neoChart
            this.drawChartCallBack();
        }
    };

    render() {
        const {componentState} = this.state;
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
                    className={classes.styleAdnCardHeader}
                    action={
                        <IconButton aria-label="refresh" onClick={this.refreshData}>
                            <RefreshIcon/>
                        </IconButton>
                    }
                />
                <div className={classes.section}>
                    {infoChart}
                    <div id='neo_chart' style={{height: '550px'}}></div>
                </div>
            </Card>
        )
    }
}

export default withStyles(styles)(NeoChart);
