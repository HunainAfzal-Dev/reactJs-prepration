import React, { useState, useEffect } from "react"
import { Sidebar } from "./components/sidebar"
import { CommandBar } from "./components/command-bar"
import { LoginCard } from "./components/login-card"
import { DataTable } from "./components/ui/table"
import type { Column } from "./components/ui/table"
import { Modal } from "./components/ui/modal"
import { ToastProvider } from "./components/ui/toast"
import { toast } from "./hooks/use-toast"
import { 
  AlertTriangle, 
  ArrowRightLeft, 
  Boxes, 
  CheckCircle2, 
  Database, 
  Edit3, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  TrendingUp 
} from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  price: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [newStockVal, setNewStockVal] = useState<number>(0)
  const [tableSearchTerm, setTableSearchTerm] = useState("")

  // Initial Inventory Mock Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "1", name: "AI Smart Scanner Pro", sku: "SKU-AISCAN-01", category: "Electronics", stock: 124, price: 299.99, status: "In Stock" },
    { id: "2", name: "Holographic Barcode Reader", sku: "SKU-HOLOB-02", category: "Hardware", stock: 8, price: 450.00, status: "Low Stock" },
    { id: "3", name: "Thermal Label Matrix", sku: "SKU-THERM-03", category: "Printers", stock: 45, price: 189.50, status: "In Stock" },
    { id: "4", name: "AI Predictive Server Rack", sku: "SKU-AIPRED-04", category: "Infrastructure", stock: 3, price: 2499.00, status: "Low Stock" },
    { id: "5", name: "Magnetic POS Terminal V2", sku: "SKU-MAGPOS-05", category: "Electronics", stock: 18, price: 599.00, status: "In Stock" },
    { id: "6", name: "RFID Tag Spool (1000ct)", sku: "SKU-RFID-06", category: "Consumables", stock: 0, price: 85.00, status: "Out of Stock" },
  ])

  // Broadcast toast alerts for Low/Out of Stock items on mount
  useEffect(() => {
    toast("Welcome to AI Inventory Terminal", "System initialized and security handshakes complete.", "ai")
    
    // Trigger warnings for critical items
    const criticalItems = inventory.filter(item => item.status !== "In Stock")
    if (criticalItems.length > 0) {
      setTimeout(() => {
        toast(
          "Low Stock Warnings",
          `Found ${criticalItems.length} items needing immediate restocking.`,
          "warning"
        )
      }, 1000)
    }
  }, [])

  // Triggered from Command Bar Search
  const handleAISearch = (term: string) => {
    if (term.startsWith("/")) {
      if (term === "/low-stock") {
        setTableSearchTerm("Low Stock")
        toast("Filter Applied", "Displaying only low stock items.", "success")
      } else if (term === "/check-stock") {
        setTableSearchTerm("")
        toast("Filter Cleared", "Displaying full catalog.", "info")
      } else {
        toast("Command Executed", `AI command '${term}' completed.`, "success")
      }
    } else {
      setTableSearchTerm(term)
    }
  }

  // Handle Edit Action
  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setNewStockVal(item.stock)
    setIsModalOpen(true)
  }

  // Save Modal Changes
  const handleSaveChanges = () => {
    if (!selectedItem) return
    
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock"
        if (newStockVal === 0) status = "Out of Stock"
        else if (newStockVal < 10) status = "Low Stock"
        
        return {
          ...item,
          stock: newStockVal,
          status
        }
      }
      return item
    })

    setInventory(updatedInventory)
    setIsModalOpen(false)
    toast(
      "Inventory Updated",
      `Successfully adjusted stock for ${selectedItem.name} to ${newStockVal}.`,
      "success"
    )
  }

  // Reload inventory simulation
  const handleRefresh = () => {
    setIsLoading(true)
    toast("Refreshing catalog...", "Fetching real-time levels from nodes.", "ai")
    setTimeout(() => {
      setIsLoading(false)
      toast("Sync Complete", "Catalog is now fully up to date.", "success")
    }, 1500)
  }

  // Columns definition for Table
  const columns: Column<InventoryItem>[] = [
    { key: "name", header: "Item Name", sortable: true },
    { key: "sku", header: "SKU" },
    { key: "category", header: "Category", sortable: true },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (item) => `$${item.price.toFixed(2)}`
    },
    { key: "stock", header: "Stock", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => {
        const badgeColors = {
          "In Stock": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          "Low Stock": "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)] animate-pulse-slow",
          "Out of Stock": "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
        }
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColors[item.status]}`}>
            {item.status === "Low Stock" && <AlertTriangle className="h-3 w-3" />}
            {item.status === "In Stock" && <CheckCircle2 className="h-3 w-3" />}
            {item.status}
          </span>
        )
      }
    }
  ]

  return (
    <div className="flex bg-[#050507] text-white min-h-screen bg-grid-pattern relative">
      {/* Absolute floating glow blobs */}
      <div className="absolute top-[10%] left-[20%] h-96 w-96 rounded-full radial-glow pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[10%] h-[500px] w-[500px] rounded-full radial-glow pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col p-6 overflow-y-auto max-w-[1600px] mx-auto w-full gap-8">
        
        {/* Top Navigation Row */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              System Control Dashboard
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </h1>
            <p className="text-xs text-zinc-400">Interactive POS & Inventory Analytics Nodes</p>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3">
            <CommandBar onSearch={handleAISearch} />
            <LoginCard />
          </div>
        </header>

        {/* Analytics Card Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Stock */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            <div className="absolute right-4 top-4 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Inventory Items</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 font-mono">198 Units</h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-4">
              <span className="text-emerald-400 font-bold">+12%</span> from last billing cycle
            </div>
          </div>

          {/* Active POS Revenue */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute right-4 top-4 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Daily POS Transactions</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 font-mono">$4,395.00</h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-4">
              <span className="text-emerald-400 font-bold">+24.5%</span> system efficiency rate
            </div>
          </div>

          {/* Connected Runtimes */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute right-4 top-4 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Storage Sync Node</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 font-mono">100% Online</h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-4">
              <span className="text-emerald-400 font-bold">Latency 14ms</span> active connection
            </div>
          </div>
        </section>

        {/* Inventory Control Table Section */}
        <section className="glass-card rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-lg font-bold text-white">Live Stock Levels</h3>
              <p className="text-xs text-zinc-400">View, sort, filter, and adjust real-time stock levels.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5 hover:text-white transition-colors text-zinc-400 flex items-center justify-center"
                title="Synchronize Database"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
              </button>
              <button
                onClick={() => {
                  toast("Add Item Action", "Registering new inventory models is disabled in this preview.", "warning")
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-xs font-semibold flex items-center gap-2 transition-colors text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Register Item</span>
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={inventory.filter(item => 
              item.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
              item.sku.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
              item.category.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
              item.status.toLowerCase().includes(tableSearchTerm.toLowerCase())
            )}
            isLoading={isLoading}
            selectable
            searchPlaceholder="Search by name, SKU, category, status..."
            actions={(row) => (
              <button
                onClick={() => handleEditItem(row)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all flex items-center gap-1 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Stock</span>
              </button>
            )}
          />
        </section>

      </main>

      {/* Reusable modal for Editing Stock */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Inventory Stock"
      >
        {selectedItem && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-bold text-white">{selectedItem.name}</h4>
              <span className="text-xs text-zinc-500 font-mono">{selectedItem.sku}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Stock Unit Count</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewStockVal(Math.max(0, newStockVal - 1))}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(parseInt(e.target.value) || 0)}
                  className="w-24 text-center py-2 text-sm bg-zinc-950/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setNewStockVal(newStockVal + 1)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleSaveChanges}
                className="flex-grow py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Global Toast Stack */}
      <ToastProvider />
    </div>
  )
}
