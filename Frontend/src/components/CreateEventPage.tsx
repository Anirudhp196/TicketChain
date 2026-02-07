/**
 * CREATE EVENT PAGE - ARTIST/ORGANIZER FLOW
 * 
 * Purpose:
 * - Allow artists and event organizers to create new events
 * - Set ticket tiers, pricing, and availability
 * - Configure anti-scalping rules
 * - Mint NFT tickets to sell
 * 
 * Design Approach:
 * - Multi-step form with clear progression
 * - Visual feedback and validation
 * - Preview of final event listing
 * - Inline help text for Web3 concepts
 */

import { motion } from 'motion/react';
import { Navigation } from './Navigation';
import { Calendar, MapPin, Users, DollarSign, Shield, Star, Plus, X } from 'lucide-react';
import { useState } from 'react';

export function CreateEventPage() {
  const [ticketTiers, setTicketTiers] = useState([
    { name: 'General Admission', price: '', quantity: '' }
  ]);

  const addTier = () => {
    setTicketTiers([...ticketTiers, { name: '', price: '', quantity: '' }]);
  };

  const removeTier = (index: number) => {
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#090b0b] text-[#fafaf9]">
      <Navigation />
      
      {/* Header */}
      <section className="relative pt-32 pb-16 px-8 border-b border-[#262b2a]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-['Space_Grotesk:Bold',sans-serif] text-6xl mb-4">
              Create Your <span className="text-[#32b377]">Event</span>
            </h1>
            <p className="text-[#87928e] text-xl font-['Inter:Regular',sans-serif]">
              Set up your event, configure ticket tiers, and mint NFT tickets for your fans. 
              All sales and resales automatically follow your rules on-chain.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#131615] border border-[#262b2a] rounded-2xl p-8">
            <form className="space-y-8">
              {/* Event Details */}
              <div>
                <h2 className="font-['Space_Grotesk:Bold',sans-serif] text-2xl mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[rgba(50,179,119,0.1)] rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#32b377]" />
                  </div>
                  Event Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 font-['Inter:Medium',sans-serif]">
                      Event Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Music Festival 2026"
                      className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-xl px-4 py-3.5 text-[#fafaf9] placeholder-[#87928e] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 font-['Inter:Medium',sans-serif]">
                        Event Type
                      </label>
                      <select className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-xl px-4 py-3.5 text-[#fafaf9] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]">
                        <option>Concert</option>
                        <option>Sports</option>
                        <option>Festival</option>
                        <option>Comedy</option>
                        <option>Theater</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 font-['Inter:Medium',sans-serif]">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-xl px-4 py-3.5 text-[#fafaf9] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-['Inter:Medium',sans-serif]">
                      Venue / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Madison Square Garden, New York, NY"
                      className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-xl px-4 py-3.5 text-[#fafaf9] placeholder-[#87928e] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-['Inter:Medium',sans-serif]">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell fans what makes your event special..."
                      className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-xl px-4 py-3.5 text-[#fafaf9] placeholder-[#87928e] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif] resize-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Ticket Tiers */}
              <div className="border-t border-[#262b2a] pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-['Space_Grotesk:Bold',sans-serif] text-2xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-[rgba(50,179,119,0.1)] rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-[#32b377]" />
                    </div>
                    Ticket Tiers
                  </h2>
                  <button
                    type="button"
                    onClick={addTier}
                    className="flex items-center gap-2 text-sm bg-[rgba(50,179,119,0.1)] hover:bg-[rgba(50,179,119,0.2)] text-[#32b377] px-4 py-2 rounded-lg transition-colors font-['Inter:Medium',sans-serif]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tier
                  </button>
                </div>
                
                <div className="space-y-4">
                  {ticketTiers.map((tier, index) => (
                    <div key={index} className="bg-[rgba(38,43,42,0.3)] border border-[#262b2a] rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-['Inter:Medium',sans-serif]">Tier {index + 1}</h3>
                        {ticketTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTier(index)}
                            className="text-[#ff6464] hover:text-[#ff8888] transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs mb-2 text-[#87928e] font-['Inter:Regular',sans-serif]">
                            Tier Name
                          </label>
                          <input
                            type="text"
                            value={tier.name}
                            placeholder="e.g., VIP, General"
                            className="w-full bg-[#090b0b] border border-[#262b2a] rounded-lg px-3 py-2.5 text-sm text-[#fafaf9] placeholder-[#87928e] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs mb-2 text-[#87928e] font-['Inter:Regular',sans-serif]">
                            Price (SOL)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={tier.price}
                            placeholder="0.5"
                            className="w-full bg-[#090b0b] border border-[#262b2a] rounded-lg px-3 py-2.5 text-sm text-[#fafaf9] placeholder-[#87928e] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs mb-2 text-[#87928e] font-['Inter:Regular',sans-serif]">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={tier.quantity}
                            placeholder="1000"
                            className="w-full bg-[#090b0b] border border-[#262b2a] rounded-lg px-3 py-2.5 text-sm text-[#fafaf9] placeholder-[#87928e] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Anti-Scalping Rules */}
              <div className="border-t border-[#262b2a] pt-8">
                <h2 className="font-['Space_Grotesk:Bold',sans-serif] text-2xl mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[rgba(50,179,119,0.1)] rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#32b377]" />
                  </div>
                  Anti-Scalping Rules
                </h2>
                <p className="text-[#87928e] text-sm mb-6 font-['Inter:Regular',sans-serif]">
                  Protect your fans from bots and scalpers with on-chain rules enforced automatically.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 font-['Inter:Medium',sans-serif]">
                        Max Tickets per Wallet
                      </label>
                      <input
                        type="number"
                        defaultValue="4"
                        className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-xl px-4 py-3.5 text-[#fafaf9] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 font-['Inter:Medium',sans-serif]">
                        Transfer Cooldown (hours)
                      </label>
                      <input
                        type="number"
                        defaultValue="24"
                        className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-xl px-4 py-3.5 text-[#fafaf9] focus:border-[#32b377] focus:outline-none transition-colors font-['Inter:Regular',sans-serif]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-[#262b2a] text-[#32b377] focus:ring-[#32b377] bg-[rgba(38,43,42,0.5)]"
                      />
                      <span className="text-sm font-['Inter:Regular',sans-serif]">
                        Enable loyalty tier early access (Gold: 72h, Silver: 48h, Bronze: 24h before public)
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-[#262b2a] text-[#32b377] focus:ring-[#32b377] bg-[rgba(38,43,42,0.5)]"
                      />
                      <span className="text-sm font-['Inter:Regular',sans-serif]">
                        Enable 40/40/20 fair resale split (Artist: 40%, Seller: 40%, Platform: 20%)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="border-t border-[#262b2a] pt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#32b377] hover:bg-[#2a9865] transition-all px-8 py-4 rounded-xl font-['Inter:Medium',sans-serif] text-[#090b0b] shadow-lg hover:shadow-[0_0_20px_rgba(50,179,119,0.3)]"
                  >
                    Create Event & Mint Tickets
                  </button>
                  <button
                    type="button"
                    className="flex-1 border border-[#262b2a] hover:border-[#32b377] transition-all px-8 py-4 rounded-xl font-['Inter:Medium',sans-serif] text-[#fafaf9] hover:bg-[rgba(50,179,119,0.05)]"
                  >
                    Save as Draft
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-[rgba(50,179,119,0.05)] border border-[rgba(50,179,119,0.2)] rounded-xl">
                  <p className="text-sm text-[#87928e] font-['Inter:Regular',sans-serif]">
                    💡 <strong className="text-[#32b377]">Estimated gas fee:</strong> ~0.005 SOL to deploy event contract and mint all tickets as NFTs.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
