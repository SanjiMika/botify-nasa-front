import React from "react";
import {Button} from "@material-ui/core";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PropTypes from "prop-types";

class ExportCSVButton extends React.PureComponent {
    static propTypes = {
        computedData: PropTypes.array,
    };

    handleClick = () => {
        const {computedData} = this.props;

        if (computedData.length > 1) {
            let computedData_csv = '';
            for (let i = 0; i < computedData.length; i++) {
                let line = computedData[i];
                computedData_csv += `"${line[0]}";"${line[1]}";"${line[2]}"\n`;
            }
            let csvContent = 'data:text/csv;charset=utf-8,' + computedData_csv;
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "nasa.csv");
            document.body.appendChild(link);
            link.click();
        };
    };

    render() {
        return (
            <Button onClick={this.handleClick}>CSV &nbsp;<CloudDownloadIcon/></Button>
        )
    }
}

export default ExportCSVButton;
