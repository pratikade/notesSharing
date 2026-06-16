// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './navbar';
import Footer from './Footer';
import axios from 'axios';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:5000/api/note';
            if (selectedCategory !== 'all') {
                url = `http://localhost:5000/api/notes/category/${selectedCategory}`;
            }
            const response = await axios.get(url);
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);


    const handleDownload = async (noteId) => {
        try {
            // Find the note to get its URL
            const note = notes.find(n => n._id === noteId);
            if (note) {
                // Increment download count
                await axios.put(`http://localhost:5000/api/notes/download/${noteId}`);
                // Open file in new tab
                window.open(note.fileUrl, '_blank');
                // Refresh notes to update download count
                fetchNotes();
            }
        } catch (error) {
            console.error('Error downloading:', error);
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
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'Engineering', 'Medical', 'BSc', 'Finance'];

    return (
        <>
            <Navbar />
            <div className="min-h-screen container md:px-20 px-4 pt-52">
                <h2 className="text-3xl font-bold mb-8 text-pink-800 text-center">Shared Notes</h2>
                
                {/* Search and Filter Section */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-pink-500 hover:bg-pink-700 text-white px-6 py-2 rounded-md"
                        >
                            Search
                        </button>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-md transition ${
                                    selectedCategory === category
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {category === 'all' ? 'All Notes' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes Display */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        <p className="mt-2 text-gray-600">Loading notes...</p>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No notes found. Be the first to share!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map(note => (
                            <div key={note._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-semibold text-gray-800">{note.name}</h3>
                                        <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                                            {note.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{note.description}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span>📄 {note.fileName}</span>
                                        <span>📥 {note.downloads} downloads</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => handleDownload(note._id)}
                                            className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm transition"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Notes