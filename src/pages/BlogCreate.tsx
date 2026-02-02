import { React, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export default function BlogCreate() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
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
        <div className="feed-container">
            <h1>Create Blog Post</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <br />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                />
                <br />
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Post</button>
            </form>
        </div>
    );
}