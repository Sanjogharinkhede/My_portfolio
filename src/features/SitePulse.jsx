import { Heart, Eye, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { recordSiteView, submitSiteLike } from '../lib/sitePulseClient.js'
import { getTurnstileToken } from '../lib/turnstile.js'
import './SitePulse.css'

const viewKey = 'sanjog-site-views'
const likeKey = 'sanjog-site-likes'
const likedKey = 'sanjog-site-liked'

function readCount(key, initial) {
  const value = Number(window.localStorage.getItem(key))
  return Number.isFinite(value) && value > 0 ? value : initial
}

function SitePulse() {
  const [views, setViews] = useState(() => readCount(viewKey, 124))
  const [likes, setLikes] = useState(() => readCount(likeKey, 18))
  const [liked, setLiked] = useState(() => window.localStorage.getItem(likedKey) === 'true')
  const [live, setLive] = useState(import.meta.env.VITE_ENABLE_SITE_PULSE === 'true')

  useEffect(() => {
    if (!live) return
    recordSiteView().then((result) => { setViews(result.views); setLikes(result.likes) }).catch(() => setLive(false))
  }, [live])

  const like = async () => {
    if (liked) return
    if (live) {
      try {
        const result = await getTurnstileToken().then((token) => submitSiteLike(token))
        setViews(result.views)
        setLikes(result.likes)
      } catch { setLive(false); return }
    } else {
      const next = likes + 1
      setLikes(next)
      window.localStorage.setItem(likeKey, String(next))
    }
    setLiked(true)
    window.localStorage.setItem(likedKey, 'true')
  }

  const viewLabel = views.toLocaleString('en-IN')
  return <div className="site-pulse" aria-label="Site Pulse"><span><Eye size={14} /> {viewLabel} views</span><button type="button" onClick={like} aria-pressed={liked} title={liked ? 'Already liked' : 'Like this portfolio'}><Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {likes} {liked ? 'liked' : 'like'}</button><small><ShieldCheck size={12} /> {live ? 'live pulse' : 'local preview'}</small></div>
}

export default SitePulse
