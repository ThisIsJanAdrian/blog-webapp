export default function BlogCreate() {
    return (
        <div>
            <h1>Blog Create Page</h1>
            <form>
                <button type='button' onClick={() => window.location.href = '/logout'}>
                    Logout
                </button>
            </form>
        </div>
    );
}