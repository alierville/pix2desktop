import * as React from "react";
import axios from 'axios';
import {socket} from './socket';

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

        this.uploadFile.bind(this);
    }

    componentDidMount() {
        console.log('asdsad',process.env.REACT_APP_SECRET_CODE);

        // Push to node that we reached the upload page
        socket.emit('onEnterUpload', {uniqueID: this.props.uniqueID})
    }


    uploadFile(e: any) {
        let file = e.target.files[0];
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
            if (context)
                context.drawImage(image, 0, 0, newWidth, newHeight);
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
        var formData = new FormData();
        formData.append('image', fileData);
        formData.append('uniqueID', this.props.uniqueID);

        try {
            let response = await axios.post('http://pix2desktop.backend.local/upload', formData);
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
            <div className="upload-form">
                {(this.state.uploadStatus === 'progress') ?
                    <label className="upload-form-loader">
                        <img src="/img/loader.svg"/>
                    </label>
                    :
                    <label className="upload-form-button">
                        <input type="file" capture accept="image/*;capture=camera"
                               onChange={(e) => this.uploadFile(e)}/>
                    </label>
                }
                {(this.state.uploadStatus === 'error') ?
                    <span
                        className="upload-form-error">Something wrong occurred with the uploaded file</span>
                    : null}

                {(this.state.uploadStatus === 'success') ?
                    <span
                        className="upload-form-error">done</span>
                    : null}
                <span className="upload-form-description">Please select any image</span>
            </div>
        </div>
    }
}