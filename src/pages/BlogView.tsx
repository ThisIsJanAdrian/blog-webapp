import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import LoadingScreen from '../components/LoadingScreen';

interface Blog {
    id: string
    title: string
    content: string
    image_url?: string | null
    created_at: string
    created_by: string
    profiles?: {
        username: string
    }
};

interface Comment {
    id: string
    content: string
    image_url?: string | null
    created_at: string
    created_by: string
};

export default function BlogView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string | null>(null);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            if (!data.user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', data.user.id)
                .single();

            setUsername(profile?.username ?? null);
        });
    }, []);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select(`
                        id,
                        title,
                        content,
                        image_url,
                        created_at,
                        created_by,
                        profiles (
                            username
                        )
                    `)
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    console.error(error);
                    navigate('/feed');
                    return;
                }

                else {
                    setBlog(data || []);
                };
            } 
            
            catch (err) {
                console.error(err);
            }

            finally {
                setLoading(false);
            };
        };

        fetchBlog();

    }, [id, navigate]);

    useEffect(() => {
        if (!id) return;

        const fetchComments = async () => {
            const { data, error } = await supabase
            .from('comments')
            .select(`
            id,
            content,
            image_url,
            created_at,
            created_by
            `)
            .eq('blog_id', id)
            .order('created_at', { ascending: true });

            if (!error) setComments(data || []);
        };

        fetchComments();
    }, [id]);

    const handleCommentSubmit = async () => {
        if (!username) return;

        if (!commentText.trim() || !id) return;
        setSubmitting(true);

        let image_url = null;

        if (commentImage) {
            const fileName = `${Date.now()}_${commentImage.name}`;
            await supabase.storage.from('blog-images').upload(fileName, commentImage);
            const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
            image_url = data.publicUrl;
        };

        const { error } = await supabase.from('comments').insert({
            blog_id: id,
            content: commentText,
            image_url,
            created_by: username,
        });

        if (error) {
            console.error('Insert failed:', error);
            setSubmitting(false);
            return;
        };

        setCommentText('');
        setCommentImage(null);
        setSubmitting(false);

        const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('blog_id', id)
            .order('created_at', { ascending: true });

        setComments(data || []);
    };

    if (loading || !blog) return <LoadingScreen />;

    return (
        <div className='feed-container'>
            <h3>{blog.title}</h3>
            <p style={{ marginTop: '-1.2rem', fontSize: '0.8rem', color: '#121b2c' }}>
                by <strong>{blog.profiles?.username ?? 'Unknown user'}</strong>
            </p>

            <p>{blog.content}</p>

            {blog.image_url && (
                <div className='blog-image-wrapper'>
                    <img
                    src={blog.image_url}
                    alt={blog.title}
                    className='blog-image'
                    onClick={() => setLightboxImage(blog.image_url)}
                    />
                </div>
            )}

            <small>
                {new Date(blog.created_at).toLocaleString()}
            </small>

            <div className='comment-input-wrapper'>
                {commentImage && (
                    <div className="comment-image-preview">
                        <img
                            src={URL.createObjectURL(commentImage)}
                            alt="Preview"
                            onClick={() => setLightboxImage(URL.createObjectURL(commentImage))}
                        />
                        <button
                            className="remove-image-button"
                            onClick={() => setCommentImage(null)}
                        >
                            <strong>✕</strong>
                        </button>
                    </div>
                )}

                <textarea
                    placeholder='Babble a comment...'
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                />

                <div className='comment-actions'>
                    <button
                        type='button'
                        className='image-button'
                        onClick={() => document.getElementById('comment-image-input')?.click()}
                        >
                            Add image
                    </button>

                    <input
                        id='comment-image-input'
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={(e) => e.target.files && setCommentImage(e.target.files[0])}
                    />

                    <button
                        type='button'
                        disabled={!commentText.trim() || submitting}
                        onClick={handleCommentSubmit}
                    >
                        Post
                    </button>
                </div>
            </div>

            <div className='comments-section'>
                {comments.map((comment) => (
                    <div key={comment.id} className='comment-card'>
                        <p style={{ marginTop: '-0.5rem', color: '#121b2c' }}>
                            <strong>{comment.created_by}</strong>
                        </p>
                        <p>{comment.content}</p>

                        {comment.image_url && (
                            <div>
                                <img
                                src={comment.image_url}
                                alt='comment'
                                className='comment-image'
                                onClick={() => setLightboxImage(comment.image_url)}
                                />
                            </div>
                        )}

                        <small>
                            <span className='comment-time'>
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </small>
                    </div>
                ))}
            </div>

            {lightboxImage && (
                <div className='lightbox-overlay' onClick={() => setLightboxImage(null)}>
                    <img src={lightboxImage} alt='Full view' className='lightbox-image' />
                </div>
            )}
        </div>
    );
};