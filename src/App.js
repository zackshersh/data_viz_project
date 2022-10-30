import {useEffect, useState} from "react"
import data from "./data/worldbank_climate_crop_refactor.json"
import Header from "./components/Header";
import "./styles/main.css"
import Map from "./components/Map";
import Scatter from "./components/Scatter";

import dataProps from "./data/worldbank_climate_props.json";
import { MapHandler } from './scripts/mapScripts';
import { ScatterHandler } from "./scripts/scatterScripts";
import ContentWrapper from "./components/ContentWrapper";
import ToolBar from "./components/ToolBar";
import Table from "./components/Table";



function App() {

    const [mapHandler, setMapHandler] = useState(new MapHandler(".Map-Svg",".Map-Parent")); 
    const [scatterHandler, setScatterHandler] = useState(new ScatterHandler(".Scatter-Svg",".Scatter-Parent")); 
    
    const [paramA, setParamA] = useState("CO2 emissions, total (KtCO2)");
    const [paramB, setParamB] = useState("GDP ($)");

    const [selection, setSelection] = useState(null);

    useEffect(() => {
        mapHandler.init();
        mapHandler.setParams(paramA,paramB);
        scatterHandler.init();
        scatterHandler.setParams(paramA,paramB);
    },[]);

    const handleParamChange = (e) => {
        let val = e.target.value;
        console.log(val)
        mapHandler.changeParam(val);
        scatterHandler.changeParam(val);
        setParamB(val);
    }

    const toolBarProps = {
        paramA: paramA,
        paramB: paramB,
        handleParamChange: handleParamChange,
        dataProps: dataProps
    }

  return (
    <div className="App">
        <Header />
        <main>
            <ToolBar props={toolBarProps} />
            <Map />
            <Scatter />
            <Table />
        </main>
    </div>
  );
}

export default App;

