import * as d3 from "d3";

import data from "../data/worldbank_climate_crop_refactor_floats.json";
import minMaxData from "../data/worldbank_climate_min-max.json";
import { colorLerp, colorString, guiltCalc, normalize, rndmFlt, rndmInt, simplifyNumber } from "./utils";

export class ScatterHandler {
    constructor(svgClass, parentClass){
        this.svgClass = svgClass;
        this.svg = undefined;

        this.parentClass = parentClass;

        this.data = data;


        this.points = [];

        this.params = {
            a: "CO2 emissions, total (KtCO2)",
            b: "GDP ($)"
        };

        this.colors = {
            noData: {
                r: 120,
                g: 120,
                b: 120
            },
            min: {
                r: 40,
                g: 91,
                b: 133
            },
            max: {
                r: 212,
                g: 100,
                b: 44
            }
        }

    }

    init(){
        this.svg = d3.select(this.svgClass);
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");
    
        this.generatePlot();
        this.createTooltip();

        this.resizeSVG()

        document.defaultView.addEventListener("resize",() => {
            this.resizeSVG();
        })
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
                <b>${countryData.name}</b>
                <div>
                    <p>${this.params.a}: ${simplifyNumber(valA)}</p>
                    <p>${this.params.b}: ${simplifyNumber(valB)}</p>
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
        var margin = {top: 10, right: 0, bottom: 45, left: 60},
            width = this.width - margin.left - margin.right,
            height = this.height - margin.top - margin.bottom;
        console.log(width, height)
        // append the svg object to the body of the page
        this.svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // AXES
        var x = d3.scaleLog()
        .domain([minMaxData[this.params.a].min, minMaxData[this.params.a].max])
        .range([margin.left , width ]);
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .call(g => g.select(".domain")
            .attr("stroke","var(--gray)")
            )
            .call(g => g.selectAll(".tick")
                .attr("color","var(--gray)")
            )

        // Add Y axis
        let bMin = minMaxData[this.params.b].min;
        let bMax = minMaxData[this.params.b].max;

        var y = d3.scaleLog()
            .domain([bMin+0.01,bMax*2])
            .range([ height, 0]);
        this.svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain")
                .attr("stroke","var(--gray)")
            )
            .call(g => g.selectAll(".tick")
                .attr("color","var(--gray)")
            )


        
        // labels

        this.svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("y", 6)
        .attr("dy", "1.25em")
        .attr("fill","var(--gray)")
        .attr("x",-height/2)
        .attr("transform", "rotate(-90)")
        .text(this.params.b);

        this.svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("y", height)
        .attr("dy", "2.5em")
        .attr("fill","var(--gray)")
        .attr("x",width/2)
        .text(this.params.a);

        
        let guiltVals = Object.entries(this.data).map(country => {
            let params = { ...this.params}
            let _country = country[1]

            if(Array.isArray(_country[params.b])) _country[params.b] = _country[params.b][2];

            return guiltCalc(params.a,params.b,_country[params.a],_country[params.b]);
        })

        let guiltValsNormalized = normalize(guiltVals)
        
        Object.entries(this.data).forEach((country,i) => {
            let params = { ...this.params}
            let _country = country[1]
            if(_country[params.a] && _country[params.b]){

                // picking difference value out of __ to __ array
                if(Array.isArray(_country[params.b])) _country[params.b] = _country[params.b][2];

                let relX = x(_country[params.a]);
                let relY = y(Math.abs(_country[params.b]));

                
                let guiltVal = guiltCalc(params.a,params.b,_country[params.a],_country[params.b]);


                this.svg.append("circle")
                .attr("cx", relX)
                .attr("cy", relY )
                .attr("r", 4)
                .style("fill", this.calcColor(guiltValsNormalized[i]))
                .attr("guilt",guiltVal)
                .attr("class","point")
                .attr("name",_country.name)
                .attr("country-code",country[0])
            } 
        })

        this.points = this.svg.selectAll(".point")._groups[0];

        // tooltip event listeners have to be added to new points
        this.addToolTipEvents()
    };

    calcColor(val){
        if(val == "no data" || val == null){
            return colorString(this.colors.noData)
        } else {
            return colorLerp(this.colors.min,this.colors.max,val)
        }
    }

    updateMap(){
        this.generatePlot()
    }

    resizeSVG(){
        this.width = this.svg._groups[0][0].parentNode.getBoundingClientRect().width;
        this.height = this.svg._groups[0][0].parentNode.getBoundingClientRect().height;

        this.updateMap()
    }
}