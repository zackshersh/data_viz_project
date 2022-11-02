import React from 'react';
import ContentWrapper from './ContentWrapper';

import DataTable from "react-data-table-component";

import countryData from "../data/worldbank_climate_crop_refactor_floats.json"
import { round2Places, roundDec, simplifyNumber } from '../scripts/utils';

import "../styles/table.css"

function Table(props) {

    const columns = [
        {
            name: "Name",
            selector: row => row["name"],
            sortable: true
        },
        {
            name: "CO2 emissions, total (KtCO2)",
            selector: row => row["CO2 emissions, total (KtCO2)"],
            sortable: true,
            format: (row, i) => {return simplifyNumber(row["CO2 emissions, total (KtCO2)"])}
        },
        {
            name: "CO2 emissions per capita (metric tons)",
            selector: row => row["CO2 emissions per capita (metric tons)"],
            sortable: true
        },
        {
            name: "Droughts, floods, extreme temps (% pop. avg. 1990-2009)",
            selector: row => row["Droughts, floods, extreme temps (% pop. avg. 1990-2009)"],
            sortable: true,
            format: (row, i) => {return roundDec(row["Droughts, floods, extreme temps (% pop. avg. 1990-2009)"],3)}
        },
        {
            name: "GDP ($)",
            selector: row => row["GDP ($)"],
            sortable: true,
            format: (row, i) => {return simplifyNumber(row["GDP ($)"])}
        },
        {
            name: "Land area below 5m (% of land area)",
            sortable: true,
            selector: row => row["Land area below 5m (% of land area)"]
        },
        {
            name: "Population below 5m (% of total)",
            sortable: true,
            selector: row => row["Population below 5m (% of total)"]
        },
        {
            name: "Projected annual precipitation change (2045-2065, mm)",
            sortable: true,
            selector: row => row["Projected annual precipitation change (2045-2065, mm)"],
            sortFunction: (rowA,rowB) => {
                let a = parseFloat(rowA["Projected annual precipitation change (2045-2065, mm)"].split(" ")[0])
                let b = parseFloat(rowB["Projected annual precipitation change (2045-2065, mm)"].split(" ")[0])

                if(typeof a == "string") return -1;
                if(typeof b == "string") return 1;

                if(a > b){return 1}else{return -1}
            }
        },
        {
            name: "Projected annual temperature change (2045-2065, Celsius)",
            sortable: true,
            selector: row => row["Projected annual temperature change (2045-2065, Celsius)"],
            sortFunction: (rowA,rowB) => {
                let a = parseFloat(rowA["Projected annual temperature change (2045-2065, Celsius)"].split(" ")[0])
                let b = parseFloat(rowB["Projected annual temperature change (2045-2065, Celsius)"].split(" ")[0])

                if(typeof a == "string") return -1;
                if(typeof b == "string") return 1;

                if(a > b){return 1}else{return -1}
            }
        },

    ]

    const data = Object.entries(countryData).map((country) => {
        let _country = country[1];

        let precip = _country["Projected annual precipitation change (2045-2065, mm)"]
        let temp = _country["Projected annual temperature change (2045-2065, Celsius)"]

        return {
            name: _country.name,
            "CO2 emissions, total (KtCO2)": _country["CO2 emissions, total (KtCO2)"] == null ? "No data" : _country["CO2 emissions, total (KtCO2)"],
            "CO2 emissions per capita (metric tons)": _country["CO2 emissions per capita (metric tons)"] == null ? "No data" : _country["CO2 emissions per capita (metric tons)"],
            "Droughts, floods, extreme temps (% pop. avg. 1990-2009)": _country["Droughts, floods, extreme temps (% pop. avg. 1990-2009)"] == null ? "No data" : _country["Droughts, floods, extreme temps (% pop. avg. 1990-2009)"],
            "GDP ($)": _country["GDP ($)"] == null ? "No data" : _country["GDP ($)"],
            "Land area below 5m (% of land area)": _country["Land area below 5m (% of land area)"] == null ? "No data" : _country["Land area below 5m (% of land area)"],
            "Population below 5m (% of total)": _country["Population below 5m (% of total)"] == null ? "No data" : _country["Population below 5m (% of total)"],
            "Projected annual precipitation change (2045-2065, mm)": precip == null ? "No data" : `${precip[2]}  (${precip[0]} → ${precip[1]} )`,
            "Projected annual temperature change (2045-2065, Celsius)": _country["Projected annual temperature change (2045-2065, Celsius)"] == null ? "No data" : `${temp[2]}  (${temp[0]} → ${temp[1]} )`,
        }
    })

    const customStyles = {

    }


    return (
        <div className='Table Container'>
            <ContentWrapper>
                <div>
                    <DataTable 
                        columns={columns}
                        data={data}
                        pagination
                        customStyles={customStyles}
                    />
                </div>
            </ContentWrapper>
        </div>
    );
}

export default Table;