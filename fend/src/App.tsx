import * as React from 'react';
import Upload from './Upload';
import Qr from './Qr';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Header from './Header';

const UploadComp = ({match}: any) => <Upload uniqueID={match.params.uniqueID}/>;

class App extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <Router>
                    <div className="App container">
                        <Route exact={true} path="/" component={Qr}/>
                        <Route path="/upload/:uniqueID" component={UploadComp}/>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;