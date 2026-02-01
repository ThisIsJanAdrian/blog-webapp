export default function BlogUpdate() {
    return (
        <div>
            <h1>Blog Update Page</h1>
            <form>
                <button type='button' onClick={() => window.location.href = '/logout'}>
                    Logout
                </button>
            </form>
        </div>
    );
}