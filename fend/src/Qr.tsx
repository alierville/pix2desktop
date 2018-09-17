import * as React from 'react';
import * as v4 from 'uuid/v4';
import {socket} from './socket';

interface State {
    uniqueID?: string
    status?: 'sync' | 'image_received',
    image?: string
}

export default class Qr extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {} as State;
    }

    componentDidMount() {
        // generate unique ID
        const uniqueID = v4();

        // relate the unique ID to the current socket session
        socket.emit('onRelUniqueID', {uniqueID: uniqueID})

        //update set to force rendering
        this.setState({
            uniqueID: uniqueID
        });

        // Update the current flow status
        socket.on('onStatusChanged', (mess: any) => {
            this, this.setState({
                status: mess.status,
                image: mess.image || undefined
            })
        })
    }

    componentWillUnmount() {
        // destroy the unique ID from node server
        if (this.state.uniqueID !== undefined)
            socket.emit('onRmUniqueID', {uniqueID: this.state.uniqueID})
    }

    public render() {
        if (!this.state.status) {
            return (
                <div className="Qr">
                    {(this.state.uniqueID !== undefined) ?
                        <img src={`http://pix2desktop.backend.local/qr/${this.state.uniqueID}`}/> : null}
                    Please scan this QR code in order to sync you mobile device
                </div>
            );
        } else {
            return (
                <div>
                    {this.state.status}
                    {(this.state.image !== undefined) ? <img srcSet={this.state.image}/> : null}
                </div>
            )
        }
    }
}