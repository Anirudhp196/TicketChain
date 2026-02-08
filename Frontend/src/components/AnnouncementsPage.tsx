import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Navigation } from './Navigation';
import { Calendar, Megaphone } from 'lucide-react';
import { getAnnouncements, createAnnouncement, getEvents } from '../lib/api';
import { useWallet, shortenAddress } from '../contexts/WalletContext';
import type { Event } from '../types';
import type { Announcement } from '../lib/api';

export function AnnouncementsPage() {
  const { connected, publicKey, connect } = useWallet();
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getEvents(), getAnnouncements()])
      .then(([eventsData, announcementsData]) => {
        if (cancelled) return;
        setEvents(eventsData);
        setAnnouncements(announcementsData);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load announcements');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const organizerEvents = useMemo(() => {
    if (!publicKey) return [];
    return events.filter((event) => event.organizerPubkey === publicKey);
  }, [events, publicKey]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!connected || !publicKey) {
      connect();
      return;
    }
    if (!selectedEvent || !message.trim()) {
      setError('Select an event and write a message.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const created = await createAnnouncement(publicKey, selectedEvent, message.trim());
      setAnnouncements((prev) => [created, ...prev]);
      setMessage('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090b0b] text-[#fafaf9]">
      <Navigation />

      <section className="relative pt-32 pb-16 px-8 border-b border-[#262b2a]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-['Space_Grotesk:Bold',sans-serif] text-6xl mb-4">
              Event <span className="text-[#32b377]">Announcements</span>
            </h1>
            <p className="text-[#87928e] text-xl font-['Inter:Regular',sans-serif]">
              Creators can share updates with their fans. All announcements live in the app database.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-[rgba(255,100,100,0.1)] border border-[rgba(255,100,100,0.3)] rounded-xl text-[#ff6464] font-['Inter:Medium',sans-serif]">
                {error}
              </div>
            )}

            {loading ? (
              <div className="h-40 bg-[#131615] border border-[#262b2a] rounded-2xl animate-pulse" />
            ) : announcements.length === 0 ? (
              <div className="p-6 bg-[#131615] border border-[#262b2a] rounded-2xl text-[#87928e] font-['Inter:Medium',sans-serif]">
                No announcements yet.
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={`${announcement.event_pubkey}-${announcement.created_at ?? Math.random()}`}
                  className="bg-[#131615] border border-[#262b2a] rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-['Space_Grotesk:Bold',sans-serif] text-xl">
                        {announcement.event_title ?? 'Event'}
                      </h3>
                      <div className="text-sm text-[#87928e]">
                        {shortenAddress(announcement.organizer_pubkey)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#87928e]">
                      <Calendar className="w-4 h-4 text-[#32b377]" />
                      {announcement.created_at
                        ? new Date(announcement.created_at).toLocaleString()
                        : 'Just now'}
                    </div>
                  </div>
                  <p className="text-[#d7dad9] font-['Inter:Regular',sans-serif] leading-relaxed">
                    {announcement.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#131615] border border-[#262b2a] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[rgba(50,179,119,0.1)] rounded-lg flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-[#32b377]" />
                </div>
                <h2 className="font-['Space_Grotesk:Bold',sans-serif] text-xl">Create Announcement</h2>
              </div>

              {!connected && (
                <div className="text-sm text-[#87928e] mb-4">
                  Connect your wallet to post an announcement.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs mb-2 text-[#87928e] font-['Inter:Regular',sans-serif]">
                    Select Event
                  </label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-lg px-3 py-2.5 text-sm text-[#fafaf9]"
                    disabled={!connected || organizerEvents.length === 0}
                  >
                    <option value="">Choose an event</option>
                    {organizerEvents.map((event) => (
                      <option key={event.eventPubkey ?? event.id} value={event.eventPubkey ?? ''}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs mb-2 text-[#87928e] font-['Inter:Regular',sans-serif]">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={500}
                    className="w-full bg-[rgba(38,43,42,0.5)] border border-[#262b2a] rounded-lg px-3 py-2.5 text-sm text-[#fafaf9] resize-none"
                    placeholder="Share an update with ticket holders…"
                    disabled={!connected}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!connected || submitting}
                  className="w-full bg-[#32b377] hover:bg-[#2a9865] disabled:opacity-60 transition-all px-4 py-2.5 rounded-lg font-['Inter:Medium',sans-serif] text-sm text-[#090b0b]"
                >
                  {submitting ? 'Posting…' : 'Post Announcement'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
