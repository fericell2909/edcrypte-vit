import { useEffect, useState } from "react"
import { URL_COINS } from "../constants/api"
import { useParams, Link } from "react-router-dom"
import type { CoinDetailInterface } from "../interfaces/Coin"

// --- Utilities ---

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

const formatCompact = (value: number) =>
    new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value)

const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value)

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })

// --- Sub-components ---

const PercentBadge = ({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) => {
    const isPositive = value >= 0
    const sizeClass = size === "lg" ? "text-lg px-3 py-1" : "text-xs px-2 py-0.5"
    return (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClass} ${isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(value).toFixed(2)}%
        </span>
    )
}

const StatRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
)

const MetricCard = ({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
        {sub && <div className="mt-1">{sub}</div>}
    </div>
)

const PriceRangeBar = ({ low, high, current }: { low: number; high: number; current: number }) => {
    const position = ((current - low) / (high - low)) * 100
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Rango 24h</h2>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{formatCurrency(low)}</span>
                <span>{formatCurrency(high)}</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
                <div
                    className="absolute h-2 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-green-400"
                    style={{ width: "100%" }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-amber-500 rounded-full shadow-md transition-all"
                    style={{ left: `calc(${Math.min(Math.max(position, 0), 100)}% - 8px)` }}
                />
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
                Precio actual: <span className="font-semibold text-gray-700">{formatCurrency(current)}</span>
            </p>
        </div>
    )
}

const SupplyRing = ({ circulating, max }: { circulating: number; max: number | null }) => {
    const percentage = max ? (circulating / max) * 100 : 100
    const radius = 50
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className="flex flex-col items-center">
            <svg width="130" height="130" viewBox="0 0 120 120" className="mb-3">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                    cx="60" cy="60" r={radius} fill="none"
                    stroke="#f59e0b" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    transform="rotate(-90 60 60)"
                    className="transition-all duration-1000"
                />
                <text x="60" y="56" textAnchor="middle" className="text-sm font-bold fill-gray-800" fontSize="16">
                    {percentage.toFixed(1)}%
                </text>
                <text x="60" y="72" textAnchor="middle" className="fill-gray-400" fontSize="10">
                    minado
                </text>
            </svg>
        </div>
    )
}

