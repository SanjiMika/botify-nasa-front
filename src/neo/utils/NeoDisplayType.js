import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import PropTypes from "prop-types";

class NeoDisplayType extends React.PureComponent {
    static propTypes = {
        changeNeoDisplayType: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: 'chart'
        };
        this.items = [
            {id: "all", name: "All of two"},
            {id: "chart", name: "Chart"},
            {id: "table", name: "Table"},
        ];
    };

    handleChange = (value) => {
        this.props.changeNeoDisplayType(value.target.value);
        this.setState({value: value.target.value});
    };

    render() {
        const {value} = this.state;

        return (
            <FormControl>
                <InputLabel id="neo_switch">Display Type</InputLabel>
                <Select
                    style={{width: '150px'}}
                    labelId='neo_switch'
                    value={value}
                    onChange={this.handleChange}
                >
                    {
                        this.items.map((data) => {
                            return <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        )
    }
}

export default NeoDisplayType;
