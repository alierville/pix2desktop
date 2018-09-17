import * as React from "react";
import {socket} from './socket';
import axios from 'axios';
import loader from './loader.svg';

interface State {
    uploadStatus: 'idle' | 'progress' | 'error' | 'success'
}

interface Props {
    uniqueID: string
}


export default class Upload extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            uploadStatus: 'idle'
        }

        this.uploadFile = this.uploadFile.bind(this);
    }

    componentDidMount() {
        // Push to node that we reached the upload page
        socket.emit('onEnterUpload', {uniqueID: this.props.uniqueID})
    }


    uploadFile(e: any) {
        const file = e.target.files[0];
        if (file) {
            if (/^image\//i.test(file.type)) {
                this.setState({
                    uploadStatus: 'progress'
                })
                this.readFile(file);
            } else {
                this.setState({
                    uploadStatus: 'error'
                })
            }
        }
    }

    readFile(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => this.processFile(reader.result, file.type);
        reader.onerror = () => {
            this.setState({
                uploadStatus: 'error'
            })
        };
        reader.readAsDataURL(file);
    }

    processFile(dataURL: any, fileType: string) {
        const maxWidth = 500;
        const maxHeight = 500;

        const image = new Image();
        image.src = dataURL;

        image.onload = () => {
            const width = image.width;
            const height = image.height;
            const shouldResize = (width > maxWidth) || (height > maxHeight);

            if (!shouldResize) {
                this.sendFile(dataURL);
                return;
            }

            let newWidth;
            let newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;


            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(image, 0, 0, newWidth, newHeight);
            }
            dataURL = canvas.toDataURL(fileType);

            this.sendFile(dataURL);
        };

        image.onerror = () => {
            this.setState({
                uploadStatus: 'error'
            })
        };
    }

    async sendFile(fileData: any) {
        const formData = new FormData();
        formData.append('image', fileData);
        formData.append('uniqueID', this.props.uniqueID);

        try {
            const response = await axios.post(process.env.REACT_APP_API + '/upload', formData);
            this.parseResult(response.data);
        } catch (err) {
            console.log(err);
            this.setState({
                uploadStatus: 'error'
            })
        }
    }


    parseResult(payload: any) {
        this.setState({
            uploadStatus: payload.success === true ? 'success' : 'error'
        })
    }

    render() {
        return <div className="upload">
            <h1>Taking picture (smartphone) {(this.state.uploadStatus === 'error') ?
                <span
                    className="label label-warning">Something wrong occurred with the uploaded file</span>
                : null}

                {(this.state.uploadStatus === 'success') ?
                    <span
                        className="label label-success">Done</span>
                    : null}</h1>
            <hr/>
            <div className="upload-form">
                {(this.state.uploadStatus === 'progress') ?
                    <label className="upload-form-loader">
                        <img src={loader}/>
                    </label>
                    :
                    <span className="btn btn-default btn-file">
                        <input type="file" capture={true} accept="image/*;capture=camera"
                               onChange={this.uploadFile}/>
                        Click here
                    </span>
                }
            </div>
        </div>
    }
}