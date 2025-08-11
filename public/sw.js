const CACHE_NAME = 'rmcbuddy-v1.0.0'
const STATIC_CACHE = 'rmcbuddy-static-v1'
const DYNAMIC_CACHE = 'rmcbuddy-dynamic-v1'

// URLs to cache on install
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker: Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return
  }

  // Handle API requests (don't cache)
  if (request.url.includes('/api/') || request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return offline fallback for API requests
        return new Response(
          JSON.stringify({ error: 'Offline', offline: true }),
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
      })
    )
    return
  }

  // Handle YouTube API requests (don't cache, but provide fallback)
  if (request.url.includes('googleapis.com') || request.url.includes('youtube.com')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return mock data for offline YouTube requests
        return new Response(
          JSON.stringify({ items: [], offline: true }),
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
      })
    )
    return
  }

  // For all other requests, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        // Clone the request for cache
        const fetchRequest = request.clone()

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response for cache
            const responseToCache = response.clone()

            // Add to dynamic cache
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-votes') {
    event.waitUntil(syncVotes())
  }
  
  if (event.tag === 'sync-suggestions') {
    event.waitUntil(syncSuggestions())
  }
})

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New songs available to vote on!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'vote',
        title: 'Vote Now',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('RMCBuddy', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'vote') {
    event.waitUntil(
      clients.openWindow('/?tab=vote')
    )
  } else {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Sync functions (placeholders for offline functionality)
async function syncVotes() {
  console.log('Service Worker: Syncing votes...')
  // TODO: Implement offline vote sync
}

async function syncSuggestions() {
  console.log('Service Worker: Syncing suggestions...')
  // TODO: Implement offline suggestion sync
}
