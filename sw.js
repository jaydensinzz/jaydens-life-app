
self.addEventListener('install', e => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('push', event => {
  let d = { title: "Jayden's Life", body: '' }
  try { d = event.data.json() } catch (_) { d.body = event.data ? event.data.text() : '' }
  event.waitUntil(self.registration.showNotification(d.title, {
    body: d.body,
    icon: './icon.svg',
    badge: './icon.svg',
    tag: d.tag,
    data: { url: d.url || './' },
    requireInteraction: true,
  }))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || './', self.registration.scope).href
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(self.registration.scope)) return c.focus()
    return clients.openWindow(url)
  }))
})
