import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, MapPin, Search, Star, Stethoscope, Video } from 'lucide-react';
import { AppointmentModal } from '../components/Modals';
import { vetApi } from '../src/api';

const tabs = ['All', 'Poultry Specialist', 'Cattle & Livestock', 'Crop Disease Expert'];

export const VetDirectory = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVets = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await vetApi.listVets();
        const items = (data.items || []).map((vet, index) => ({
          id: vet.id,
          name: vet.name,
          spec: vet.specialty || 'Farm Specialist',
          city: vet.city || 'Remote',
          exp: vet.exp || 5 + index,
          rating: vet.rating || 4.8,
          avail: vet.availability || 'Available soon',
          mode: vet.mode || 'Video & phone',
        }));
        setDoctors(items);
      } catch (loadError) {
        console.error(loadError);
        setError('Unable to load the vet network right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVets();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesTab = activeTab === 'All' || doctor.spec === activeTab;
      const matchesQuery =
        query.trim() === '' ||
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.city.toLowerCase().includes(query.toLowerCase()) ||
        doctor.spec.toLowerCase().includes(query.toLowerCase());

      return matchesTab && matchesQuery;
    });
  }, [activeTab, query]);

  const getInitials = (name) =>
    name
      .replace('Dr. ', '')
      .split(' ')
      .map((part) => part[0])
      .join('');

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="dashboard-card p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="eyebrow">Vet network</span>
            <h1 className="mt-4 text-4xl font-serif text-slate-950 sm:text-5xl">Find the right expert without leaving your workflow.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              The refreshed directory feels more like a true professional dashboard module, with better scanning, filtering, and booking flow for critical farm cases.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Verified experts', value: String(doctors.length || 0) },
              { label: 'Average rating', value: doctors.length ? `${(doctors.reduce((sum, doctor) => sum + doctor.rating, 0) / doctors.length).toFixed(1)}/5` : '--' },
              { label: 'Available now', value: String(doctors.filter((doctor) => doctor.avail.toLowerCase().includes('hour') || doctor.avail.toLowerCase().includes('today')).length) },
            ].map((item) => (
              <div key={item.label} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab ? 'bg-emerald-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, city, or specialization"
              className="input-field pl-11"
            />
          </div>
        </div>

        {isLoading && <p className="mt-6 text-sm text-slate-500">Loading vet network...</p>}
        {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

        <div className="mt-6 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <article key={doctor.id} className="rounded-[30px] border border-slate-200 bg-slate-50/75 p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950 text-lg font-semibold text-amber-300">
                    {getInitials(doctor.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{doctor.name}</h2>
                    <p className="mt-1 text-sm text-emerald-700">{doctor.spec}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  doctor.avail === 'Available Today' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {doctor.avail}
                </span>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  {doctor.city}
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <Stethoscope className="h-4 w-4 text-emerald-700" />
                  {doctor.exp} years of experience
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <Video className="h-4 w-4 text-emerald-700" />
                  {doctor.mode}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-900">{doctor.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  Next slot in 1 day
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" className="btn-secondary justify-center">View profile</button>
                <button type="button" onClick={() => openBooking(doctor)} className="btn-primary justify-center">Book now</button>
              </div>
            </article>
          ))}
        </div>

        {!isLoading && !error && filteredDoctors.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            No vets match this search yet.
          </div>
        )}
      </section>

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} doctor={selectedDoctor} />
    </div>
  );
};
