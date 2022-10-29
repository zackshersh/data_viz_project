import * as d3 from "d3";

import TopoJSON from "../data/TopoJSON.json";
import data from "../data/worldbank_climate_crop_refactor_floats.json";

import minMaxData from "../data/worldbank_climate_min-max.json";

export class ScatterHandler {
    constructor(svgClass, parentClass){
        this.svgClass = svgClass;
        this.svg = undefined;

        this.parentClass = parentClass;

        this.data = data;
        this.mapData = TopoJSON;

        this.points = [];

        this.params = {
            a: "CO2 emissions, total (KtCO2)",
            b: "GDP ($)"
        };

    }

    init(){
        this.svg = d3.select(this.svgClass);
        console.log(this.svg)
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");
    
        this.generatePlot();
    }

    setParams(a,b){
        this.params.a = a;
        this.params.b = b;
    }

    generatePlot(){
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 0},
            width = this.width - margin.left - margin.right,
            height = this.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        this.svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // AXES
        var x = d3.scaleLinear()
        .domain([0, ])
        .range([ 0, width ]);

        console.log(this.svg)
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 500000])
            .range([ height, 0]);
        this.svg.append("g")
            .call(d3.axisLeft(y));

        console.log(this.data.AUT[this.params.a]);

        
        Object.entries(this.data).forEach((country) => {
            this.svg.append("circle")
                .attr("cx", function (d) { return x(d.GrLivArea); } )
                .attr("cy", function (d) { return y(d.SalePrice); } )
                .attr("r", 1.5)
                .style("fill", "#69b3a2")
        })

        // const genFromData = (data) => {
        //     var x = d3.scaleLinear()
        //     .domain([0, 4000])
        //     .range([ 0, width ]);
    
        //     console.log(this.svg)
        //     this.svg.append("g")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(d3.axisBottom(x));
            
        //     // Add Y axis
        //     var y = d3.scaleLinear()
        //         .domain([0, 500000])
        //         .range([ height, 0]);
        //     this.svg.append("g")
        //         .call(d3.axisLeft(y));
            
        //     // Add dots
        //     this.svg.append('g')
        //         .selectAll("dot")
        //         .data(data)
        //         .enter()
        //         .append("circle")
        //         .attr("cx", function (d) { return x(d.GrLivArea); } )
        //         .attr("cy", function (d) { return y(d.SalePrice); } )
        //         .attr("r", 1.5)
        //         .style("fill", "#69b3a2")
        // }
            
        // let data = d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv", genFromData)

    };
}