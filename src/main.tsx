import { StrictMode, Suspense, lazy, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const ScriptPage = lazy(() => import('./script/ScriptPage'))
const Presentation = lazy(() => import('./presentation/Presentation'))

const isScript = () => location.hash.startsWith('#/script')

function Root() {
  const [script, setScript] = useState(isScript)
  useEffect(() => {
    const onHash = () => setScript(isScript())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return <Suspense fallback={null}>{script ? <ScriptPage /> : <Presentation />}</Suspense>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
