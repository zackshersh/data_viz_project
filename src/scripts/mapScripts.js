import * as d3 from "d3";
import { feature } from "topojson";
import TopoJSON from "../data/TopoJSON_NoAntarctic.json";
import data from "../data/worldbank_climate_crop_refactor_floats.json";
import minMaxData from "../data/worldbank_climate_min-max.json";
import { colorLerp, colorString, guiltCalc, indexSort, lerp, normalize, rndmFlt, rndmInt, simplifyNumber } from "./utils";

export class MapHandler {
    constructor(svgClass, parentClass){
        this.svgClass = svgClass;
        this.svg = undefined;

        this.parentClass = parentClass;

        this.data = data;
        this.mapData = TopoJSON;

        this.paths = [];

        this.countryNum = Object.entries(this.data).length;
        this.pathNum = this.mapData.objects.countries.geometries.length;

        // kinda weird syntax
            // values are 1-0
        this.filter = 1

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
                r: 72,
                g: 102,
                b: 128
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

        // this.width = +this.svg.attr("width");
        // this.height = +this.svg.attr("height");
        this.width = document.querySelector(this.parentClass).getBoundingClientRect().width;
        this.height = document.querySelector(this.parentClass).getBoundingClientRect().height;
        
        this.createTooltip();

        this.generateMap();

        document.defaultView.addEventListener("resize",() => {
            this.resizeSVG()
            // console.log("Hey")
        })
    }

    setParams(a,b){
        this.params.a = a;
        this.params.b = b;
    }

    createTooltip(){

        if(this.tooltip){
            // return
        }

        this.tooltip = d3.select(this.parentClass)
            .append("div")
            .attr("class","tooltip")
            .style("position", "absolute")
            .style("display","none")
            .text("Doo Bop")




        let tooltipDisplay = false; 
        
        const pathMove = (e) => {
            if(!tooltipDisplay) return;
 
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
        
        const pathEnter = (e) => {
            this.tooltip.style("display","block")
            tooltipDisplay = true;
        }

        const pathLeave = (e) => {
            this.tooltip.style("display","none")
            tooltipDisplay = false;
        }

        let validCountries = document.querySelectorAll(".valid-country");

        validCountries.forEach(path => path.addEventListener("mousemove",pathMove))
        validCountries.forEach(path => path.addEventListener("mouseenter",pathEnter))
        validCountries.forEach(path => path.addEventListener("mouseleave",pathLeave))

    }


    generateMap(reproject){

        // clearing svg for new map 
        this.svg.selectAll("*").remove()

        const countries = feature(this.mapData, this.mapData.objects.countries);
        let b = d3.geoBounds(countries);
        let s = .95 / Math.max((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1]) / this.height);
        let t = [(this.width - s * (b[1][0] + b[0][0])) / 2, (this.height - s * (b[1][1] + b[0][1])) / 2];

        const projection = d3.geoMercator()
            .fitSize([this.width,this.height],countries)
            // .translate(t)
        const pathGenerator = d3.geoPath().projection(projection);


        const paths = this.svg.selectAll("path")
            .data(countries.features);
        paths.enter().append('path')
            .attr("d", pathGenerator)
            .attr("class", "country-path")
        



        // set country name attribute
        let countryPaths = this.svg.selectAll("path")._groups[0];
        countryPaths.forEach((path,i) => {
            let countryName = this.mapData.objects.countries.geometries[i].properties.name;
            path.setAttribute("country",countryName);


            Object.entries(data).forEach(i => {
                let obj = i[1];
                if(obj.name == countryName){

                    path.classList.add("valid-country");
                    path.classList.add("country-code", i[0]);
                    path.setAttribute("country-code",i[0]);
                }
            })

            this.paths.push(path);

        })
        
        this.updateMap();
        if(!reproject){
            this.createTooltip();
        }
    }


    updateMap(){
        let vals = [];
        this.paths.forEach((path, i) => {
            let countryData = this.data[path.getAttribute("country-code")];

            let countryVal = null;

            if(i == 139){
                console.log(countryData)
            }

            if(!countryData){
            } else {

                let paramA = this.params.a; let valA = countryData[paramA];
                    if(Array.isArray(valA) && paramA && valA) valA = valA[2];
                let paramB = this.params.b; let valB = countryData[paramB];
                    if(Array.isArray(valB) && paramB && valB) valB = valB[2];


                if(valA == null || valB == null){

                } else {
                    let val = guiltCalc(paramA,paramB,valA,valB)
                    countryVal = val;
                }
            }

            vals.push(countryVal);
        })

        let valsNorm = normalize(vals);

        this.setColors(valsNorm)
    }

    setColors(arr){


        // gets top or bottom 25% or 50 or whatever
        let orderedIndeces = indexSort(arr);
        let filterValue = Math.abs(this.filter); let filterSign = Math.sign(this.filter);
        console.log(filterSign)
        // indeces of the values that do fufill the filter
        let fufillFilter;
        let len = orderedIndeces.length
        let subLength = Math.round(orderedIndeces.length * filterValue);
        console.log(subLength)
        if(filterSign < 0){
            fufillFilter = orderedIndeces.slice(0, subLength);
        } else {
            fufillFilter = orderedIndeces.slice(len-(len*filterValue), len)
        }
        console.log(fufillFilter)
        let v = 0;
        this.paths.forEach((path,i) => {
            let t = arr[i];
            // console.log(t, path.getAttribute("country"));
            if(t == "no data" || t == null || !fufillFilter.includes(i)){
                path.style.fill = colorString(this.colors.noData);
            } else {
                path.style.fill = colorLerp(this.colors.min,this.colors.max,t);
            }
        })

    }


    changeParam(newVal){
        this.params.b = newVal;
        this.updateMap();
    }

    resizeSVG(){
        let parentBounds = this.svg._groups[0][0].parentNode.getBoundingClientRect();
        this.width = parentBounds.width;
        this.height = parentBounds.height;
        this.generateMap(true);
        this.createTooltip()
    }

    setFilter(val){
        this.filter = val;
        this.generateMap();
    }

}