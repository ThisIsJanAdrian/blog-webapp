import { useNavigate } from 'react-router-dom'

export default function BackButton() {
    const navigate = useNavigate()

    return (
        <button
            type='button'
            onClick={() => navigate(-1)}
            style={{
            padding: '0rem',
            background: 'transparent',
            border: 'none',
            color: '#4A90E2',
            cursor: 'pointer',
            fontSize: '0.9rem'
            }}
        >
            ← Back
        </button>
    )
}