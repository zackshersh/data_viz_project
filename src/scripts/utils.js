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
        if(num && typeof num != "string") pruned.push(num);
    })

    let max = Math.max(...pruned); let min = Math.min(...pruned);

    let norm = [];

    pruned.forEach(num => norm.push((num-min)/(max-min)));

    return norm
}

// takes large numbers and returns millions or billions or trillions and such
// export function simplifyNumber(number){
//     let abs = Math.abs(Math.floor(number));
//     console.log(abs);

// }

export function simplifyNumber(labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue));

}