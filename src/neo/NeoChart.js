import React from 'react';
import PropTypes from 'prop-types';
import {GoogleCharts} from 'google-charts';

class NeoChart extends React.PureComponent {
    static propTypes = {
        computedData: PropTypes.array,
    };

    constructor(props) {
        super(props);

        // Object neoChart with element div with id='neo_chart'
        this.neoChart = null;
        // Meta for neoChart
        this.chartOptions = {
            chart: {
                title: 'Neo Chart',
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

    drawChartCallBack = () => {
        const {computedData} = this.props;

        if (computedData.length > 1) { // neoChart with data
            // Init neoChart
            if (!this.neoChart) {
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.computedData !== this.props.computedData) {
            this.drawChart();
        }
    }

    componentDidMount() {
        this.drawChart();
    }

    render() {
        const {computedData} = this.props;

        return (
            <div>
                {computedData.length < 2 && <p style={{fontSize: '20px'}}>Empty chart :(</p>}
                <div id='neo_chart' style={{height: '900px'}}></div>
            </div>
        )
    }
}

export default NeoChart;
