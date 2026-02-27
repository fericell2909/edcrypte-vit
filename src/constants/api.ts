
const URL_API = import.meta.env.VITE_URL_API
const URL_COINS = `${URL_API}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${import.meta.env.VITE_COINGECKO_API_KEY}`
export { URL_API, URL_COINS }