// // file is not Routed anywere, after routing successfully plese remove this comment.


// // eslint-disable-next-line no-unused-vars
// import React from 'react'
// import Navbar from './navbar'
// import Footer from './Footer'


// import { useState } from 'react';

// function UploadFile() {

//     const [selectedFile, setSelectedFile] = useState(null);

//     const handleFileChange = (e) => {
//         setSelectedFile(e.target.files[0]);
//     };

//     const handleUpload = () => {
//         console.log(selectedFile);
//     };



//     return (
//         <>
//             <Navbar />

//             <div>
//                 <div className="min-h-screen container md:px-20 px-4 space-y-5 pt-52">
//                     <h2 className="text-2xl font-bold mb-6 text-pink-800 text-center">Uplode the file, It`s good to helping others</h2>
//                     <form className='space-y-5'>
//                         <div className="mb-4">
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 placeholder='Name Your Book '
//                                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                                 required
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <label htmlFor="text" className="block text-sm font-medium text-gray-700">Discription</label>
//                             <input
//                                 type="text"
//                                 id="text"
//                                 name="text"
//                                 placeholder='what kind of book it is ?'
//                                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                                 required
//                             />
//                         </div>

//                         <select className='mt-1 block w-full p-2 border border-gray-300 rounded-md transition duration-200 ' required>
//                             <option value="Enfineering">Select</option>
//                             <option value="Enfineering">Engineering</option>
//                             <option value="Medical">Medical</option>
//                             <option value="BSc">BSc</option>
//                             <option value="Finance">Finance</option>
//                         </select>

                        


//                         <div className="max-w-md mx-auto text-center space-y-5">
//                             <input
//                                 type="file"
//                                 onChange={handleFileChange}
//                                 className="border border-gray-300 p-2 w-full"
//                                 required
//                             />
//                             <button
//                                 onClick={handleUpload}
//                                 className="mt-4 bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
//                             >
//                                 Upload
//                             </button>
//                             {selectedFile && (
//                                 <div className="mt-4">
//                                     <p className="font-semibold">Selected File:</p>
//                                     <p>{selectedFile.name}</p>
//                                 </div>
//                             )}
//                         </div>




//                         {/* <div>
//                         You can contact us via <a href='www.linkedin.com/in/pratik-ade-45014825b'>Linkdin</a> of <a>Facebook</a> or <a>Instagram</a>
//                     </div> */}
//                     </form>
//                     <p className='mt-24'>Note : Do not share anything weird or illegal. If anything inappropriate is shared from your ID, then you will be responsible for any further inquiry. The website only provides you a platform to help each other in studying.
//                     </p>
            
//                 </div>
//                 </div>

//             <Footer />
//         </>
//     )
// }

// export default UploadFile


// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import Navbar from './navbar'
import Footer from './Footer'
import axios from 'axios'

function UploadFile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: ''
    });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Please select a file to upload' });
            return;
        }

        if (!formData.name || !formData.description || !formData.category) {
            setMessage({ type: 'error', text: 'Please fill all fields' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('file', selectedFile);
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('category', formData.category);

        try {
            await axios.post('http://localhost:5000/api/notes/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMessage({ type: 'success', text: 'Note uploaded successfully!' });
            
            // Reset form
            setSelectedFile(null);
            setFormData({
                name: '',
                description: '',
                category: ''
            });
            
            // Reset file input
            e.target.reset();
            
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to upload note' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div>
                <div className="min-h-screen container md:px-20 px-4 space-y-5 pt-52">
                    <h2 className="text-2xl font-bold mb-6 text-pink-800 text-center">Upload the file, It`s good to helping others</h2>
                    
                    {message.text && (
                        <div className={`p-4 rounded-md ${
                            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleUpload} className='space-y-5'>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder='Name Your Book'
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder='What kind of book it is?'
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <select 
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className='mt-1 block w-full p-2 border border-gray-300 rounded-md transition duration-200'
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Medical">Medical</option>
                            <option value="BSc">BSc</option>
                            <option value="Finance">Finance</option>
                        </select>

                        <div className="max-w-md mx-auto text-center space-y-5">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="border border-gray-300 p-2 w-full"
                                required
                            />
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`mt-4 bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded ${
                                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                            {selectedFile && (
                                <div className="mt-4">
                                    <p className="font-semibold">Selected File:</p>
                                    <p>{selectedFile.name}</p>
                                </div>
                            )}
                        </div>
                    </form>
                    
                    <p className='mt-24'>Note: Do not share anything weird or illegal. If anything inappropriate is shared from your ID, then you will be responsible for any further inquiry. The website only provides you a platform to help each other in studying.</p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default UploadFile
