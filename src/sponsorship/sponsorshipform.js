import React, { useState } from "react";

const SponsorshipForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    childName: "",
    sponsorshipType: "",
    duration: "",
    amount: "",
    updates: false,
    gifts: false,
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Check if APIs exist first
      const apiExists = await checkApiEndpoints();
      
      if (!apiExists) {
        // Fallback: Log form data and show success message
        console.log('Form Data Submitted:', formData);
        setMessage({ 
          text: "Form submitted successfully! (Backend API not configured - check console for form data)", 
          type: "success" 
        });
        
        // Reset form
        resetForm();
        return;
      }

      // Original API calls (if endpoints exist)
      const donorResponse = await fetch('/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!donorResponse.ok) {
        throw new Error('Failed to create donor');
      }

      const donorData = await donorResponse.json();

      // Create sponsorship
      const startDate = new Date().toISOString().split('T')[0];
      let endDate;
      
      if (formData.duration === 'Monthly') {
        endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      } else if (formData.duration === 'Yearly') {
        endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      } else {
        endDate = startDate; // One-time
      }

      const sponsorshipResponse = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donor_id: donorData.donor_id,
          child_id: formData.childName === 'dennis' ? 1 : 2,
          start_date: startDate,
          end_date: endDate,
          status: 'Active',
          sponsorship_type: formData.sponsorshipType,
          amount: formData.amount,
          duration: formData.duration,
        }),
      });

      if (!sponsorshipResponse.ok) {
        throw new Error('Failed to create sponsorship');
      }

      setMessage({ text: "Sponsorship form submitted successfully!", type: "success" });
      resetForm();

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // More specific error handling
      if (error.message.includes('Failed to fetch') || error.toString().includes('404')) {
        console.log('API endpoints not found. Form data:', formData);
        setMessage({ 
          text: "Backend API not configured. Form data logged to console.", 
          type: "warning" 
        });
        resetForm();
      } else {
        setMessage({ 
          text: "Failed to submit sponsorship form. Please try again.", 
          type: "error" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkApiEndpoints = async () => {
    try {
      const response = await fetch('/api/donors', { method: 'HEAD' });
      return response.status !== 404;
    } catch {
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      childName: "",
      sponsorshipType: "",
      duration: "",
      amount: "",
      updates: false,
      gifts: false,
      terms: false,
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Sponsor a Child</h2>

      {message.text && (
        <div className={`p-3 rounded mb-4 ${
          message.type === "success" ? "bg-green-100 text-green-700" :
          message.type === "warning" ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input 
            type="text"
            name="fullName" 
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address *</label>
          <input 
            type="email"
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number *</label>
          <input 
            type="tel"
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Child Name *</label>
          <select
            name="childName"
            value={formData.childName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a child</option>
            <option value="dennis">Dennis</option>
            <option value="dennis2">Dennis 2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sponsorship Type *</label>
          <select
            name="sponsorshipType"
            value={formData.sponsorshipType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Basic Needs">Basic Needs</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sponsorship Duration *</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select duration</option>
            <option value="One-time">One-time</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Donation Amount (USD) *</label>
          <input 
            type="number"
            name="amount" 
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="updates"
            checked={formData.updates}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Receive updates about the child's progress</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            required
            className="mr-2"
          />
          <label className="text-sm">I agree to the terms and conditions *</label>
        </div>

        <button 
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-wait"
        >
          {loading ? "Submitting..." : "Submit Sponsorship"}
        </button>
      </div>
    </div>
  );
};

export default SponsorshipForm;