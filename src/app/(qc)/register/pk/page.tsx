"use client"

import { useState } from "react"
import { registerVehicle } from "../actions"

export default function RegisterPKPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append("materialType", "PK")
      await registerVehicle(formData)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to register vehicle")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {success && (
        <div className="mb-6 p-4 rounded-md border border-green-200 bg-green-50 text-green-900">
          Vehicle registered successfully.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-md border border-red-200 bg-red-50 text-red-900">
          {error}
        </div>
      )}

      <div className="border rounded-lg shadow-sm bg-card text-card-foreground p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="noPolisi" className="text-sm font-medium leading-none">No Polisi</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors"
                id="noPolisi" name="noPolisi" placeholder="e.g. B 1234 XYZ" type="text" required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pmks" className="text-sm font-medium leading-none">PMKS (Supplier)</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors"
                id="pmks" name="pmks" placeholder="e.g. PT Jaya Sentosa" type="text" required
              />
            </div>
          </div>

          <div className="bg-muted/50 -mx-6 px-6 py-4 border-y">
            <h3 className="font-semibold text-sm mb-4">Quality Metrics (PK)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="ka" className="text-sm font-medium leading-none text-muted-foreground">KA (%)</label>
                <input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" id="ka" name="ka" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label htmlFor="kk" className="text-sm font-medium leading-none text-muted-foreground">KK (%)</label>
                <input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" id="kk" name="kk" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label htmlFor="stone" className="text-sm font-medium leading-none text-muted-foreground">Stone (%)</label>
                <input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" id="stone" name="stone" type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium leading-none">Status Kendaraan</label>
              <select 
                id="status" name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="BONGKAR">Bongkar</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div className="space-y-2 opacity-0 pointer-events-none hidden md:block">
              {/* Spacer */}
            </div>
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 w-full disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register Vehicle (PK)"}
          </button>
        </form>
      </div>
    </div>
  )
}
