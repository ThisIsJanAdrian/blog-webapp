import { useNavigate } from 'react-router-dom'

export default function BackButton() {
    const navigate = useNavigate()

    return (
        <button
            className='back-button'
            type='button'
            onClick={() => navigate('/feed')}
        >
            ← Back
        </button>
    )
}