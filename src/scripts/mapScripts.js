import * as d3 from "d3";
import { feature } from "topojson";
import TopoJSON from "../data/TopoJSON.json";
import data from "../data/worldbank_climate_crop_refactor.json"
import { rndmFlt } from "./utils";

export class MapHandler {
    constructor(svgClass){
        this.svgClass = svgClass;
        this.svg = undefined;
        this.data = data;
        this.mapData = TopoJSON;
    }

    init(){
        this.svg = d3.select(this.svgClass);

        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");
        
        this.generateMap();
    }


    generateMap(scale = 2.5){

        console.log(this.mapData)
        const projection = d3.geoMercator()
            .scale(this.width/scale/Math.PI)
            .center([0,0]);
        const pathGenerator = d3.geoPath().projection(projection);

        const countries = feature(this.mapData, this.mapData.objects.countries);
        console.log(this.svg.selectAll("path"))
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
                    console.log("HEY")
                    path.classList.add("white")
                }
            })

        })


    }
}