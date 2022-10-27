function refactorJSON(){
    // console.log(data)
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
            newObj[row.series_name] = value
            obj[row.country_code] = newObj;
        } else {
            let existingRow = obj[row.country_code];
            existingRow[row.series_name] = value
        }
    })
    console.log(obj)
    console.log(JSON.stringify(obj))
}