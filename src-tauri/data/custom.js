window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    
    console.log('origin', origin, isBaseTargetBlank)
    
    // 检查是否是下载链接（关键修改！）
    const isDownloadLink = origin && (
        origin.hasAttribute('download') ||
        origin.href.match(/\.(mp3|wav|m4a|aac|flac|ogg|webm|mp4|avi|mov|zip|rar|7z|exe|dmg|pkg|pdf|doc|xls|ppt)$/i) ||
        origin.classList.contains('download') ||
        origin.getAttribute('href')?.includes('download') ||
        origin.innerText.toLowerCase().includes('download')
    )
    
    // 如果是下载链接，不拦截，让它正常下载
    if (isDownloadLink) {
        console.log('下载链接，允许正常下载', origin.href)
        return // 不执行后续的拦截逻辑
    }
    
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    // 检查是否是下载URL
    if (url && url.match(/\.(mp3|wav|m4a|aac|flac|ogg)$/i)) {
        console.log('音频下载，使用原生下载', url)
        // 创建下载链接
        const a = document.createElement('a')
        a.href = url
        a.download = url.split('/').pop()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return
    }
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// 新增：专门的下载处理函数
function forceDownload(url, filename) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename || url.split('/').pop()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

// 监听可能的AJAX下载请求
const originalFetch = window.fetch
window.fetch = function(...args) {
    const [resource, config] = args
    console.log('fetch请求:', resource)
    
    // 检查是否是音频下载请求
    if (resource && 
        (typeof resource === 'string' || resource.url) &&
        (resource.includes('download') || 
         (config && config.headers && 
          config.headers['Accept'] && 
          config.headers['Accept'].includes('audio')))) {
        
        console.log('检测到音频下载请求，尝试强制下载')
        // 这里可以根据需要处理
    }
    
    return originalFetch.apply(this, args)
}