/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Cards({ item, isUploaded, onDownload }) {
    const navigate = useNavigate();

    const handleReadMore = () => {
        if (isUploaded && onDownload) {
            // For uploaded books, trigger download
            onDownload(item.id, item.fileUrl);
        } else {
            // For static books, navigate to book details
            navigate(`/book/${item.id}`);
        }
    };

    const handleDownload = () => {
        if (isUploaded && onDownload) {
            onDownload(item.id, item.fileUrl);
        } else if (item.fileUrl) {
            // If static book has a file URL
            window.open(item.fileUrl, '_blank');
        } else {
            // Fallback for static books without download link
            alert('Download link not available for this book');
        }
    };

    return (
        <>
            <div className='mt-5 ml-5'>
                <div className="card bg-base-100 w-80 h-auto shadow-xl hover:scale-105 duration-200 dark:bg-slate-900 dark:text-white">
                    <figure className="h-48 overflow-hidden">
                        <img
                            src={item.image || item.imageUrl || 'https://via.placeholder.com/400x300?text=Book+Cover'}
                            alt={item.title || item.name || 'Book'}
                            className="w-full h-full object-cover"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title line-clamp-1">
                            {item.title || item.name}
                            {isUploaded && (
                                <div className="badge badge-secondary text-xs">NEW</div>
                            )}
                        </h2>
                        
                        {item.category && (
                            <div className="badge badge-primary badge-outline">
                                {item.category}
                            </div>
                        )}
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {item.description || 'No description available'}
                        </p>
                        
                        {isUploaded && (
                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <span>📥 {item.downloads || 0} downloads</span>
                                <span>📄 {item.fileName || 'PDF'}</span>
                            </div>
                        )}
                        
                        <div className="card-actions justify-between mt-4">
                            <button 
                                onClick={handleReadMore}
                                className="badge badge-outline p-3 hover:bg-pink-500 hover:text-white cursor-pointer transition duration-200"
                            >
                                {isUploaded ? 'Download Now' : 'Read More'}
                            </button>
                            <button 
                                onClick={handleDownload}
                                className="badge badge-outline p-3 hover:bg-pink-500 hover:text-white cursor-pointer transition duration-200"
                            >
                                {isUploaded ? 'View' : 'Download'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cards