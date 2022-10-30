import * as d3 from "d3";
import { feature } from "topojson";
import TopoJSON from "../data/TopoJSON.json";
import data from "../data/worldbank_climate_crop_refactor_floats.json";
import minMaxData from "../data/worldbank_climate_min-max.json";
import { colorLerp, colorString, guiltCalc, lerp, normalize, rndmFlt, rndmInt, simplifyNumber } from "./utils";

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
                r: 255,
                g: 172,
                b: 121
            },
            max: {
                r: 0,
                g: 0,
                b: 200
            }
        }
    }

    init(){
        this.svg = d3.select(this.svgClass);

        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");
        
        this.createTooltip();

        this.generateMap();

        this.resizeSVG();
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
                <p>${countryData.name}</p>
                <div class="single-stat-container">
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


    generateMap(scale = 2.5){

        const projection = d3.geoMercator()
            .scale(this.width/scale/Math.PI)
            .center([0,0]);
        const pathGenerator = d3.geoPath().projection(projection);

        const countries = feature(this.mapData, this.mapData.objects.countries);

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
        this.createTooltip();
    }

    // updateMap(){
    //     let vals = [];
    //     this.paths.forEach((path,i) => {
    //         let countryData = this.data[path.getAttribute("country-code")];
    //         if(!countryData){
    //             vals.push(null)
    //         } else {
                
    //             // usually emissions per capita
    //             let paramA = this.params.a;
    //             let valA = countryData[paramA];

    //             //accounts for if it is of the types that have an array of data like change in avg temp
    //             if(Array.isArray(valA) && paramA) {
    //                 console.log(valA)
    //             } else {
    //                 // console.log(valA, "YES")
    //             }


    //             // the varied one
    //             let paramB = this.params.b;
    //             let valB = countryData[paramB];
    //             // if(typeof valB == "object" && paramB) valB = valB[2];

    //             if(Array.isArray(valB) && paramB) {
    //                 valB = valB[2];
    //             } else {
    //                 // console.log(valA, "YES")
    //             }

    //             if(!valA || !valB){
    //                 vals.push("no data")
    //             } else {
    //                 let minMaxA = minMaxData[paramA];
    //                 let rangeA = minMaxA.max - minMaxA.min;
                    
    //                 let minMaxB = minMaxData[paramB];
    //                 let rangeB = minMaxB.max - minMaxB.min;

    //                 let a = (valA - minMaxA.min)/rangeA;
    //                 let b = (valB - minMaxB.min)/rangeB;


    //                 vals.push(1/(a*b));

    //             }

    //         }
    //     })

    //     // Makes it so the lowest value is 0 and highest is 1
    //     let normalizedVals = normalize(vals)
    //     this.setColors(normalizedVals);
    // }

    updateMap(){
        let vals = [];
        this.paths.forEach((path, i) => {
            let countryData = this.data[path.getAttribute("country-code")];

            let countryVal = null;

            if(!countryData){
                // vals.push(null)
            } else {

                let paramA = this.params.a; let valA = countryData[paramA];
                    if(Array.isArray(valA) && paramA && valA) valA = valA[2];
                let paramB = this.params.b; let valB = countryData[paramB];
                    if(Array.isArray(valB) && paramB && valB) valB = valB[2];

                if(valA == null || valB == null){
                    // vals.push(null);

                } else {
                    let val = guiltCalc(paramA,paramB,valA,valB)
                    // vals.push(logA(valA),logB(valB))
                    countryVal = val;
                }
            }

            vals.push(countryVal);
        })

        let valsNorm = normalize(vals);


        this.setColors(valsNorm)
    }

    setColors(arr){

        let v = 0;
        this.paths.forEach((path,i) => {
            let t = arr[i];
            // console.log(t, path.getAttribute("country"));
            if(t == "no data" || t == null){
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
        let svgElem = this.svg._groups[0][0]
        let parentElem = svgElem.parentNode;

        let pBox = parentElem.getBoundingClientRect();
        svgElem.width = pBox
        console.log(pBox);
    }

}