/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Footer from './Footer';

function ReadNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [selectedCategory]);

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = 'http://localhost:5000/api/notes';
            if (selectedCategory !== 'all') {
                url = `http://localhost:5000/api/notes/category/${selectedCategory}`;
            }
            const response = await axios.get(url);
            setNotes(response.data);
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError('Failed to load notes. Please make sure the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (note) => {
        try {
            // Increment download count
            await axios.put(`http://localhost:5000/api/notes/download/${note._id}`);
            // Open file in new tab
            window.open(note.fileUrl, '_blank');
            // Refresh notes to update download count
            fetchNotes();
        } catch (err) {
            console.error('Error downloading:', err);
            alert('Failed to download. Please try again.');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchNotes();
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/notes/search/${searchQuery}`);
            setNotes(response.data);
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const categories = ['all', 'Engineering', 'Medical', 'BSc', 'Finance'];

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    // Get file icon based on file type
    const getFileIcon = (fileName) => {
        const extension = fileName?.split('.').pop()?.toLowerCase();
        switch(extension) {
            case 'pdf':
                return '📕';
            case 'doc':
            case 'docx':
                return '📘';
            case 'txt':
                return '📄';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return '🖼️';
            default:
                return '📁';
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto md:px-20 px-4 pt-32 pb-12">
                    
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-pink-800 dark:text-pink-400 mb-4">
                            📚 Shared Notes Library
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Discover and download notes shared by the community
                        </p>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="🔍 Search notes by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-pink-500 hover:bg-pink-700 text-white px-8 py-3 rounded-lg transition duration-200 font-semibold"
                            >
                                Search
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-700 dark:text-gray-300 font-semibold mr-2">Filter by:</span>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                                        selectedCategory === category
                                            ? 'bg-pink-500 text-white shadow-md'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {category === 'all' ? 'All Notes' : category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Notes Count */}
                    {!loading && !error && notes.length > 0 && (
                        <div className="mb-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                Found <span className="font-bold text-pink-600 dark:text-pink-400">{notes.length}</span> note{notes.length !== 1 ? 's' : ''}
                                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notes...</p>
                        </div>
                    )}

                    {/* Notes Grid */}
                    {!loading && !error && notes.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Notes Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {selectedCategory !== 'all' 
                                    ? `No notes available in ${selectedCategory} category yet.`
                                    : 'No notes have been uploaded yet.'}
                            </p>
                            <button 
                                onClick={() => window.location.href = '/upload'}
                                className="bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold"
                            >
                                Upload a Note
                            </button>
                        </div>
                    )}

                    {/* Notes Cards Grid */}
                    {!loading && !error && notes.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes.map((note) => (
                                <div 
                                    key={note._id} 
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-white line-clamp-1">
                                                {note.name}
                                            </h3>
                                            <span className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded-full">
                                                {note.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                            {note.description}
                                        </p>

                                        {/* File Info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="mr-2">{getFileIcon(note.fileName)}</span>
                                                <span className="truncate">{note.fileName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                                <span>📏 {formatFileSize(note.fileSize)}</span>
                                                <span>📥 {note.downloads} downloads</span>
                                            </div>
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                📅 Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Download Button */}
                                        <button
                                            onClick={() => handleDownload(note)}
                                            className="w-full bg-pink-500 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                                        >
                                            <span>📥</span>
                                            Download Note
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer Note */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ⚠️ Please respect intellectual property rights. Only share notes that you have permission to distribute.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ReadNotes;
