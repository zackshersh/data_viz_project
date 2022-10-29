import * as d3 from "d3";

import TopoJSON from "../data/TopoJSON.json";
import data from "../data/worldbank_climate_crop_refactor_floats.json";
import minMaxData from "../data/worldbank_climate_min-max.json";
import { simplifyNumber } from "./utils";

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
        this.createTooltip();
    }

    setParams(a,b){
        this.params.a = a;
        this.params.b = b;
    }
    
    changeParam(newVal){
        console.log("HEY")
        this.params.b = newVal;
        this.updateMap();
    };

    createTooltip(){

        this.tooltip = d3.select(this.parentClass)
            .append("div")
            .attr("class","tooltip")
            .style("position", "absolute")
            .style("display","none")
            .text("Doo Bop")


        this.tooltipDisplay = false; 
        
        this.addToolTipEvents()

    };

    addToolTipEvents(){
        const pointMove = (e) => {
            if(!this.tooltipDisplay) return;

            let bbox = e.target.getBBox();
            let parentBox = e.target.parentNode.getBoundingClientRect();

            let relX = e.clientX - parentBox.x;
            let relY = e.clientY - parentBox.y;

            this.tooltip.style("left", relX+"px");
            this.tooltip.style("top", relY+"px");

            let countryData = this.data[e.target.getAttribute("country-code")];

            let valA = countryData[this.params.a];
            let valB = countryData[this.params.b];

            if(!valA) valA = "No Data"; if(!valB) valB = "No Data"

            // picks out the difference value from the data that's __ to __
            if(Array.isArray(valB) && valB){
                valB = valB[2];  
            } 

            let string = `
                <p>${countryData.name}</p>
                <div class="single-stat-container">
                    <p>${this.params.a}: ${valA}</p>
                    <p>${this.params.b}: ${valB}</p>
                </div>
            `
            this.tooltip.html(string)
        } 
        
        const pointEnter = (e) => {
            this.tooltip.style("display","block")
            this.tooltipDisplay = true;
        }

        const pointLeave = (e) => {
            this.tooltip.style("display","none")
            this.tooltipDisplay = false;
        }

        this.points.forEach(point => point.addEventListener("mousemove",pointMove))
        this.points.forEach(point => point.addEventListener("mouseenter",pointEnter))
        this.points.forEach(point => point.addEventListener("mouseleave",pointLeave))
    }

    generatePlot(){

        // clears everything
        this.svg.selectAll("*")
            .remove();

        
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 30},
            width = this.width - margin.left - margin.right,
            height = this.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        this.svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // AXES
        var x = d3.scaleLog()
        .domain([minMaxData[this.params.a].min, minMaxData[this.params.a].max])
        .range([margin.left , width ]);

        console.log(this.svg)
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        let bMin = minMaxData[this.params.b].min;
        let bMax = minMaxData[this.params.b].max;

        var y = d3.scaleLog()
            .domain([bMin+0.01,bMax*2])
            .range([ height, 0]);
        this.svg.append("g")
            .attr("transform", "translate(30,0)")
            .call(d3.axisLeft(y));


        
        Object.entries(this.data).forEach((country) => {
            let params = { ...this.params}
            let _country = country[1]
            if(_country[params.a] && _country[params.b]){

                // picking difference value out of __ to __ array
                if(Array.isArray(_country[params.b])) _country[params.b] = _country[params.b][2]


                let relX = x(_country[params.a]);
                let relY = y(Math.abs(_country[params.b]))

                this.svg.append("circle")
                .attr("cx", relX)
                .attr("cy", relY )
                .attr("r", 4)
                .style("fill", "#69b3a2")
                .attr("class","point")
                .attr("name",_country.name)
                .attr("country-code",country[0])
            } 
        })

        this.points = this.svg.selectAll(".point")._groups[0];

        // tooltip event listeners have to be added to new points
        this.addToolTipEvents()

    };

    updateMap(){
        this.generatePlot()
    }
}