const ConverterWidget = ({ price, symbol }: { price: number; symbol: string }) => {
    const [usdAmount, setUsdAmount] = useState("100")

    const coinAmount = usdAmount && !isNaN(Number(usdAmount))
        ? (Number(usdAmount) / price)
        : 0

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Convertidor</h2>
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">USD</label>
                    <input
                        type="number"
                        value={usdAmount}
                        onChange={e => setUsdAmount(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="0.00"
                    />
                </div>
                <span className="text-gray-300 text-lg mt-4">=</span>
                <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">{symbol.toUpperCase()}</label>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-amber-600">
                        {coinAmount.toFixed(8)}
                    </div>
                </div>
            </div>
        </div>
    )
}

type Tab = "general" | "supply" | "historico"

// --- Main Component ---

const CoinContainer = () => {
    const { id } = useParams()
    const [coin, setCoin] = useState<CoinDetailInterface | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<Tab>("general")

    useEffect(() => {
        setError(null)
        fetch(`${URL_COINS}&ids=${id}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error ${response.status}`)
                return response.json()
            })
            .then(data => {
                if (data.length === 0) throw new Error("Criptomoneda no encontrada.")
                setCoin(data[0])
            })
            .catch(error => {
                console.error("Error fetching coin data:", error)
                setError(error.message)
            })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex items-center justify-center mt-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-amber-500" />
            </div>
        )
    }

    if (error) {
        return <p className="flex justify-center px-4 py-4 text-red-500">{error}</p>
    }

    if (!coin) return null

    const tabs: { key: Tab; label: string }[] = [
        { key: "general", label: "General" },
        { key: "supply", label: "Suministro" },
        { key: "historico", label: "Historico" },
    ]

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Back */}
            <Link to="/" className="inline-block text-sm text-gray-400 hover:text-amber-500 transition-colors">
                &larr; Volver al mercado
            </Link>

            {/* Hero */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                    <img src={coin.image} alt={coin.name} className="w-16 h-16" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold">{coin.name}</h1>
                            <span className="text-sm text-gray-400 uppercase">{coin.symbol}</span>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                #{coin.market_cap_rank}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-3xl font-bold">{formatCurrency(coin.current_price)}</span>
                            <PercentBadge value={coin.price_change_percentage_24h} size="lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Market Cap" value={`$${formatCompact(coin.market_cap)}`} sub={<PercentBadge value={coin.market_cap_change_percentage_24h} />} />
                <MetricCard label="Volumen 24h" value={`$${formatCompact(coin.total_volume)}`} />
                <MetricCard label="Cambio 24h" value={formatCurrency(coin.price_change_24h)} sub={<PercentBadge value={coin.price_change_percentage_24h} />} />
                <MetricCard label="Val. Diluida" value={`$${formatCompact(coin.fully_diluted_valuation)}`} />
            </div>

            {/* Price range */}
            <PriceRangeBar low={coin.low_24h} high={coin.high_24h} current={coin.current_price} />

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.key
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Precio 24h</h2>
                        <StatRow label="Maximo 24h" value={formatCurrency(coin.high_24h)} />
                        <StatRow label="Minimo 24h" value={formatCurrency(coin.low_24h)} />
                        <StatRow
                            label="Cambio 24h"
                            value={
                                <span className={coin.price_change_24h >= 0 ? "text-green-600" : "text-red-600"}>
                                    {formatCurrency(coin.price_change_24h)}
                                </span>
                            }
                        />
                        <StatRow label="Volumen 24h" value={formatCurrency(coin.total_volume)} />
                    </div>
                    <ConverterWidget price={coin.current_price} symbol={coin.symbol} />
                </div>
            )}

            {activeTab === "supply" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Suministro</h2>
                        <StatRow label="En Circulacion" value={formatNumber(coin.circulating_supply)} />
                        <StatRow label="Total" value={formatNumber(coin.total_supply)} />
                        <StatRow label="Maximo" value={coin.max_supply ? formatNumber(coin.max_supply) : "Ilimitado"} />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center justify-center">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Circulacion</h2>
                        <SupplyRing circulating={coin.circulating_supply} max={coin.max_supply} />
                        <p className="text-xs text-gray-400 mt-2">
                            {formatNumber(coin.circulating_supply)} / {coin.max_supply ? formatNumber(coin.max_supply) : "∞"}
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "historico" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Maximo Historico (ATH)</h2>
                        <StatRow label="Precio ATH" value={formatCurrency(coin.ath)} />
                        <StatRow label="Cambio desde ATH" value={<PercentBadge value={coin.ath_change_percentage} />} />
                        <StatRow label="Fecha" value={formatDate(coin.ath_date)} />
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Precio actual vs ATH</span>
                                <span>{((coin.current_price / coin.ath) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((coin.current_price / coin.ath) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Minimo Historico (ATL)</h2>
                        <StatRow label="Precio ATL" value={formatCurrency(coin.atl)} />
                        <StatRow label="Cambio desde ATL" value={<PercentBadge value={coin.atl_change_percentage} />} />
                        <StatRow label="Fecha" value={formatDate(coin.atl_date)} />
                        <div className="mt-3 bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-400">Crecimiento desde ATL</p>
                            <p className="text-xl font-bold text-green-600">
                                x{(coin.current_price / coin.atl).toFixed(0)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Last updated */}
            <p className="text-xs text-gray-400 text-center">
                Ultima actualizacion: {new Date(coin.last_updated).toLocaleString("es-ES")}
            </p>
        </div>
    )
}

export default CoinContainer
