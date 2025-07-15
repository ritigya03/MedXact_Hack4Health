"use client"

import React, { useState } from "react"
import { Mail, Phone, HelpCircle } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", query: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Navbar></Navbar>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">
            We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="space-y-6">
          {/* Contact Form */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-bold">Send us a message</h2>
              <p className="text-gray-500 text-sm">
                Fill out the form below and we'll get back to you shortly.
              </p>
            </div>
            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-lg font-semibold mb-2">
                    Message sent successfully!
                  </div>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="query"
                      name="query"
                      placeholder="Write your query."
                      className="w-full border-gray-300 rounded-md shadow-sm min-h-[120px] focus:border-blue-500 focus:ring-blue-500"
                      value={formData.query}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-bold">Other ways to reach us</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <Link href="mailto:support@medxact.com" className="text-blue-600 hover:underline">
                    support@medxact.com
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <Link href="tel:+1-555-123-4567" className="text-green-600 hover:underline">
                    +1 (555) 123-4567
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Frequently Asked Questions</p>
                  <Link href="/faq" className="text-purple-600 hover:underline">
                    Visit our FAQ page
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-bold">Business Hours</h2>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
