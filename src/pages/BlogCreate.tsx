import { useRef, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export default function BlogCreate() {
    const navigate = useNavigate()
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            let image_url = null

            if (imageFile) {
                const fileName = `${Date.now()}_${imageFile.name}`
                const { error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, imageFile)

            if (uploadError) {
                setError('Error uploading image')
                setLoading(false)
                return
            }

            const { data } = supabase.storage
                .from('blog-images')
                .getPublicUrl(fileName)

            image_url = data.publicUrl
            }

            const { data, error: insertError } = await supabase
                .from('blogs')
                .insert({
                    title,
                    content,
                    image_url,
                    created_by: (await supabase.auth.getUser()).data.user?.id,
                })

            if (insertError) {
                setError('Error creating blog')
                setLoading(false)
                return
            }

            navigate('/feed')
        } 
        
        catch (err) {
            console.error(err)
            setError('An unexpected error occurred')
        } 

        finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='feed-container'>
            <div className='post-composer'>
                <h2>Create blog</h2>
                {error && <p className='error-message'>{error}</p>}
                <input
                    className='post-title'
                    placeholder='Blog title here...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className='post-content-wrapper'>
                    {imageFile && (
                        <div className='comment-image-preview'>
                        <img src={URL.createObjectURL(imageFile)} alt='Preview' />
                        <button
                            type='button'
                            className='remove-image-button'
                            onClick={() => setImageFile(null)}
                        >
                            ✕
                        </button>
                        </div>
                    )}

                    <textarea
                        ref={textareaRef}
                        placeholder='Babble away...'
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value)
                            if (textareaRef.current) {
                                textareaRef.current.style.height = 'auto'
                                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
                        }
                    }}
                        rows={6}
                    />

                    <div className='comment-actions'>
                        <button
                            type='button'
                            className='image-button'
                            onClick={() => document.getElementById('blog-image-input')?.click()}
                        >
                            Add image
                        </button>

                        <input
                            id='blog-image-input'
                            type='file'
                            accept='image/*'
                            hidden
                            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                        />

                        <button
                            type='button'
                            disabled={!title.trim() || !content.trim() || submitting}
                            onClick={handleSubmit}
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}