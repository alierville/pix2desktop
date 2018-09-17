import * as React from 'react';
import v4 = require('uuid/v4'); // TS style
import {socket} from './socket';

interface State {
    uniqueID?: string
    status?: 'sync' | 'image_received',
    image?: string | undefined
}

export default class Qr extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {} as State;
    }

    componentDidMount() {
        // Generate unique ID
        const uniqueID = v4();

        // Relate the unique ID to the current socket session
        socket.emit('onRelUniqueID', {uniqueID})

        // Update set to force rendering
        this.setState({uniqueID});

        // Update the current flow status
        socket.on('onStatusChanged', (mess: any) => {
            this.setState({
                image: mess.image || undefined,
                status: mess.status
            })
        })
    }

    componentWillUnmount() {
        // Destroy the unique ID from node server
        if (this.state.uniqueID !== undefined) {
            socket.emit('onRmUniqueID', {uniqueID: this.state.uniqueID})
        }
    }

    header(addH3 = false) {
        return (
            <header>
                <h1>Send pix with your mobile device <label className="label label-info">{this.state.status}</label></h1>
                {addH3 ? <h3>Scan QR code in order to sync you mobile device to this page</h3> : null}
                <hr/>
            </header>
        )
    }

    render() {
        if (!this.state.status) {
            return (
                <div className="Qr">
                    {this.header(true)}
                    {(this.state.uniqueID !== undefined) ?
                        <img src={`http://pix2desktop.backend.local/qr/${this.state.uniqueID}`}/> : null}
                </div>
            );
        } else {
            return (
                <div>
                    {this.header()}
                    {(this.state.image !== undefined) ? <img srcSet={this.state.image}/> : null}
                </div>
            )
        }
    }
}