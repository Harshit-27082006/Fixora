import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PRIORITIES, DEPARTMENTS } from '../data/seedData';
import { analyzeComplaintText, checkDuplicateComplaint } from '../services/aiEngine';
import { 
  Sparkles, 
  UploadCloud, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  MapPin, 
  Camera, 
  X, 
  FileText, 
  Info,
  ExternalLink,
  ChevronRight,
  Navigation,
  Crosshair,
  Compass,
  RefreshCw
} from 'lucide-react';

const SAMPLE_CAMPUS_IMAGES = [
  { label: 'Damaged Ceiling Fan', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
  { label: 'Water Leakage Seepage', url: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80' },
  { label: 'Exposed Wires / Switchboard', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80' },
  { label: 'Air Conditioner Breakdown', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80' }
];

const LOCATION_PRESETS = [
  'Academic Block A, Room 204',
  'Academic Block B, Room 302',
  'Central Library, 2nd Floor Reading Hall',
  'Hostel 3, Block C - 3rd Floor',
  'Hostel 1, Ground Floor Dining Mess',
  'Engineering Block, 1st Floor Corridor',
  'Science Block, Lab 4 (Biochemistry)',
  'Main Seminar Hall 1',
  'South Campus Perimeter Road Gate 2',
  'Bus Bay 4 / North City Route'
];

export function ReportComplaint() {
  const { addComplaint, complaints, navigateTo } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [imageUrl, setImageUrl] = useState('');
  const [assignedDepartment, setAssignedDepartment] = useState('Maintenance');

  // GPS Location State
  const [gpsCoordinates, setGpsCoordinates] = useState(null); // { lat, lng, accuracy, detectedAt }
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'loading' | 'detected' | 'denied' | 'error'
  const [gpsNotice, setGpsNotice] = useState('');

  // AI Assistance state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [duplicateMatch, setDuplicateMatch] = useState(null);
  const [aiApplied, setAiApplied] = useState(false);

  // Success Modal
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Request GPS Geolocation on user button click
  const handleRequestLocation = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGpsStatus('error');
      setGpsNotice('Geolocation API is not supported by your browser.');
      return;
    }

    setGpsStatus('loading');
    setGpsNotice('Acquiring device GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          detectedAt: new Date().toISOString()
        };
        setGpsCoordinates(coords);
        setGpsStatus('detected');
        setGpsNotice(`GPS Verified: ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E (±${Math.round(accuracy)}m)`);
        
        // If location is blank, provide GPS label
        if (!location.trim()) {
          setLocation(`Campus Sector [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        if (error.code === 1) { // PERMISSION_DENIED
          setGpsStatus('denied');
          setGpsNotice('Location permission denied. GPS is completely optional — you can still type the campus room/block name manually.');
        } else {
          setGpsStatus('error');
          setGpsNotice('Could not determine current location. Please enter campus room/block manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000
      }
    );
  };

  const handleClearLocation = () => {
    setGpsCoordinates(null);
    setGpsStatus('idle');
    setGpsNotice('');
  };

  // Run AI analysis as user types title and description
  useEffect(() => {
    if (title.trim().length > 3 || description.trim().length > 10) {
      const analysis = analyzeComplaintText(title, description);
      setAiAnalysis(analysis);

      // Check duplicates
      const dup = checkDuplicateComplaint(
        { title, description, location, category },
        complaints
      );
      setDuplicateMatch(dup?.isDuplicate ? dup : null);
    } else {
      setAiAnalysis(null);
      setDuplicateMatch(null);
    }
  }, [title, description, location, complaints]);

  // Quick apply AI recommendations
  const applyAiRecommendations = () => {
    if (!aiAnalysis) return;
    setCategory(aiAnalysis.suggestedCategory);
    setPriority(aiAnalysis.suggestedPriority);
    setAssignedDepartment(aiAnalysis.suggestedDepartment);
    setAiApplied(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket = addComplaint({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim() || 'General Campus Area',
      coordinates: gpsCoordinates, // Attach GPS coordinates if permitted
      priority,
      assignedDepartment,
      imageUrl: imageUrl || null,
      aiSummary: aiAnalysis?.shortSummary
    });

    setSubmittedTicket(newTicket);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Report Campus Complaint
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              AI-Assisted Triage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Describe the problem in your own words. Fixora will analyze category, hazard level, and route directly to technicians.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Complaint Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Broken ceiling fan making screeching noise in Lab 204"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            {/* Description with Live AI indicator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                {aiAnalysis && (
                  <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Analyzing Input...
                  </span>
                )}
              </div>
              <textarea
                required
                rows={4}
                placeholder="Describe what is broken, what floor/room, how urgent it is, or if there is any safety hazard..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none leading-relaxed"
              />
            </div>

            {/* Location with GPS Current Location & Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Specific Campus Location <span className="text-rose-500">*</span>
                </label>

                {/* GPS Current Location Button */}
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={gpsStatus === 'loading'}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all border ${
                    gpsStatus === 'detected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border-slate-300'
                  }`}
                  title="Detect GPS coordinates using device location"
                >
                  {gpsStatus === 'loading' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                      <span>Acquiring GPS...</span>
                    </>
                  ) : gpsStatus === 'detected' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>GPS Attached</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5 text-brand-600" />
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Main Location Input */}
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Hostel 3, 2nd floor corridor or Academic Block A Room 204"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              {/* GPS Live Feedback & Map Coordinates Card */}
              {gpsStatus === 'detected' && gpsCoordinates && (
                <div className="mt-2.5 p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-emerald-800">
                        Current location detected
                      </div>
                      <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                        Lat: {gpsCoordinates.lat.toFixed(5)}, Lng: {gpsCoordinates.lng.toFixed(5)} (±{gpsCoordinates.accuracy}m)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <a
                      href={`https://www.google.com/maps?q=${gpsCoordinates.lat},${gpsCoordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold hover:underline"
                    >
                      <span>Preview Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="text-slate-400 hover:text-rose-600 text-[11px] font-semibold ml-1"
                    >
                      Clear GPS
                    </button>
                  </div>
                </div>
              )}

              {/* GPS Denied / Error Notice */}
              {gpsNotice && gpsStatus !== 'detected' && (
                <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                  gpsStatus === 'denied' 
                    ? 'bg-amber-50 border border-amber-200 text-amber-800' 
                    : 'bg-slate-100 border border-slate-200 text-slate-700'
                }`}>
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{gpsNotice}</span>
                </div>
              )}

              {/* Location presets chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 self-center mr-1">Presets:</span>
                {LOCATION_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLocation(preset)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
                  >
                    {preset.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Category and Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                >
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.label} (SLA: {p.sla})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Evidence / Photo Attachment (Optional)
              </label>

              {imageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-56 group">
                  <img
                    src={imageUrl}
                    alt="Complaint attachment"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded backdrop-blur">
                    Photo attached
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-brand-50/30">
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">
                      Click to browse or drag campus photo here
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Supports JPG, PNG, WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Campus Infrastructure Reference Photos */}
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold mb-1">
                      Or select campus issue reference photo:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_CAMPUS_IMAGES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(sample.url)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-100 hover:text-brand-700 text-slate-600 text-xs font-medium border border-slate-200 transition-colors"
                        >
                          + {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Ticket ID generated automatically upon submission.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
              >
                <span>Submit Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI Smart Assist Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Suggestions Card */}
          <div className="bg-gradient-to-b from-indigo-50/90 to-white rounded-xl border border-brand-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brand-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Smart Triage
                  </h3>
                  <span className="text-[10px] text-brand-600 font-semibold">
                    Real-time text analysis
                  </span>
                </div>
              </div>

              {aiAnalysis && !aiApplied && (
                <button
                  type="button"
                  onClick={applyAiRecommendations}
                  className="px-2.5 py-1 rounded bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold shadow-sm transition-all"
                >
                  Apply All
                </button>
              )}
            </div>

            {aiAnalysis ? (
              <div className="space-y-3.5 text-xs">
                {/* Detected Category */}
                <div className="p-2.5 rounded-lg bg-white border border-brand-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Suggested Category</span>
                    <span className="text-brand-600 font-bold font-mono">
                      {aiAnalysis.confidence}% match
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">
                      {aiAnalysis.suggestedCategory}
                    </span>
                    {category !== aiAnalysis.suggestedCategory && (
                      <button
                        type="button"
                        onClick={() => setCategory(aiAnalysis.suggestedCategory)}
                        className="text-[11px] text-brand-600 font-semibold hover:underline"
                      >
                        Use this
                      </button>
                    )}
                  </div>
                </div>

                {/* Priority & Urgency Risk */}
                <div className={`p-2.5 rounded-lg border shadow-sm ${
                  aiAnalysis.isHazard 
                    ? 'bg-rose-50 border-rose-200 text-rose-900' 
                    : 'bg-white border-brand-100 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">Urgency Assessment</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      aiAnalysis.suggestedPriority === 'Critical'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : (aiAnalysis.suggestedPriority === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white')
                    }`}>
                      {aiAnalysis.suggestedPriority}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
                    {aiAnalysis.riskExplanation}
                  </p>
                </div>

                {/* Suggested Department */}
                <div className="p-2.5 rounded-lg bg-white border border-brand-100 shadow-sm">
                  <span className="text-slate-500 font-medium">Target Department</span>
                  <div className="mt-1 font-bold text-slate-900">
                    {aiAnalysis.suggestedDepartment} Department
                  </div>
                </div>

                {/* AI One-Line Summary */}
                <div className="p-2.5 rounded-lg bg-white border border-brand-100 shadow-sm">
                  <span className="text-slate-500 font-medium">Executive AI Summary</span>
                  <p className="mt-1 italic text-slate-700 font-medium">
                    "{aiAnalysis.shortSummary}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-brand-300 opacity-60" />
                <p className="text-xs font-semibold text-slate-600">
                  Type title or description
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  AI will suggest category, urgency priority, and check duplicates automatically.
                </p>
              </div>
            )}
          </div>

          {/* Duplicate Detection Alert Card */}
          {duplicateMatch && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 shadow-sm space-y-2 animate-subtle-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <h4 className="text-xs font-bold text-amber-900">
                  Potential Duplicate Ticket Found ({duplicateMatch.similarityScore}%)
                </h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {duplicateMatch.reason}
              </p>
              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('complaint-details', duplicateMatch.matchedTicket.id)}
                  className="font-bold text-amber-900 underline flex items-center gap-1"
                >
                  Inspect Existing Ticket #{duplicateMatch.matchedTicket.id}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Campus Facility Guidelines */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-600" />
              Reporting Guidelines
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px]">
              <li>For immediate electrical fires or hazards, alert safety security first.</li>
              <li>Include room numbers or floor landmarks for faster response.</li>
              <li>Attach clear photos when reporting physical structural damage.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {submittedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Complaint Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                Your issue has been recorded and queued for triage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tracking Ticket ID:</span>
                <span className="font-mono font-bold text-sm text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {submittedTicket.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Department:</span>
                <strong className="text-slate-800">{submittedTicket.assignedDepartment}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Priority Level:</span>
                <strong className="text-slate-800">{submittedTicket.priority}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Target Resolution:</span>
                <strong className="text-emerald-700">
                  {submittedTicket.priority === 'Critical' ? 'Within 2 Hours' : 'Within 24 Hours'}
                </strong>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  const id = submittedTicket.id;
                  setSubmittedTicket(null);
                  navigateTo('complaint-details', id);
                }}
                className="flex-1 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Track Status Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  navigateTo('my-complaints');
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                My Complaints
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
