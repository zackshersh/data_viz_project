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
import Intro from "./components/Intro";
import Footer from "./components/Footer";



function App() {

    const [mapHandler, setMapHandler] = useState(new MapHandler(".Map-Svg",".Map-Parent")); 
    const [scatterHandler, setScatterHandler] = useState(new ScatterHandler(".Scatter-Svg",".Scatter-Parent")); 
    
    const [paramA, setParamA] = useState("CO2 emissions, total (KtCO2)");
    const [paramB, setParamB] = useState("GDP ($)");

    const [filter, setFilter] = useState(1);

    const [mode,setMode] = useState(null);

    useEffect(() => {
        mapHandler.init();
        mapHandler.setParams(paramA,paramB);
        scatterHandler.init();
        scatterHandler.setParams(paramA,paramB);
        setMode("map")
    },[]);

    const handleParamChange = (e) => {
        let val = e.target.value;
        console.log(val)
        mapHandler.changeParam(val);
        scatterHandler.changeParam(val);
        setParamB(val);
    }

    const handleFilterChange = (e) => {
        mapHandler.setFilter(parseFloat(e.target.value))
        scatterHandler.setFilter(parseFloat(e.target.value))
        setFilter(e.target.value)
    }

    const toolBarProps = {
        paramA: paramA,
        paramB: paramB,
        handleParamChange: handleParamChange,
        dataProps: dataProps,
        mode: mode,
        setMode: setMode,
        filter: filter,
        handleFilterChange: handleFilterChange
    }

  return (
    <div className="App">
        <Header />
        <main>
            <Intro />
            <div className="Graphs-and-Toolbar">
                <ToolBar props={toolBarProps} />
                <div className="Graphs-Container">
                    <Map mode={mode}/>
                    <Scatter mode={mode} />
                    <div className="Plot-Spacer"></div>
                </div>
            </div>
            <Table />
        </main>
        <Footer />
    </div>
  );
}

export default App;

