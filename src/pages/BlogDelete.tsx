export default function BlogDelete() {
    return (
        <div>
            <h1>Blog Delete Page</h1>
            <form>
                <button type='button' onClick={() => window.location.href = '/logout'}>
                    Logout
                </button>
            </form>
        </div>
    );
}