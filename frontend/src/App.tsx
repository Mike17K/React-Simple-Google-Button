import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  function handleGoogleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    console.log('Google button clicked')

    fetch('http://localhost:5000/google_signin').then(response => response.json()).then(data => {
      console.log(data)
      const url = data.url;
      window.location.href = url;
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error)
    }
    )
  }

  useEffect(() => {
    const code = params.get('code')
    if (code) {
      fetch('http://localhost:5000/google_signin/callback?code=' + code).then(response => response.json()).then(data => {
        console.log(data)
        // redirect to the original page
        navigate(params.get('redirect') || '/')
      }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error)
      }
      )
    }
  }, [])

  return (
    <>
    <button
      onClick={handleGoogleClick}
     className='flex items-center justify-center border-2 border-blue-600'>
      <img src="/google_logo.jpg" alt="" width={36} />
      <span>Login with Google</span>
    </button>
    </>
  )
}

export default App
