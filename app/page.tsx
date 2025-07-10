"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  Factory,
  CheckCircle,
  Star,
  Menu,
  X,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NitinIndustriesWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [flippedCard, setFlippedCard] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("Show All Products")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  // Simplified refs for marquee functionality
  const marqueeRefs = useRef<(HTMLDivElement | null)[]>([])
  const animationRefs = useRef<number[]>([])
  const isPausedRefs = useRef<boolean[]>([])
  const manualScrollTimeoutRefs = useRef<NodeJS.Timeout[]>([])

  // Company data
  const companyData = {
    name: "Nitin Industries",
    location: "Udhana, Surat, Gujarat, India",
    address: "5, New Ashirwad Society, Bamroli Road, Pandesra, Udhana, Surat-394220, Gujarat, India",
    GST: "24AAOPT2302A1Z7",
    yearsInBusiness: "25+ years",
    CEO: "Nitin Thakur",
    verification: "TrustSEAL Verified",
  }

  // Product data types and categories
  type ProductItem = {
    category: string
    description: string
    products: string[]
  }

  type LaminationMachineCategory = {
    "Cold Lamination Machine": {
      "Roll to Roll": string[]
      "Sheet to Roll": string[]
      "Window Show": string[]
    }
    "Thermal Lamination Machine": {
      "Sheet to Roll": string[]
    }
  }

  type ProductCategories = {
    "Show All Products": ProductItem[]
    "Lamination Machine": LaminationMachineCategory
    "Pasting Machine": ProductItem[]
    "Slitter Rewinder": ProductItem[]
    "Honeycomb Paper Roll Making Machine": ProductItem[]
  }

  const productCategories: ProductCategories = {
    "Show All Products": [
      {
        category: "Lamination Machine",
        description: "Complete range of cold and thermal lamination machines for various industrial applications.",
        products: [
          "Roll to Roll Cold Lamination Machine",
          "Sheet to Roll Cold Lamination Machine",
          "Window Cold Lamination Machine",
          "Thermal Lamination Machine",
        ],
      },
      {
        category: "Pasting Machine",
        description: "High-quality duplex paper pasting solutions for industrial applications.",
        products: ["Duplex Paper Pasting Machine"],
      },
      {
        category: "Slitter Rewinder Machine",
        description: "Precision slitting and rewinding solutions for various materials.",
        products: ["Industrial Slitter Rewinder Machine"],
      },
      {
        category: "Honeycomb Paper Roll Making Machine",
        description: "Advanced machinery for manufacturing honeycomb paper rolls.",
        products: ["Automatic Honeycomb Paper Roll Making Machine"],
      },
    ],
    "Lamination Machine": {
      "Cold Lamination Machine": {
        "Roll to Roll": ["Roll to Roll Cold Lamination Machine"],
        "Sheet to Roll": ["Sheet to Roll Cold Lamination Machine"],
        "Window Show": ["Window Cold Lamination Machine"],
      },
      "Thermal Lamination Machine": {
        "Sheet to Roll": ["Thermal Lamination Machine"],
      },
    },
    "Pasting Machine": [
      {
        category: "Pasting Machine",
        description: "High-quality duplex paper pasting solutions for industrial applications.",
        products: ["Duplex Paper Pasting Machine"],
      },
    ],
    "Slitter Rewinder": [
      {
        category: "Slitter Rewinder Machine",
        description: "Precision slitting and rewinding solutions for various materials.",
        products: ["Industrial Slitter Rewinder Machine"],
      },
    ],
    "Honeycomb Paper Roll Making Machine": [
      {
        category: "Honeycomb Paper Roll Making Machine",
        description: "Advanced machinery for manufacturing honeycomb paper rolls.",
        products: ["Automatic Honeycomb Paper Roll Making Machine"],
      },
    ],
  }

  const productDetails = {
    "Roll to Roll Cold Lamination Machine": {
      specifications: "Customizable width, High-speed operation, Roll-to-roll processing",
      features: "Continuous operation, Adjustable speed, Quality control, Custom sizing available",
      applications: "Flexible packaging, Labels, Industrial films",
      image: "/placeholder.svg?height=200&width=300", // Dynamic image path
    },
    "Sheet to Roll Cold Lamination Machine": {
      specifications: "Customizable dimensions, Sheet-to-roll conversion, Precision processing",
      features: "Format flexibility, Speed adjustment, Quality control, Custom sizing available",
      applications: "Converting operations, Custom packaging",
      image: "/placeholder.svg?height=200&width=300", // Dynamic image path
    },
    "Window Cold Lamination Machine": {
      specifications: "Customizable size, Window application specialist, Precision cutting",
      features: "Edge sealing, UV protection, Clarity maintenance, Custom sizing available",
      applications: "Building windows, Vehicle windows, Display panels",
      image: "/placeholder.svg?height=200&width=300", // Dynamic image path
    },
    "Thermal Lamination Machine": {
      specifications: "High-temperature processing, Customizable width, Professional grade",
      features: "Temperature control, Automatic feeding, Energy efficient, Custom sizing available",
      applications: "Paper plates, Food packaging, Industrial use",
      image: "/placeholder.svg?height=200&width=300", // Dynamic image path
    },
    "Duplex Paper Pasting Machine": {
      specifications: "Duplex processing, Adhesive application, Industrial grade",
      features: "Uniform pasting, Adjustable thickness, Clean operation",
      applications: "Cardboard manufacturing, Book binding, Packaging",
      image: "/placeholder.svg?height=200&width=300", // Dynamic image path
    },
    "Industrial Slitter Rewinder Machine": {
      specifications: "High-precision slitting, Variable speed control, Industrial capacity",
      features: "Automatic tension control, Clean cutting, Easy operation",
      applications: "Paper processing, Film slitting, Label manufacturing",
      image: "/placeholder.svg?height=200&width=300", // Dynamic image path
    },
    "Automatic Honeycomb Paper Roll Making Machine": {
      specifications: "Automated production, High output capacity, Professional grade",
      features: "Continuous operation, Quality control, Energy efficient",
      applications: "Packaging industry, Protective materials, Industrial applications",
      image: "/placeholder.svg?height=200&width=300", // Dynamic image path
    },
  }

  const getCurrentProducts = useCallback((): ProductItem[] => {
    if (selectedCategory === "Show All Products") {
      return productCategories["Show All Products"]
    }

    if (selectedCategory === "Lamination Machine") {
      if (selectedSubCategory === "Cold Lamination Machine") {
        const coldLaminationProducts = productCategories["Lamination Machine"]["Cold Lamination Machine"]
        let combinedProducts: string[] = []
        for (const key in coldLaminationProducts) {
          combinedProducts = combinedProducts.concat(coldLaminationProducts[key as keyof typeof coldLaminationProducts])
        }
        return [
          {
            category: "Cold Lamination Machine",
            description:
              "Comprehensive range of cold lamination solutions including Roll to Roll, Sheet to Roll, and Window Show.",
            products: combinedProducts,
          },
        ]
      } else if (selectedSubCategory === "Thermal Lamination Machine") {
        const thermalProducts = productCategories["Lamination Machine"]["Thermal Lamination Machine"]["Sheet to Roll"]
        return [
          {
            category: "Thermal Lamination Machine - Sheet to Roll",
            description: "High-quality thermal lamination for sheet to roll applications.",
            products: thermalProducts,
          },
        ]
      }
      return []
    }

    const selectedTopLevel = productCategories[selectedCategory as keyof ProductCategories]
    if (Array.isArray(selectedTopLevel)) {
      return selectedTopLevel
    }

    return []
  }, [selectedCategory, selectedSubCategory])

  // Simplified marquee animation
  const animateMarquee = useCallback((index: number) => {
    const marqueeElement = marqueeRefs.current[index]
    if (!marqueeElement || isPausedRefs.current[index]) return

    const currentTransform = marqueeElement.style.transform
    const currentX = currentTransform
      ? Number.parseFloat(currentTransform.replace("translateX(", "").replace("px)", ""))
      : 0

    const containerWidth = marqueeElement.scrollWidth / 3
    const newX = currentX <= -containerWidth ? 0 : currentX - 0.5

    marqueeElement.style.transform = `translateX(${newX}px)`
    animationRefs.current[index] = requestAnimationFrame(() => animateMarquee(index))
  }, [])

  const startMarquee = useCallback(
    (index: number) => {
      if (animationRefs.current[index]) {
        cancelAnimationFrame(animationRefs.current[index])
      }
      isPausedRefs.current[index] = false
      animateMarquee(index)
    },
    [animateMarquee],
  )

  const pauseMarquee = useCallback((index: number) => {
    isPausedRefs.current[index] = true
    if (animationRefs.current[index]) {
      cancelAnimationFrame(animationRefs.current[index])
    }
  }, [])

  // Card click handler
  const handleCardClick = useCallback(
    (productName: string, categoryIndex: number) => {
      const newFlippedCard = flippedCard === productName ? null : productName
      setFlippedCard(newFlippedCard)

      if (newFlippedCard !== null) {
        // Card is being flipped to show details - stop auto-scroll
        pauseMarquee(categoryIndex)
        // Clear any pending auto-scroll resume from manual scrolling
        if (manualScrollTimeoutRefs.current[categoryIndex]) {
          clearTimeout(manualScrollTimeoutRefs.current[categoryIndex])
        }
      } else {
        // Card is being flipped back to front - allow auto-scroll to resume
        setTimeout(() => {
          startMarquee(categoryIndex)
        }, 1000)
      }
    },
    [flippedCard, pauseMarquee, startMarquee],
  )

  const handleScrollLeft = useCallback(
    (index: number) => {
      const marqueeElement = marqueeRefs.current[index]
      if (!marqueeElement) return

      pauseMarquee(index) // Pause auto-marquee

      const currentTransform = marqueeElement.style.transform
      const currentX = currentTransform
        ? Number.parseFloat(currentTransform.replace("translateX(", "").replace("px)", ""))
        : 0

      const scrollAmount = 300 // Adjust scroll amount as needed
      const newX = currentX + scrollAmount

      marqueeElement.style.transform = `translateX(${newX}px)`

      // Clear any existing timeout and set a new one to resume auto-scroll
      if (manualScrollTimeoutRefs.current[index]) {
        clearTimeout(manualScrollTimeoutRefs.current[index])
      }
      manualScrollTimeoutRefs.current[index] = setTimeout(() => {
        const isAnyCardFlippedInCategory = flippedCard && flippedCard.startsWith(`${index}-`)
        if (!isAnyCardFlippedInCategory) {
          startMarquee(index)
        }
      }, 1000) // Resume after 1 second
    },
    [pauseMarquee, startMarquee, flippedCard],
  )

  const handleScrollRight = useCallback(
    (index: number) => {
      const marqueeElement = marqueeRefs.current[index]
      if (!marqueeElement) return

      pauseMarquee(index) // Pause auto-marquee

      const currentTransform = marqueeElement.style.transform
      const currentX = currentTransform
        ? Number.parseFloat(currentTransform.replace("translateX(", "").replace("px)", ""))
        : 0

      const scrollAmount = 300 // Adjust scroll amount as needed
      const newX = currentX - scrollAmount

      marqueeElement.style.transform = `translateX(${newX}px)`

      // Clear any existing timeout and set a new one to resume auto-scroll
      if (manualScrollTimeoutRefs.current[index]) {
        clearTimeout(manualScrollTimeoutRefs.current[index])
      }
      manualScrollTimeoutRefs.current[index] = setTimeout(() => {
        const isAnyCardFlippedInCategory = flippedCard && flippedCard.startsWith(`${index}-`)
        if (!isAnyCardFlippedInCategory) {
          startMarquee(index)
        }
      }, 1000) // Resume after 1 second
    },
    [pauseMarquee, startMarquee, flippedCard],
  )

  // Initialize marquees
  useEffect(() => {
    const products = getCurrentProducts()

    products.forEach((category, index) => {
      if (category.products.length > 3) {
        isPausedRefs.current[index] = false
        if (marqueeRefs.current[index]) {
          startMarquee(index)
        }
      } else {
        isPausedRefs.current[index] = true
      }
    })

    return () => {
      animationRefs.current.forEach((animationId) => {
        if (animationId) cancelAnimationFrame(animationId)
      })
    }
  }, [startMarquee, getCurrentProducts])

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "products", "about", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Factory className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Nitin Industries</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["home", "products", "about", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === section
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  }`}
                >
                  {section}
                </button>
              ))}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-blue-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {["home", "products", "about", "contact"].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="capitalize block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 w-full text-left"
                  >
                    {section}
                  </button>
                ))}
                <div className="px-3 py-2">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="h-5 w-5 text-yellow-500" />
                        <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Home Section */}
      <section
        id="home"
        className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          {/* "Since 1992" on left top */}
          <div className="absolute top-8 left-8 text-lg dark:text-gray-200 font-bold italic text-slate-500">
            Since 1992
          </div>

          {/* "Checkout IndiaMART" button on right top */}
          <div className="absolute top-8 right-8">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow-lg animate-pulse">
              Checkout IndiaMART
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">{companyData.name}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Leading Manufacturer of Industrial Lamination Machines
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto mb-12">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Surat, Gujarat</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">GST</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{companyData.GST}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Experience</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{companyData.yearsInBusiness}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">TrustSEAL</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Verified</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">CEO</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{companyData.CEO}</p>
              </div>
            </div>

            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Get Quote Now
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Product Range</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive range of industrial lamination machines designed for efficiency and precision
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="mb-8 max-w-md mx-auto">
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
                setSelectedSubCategory(null)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Product Category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(productCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-category Selection for Lamination Machine */}
          {selectedCategory === "Lamination Machine" && (
            <div className="mb-8 max-w-md mx-auto">
              <Select
                value={selectedSubCategory || ""}
                onValueChange={(value) => {
                  setSelectedSubCategory(value)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Machine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cold Lamination Machine">Cold Lamination Machine</SelectItem>
                  <SelectItem value="Thermal Lamination Machine">Thermal Lamination Machine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Products Display */}
          {getCurrentProducts().length > 0 && (
            <div className="space-y-12">
              {getCurrentProducts().map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{category.category}</h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{category.description}</p>
                  </div>

                  {/* Conditional Marquee/Grid Layout */}
                  {category.products.length > 3 ? (
                    <>
                      {/* Mobile Slider */}
                      <div className="md:hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                          <div className="flex space-x-4 pb-4 px-2" style={{ width: "max-content" }}>
                            {category.products.map((product, productIndex) => (
                              <div key={productIndex} className="flex-shrink-0 w-64 sm:w-72">
                                <div className="perspective-1000 h-full">
                                  <div
                                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                                      flippedCard === `${categoryIndex}-${productIndex}` ? "rotate-y-180" : ""
                                    }`}
                                  >
                                    {/* Front of card */}
                                    <Card className="w-full bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300 backface-hidden">
                                      <CardHeader>
                                        <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                          <img
                                            src={
                                              productDetails[product as keyof typeof productDetails]?.image ||
                                              "/placeholder.svg?height=200&width=300" ||
                                              "/placeholder.svg"
                                            }
                                            alt={product}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                              // Fallback to icon if image fails to load
                                              e.currentTarget.style.display = "none"
                                              e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                            }}
                                          />
                                          <Factory className="h-12 w-12 text-blue-600 dark:text-blue-400 hidden" />
                                        </div>
                                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                                          {product}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <Button
                                          variant="outline"
                                          className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 bg-transparent text-sm"
                                          onClick={() =>
                                            handleCardClick(`${categoryIndex}-${productIndex}`, categoryIndex)
                                          }
                                        >
                                          View Details
                                        </Button>
                                      </CardContent>
                                    </Card>

                                    {/* Back of card */}
                                    <Card className="absolute inset-0 w-full bg-blue-50 dark:bg-blue-900 rotate-y-180 backface-hidden">
                                      <CardHeader>
                                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                          {product}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        {productDetails[product as keyof typeof productDetails] && (
                                          <>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                                Specifications:
                                              </h4>
                                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                                {productDetails[product as keyof typeof productDetails].specifications}
                                              </p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                                Features:
                                              </h4>
                                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                                {productDetails[product as keyof typeof productDetails].features}
                                              </p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                                Applications:
                                              </h4>
                                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                                {productDetails[product as keyof typeof productDetails].applications}
                                              </p>
                                            </div>
                                          </>
                                        )}
                                        <Button
                                          variant="outline"
                                          className="w-full mt-3 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 bg-transparent text-sm"
                                          onClick={() =>
                                            handleCardClick(`${categoryIndex}-${productIndex}`, categoryIndex)
                                          }
                                        >
                                          Back to Front
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
                            ← Swipe horizontally to browse products →
                          </p>
                        </div>
                      </div>

                      {/* Desktop Marquee */}
                      <div
                        className="hidden md:block relative overflow-hidden"
                        onMouseEnter={() => pauseMarquee(categoryIndex)}
                        onMouseLeave={() =>
                          !flippedCard?.startsWith(`${categoryIndex}-`) && startMarquee(categoryIndex)
                        }
                      >
                        {/* Scroll indicators */}
                        <div
                          className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-lg opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => handleScrollLeft(categoryIndex)}
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-lg opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => handleScrollRight(categoryIndex)}
                        >
                          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>

                        <div
                          ref={(el) => {
                            marqueeRefs.current[categoryIndex] = el
                          }}
                          className="flex space-x-6 pb-4 transition-transform duration-75 ease-linear"
                          style={{ width: "fit-content" }}
                        >
                          {[...category.products, ...category.products, ...category.products].map(
                            (product, productIndex) => (
                              <div key={productIndex} className="flex-shrink-0 w-80">
                                <div className="perspective-1000 h-full">
                                  <div
                                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                                      flippedCard === `${categoryIndex}-${productIndex}` ? "rotate-y-180" : ""
                                    }`}
                                  >
                                    {/* Front of card */}
                                    <Card className="w-full bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300 backface-hidden">
                                      <CardHeader>
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                          <img
                                            src={
                                              productDetails[product as keyof typeof productDetails]?.image ||
                                              "/placeholder.svg?height=200&width=300" ||
                                              "/placeholder.svg"
                                            }
                                            alt={product}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                              // Fallback to icon if image fails to load
                                              e.currentTarget.style.display = "none"
                                              e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                            }}
                                          />
                                          <Factory className="h-16 w-16 text-blue-600 dark:text-blue-400 hidden" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                          {product}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <Button
                                          variant="outline"
                                          className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 bg-transparent"
                                          onClick={() =>
                                            handleCardClick(`${categoryIndex}-${productIndex}`, categoryIndex)
                                          }
                                        >
                                          View Details
                                        </Button>
                                      </CardContent>
                                    </Card>

                                    {/* Back of card */}
                                    <Card className="absolute inset-0 w-full bg-blue-50 dark:bg-blue-900 rotate-y-180 backface-hidden">
                                      <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                          {product}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        {productDetails[product as keyof typeof productDetails] && (
                                          <>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                                Specifications:
                                              </h4>
                                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                                {productDetails[product as keyof typeof productDetails].specifications}
                                              </p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                                Features:
                                              </h4>
                                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                                {productDetails[product as keyof typeof productDetails].features}
                                              </p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                                Applications:
                                              </h4>
                                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                                {productDetails[product as keyof typeof productDetails].applications}
                                              </p>
                                            </div>
                                          </>
                                        )}
                                        <Button
                                          variant="outline"
                                          className="w-full mt-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 bg-transparent"
                                          onClick={() =>
                                            handleCardClick(`${categoryIndex}-${productIndex}`, categoryIndex)
                                          }
                                        >
                                          Back to Front
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        <div className="flex justify-center mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Hover to pause • Auto-scrolling stops when viewing details
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Grid layout for categories with 3 or fewer products */
                    <div
                      className={`grid gap-4 md:gap-6 ${
                        category.products.length === 1
                          ? "grid-cols-1 max-w-md mx-auto"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {category.products.map((product, productIndex) => (
                        <div key={productIndex} className="perspective-1000">
                          <div
                            className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                              flippedCard === `${categoryIndex}-${productIndex}` ? "rotate-y-180" : ""
                            }`}
                          >
                            {/* Front of card */}
                            <Card className="w-full bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300 backface-hidden">
                              <CardHeader>
                                <div className="w-full h-40 md:h-48 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                  <img
                                    src={
                                      productDetails[product as keyof typeof productDetails]?.image ||
                                      "/placeholder.svg?height=200&width=300" ||
                                      "/placeholder.svg"
                                    }
                                    alt={product}
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      // Fallback to icon if image fails to load
                                      e.currentTarget.style.display = "none"
                                      e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                    }}
                                  />
                                  <Factory className="h-12 w-12 md:h-16 md:w-16 text-blue-600 dark:text-blue-400 hidden" />
                                </div>
                                <CardTitle className="text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                  {product}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Button
                                  variant="outline"
                                  className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 bg-transparent text-sm md:text-base"
                                  onClick={() => handleCardClick(`${categoryIndex}-${productIndex}`, categoryIndex)}
                                >
                                  View Details
                                </Button>
                              </CardContent>
                            </Card>

                            {/* Back of card */}
                            <Card className="absolute inset-0 w-full bg-blue-50 dark:bg-blue-900 rotate-y-180 backface-hidden">
                              <CardHeader>
                                <CardTitle className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                                  {product}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2 md:space-y-3">
                                {productDetails[product as keyof typeof productDetails] && (
                                  <>
                                    <div>
                                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs md:text-sm">
                                        Specifications:
                                      </h4>
                                      <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {productDetails[product as keyof typeof productDetails].specifications}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs md:text-sm">
                                        Features:
                                      </h4>
                                      <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {productDetails[product as keyof typeof productDetails].features}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs md:text-sm">
                                        Applications:
                                      </h4>
                                      <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {productDetails[product as keyof typeof productDetails].applications}
                                      </p>
                                    </div>
                                  </>
                                )}
                                <Button
                                  variant="outline"
                                  className="w-full mt-3 md:mt-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 bg-transparent text-sm md:text-base"
                                  onClick={() => handleCardClick(`${categoryIndex}-${productIndex}`, categoryIndex)}
                                >
                                  Back to Front
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {getCurrentProducts().length === 0 && selectedCategory === "Lamination Machine" && !selectedSubCategory && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">Please select a machine type to view products.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About Nitin Industries
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                With {companyData.yearsInBusiness} of excellence in manufacturing, Nitin Industries has established
                itself as a trusted name in the industrial lamination machinery sector. Based in {companyData.location},
                we serve clients across all parts of India.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">TrustSEAL Verified Company</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">25+ Years of Industry Experience</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Pan-India Service Network</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Leadership</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Under the leadership of <strong>{companyData.CEO}</strong>, our company continues to innovate and
                  deliver high-quality industrial solutions that meet the evolving needs of our clients.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Serving All India</h3>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 rounded-lg p-8 text-center">
                <div className="relative mx-auto mb-4" style={{ width: "300px", height: "350px" }}>
                  <svg
                    viewBox="0 0 300 350"
                    className="w-full h-full"
                    style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
                  >
                    {/* India Map Outline */}
                    <path
                      d="M150 20 L180 30 L200 50 L220 70 L240 90 L250 120 L260 150 L250 180 L240 200 L220 220 L200 240 L180 250 L160 260 L140 270 L120 280 L100 270 L80 260 L60 250 L50 230 L40 210 L30 190 L25 170 L20 150 L25 130 L30 110 L40 90 L50 70 L70 50 L90 40 L120 30 Z"
                      fill="transparent"
                      stroke="black"
                      strokeWidth="3"
                      className="animate-pulse"
                    />

                    {/* Animated State Dots */}
                    <circle
                      cx="80"
                      cy="100"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "0s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0s" />
                    </circle>
                    <circle
                      cx="120"
                      cy="80"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0.3s" />
                    </circle>
                    <circle
                      cx="160"
                      cy="90"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "0.6s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0.6s" />
                    </circle>
                    <circle
                      cx="200"
                      cy="110"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "0.9s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0.9s" />
                    </circle>
                    <circle
                      cx="180"
                      cy="140"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "1.2s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1.2s" />
                    </circle>
                    <circle
                      cx="140"
                      cy="130"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "1.5s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1.5s" />
                    </circle>
                    <circle
                      cx="100"
                      cy="150"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "1.8s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1.8s" />
                    </circle>
                    <circle
                      cx="70"
                      cy="180"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "2.1s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="2.1s" />
                    </circle>
                    <circle
                      cx="110"
                      cy="200"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "2.4s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="2.4s" />
                    </circle>
                    <circle
                      cx="150"
                      cy="190"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                      style={{ animationDelay: "2.7s" }}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="2.7s" />
                    </circle>

                    {/* Delivery Routes Animation */}
                    <path
                      d="M150 175 Q120 150 80 100"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.7"
                    >
                      <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path
                      d="M150 175 Q180 120 200 110"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.7"
                    >
                      <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path
                      d="M150 175 Q100 180 70 180"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.7"
                    >
                      <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
                    </path>

                    {/* Central Hub */}
                    <circle cx="150" cy="175" r="6" fill="#f59e0b" className="animate-pulse">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text
                      x="150"
                      y="195"
                      textAnchor="middle"
                      className="text-xs font-bold fill-gray-800 dark:fill-white"
                    >
                      Surat HQ
                    </text>
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pan-India Delivery Network</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Our products reach customers across all 28+ states of India with animated delivery tracking from our
                  Surat headquarters.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">1500+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Happy Clients</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">28+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">States Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Get in touch for quotes, inquiries, or support</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-8">
              <div className="bg-blue-50 dark:bg-blue-900 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Address</p>
                      <p className="text-gray-600 dark:text-gray-300">{companyData.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">CEO</p>
                      <p className="text-gray-600 dark:text-gray-300">{companyData.CEO}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">GST Number</p>
                      <p className="text-gray-600 dark:text-gray-300">{companyData.GST}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300">Click to View Number</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">Send Email Inquiry</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
                <a
                  href="https://maps.app.goo.gl/pBcfbYJMfNbJDB4n7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center w-full h-full text-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer relative z-10"
                  aria-label="View location on Google Maps"
                >
                  {/* Mini India Map Preview */}
                  <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                    <svg viewBox="0 0 300 350" className="w-32 h-40">
                      <path
                        d="M150 20 L180 30 L200 50 L220 70 L240 90 L250 120 L260 150 L250 180 L240 200 L220 220 L200 240 L180 250 L160 260 L140 270 L120 280 L100 270 L80 260 L60 250 L50 230 L40 210 L30 190 L25 170 L20 150 L25 130 L30 110 L40 90 L50 70 L70 50 L90 40 L120 30 Z"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="150" cy="175" r="4" fill="currentColor" className="animate-pulse" />
                    </svg>
                  </div>

                  <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2 relative z-10" />
                  <p className="text-lg font-semibold relative z-10">Interactive Location Map</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 relative z-10">Click to view on Google Maps</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Factory className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">Nitin Industries</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                Leading manufacturer of industrial lamination machines serving clients across India.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>
                  <button onClick={() => scrollToSection("home")} className="hover:text-white">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("products")} className="hover:text-white">
                    Products
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-white">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contact")} className="hover:text-white">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400 dark:text-gray-500">
                <p>Surat, Gujarat, India</p>
                <p>GST: {companyData.GST}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>&copy; 2024 Nitin Industries. All Rights Reserved.</p>
            <p className="text-sm mt-2">Terms of Use | Developed and Managed by IndiaMART InterMESH Limited</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
