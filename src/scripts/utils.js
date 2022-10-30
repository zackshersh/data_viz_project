import * as d3 from "d3"

import data from "../data/worldbank_climatedata_cropped.json"
import refactoredData from "../data/worldbank_climate_crop_refactor_floats.json"
import dataProps from "../data/worldbank_climate_props.json"
import minMaxData  from "../data/worldbank_climate_min-max.json"
import fairnessDirection from "../data/prop_fairness_direction.json"



function refactorJSON(){
    console.log(data)
    let obj = {};
    data.forEach((row,i) => {
        let value = row.value;
        if(value == ".."){
            value = null
        } else if (!value.includes("to")){
            value = parseFloat(value)
        } else if (value.includes("to")){
            let split = value.split(" to ")
            let v1 = parseFloat(split[0]); let v2 = parseInt(split[1]);
            let dif = Math.round((v2-v1)*10)/10

            value = [v1,v2,dif]
        }

        if(!obj[row.country_code]){
            let newObj = {};
            newObj.name = row.country_name
            newObj[row.series_name] = value;
            obj[row.country_code] = newObj;
        } else {
            let existingRow = obj[row.country_code];
            existingRow[row.series_name] = value
        }
    })
    console.log(obj)
    console.log(JSON.stringify(obj))
}


// refactorJSON();

export function rndmFlt(max){
    return Math.random()*max;
}

export function rndmInt(max){
    return Math.floor(Math.random()*max)
}

export function lerp(a,b,t){
    return a*(1-t)+b*t
}

export function exerp(a,b,t){
    return lerp(a,b,Math.pow(t,0.5));
}


export function colorString({r,g,b}){
    return `rgb(${r},${g},${b})`
}

export function colorLerp(a,b,t){
    let rgb = {
        r: lerp(a.r,b.r,t),
        g: lerp(a.g,b.g,t),
        b: lerp(a.b,b.b,t)

    }

    return colorString(rgb);
}

// reduces range of array from a lowest value of 0 to a highest value of 1
export function normalize(arr){

    let pruned = [];
    arr.forEach(num => {
        if(num && typeof num != "string"){
            pruned.push(num); 
        } else {
            pruned.push(null);
        }
    })

    let max = Math.max(...pruned); let min = Math.min(...pruned.filter(a => a != null));

    
    let norm = [];

    pruned.forEach((num) => {
        if(num && typeof num != "string"){
            norm.push((num-min)/(max-min))
        } else {
            norm.push(null)
        }

    
    });

    return norm
}

// takes large numbers and returns millions or billions or trillions and such
// export function simplifyNumber(number){
//     let abs = Math.abs(Math.floor(number));
//     console.log(abs);

// }

export function simplifyNumber(labelValue) {
    // Nine Zeroes for Billions
    return typeof labelValue == "string" ?
    
    "No Data"
    
    : Math.abs(Number(labelValue)) >= 1.0e+12

    ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + " Trillion"
    
    : Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " Billion"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " Million"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? Math.abs(Number(labelValue) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue))
    


}

console.log(simplifyNumber("sjdnfk"))

function commafy( num ) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}


export function guiltCalc(paramA,paramB,valA,valB){
    // Logarithmic Normalization

    // 1 means that having a higher value for that property = more fair
        // ie, higher GDP, means more fair
    // -1 means having lower values for that property = more fair
        // ie, lower % below 5 m, means more fair
    let fairDir = fairnessDirection[paramB];
        
        let logA = d3.scaleLog()
        .domain([minMaxData[paramA].min, minMaxData[paramA].max])
        .range([0,1]);
        let logB = d3.scaleLog()
        .domain([minMaxData[paramB].min+0.01, minMaxData[paramB].max])
        .range([0,1]);

    if(fairDir == -1) valB = 1/valB;

    let val = 1-(logA(valA)*(logB(valB)));
    val = val*(1-logA(valA))    // console.log(val)
    return val
}

export function roundDec(num,places){
    if(typeof num != "number"){
        return num
    } else {
        return parseFloat(num.toFixed(places));
    }
    
}
