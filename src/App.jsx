import { useState } from 'react';
import NoData from "./no-data.jsx";
import imageCompression from "browser-image-compression";

const App = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [originalImageSize, setOriginalImageSize] = useState(0);
    const [compressedImageSize, setCompressedImageSize] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOriginalImage(file);
            setOriginalImageSize((file.size / 1024).toFixed(2)); // Size in KB
            setCompressedImage(null);
            setCompressedImageSize(0);
        }
    };

    const handleCompression = async () => {
        if (!originalImage) {
            return alert("Please upload an image first");
        }
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };
        try {
            setIsCompressing(true);
            const compressedFile = await imageCompression(originalImage, options);
            const compressedFileUrl = URL.createObjectURL(compressedFile);
            setCompressedImage(compressedFileUrl);
            setCompressedImageSize((compressedFile.size / 1024).toFixed(2)); // Size in KB
            setIsCompressing(false);
        } catch (e) {
            console.error("Compression Error: ", e);
            setIsCompressing(false);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row shadow p-3 my-5 col-md-8 mx-auto">
                    <div className="my-2">
                        <input type="file" accept="image/*" onChange={handleChange} />
                    </div>
                    <div className="col-md-6 p-4">
                        {originalImage === null ? (
                            <NoData />
                        ) : (
                            <div>
                                <h4>Original Image</h4>
                                <div
                                    style={{
                                        height: '40vh',
                                        overflow: 'hidden',
                                        backgroundSize: 'cover',
                                    }}
                                    className="d-flex flex-column align-items-center text-center border border-success"
                                >
                                    <img
                                        className="img-fluid"
                                        src={URL.createObjectURL(originalImage)}
                                        alt="Original Image"
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                                <p>Size: {originalImageSize} KB</p>
                                <button
                                    className="btn btn-success mt-3"
                                    onClick={handleCompression}
                                    disabled={isCompressing}
                                >
                                    {isCompressing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Compressing...
                                        </>
                                    ) : (
                                        "Compress"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 p-4">
                        {compressedImage === null ? (
                            <div className="text-center">
                                <p>No Compressed Image Yet</p>
                            </div>
                        ) : (
                            <div>
                                <h4>Compressed Image</h4>
                                <div
                                    style={{
                                        height: '40vh',
                                        overflow: 'hidden',
                                        backgroundSize: 'cover',
                                    }}
                                    className="d-flex flex-column align-items-center text-center border border-primary"
                                >
                                    <img
                                        className="img-fluid"
                                        src={compressedImage}
                                        alt="Compressed Image"
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                                <p>Size: {compressedImageSize} KB</p>
                                <a
                                    href={compressedImage}
                                    className="btn btn-primary mt-3"
                                    download="compressed-image.jpg"
                                >
                                    Download
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
