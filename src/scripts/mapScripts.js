import * as d3 from "d3";
import { feature } from "topojson";
import TopoJSON from "../data/TopoJSON.json";



export class MapHandler {
    constructor(svgClass){
        this.svgClass = svgClass;
        this.svg = undefined;
        this.data = TopoJSON;
    }

    init(){
        this.svg = d3.select(this.svgClass);

        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");
        
        this.generateMap();
    }

    generateMap(){

        const projection = d3.geoMercator();
        const pathGenerator = d3.geoPath();

        const countries = feature(this.data, this.data.objects.countries);
        console.log(countries)
    }
}