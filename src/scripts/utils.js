import data from "../data/worldbank_climatedata_cropped.json"

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
            let v1 = parseInt(split[0]); let v2 = parseInt(split[1]);
            
            value = [v1,v2,v2-v1]
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
        r: exerp(a.r,b.r,t),
        g: exerp(a.g,b.g,t),
        b: exerp(a.b,b.b,t)

    }

    return colorString(rgb);
}