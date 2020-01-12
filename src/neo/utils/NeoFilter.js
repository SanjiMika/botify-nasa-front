import React from "react";
import {FormControl, Select, MenuItem, InputLabel} from "@material-ui/core";
import PropTypes from "prop-types";

class NeoFilter extends React.PureComponent {
    static propTypes = {
        changeNeoFilterValue: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.items = [
            {id: "", name: "None"},
            {id: "Earth", name: "Earth"},
            {id: "Juptr", name: "Juptr"},
            {id: "Mars", name: "Mars"},
            {id: "Merc", name: "Merc"},
        ];
    };

    handleChange = (value) => {
        this.props.changeNeoFilterValue(value.target.value);
        this.setState({value: value.target.value});
    };

    render() {
        const {value} = this.state;

        return (
            <FormControl>
                <InputLabel id="neo_filter">Orbiting Body</InputLabel>
                <Select
                    style={{width: '150px'}}
                    labelId='neo_filter'
                    value={value}
                    onChange={this.handleChange}
                >
                    {
                        this.items.map((data) => {
                            return <MenuItem key={data.id} value={data.id}>{data.name === 'None' ?
                                <em>{data.name}</em> : data.name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        )
    }
}

export default NeoFilter;
