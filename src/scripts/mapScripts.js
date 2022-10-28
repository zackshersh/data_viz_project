import * as d3 from "d3";
import { feature } from "topojson";
import TopoJSON from "../data/TopoJSON.json";
import data from "../data/worldbank_climate_crop_refactor.json";
import minMaxData from "../data/worldbank_climate_min-max.json";
import { colorLerp, colorString, lerp, rndmFlt, rndmInt } from "./utils";

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
            a: "CO2 emissions per capita (metric tons)",
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


    }

    createTooltip(){
        this.tooltip = d3.select(this.parentClass)
            .append("div")
            .attr("class","tooltip")
            .style("position", "absolute")
            .text("Doo Bop");


        const tooltipDisplay = false; 
        
        const pathMove = (e) => {
            let bbox = e.target.getBBox();
            let parentBox = e.target.parentNode.getBoundingClientRect();

            let relX = e.clientX - parentBox.x;
            let relY = e.clientY - parentBox.y;

            this.tooltip.style("top", e.clientY+"px");
            this.tooltip.style("left", relX+"px");
            this.tooltip.style("top", relY+"px");
        } 
        
        const pathEnter = (e) => {
            this.tooltip.style("display","block")

        }

        const pathLeave = (e) => {
            this.tooltip.style("display","none")
        }

        this.paths.forEach(path => path.addEventListener("mousemove",pathMove))
        this.paths.forEach(path => path.addEventListener("mouseenter",pathEnter))
        this.paths.forEach(path => path.addEventListener("mouseleave",pathLeave))


        d3.select(this.svgClass)
            .selectAll("path")
            // .on("mouseenter", function(e){
            //     let targetPath = e.target;
            //     let bbox = targetPath.getBBox();
            //     console.log(bbox);
            //     let parentBox = this.parentNode.getBoundingClientRect();
            //     console.log(parentBox);

            //     document.querySelector(".tooltip").style.top = bbox.y;


            //     // console.log(relX,relY)

            // })
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
    }

    updateMap(){
        let vals = [];
        this.paths.forEach((path,i) => {
            let countryData = this.data[path.getAttribute("country-code")];
            if(!countryData){
                vals.push(null)
            } else {
                
                // usually emissions per capita
                let paramA = this.params.a;
                let valA = countryData[paramA];

                //accounts for if it is of the types that have an array of data like change in avg temp
                if(Array.isArray(valA) && paramA) {
                    console.log(valA)
                } else {
                    // console.log(valA, "YES")
                }


                // the varied one
                let paramB = this.params.b;
                let valB = countryData[paramB];
                // if(typeof valB == "object" && paramB) valB = valB[2];

                if(Array.isArray(valB) && paramB) {
                    console.log(valB)
                    valB = valB[2];
                } else {
                    // console.log(valA, "YES")
                }

                // console.log(electric);
                if(!paramA || !paramB){
                    vals.push("no data")
                } else {
                    let minMaxA = minMaxData[paramA];
                    let rangeA = minMaxA.max - minMaxA.min;
                    
                    let minMaxB = minMaxData[paramB];
                    let rangeB = minMaxB.max - minMaxB.min;

                    let a = (valA - minMaxA.min)/rangeA;
                    let b = (valB - minMaxB.min)/rangeB;
                    // let minMax = minMaxData["GDP ($)"];
                    // let range = minMax.max - minMax.min;
                    // let t = (electric - minMax.min)/(range);

                    vals.push(b/a);

                }

            }
        })

        // console.log(vals);
        this.setColors(vals);
    }

    setColors(arr){
        this.paths.forEach((path,i) => {
            let t = arr[i];
            if(t == "no data" || t == null){
                path.style.fill = colorString(this.colors.noData)
            } else {
                path.style.fill = colorLerp(this.colors.min,this.colors.max,t);
            }
        })
    }


    changeParam(newVal){
        this.params.b = newVal;
        this.updateMap();
    }

}