import React from "react";
import {Table, TableRow, TableHead, TableCell, TableBody} from "@material-ui/core";
import PropTypes from "prop-types";

class NeoTable extends React.PureComponent {
    static propTypes = {
        computedData: PropTypes.array,
    };

    render() {
        const {computedData} = this.props;

        return (
            <div>
                {
                    computedData.length < 2 ? <p style={{fontSize: '20px'}}>Empty table :(</p>
                        :
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order</TableCell>
                                    <TableCell>{computedData[0][0]}</TableCell>
                                    <TableCell>{computedData[0][1]}</TableCell>
                                    <TableCell>{computedData[0][2]}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {computedData.map((data, i) => (
                                        i > 0 &&
                                        <TableRow key={data[0]}>
                                            <TableCell>{i}</TableCell>
                                            <TableCell>{data[0]}</TableCell>
                                            <TableCell>{data[1]}</TableCell>
                                            <TableCell>{data[2]}</TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                }
            </div>
        )
    }
}

export default NeoTable;
