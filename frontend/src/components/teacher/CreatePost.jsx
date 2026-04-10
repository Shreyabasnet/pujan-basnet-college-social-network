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
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)]">
            <div className="h-1 bg-gradient-to-r from-primary-500 via-cyan-400 to-emerald-400" />
            <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Compose</p>
                        <h3 className="mt-1 text-lg font-black text-slate-900">Create a new post</h3>
                    </div>
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                        Share to the feed
                    </span>
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="min-h-[140px] w-full resize-none rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-100"
                        placeholder="Share an update, resource, question, or class announcement..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>

                    {preview && (
                        <div className="relative mt-3 w-fit overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50 shadow-sm">
                            <img src={preview} alt="Preview" className="h-48 object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1.5 text-white backdrop-blur transition hover:bg-slate-900"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {fileName && (
                        <div className="mt-3 flex w-fit items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
                            <File className="mr-2 h-5 w-5 text-red-500" />
                            <span className="max-w-[220px] truncate text-sm font-medium text-slate-700">{fileName}</span>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="ml-2 text-slate-400 transition hover:text-red-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700"
                            >
                                <Image className="mr-1 h-5 w-5" />
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
                                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700"
                            >
                                <File className="mr-1 h-5 w-5" />
                                Document
                            </button>
                            <input
                                type="file"
                                ref={fileInputRefPdf}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />
                            <p className="text-xs text-slate-500">PDF, DOC, and DOCX files are supported.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={!text.trim() && !image && !file}
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-cyan-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:-translate-y-0.5 hover:from-primary-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            Post
                            <Send className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
