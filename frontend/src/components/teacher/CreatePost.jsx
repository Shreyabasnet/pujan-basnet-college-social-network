import React, { useState, useRef } from 'react';
import { Image, Send, X, File } from 'lucide-react';

import api from '../../services/api';
import toast from 'react-hot-toast';

const CreatePost = ({ onPostCreated }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);
    const fileInputRefPdf = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedMimeTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
            const allowedExtensions = ['pdf', 'doc', 'docx'];

            if (!allowedMimeTypes.includes(selectedFile.type) || !allowedExtensions.includes(fileExtension)) {
                toast.error('Only PDF, DOC, and DOCX files are allowed');
                return;
            }
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = () => {
        setFile(null);
        setFileName('');
        if (fileInputRefPdf.current) fileInputRefPdf.current.value = '';
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && !image && !file) return;

        const formData = new FormData();
        formData.append('text', text);
        if (image) {
            formData.append('image', image);
        }
        if (file) {
            formData.append('file', file);
        }

        try {
            await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setText('');
            removeImage();
            removeFile();
            toast.success('Post created!');
            if (onPostCreated) onPostCreated();
        } catch (error) {
            toast.error('Failed to create post');
        }
    };


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create Post</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full rounded-lg border-gray-200 border p-3 focus:ring-primary-500 focus:border-primary-500 min-h-[100px] resize-none"
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>

                {preview && (
                    <div className="relative mt-2 rounded-lg overflow-hidden w-fit">
                        <img src={preview} alt="Preview" className="h-48 object-cover rounded-lg" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {fileName && (
                    <div className="mt-2 flex items-center bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
                        <File className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm text-gray-700 max-w-[200px] truncate">{fileName}</span>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="ml-2 text-gray-400 hover:text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center text-gray-500 hover:text-primary-600 transition text-sm font-medium"
                        >
                            <Image className="h-5 w-5 mr-1" />
                            Photo
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRefPdf.current.click()}
                            className="flex items-center text-gray-500 hover:text-primary-600 transition text-sm font-medium"
                        >
                            <File className="h-5 w-5 mr-1" />
                            Document
                        </button>
                        <input
                            type="file"
                            ref={fileInputRefPdf}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!text.trim() && !image && !file}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Post
                        <Send className="h-4 w-4 ml-2" />
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CreatePost;
