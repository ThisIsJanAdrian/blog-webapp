import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import LoadingScreen from '../components/LoadingScreen';
import BackButton from '../components/BackButton';

export default function BlogUpdate() {
    const { id } = useParams()
    const navigate = useNavigate()
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        const fetchBlog = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('title, content, image_url')
                .eq('id', id)
                .single()

            if (error || !data) {
                navigate('/feed')
                return
            }

            setTitle(data.title)
            setContent(data.content)

            if (data.image_url != null) {
                const response = await fetch(data.image_url)
                const blob = await response.blob()
                const file = new File([blob], 'image.jpg', { type: blob.type })
                setImage(file)
            }

            setLoading(false)
        }

        fetchBlog()
    }, [id, navigate]);

    const handleUpdate = async () => {
        if (!id) return

        let finalImageUrl: string | null | undefined = undefined

        if (removeImage) {
        finalImageUrl = null
        }

        if (image) {
            const fileName = `${Date.now()}_${image.name}`
            await supabase.storage.from('blog-images').upload(fileName, image)
            const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
            finalImageUrl = data.publicUrl
        }

        const updates: any = {
            title,
            content,
        }

        if (finalImageUrl !== undefined) {
            updates.image_url = finalImageUrl
        }

        const { error } = await supabase
            .from('blogs')
            .update(updates)
            .eq('id', id)

        if (!error) {
            navigate(`/blog/${id}`)
        }
    }

    if (loading) return <LoadingScreen />

    return (
        <div className='feed-container'>
            <div className='post-composer'>
                <BackButton />
                <h2 style={{ margin: '1rem 0.2rem 0.6rem' }}>Edit blog</h2>
                {error && <p className='error-message'>{error}</p>}
                <input
                    className='post-title'
                    placeholder='Blog title here...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className='post-content-wrapper'>
                    {image && (
                        <div className='comment-image-preview'>
                        <img src={URL.createObjectURL(image)} alt='Preview' />
                        <button
                            type='button'
                            className='remove-image-button'
                            onClick={() => setRemoveImage(true)}
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
                            {image ? 'Replace image' : 'Add image'}
                        </button>

                        <input
                            id='blog-image-input'
                            type='file'
                            accept='image/*'
                            hidden
                            onChange={(e) => e.target.files && setImage(e.target.files[0])}
                        />

                        <button
                            type='button'
                            disabled={!title.trim() || !content.trim() || submitting}
                            onClick={handleUpdate}
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
