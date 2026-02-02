import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user ? user.id : null);
        });

        const fetchBlogs = async () => {
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
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching blogs:', error);
            }
            else {
                setBlogs(data || []);
            }

            setLoading(false);
        };

        fetchBlogs();
    }, []);

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
                    <div key={blog.id} style={{ marginBottom: '2rem' }}>
                        <h3>{blog.title}</h3>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            by <strong>{blog.profiles?.username ?? 'Unknown user'}</strong>
                        </p>

                        <p>{blog.content}</p>

                        {blog.image_url && (
                            <div className="blog-image-wrapper">
                                <img
                                src={blog.image_url}
                                alt={blog.title}
                                className="blog-image"
                                onClick={() => setLightboxImage(blog.image_url)}
                                />
                            </div>
                        )}

                        <small>
                            {new Date(blog.created_at).toLocaleString()}
                        </small>

                        {userId === blog.created_by && (
                            <div>
                                <Link to={`/blogs/${blog.id}/edit`}>Edit</Link>
                                {' | '}
                                <Link to={`/blogs/${blog.id}/delete`}>Delete</Link>
                            </div>
                        )}

                        {lightboxImage && (
                            <div
                                    className="lightbox-overlay"
                                    onClick={() => setLightboxImage(null)}
                                >
                                <img src={lightboxImage} alt="Full view" className="lightbox-image" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
    
}