"use client"

import { useState, useEffect, useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowRight, Award, Building2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// No replacement needed, removing unused imports

// Mock data for demonstration
const companyData = {
  Apple: {
    revenue: 394.33,
    marketCap: 2940,
    employees: 164000,
    profit: 99.8,
    growth: 8.1,
  },
  Microsoft: {
    revenue: 211.92,
    marketCap: 2750,
    employees: 221000,
    profit: 72.4,
    growth: 16.4,
  },
  Google: {
    revenue: 282.84,
    marketCap: 1890,
    employees: 156000,
    profit: 59.97,
    growth: 13.8,
  },
  Amazon: {
    revenue: 513.98,
    marketCap: 1680,
    employees: 1540000,
    profit: 30.43,
    growth: 9.4,
  },
  Meta: {
    revenue: 116.61,
    marketCap: 1020,
    employees: 86482,
    profit: 39.1,
    growth: 15.7,
  },
}

// Add this helper function before the Home component
const findCompanyIgnoreCase = (input: string, companies: Record<string, any>) => {
  const normalizedInput = input.trim().toLowerCase()

  // Find the first matching company (case-insensitive)
  const match = Object.keys(companies).find((company) => company.toLowerCase() === normalizedInput)

  return match
}

// Add this new function to filter companies based on input
const filterCompanies = (input: string, companies: Record<string, any>) => {
  const normalizedInput = input.trim().toLowerCase()

  if (!normalizedInput) return []

  return Object.keys(companies).filter((company) => {
    const companyLower = company.toLowerCase()
    // Match only from the beginning of the company name
    return companyLower.startsWith(normalizedInput)
  })
}

export default function Home() {
  const [companyA, setCompanyA] = useState("")
  const [companyB, setCompanyB] = useState("")
  const [comparison, setComparison] = useState<null | {
    companyA: string
    companyB: string
    data: any
    chartData: any[]
  }>(null)

  const [openA, setOpenA] = useState(false)
  const [openB, setOpenB] = useState(false)
  const [suggestionsA, setSuggestionsA] = useState<string[]>([])
  const [suggestionsB, setSuggestionsB] = useState<string[]>([])
  const inputARef = useRef<HTMLInputElement>(null)
  const inputBRef = useRef<HTMLInputElement>(null)

  const handleCompare = () => {
    const matchedCompanyA = findCompanyIgnoreCase(companyA, companyData)
    const matchedCompanyB = findCompanyIgnoreCase(companyB, companyData)

    if (!matchedCompanyA || !matchedCompanyB) {
      alert("Please enter valid company names (Apple, Microsoft, Google, Amazon, or Meta)")
      return
    }

    const dataA = companyData[matchedCompanyA]
    const dataB = companyData[matchedCompanyB]

    const chartData = [
      {
        name: "Revenue ($B)",
        [matchedCompanyA]: dataA.revenue,
        [matchedCompanyB]: dataB.revenue,
      },
      {
        name: "Market Cap ($B)",
        [matchedCompanyA]: dataA.marketCap,
        [matchedCompanyB]: dataB.marketCap,
      },
      {
        name: "Employees (K)",
        [matchedCompanyA]: dataA.employees / 1000,
        [matchedCompanyB]: dataB.employees / 1000,
      },
      {
        name: "Profit ($B)",
        [matchedCompanyA]: dataA.profit,
        [matchedCompanyB]: dataB.profit,
      },
      {
        name: "Growth (%)",
        [matchedCompanyA]: dataA.growth,
        [matchedCompanyB]: dataB.growth,
      },
    ]

    setComparison({
      companyA: matchedCompanyA,
      companyB: matchedCompanyB,
      data: {
        [matchedCompanyA]: dataA,
        [matchedCompanyB]: dataB,
      },
      chartData,
    })
  }

  useEffect(() => {
    if (companyA.trim()) {
      setSuggestionsA(filterCompanies(companyA, companyData))
    } else {
      setSuggestionsA([])
    }
  }, [companyA])

  useEffect(() => {
    if (companyB.trim()) {
      setSuggestionsB(filterCompanies(companyB, companyData))
    } else {
      setSuggestionsB([])
    }
  }, [companyB])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Big Business Battles
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">Compare financial giants head-to-head.</p>
        </header>

        {/* Input Section */}
        <Card className="mb-12 overflow-hidden border-0 shadow-md">
          <CardContent className="p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
              <div>
                <Label htmlFor="companyA" className="mb-2 block text-sm font-medium">
                  Company A
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="companyA"
                    ref={inputARef}
                    placeholder="Enter company name"
                    className="pl-10"
                    value={companyA}
                    onChange={(e) => {
                      setCompanyA(e.target.value)
                      setOpenA(true)
                    }}
                    onFocus={() => setOpenA(true)}
                  />
                  {openA && suggestionsA.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <ul className="max-h-60 overflow-auto py-1 text-base">
                        {suggestionsA.map((company) => (
                          <li
                            key={company}
                            className="relative cursor-default select-none px-3 py-2 hover:bg-blue-50"
                            onClick={() => {
                              setCompanyA(company)
                              setOpenA(false)
                              inputBRef.current?.focus()
                            }}
                          >
                            {company}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              <div>
                <Label htmlFor="companyB" className="mb-2 block text-sm font-medium">
                  Company B
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="companyB"
                    ref={inputBRef}
                    placeholder="Enter company name"
                    className="pl-10"
                    value={companyB}
                    onChange={(e) => {
                      setCompanyB(e.target.value)
                      setOpenB(true)
                    }}
                    onFocus={() => setOpenB(true)}
                  />
                  {openB && suggestionsB.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <ul className="max-h-60 overflow-auto py-1 text-base">
                        {suggestionsB.map((company) => (
                          <li
                            key={company}
                            className="relative cursor-default select-none px-3 py-2 hover:bg-blue-50"
                            onClick={() => {
                              setCompanyB(company)
                              setOpenB(false)
                            }}
                          >
                            {company}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleCompare}
                size="lg"
                className="gap-2 bg-[#3b82f6] px-8 text-white hover:bg-[#2563eb]"
              >
                <Search className="h-5 w-5" />
                Compare
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {comparison && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Comparison Results</h2>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries({
                "Revenue ($B)": "revenue",
                "Market Cap ($B)": "marketCap",
                "Employees (K)": "employees",
                "Profit ($B)": "profit",
                "Growth (%)": "growth",
              }).map(([label, key]) => {
                const valueA = comparison.data[comparison.companyA][key]
                const valueB = comparison.data[comparison.companyB][key]
                let winner = valueA > valueB ? comparison.companyA : comparison.companyB

                // Special case for employees - lower is better
                if (key === "employees") {
                  winner = valueA < valueB ? comparison.companyA : comparison.companyB
                }

                return (
                  <Card key={key} className="overflow-hidden border-0 shadow-md">
                    <CardHeader className="bg-gray-100 pb-2 pt-4">
                      <CardTitle className="text-lg">{label}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2">
                        <div className={`border-r p-4 ${winner === comparison.companyA ? "bg-blue-50" : ""}`}>
                          <div className="mb-1 flex items-center justify-between">
                            <CardDescription>{comparison.companyA}</CardDescription>
                            {winner === comparison.companyA && <Award className="h-5 w-5 text-[#f59e0b]" />}
                          </div>
                          <p className="text-xl font-bold">
                            {key === "employees" ? (valueA / 1000).toLocaleString() : valueA.toLocaleString()}
                          </p>
                        </div>
                        <div className={`p-4 ${winner === comparison.companyB ? "bg-blue-50" : ""}`}>
                          <div className="mb-1 flex items-center justify-between">
                            <CardDescription>{comparison.companyB}</CardDescription>
                            {winner === comparison.companyB && <Award className="h-5 w-5 text-[#f59e0b]" />}
                          </div>
                          <p className="text-xl font-bold">
                            {key === "employees" ? (valueB / 1000).toLocaleString() : valueB.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Chart */}
            <Card className="border-0 p-4 shadow-md md:p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Visual Comparison</CardTitle>
                <CardDescription>Side-by-side metrics comparison</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparison.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={comparison.companyA} fill="#3b82f6" />
                      <Bar dataKey={comparison.companyB} fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

