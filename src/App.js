import data from "./data/worldbank_climate_crop_refactor.json"
import Header from "./components/Header";
import "./styles/main.css"
import Map from "./components/Map";



function App() {
  return (
    <div className="App">
        <Header />
        <main>
            <Map />
        </main>
    </div>
  );
}

export default App;

