export default function BlogFeed() {
    return (
        <div>
            <h1>Blog Feed Page</h1>
            <form>
                <button type='button' onClick={() => window.location.href = '/logout'}>
                    Logout
                </button>
            </form>
        </div>
    );
}