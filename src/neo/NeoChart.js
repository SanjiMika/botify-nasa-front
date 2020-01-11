import React from 'react';
import {withStyles, Card, CircularProgress, CardHeader, IconButton} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import dataProvider from "../provider/dataProvider";
import {GoogleCharts} from 'google-charts';

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
        dataProvider('GET', 'aaaa', {
            'api_key': 'DEMO_KEY'
        })
            .then(({data}) => {
                console.log('data', data);
                if (this._isMounted) {
                    this.setState({componentState: 'successed'}, this.drawChart);
                }
            })
            .catch(() => {
                if (this._isMounted) {
                    this.setState({componentState: 'successed'}, this.drawChart);
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

    drawChart = () => {
        GoogleCharts.load(drawBarChart, {packages: ['corechart', 'bar']});

        function drawBarChart() {
            let data = GoogleCharts.api.visualization.arrayToDataTable([
                ['Neo Name', 'Min Estimated Diameter (km)', 'Max Estimated Diameter (km)'],
                ['New York City, NY', 8175000, 8008000],
                ['Los Angeles, CA', 3792000, 3694000],
                ['Chicago, IL', 2695000, 2896000],
                ['Houston, TX', 2099000, 1953000],
                ['Philadelphia, PA', 1526000, 1517000]
            ]);

            let materialOptions = {
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
            let materialChart = new GoogleCharts.api.visualization.BarChart(document.getElementById('chart_div'));
            materialChart.draw(data, materialOptions);
        }
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
                <div id='chart_div'></div>
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
