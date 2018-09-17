import * as React from 'react';
import './App.css';
import Upload from './Upload';
import Qr from './Qr';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

const UploadComp = ({match}: any) => (
    <Upload uniqueID={match.params.uniqueID} />
);

class App extends React.Component {
    public render() {
        return (
            <Router>
                <div className="App">
                    <Route exact path="/" component={Qr}/>
                    <Route path="/upload/:uniqueID" component={UploadComp}/>
                </div>
            </Router>
        );
    }
}

export default App;