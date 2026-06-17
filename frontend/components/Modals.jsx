import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, Phone, ShieldCheck, Video, X } from 'lucide-react';

const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka'];

import { useAuth } from '../src/store/useAuth';

export const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let success = false;
    if (activeTab === 'login') {
      success = await login({ email: formData.email, password: formData.password });
    } else {
      success = await register(formData);
    }

    if (success) {
      onLogin();
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-[#1F6F5F]/60 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-[0_40px_120px_rgba(2,8,23,0.28)]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden bg-[#1F6F5F] p-8 text-white lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">Flocksy Access</p>
            <h2 className="mt-5 text-4xl font-serif leading-tight">Run your farm like a modern operations team.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              Centralize AI workflows, crop issues, livestock support, and expert follow-ups with one dashboard built for daily execution.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Track farm performance in one dashboard',
                'Save AI analyses and review action history',
                'Coordinate crop and vet tasks with your team',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <ShieldCheck className="h-5 w-5 text-[#6FCF97]" />
                  <p className="text-sm text-white/88">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex rounded-full bg-[#EEEEEE] p-1">
                {['login', 'signup'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab ? 'bg-white text-[#1F6F5F] shadow-sm' : 'text-[#1F6F5F]/55'
                    }`}
                  >
                    {tab === 'login' ? 'Login' : 'Create account'}
                  </button>
                ))}
              </div>

              <button type="button" onClick={onClose} className="rounded-2xl bg-[#EEEEEE] p-2 text-[#1F6F5F]/55 transition hover:text-[#1F6F5F]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-3xl font-serif text-[#1F6F5F]">
                {activeTab === 'login' ? 'Welcome back to Flocksy' : 'Create your Flocksy workspace'}
              </h3>
              <p className="mt-2 text-sm text-[#1F6F5F]/55">
                {activeTab === 'login'
                  ? 'Resume your dashboard, saved analyses, and expert workflow.'
                  : 'Set up a secure dashboard for your farm operations in under a minute.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {activeTab === 'signup' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Full name</label>
                    <input type="text" required className="input-field" placeholder="Raju Singh" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Phone</label>
                    <input type="tel" required className="input-field" placeholder="+91 98765 43210" />
                  </div>
                </div>
              )}

              {activeTab === 'signup' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">State</label>
                  <select className="input-field" required defaultValue="">
                    <option value="" disabled>Select state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Email address</label>
                <input type="email" required className="input-field" placeholder="raju@flocksy.app" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Password</label>
                <input type="password" required className="input-field" placeholder="Enter your password" />
              </div>

              {activeTab === 'signup' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Confirm password</label>
                  <input type="password" required className="input-field" placeholder="Confirm your password" />
                </div>
              )}

              <button type="submit" disabled={isLoading} className="btn-primary mt-3 w-full justify-center">
                {isLoading ? 'Signing you in...' : activeTab === 'login' ? 'Enter dashboard' : 'Create workspace'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppointmentModal = ({ isOpen, onClose, doctor }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-[#1F6F5F]/60 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-[0_40px_120px_rgba(2,8,23,0.28)]">
        {isSuccess ? (
          <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#6FCF97]/24 text-[#1F6F5F]">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-3xl font-serif text-[#1F6F5F]">Appointment confirmed</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#1F6F5F]/55">
              {doctor?.name} has been added to your workflow. You will receive the consultation details shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-[#1F6F5F]/10 px-6 py-6 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F6F5F]/65">Book Consultation</p>
                <h3 className="mt-2 text-3xl font-serif text-[#1F6F5F]">{doctor?.name || 'Vet Expert'}</h3>
                <p className="mt-2 text-sm text-[#1F6F5F]/55">Schedule a secure expert session inside your Flocksy workflow.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-2xl bg-[#EEEEEE] p-2 text-[#1F6F5F]/55 transition hover:text-[#1F6F5F]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Full name</label>
                  <input type="text" required className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Phone number</label>
                  <input type="tel" required className="input-field" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Problem summary</label>
                <textarea
                  required
                  rows="4"
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Describe symptoms, urgency, and what help you need."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Preferred date</label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F6F5F]/45" />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="input-field pl-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F6F5F]/75">Time slot</label>
                  <select className="input-field" defaultValue="Morning 9AM - 12PM" required>
                    <option>Morning 9AM - 12PM</option>
                    <option>Afternoon 12PM - 3PM</option>
                    <option>Evening 3PM - 6PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-[#1F6F5F]/75">Consultation mode</label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Video call', value: 'video', icon: Video },
                    { label: 'Phone call', value: 'phone', icon: Phone },
                    { label: 'In-person', value: 'visit', icon: ShieldCheck },
                  ].map(({ label, value, icon: Icon }) => (
                    <label key={value} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#1F6F5F]/10 bg-[#EEEEEE] px-4 py-3 text-sm text-[#1F6F5F]/75 transition hover:border-[#6FCF97]">
                      <input type="radio" name="consultationType" value={value} required className="accent-[#1F6F5F]" />
                      <Icon className="h-4 w-4 text-[#1F6F5F]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center">Confirm appointment</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
