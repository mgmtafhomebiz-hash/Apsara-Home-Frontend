/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "/_next/precache.HNy-5RNzHUDaFIqubM_gx.afceeeb2d7e509a50e0e12ffee9a67f8.js"
);

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "/af_home_logo.png",
    "revision": "89900fd5367e4a225aea1999dce02b42"
  },
  {
    "url": "/Badge/homeBuilder.png",
    "revision": "cdd145977e7d8974d6ab9b8d67917b19"
  },
  {
    "url": "/Badge/homeStarter.png",
    "revision": "2f126654b32c1d2b1a6bc50b0c8c1614"
  },
  {
    "url": "/Badge/homeStylist.png",
    "revision": "ebeeea09fb63fb74dd77ca2ed803ce91"
  },
  {
    "url": "/Badge/lifestyleConsultant.png",
    "revision": "3cb9c0b8368ef5e940d0a76114e90f34"
  },
  {
    "url": "/Badge/lifestyleElite.png",
    "revision": "d82e36d063c03921ea8ff220754e45ab"
  },
  {
    "url": "/DreambuildBanner.jpg",
    "revision": "440007a8af9f54ea8d1a6f155b87b22e"
  },
  {
    "url": "/file.svg",
    "revision": "d09f95206c3fa0bb9bd9fefabfd0ea71"
  },
  {
    "url": "/globe.svg",
    "revision": "2aaafa6a49b6563925fe440891e32717"
  },
  {
    "url": "/icons/icon-192.png",
    "revision": "a5e6d2a0e6829ff7133b134d3c9f9ffc"
  },
  {
    "url": "/icons/icon-512.png",
    "revision": "1f580f8c8e30600fcbea3fba69d25a3f"
  },
  {
    "url": "/Images/abs.png",
    "revision": "0d1dc38159789a5163967eced56820e8"
  },
  {
    "url": "/Images/af_home_logo.png",
    "revision": "d9dad7e551a7efb3307b3ff2c4a88c77"
  },
  {
    "url": "/Images/FeaturedSection/bently_chest_drawer.png",
    "revision": "122cde08cfc9c8f620e52b067e31fa9a"
  },
  {
    "url": "/Images/FeaturedSection/gaynour_l-shape.jpg",
    "revision": "0c1e0018adef50a140db0876ab2f566e"
  },
  {
    "url": "/Images/FeaturedSection/home_living.jpg",
    "revision": "3d99e1b7fad2f8ecbbee6e19a1d1a9bb"
  },
  {
    "url": "/Images/FeaturedSection/sarah_corner_l-shaped.png",
    "revision": "1d87ef773fbf1ef222201abd259c3c48"
  },
  {
    "url": "/Images/FeaturedSection/zooey_cutlery.png",
    "revision": "9b9149e2f46dabddbf6f8417daf05e79"
  },
  {
    "url": "/Images/HeroSection/chairs_stools.jpg",
    "revision": "a31cd18a5debea52f92a737c8cf0597b"
  },
  {
    "url": "/Images/HeroSection/Dinning_table.jpg",
    "revision": "7c2074edb791bb271b856b88d0fc0f84"
  },
  {
    "url": "/Images/HeroSection/sofas.jpg",
    "revision": "edad4a0083b027967900a77092de57c0"
  },
  {
    "url": "/Images/HeroSection/tv_racks.jpg",
    "revision": "51fa692703161091700459d9e6e6db8b"
  },
  {
    "url": "/Images/icon_apps/messenger1.png",
    "revision": "549448a280110d8830b170f7203158c4"
  },
  {
    "url": "/Images/icon_apps/telegram1.png",
    "revision": "706358a4f4d9fa3d9bb86e71719b7864"
  },
  {
    "url": "/Images/icon_apps/viber1.png",
    "revision": "511ae8baaa994adbcf78f50d6d1b6553"
  },
  {
    "url": "/Images/icon_apps/whatsapp1.png",
    "revision": "85becb35e8864e42a5796fd8e240fbfb"
  },
  {
    "url": "/Images/icon_apps/x1.png",
    "revision": "155773593379cd7c31f8649af4fd03cc"
  },
  {
    "url": "/Images/Icon/af_home_logo.png",
    "revision": "89900fd5367e4a225aea1999dce02b42"
  },
  {
    "url": "/Images/landing/affordahome.png",
    "revision": "a57fb81e8823efc6b3d011577150605e"
  },
  {
    "url": "/Images/landing/airpro.png",
    "revision": "dfc80b8600466a022cc41a7166fb315e"
  },
  {
    "url": "/Images/landing/astro-foam.png",
    "revision": "55fe2ac38f1b972617f5fd67832ec9fd"
  },
  {
    "url": "/Images/landing/beani-mnl.png",
    "revision": "a9c312f1ecde2c036859bbe2085e010a"
  },
  {
    "url": "/Images/landing/content-creator.png",
    "revision": "92899ce1e03d8c030d21b12937c2d67d"
  },
  {
    "url": "/Images/landing/digital-nomad.png",
    "revision": "752d262a5f277ee0bed95bc37b2818fb"
  },
  {
    "url": "/Images/landing/easy-space.png",
    "revision": "a48e3f7494c825433072aada0a4c7df5"
  },
  {
    "url": "/Images/landing/furnigo.png",
    "revision": "8e1a20b0bf58be82a10a14f805e60aa8"
  },
  {
    "url": "/Images/landing/get-started.png",
    "revision": "fcdb2cf59d2eac06d5d1df1f048fc6a7"
  },
  {
    "url": "/Images/landing/hyundai-home.png",
    "revision": "6febe79341f2efec3b0bb422a328f1ad"
  },
  {
    "url": "/Images/landing/mrchuck.png",
    "revision": "82d7a11e858091e2559fd4bd950a1892"
  },
  {
    "url": "/Images/landing/pica-pillow.png",
    "revision": "ba2ab62471d2317a73d88fd685318664"
  },
  {
    "url": "/Images/landing/sales-agent.png",
    "revision": "5e88211c0ab71e65192ee271c0ca41ce"
  },
  {
    "url": "/Images/landing/sales-tactics.png",
    "revision": "5afc286a053673fba1d7588e7a27ed8c"
  },
  {
    "url": "/Images/landing/sunnyware.png",
    "revision": "a08e1118109113f3f98791353988d619"
  },
  {
    "url": "/Images/landing/turtle-wax.png",
    "revision": "2e9325eef74f054bb9f618caa1bdca4a"
  },
  {
    "url": "/Images/landing/xiaomi.png",
    "revision": "3f9fb1ad12cfc93ec203e5a3bd762738"
  },
  {
    "url": "/Images/landing/young-couple.png",
    "revision": "dfad418eea36866a4ec5fa9c5ddb85ce"
  },
  {
    "url": "/Images/landing/zooey.png",
    "revision": "469c36e842f78a03ddc1195cd7a813ac"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/1766103679_modena_dining_chair.jpg",
    "revision": "6a59986de1afaf758a33334fd606170e"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/alpaca_seat_living_room.png",
    "revision": "eda087829d29fd6802ddc0b2030484e0"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/creative_design_polar_Bear.jpg",
    "revision": "4ad30d7780930a3b6cbfd2affd0538eb"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/good_design_swan_footstool_soft_ottoman.png",
    "revision": "9ce23e16f6b47b71ca59455017e84c30"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/horse_ottooman_stool_with_sofa.png",
    "revision": "91acff0da73bbf719aff820f8ab664f2"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/modern_leisure_chinese_lion_chairs_stool_ottoman.jpg",
    "revision": "1b504abc23e2f0dc44c8b2ee66cf0b07"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/new_cute_pony_shaped_children_chair_pony_sofa_chair.png",
    "revision": "6e13b5ebd9c49f7752077f2921d25b1b"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/panda_footstool_ottoman.png",
    "revision": "bb110accc6ec660854e19de16bc45e47"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/panda_footstool.jpg",
    "revision": "844f605d4e8b3fec42eb44c831e5a1f0"
  },
  {
    "url": "/Images/product_images/chairs_and_stools/sheep_stool.jpg",
    "revision": "3b3e5ecc6a27c03484b79d239079fd03"
  },
  {
    "url": "/Images/product_images/sofas/1748399347_sofa.jpg",
    "revision": "11a90fd988fc33942319f8b7ed6b6038"
  },
  {
    "url": "/Images/product_images/sofas/1750073173_astrid.png",
    "revision": "93c27ff8b129fdb0d74f16055adc43ef"
  },
  {
    "url": "/Images/product_images/sofas/1755574295_harvey5.jpg",
    "revision": "990bdcefcbd48fce6483a7b3028f407f"
  },
  {
    "url": "/Images/product_images/sofas/1755574306_harvey6.jpg",
    "revision": "c9b06f197f02a131c1f201bea9c69761"
  },
  {
    "url": "/Images/product_images/sofas/1755574318_harvey7.jpg",
    "revision": "1866036389776acc878f33915c6849a2"
  },
  {
    "url": "/Images/product_images/sofas/1755670414_stella_fabric_sofa_2.jpg",
    "revision": "120ec16ffaeb4466ca82ba23a67506c2"
  },
  {
    "url": "/Images/product_images/sofas/1756178131_orla_fabric_sofa_bed.jpg",
    "revision": "080f76f0992a04beb02098c7345ded0f"
  },
  {
    "url": "/Images/product_images/sofas/1756262841_migumi_bench_sofa.jpg",
    "revision": "898fb45bb7944c09ae40f94719580dac"
  },
  {
    "url": "/Images/product_images/sofas/1756272013_sven_fabric_bench6.jpg",
    "revision": "443e19df79810e7b949d3b5d274e9176"
  },
  {
    "url": "/Images/product_images/tv_rack/1753926285_blythe_tv_rack.jpg",
    "revision": "0abd0525d9e75ea573e78b0109d35c17"
  },
  {
    "url": "/Images/product_images/tv_rack/1753926371_blythe_tv_rack_-_open_2_.jpg",
    "revision": "0b687f353e61e3af832d83eeed857ca2"
  },
  {
    "url": "/Images/product_images/tv_rack/1754987393_teemo_tv_rack00.jpg",
    "revision": "0f725cb4603c6e53201beff8f83f35f2"
  },
  {
    "url": "/Images/product_images/tv_rack/1755053200_anivia_tv_rack0.jpg",
    "revision": "77da85ffc0d3289ea638de36295c1466"
  },
  {
    "url": "/Images/product_images/tv_rack/1755061914_aron_tv_rack.jpg",
    "revision": "d44fa2d6d7883a9f1c5e029075966450"
  },
  {
    "url": "/Images/product_images/tv_rack/1757031412_lauri_tv_rack3.png",
    "revision": "a60e45bd75073c754d88c502e9295b6f"
  },
  {
    "url": "/Images/product_images/tv_rack/1759105474_reece_tv_rack.jpg",
    "revision": "8508ec2f21c34a3d8421dc869d14e397"
  },
  {
    "url": "/Images/product_images/tv_rack/1759105516_reece_tv_rack4.jpg",
    "revision": "3a2703083e62ffaf23664100d2203bbd"
  },
  {
    "url": "/Images/product_images/tv_rack/1764653803_boston_tv_rack.jpg",
    "revision": "85f1a64ce615c04e0373ae83dca1e2d4"
  },
  {
    "url": "/Images/product_images/tv_rack/1764658789_maverick_tv_rack.jpg",
    "revision": "7e958f50d741af73bd78cdec40a1e5de"
  },
  {
    "url": "/Images/product_images/tv_rack/1764661572_shauna_tv_rack.jpg",
    "revision": "c61944cc8cc0dbcc616730770206036f"
  },
  {
    "url": "/Images/product_images/tv_rack/1769387683_rei_tv_console_rack_-_closed2_cover_.jpg",
    "revision": "442e0ea3e3612d6684eeed351b5fdb20"
  },
  {
    "url": "/Images/PromoBanners/ct2-img1-large.jpg",
    "revision": "c6e76312399e0aebddeea32e57c04ae1"
  },
  {
    "url": "/Images/PromoBanners/ct2-img2-large.jpg",
    "revision": "cb5c4b908ee0077fb8cf5d1a4855a835"
  },
  {
    "url": "/Images/steps/r2.png",
    "revision": "c7d4d1fb3bfb4780a7d218b81e281293"
  },
  {
    "url": "/Images/steps/r3.png",
    "revision": "71f0fd571df5c51f999ec6f75a14cd22"
  },
  {
    "url": "/Images/steps/r4.png",
    "revision": "7f6fa27559bbfde4870a5c86abc65add"
  },
  {
    "url": "/Images/steps/r5.png",
    "revision": "8c56cc84de1ee560f0efcef4b9a3ee0e"
  },
  {
    "url": "/Images/steps/rr3.png",
    "revision": "8660dd79f0d8c286b7a03ccfd7dfa5c9"
  },
  {
    "url": "/Images/synergy.png",
    "revision": "25bf0911d17f98d8731ca5840aa5a207"
  },
  {
    "url": "/manifest.json",
    "revision": "f137b0f05c8788e02968a61b852a1e74"
  },
  {
    "url": "/next.svg",
    "revision": "8e061864f388b47f33a1c3780831193e"
  },
  {
    "url": "/payment-logos/bdo.svg",
    "revision": "179b894be2fbf9b93ed5839223b33308"
  },
  {
    "url": "/payment-logos/bpi.svg",
    "revision": "5416bda02df60304baa23b055b7f6e11"
  },
  {
    "url": "/payment-logos/cod.svg",
    "revision": "c25c52273917a3a7709b7e7594ad57b7"
  },
  {
    "url": "/payment-logos/gcash.svg",
    "revision": "586576f893272259636ee26a7970ee59"
  },
  {
    "url": "/payment-logos/landbank.svg",
    "revision": "76f67c902f1691a1d8c3d3c835a56407"
  },
  {
    "url": "/payment-logos/mastercard.svg",
    "revision": "0cd8a48ae70f145c67c5e46da55c2bf3"
  },
  {
    "url": "/payment-logos/maya.svg",
    "revision": "0486779022a036bdbb84c608f6587a9e"
  },
  {
    "url": "/payment-logos/online-banking.svg",
    "revision": "f271056b6a4dfda3aaa3ff521d20175b"
  },
  {
    "url": "/payment-logos/paymongo-supported.svg",
    "revision": "0e71101f68d2e2445f80a2509e65c602"
  },
  {
    "url": "/payment-logos/unionbank.svg",
    "revision": "325e0510bdab7ef37dfb00f7affa9081"
  },
  {
    "url": "/payment-logos/visa.svg",
    "revision": "80c18de48c284d0c3e2be79818d669bb"
  },
  {
    "url": "/vercel.svg",
    "revision": "c0af2f507b369b085b35ef4bbe3bcf1e"
  },
  {
    "url": "/window.svg",
    "revision": "a2760511c65806022ad20adf74370ff3"
  },
  {
    "url": "/workbox-4754cb34.js",
    "revision": "98d58f6ba4bb37cd18d746933f6b0ed4"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.precaching.cleanupOutdatedCaches();

workbox.routing.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i, new workbox.strategies.CacheFirst({ "cacheName":"google-fonts", plugins: [new workbox.expiration.Plugin({ maxEntries: 4, maxAgeSeconds: 31536000, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/use\.fontawesome\.com\/releases\/.*/i, new workbox.strategies.CacheFirst({ "cacheName":"font-awesome", plugins: [new workbox.expiration.Plugin({ maxEntries: 1, maxAgeSeconds: 31536000, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"static-font-assets", plugins: [new workbox.expiration.Plugin({ maxEntries: 4, maxAgeSeconds: 604800, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"static-image-assets", plugins: [new workbox.expiration.Plugin({ maxEntries: 64, maxAgeSeconds: 86400, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\.(?:js)$/i, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"static-js-assets", plugins: [new workbox.expiration.Plugin({ maxEntries: 16, maxAgeSeconds: 86400, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\.(?:css|less)$/i, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"static-style-assets", plugins: [new workbox.expiration.Plugin({ maxEntries: 16, maxAgeSeconds: 86400, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/.*/i, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"others", plugins: [new workbox.expiration.Plugin({ maxEntries: 16, maxAgeSeconds: 86400, purgeOnQuotaError: false })] }), 'GET');
