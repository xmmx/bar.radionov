const assets = ["/","/index.html","/styles/btns.min.css","/styles/cards.min.css","/styles/fonts.min.css","/styles/main.min.css","/js/jquery.js","/js/main.min.js","/img/amaretto_cream.jpg","/img/b-52.jpg","/img/baileys.jpg","/img/blue_hawaii.jpg","/img/blue_margarita.jpg","/img/blue_martini.jpg","/img/candy_shot.jpg","/img/cape_colder.jpg","/img/caramel_cream.jpg","/img/coconut_margarita.jpg","/img/coconut_martini.jpg","/img/coffee_cream.jpg","/img/cream_of_coconut.jpg","/img/creamy_corpse.jpg","/img/double_sugar.jpg","/img/espresso_martini.jpg","/img/fujiyama.jpg","/img/godfather.jpg","/img/irish_milk.jpg","/img/lady_limoncello.jpg","/img/lemon_margarita.jpg","/img/lemon_meringue.jpg","/img/lemon_pie.jpg","/img/limoncello.jpg","/img/margarita.jpg","/img/mermaid_lemonade.jpg","/img/mint_baileys_martini.jpg","/img/pink_lady.jpg","/img/piña-тата.jpg","/img/piña_colada.jpg","/img/salted_caramel_martini.jpg","/img/simple_sugar.jpg","/img/snowball.jpg","/img/stinger.jpg","/img/tequila_mockingbird.jpg","/img/tequila_sunrise.jpg","/img/triple_sec.jpg","/img/velvet_hammer.jpg","/img/vodka_martini.jpg","/img/whiskey_sour.jpg","/img/виски_с_содовой.jpg","/img/кокосовый_ликер.jpg","/img/кофейный_ликер.jpg","/img/мятный_ликер.jpg","/img/содовая.jpg","/img/яичный_ликер.jpg"]
// assets on build

const cachePath = "no-liqor"

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cachePath).then(cache => {
      cache.addAll(assets)
    })
  )
})

// For offline
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})