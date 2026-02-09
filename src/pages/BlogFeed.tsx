import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
}

export default function BlogFeed() {

    const navigate = useNavigate();
    
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const PAGE_SIZE = 5;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user ? user.id : null);
        });
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, error, count } = await supabase
                .from('blogs')
                .select(
                    `
                    id,
                    title,
                    content,
                    image_url,
                    created_at,
                    created_by,
                    profiles (
                        username
                    )
                    `,
                    { count: 'exact' }
                )
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                console.error(error);
            } else {
                setBlogs(data || []);
                setTotalCount(count ?? 0);
            }

            setLoading(false);
        };

        fetchBlogs();
    }, [page]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='page'>
            <div className='feed-container'>
                <form>
                    <button type='button' onClick={() => window.location.href = '/create'}>
                        Create Blog
                    </button>
                    <button type='button' onClick={() => window.location.href = '/logout'}>
                        Logout
                    </button>
                </form>

                {blogs.map((blog) => (
                    <div className='blog-card' key={blog.id} style={{ marginBottom: '1rem' }}>
                        <div className='blog-text' onClick={() => navigate(`/blog/${blog.id}`)}>
                            <h3>{blog.title}</h3>
                            <p style={{ marginTop: '-1.2rem', fontSize: '0.8rem', color: '#121b2c' }}>
                                by <strong>{blog.profiles?.username ?? 'Unknown user'}</strong>
                            </p>
                            <p className='line-clamp-2' style={{ whiteSpace: 'pre-wrap' }}>{blog.content}</p>
                        </div>

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

                        {userId === blog.created_by && (
                            <div>
                                <Link to={`/blog/${blog.id}/edit`}>Edit</Link>
                                {' | '}
                                <Link to={`/blog/${blog.id}/delete`}>Delete</Link>
                            </div>
                        )}

                        {lightboxImage && (
                            <div
                                    className='lightbox-overlay'
                                    onClick={() => setLightboxImage(null)}
                                >
                                <img src={lightboxImage} alt='Full view' className='lightbox-image' />
                            </div>
                        )}
                    </div>
                ))}

                <div className='pagination'>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
    
}