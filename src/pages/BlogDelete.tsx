import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useState } from 'react'

export default function BlogDelete() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const handleDelete = async () => {
        if (!id) return

        setDeleting(true)

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id)

        if (error) {
            setError('Failed to delete blog.')
            setDeleting(false)
            return
        }

        navigate('/feed')
    }

    return (
        <div className='feed-container'>
            <div className='post-composer'>
                <h2>Delete post</h2>
                <p>This action cannot be undone.</p>

                {error && <p className='error-message'>{error}</p>}

                <div className='comment-actions'>
                    <button
                        type='button'
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type='button'
                        disabled={deleting}
                        style={{ background: '#d9534f', color: '#fff' }}
                        onClick={handleDelete}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}
