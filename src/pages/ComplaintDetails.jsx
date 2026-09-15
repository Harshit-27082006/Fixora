import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/common/StatusBadge';
import { StatusTimeline } from '../components/timeline/StatusTimeline';
import { DEPARTMENTS, PRIORITIES } from '../data/seedData';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertTriangle,
  Star,
  MessageSquare,
  Wrench,
  ChevronRight,
  Share2,
  Compass,
  ExternalLink,
  Navigation
} from 'lucide-react';

export function ComplaintDetails() {
  const { 
    selectedComplaintId, 
    complaints, 
    currentUser, 
    navigateTo, 
    updateComplaintStatus, 
    assignDepartment, 
    updatePriority, 
    addComplaintResponse,
    rateSatisfaction 
  } = useApp();

  const complaint = complaints.find(c => c.id === selectedComplaintId) || complaints[0];

  // Action states
  const [newResponse, setNewResponse] = useState('');
  const [selectedDept, setSelectedDept] = useState(complaint?.assignedDepartment || 'Electrical');
  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || 'In Progress');
  const [selectedPriority, setSelectedPriority] = useState(complaint?.priority || 'Medium');
  const [adminNote, setAdminNote] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Student feedback state
  const [userRating, setUserRating] = useState(complaint?.satisfactionRating || 5);
  const [userFeedback, setUserFeedback] = useState(complaint?.resolutionFeedback || '');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!complaint?.satisfactionRating);

  if (!complaint) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Complaint not found.</p>
        <button
          onClick={() => navigateTo('my-complaints')}
          className="mt-3 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold"
        >
          Back to Complaints
        </button>
      </div>
    );
  }

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!newResponse.trim()) return;
    addComplaintResponse(complaint.id, newResponse);
    setNewResponse('');
  };

  const handleUpdateStatus = (statusToSet, customNote) => {
    updateComplaintStatus(complaint.id, statusToSet, customNote || adminNote);
    setAdminNote('');
    setShowStatusModal(false);
  };

  const handleAssignDept = () => {
    assignDepartment(complaint.id, selectedDept, adminNote);
    setAdminNote('');
    setShowAssignModal(false);
  };

  const handlePriorityChange = (e) => {
    const newP = e.target.value;
    setSelectedPriority(newP);
    updatePriority(complaint.id, newP);
  };

  const handleRateSubmit = (e) => {
    e.preventDefault();
    rateSatisfaction(complaint.id, userRating, userFeedback);
    setFeedbackSubmitted(true);
  };

  const isResolved = complaint.status === 'Resolved';
  const isAdmin = currentUser.role === 'admin';
  const isDept = currentUser.role === 'department';
  const isReporter = currentUser.id === complaint.reportedBy?.id;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => navigateTo(currentUser.role === 'admin' ? 'admin-complaints' : 'my-complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400">
            Ticket ID:
          </span>
          <span className="font-mono text-xs font-black text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
            {complaint.id}
          </span>
        </div>
      </div>

      {/* Main Ticket Banner Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <CategoryBadge category={complaint.category} />
          <PriorityBadge priority={complaint.priority} size="md" />
          <StatusBadge status={complaint.status} size="md" />
          {complaint.assignedDepartment && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Building className="w-3.5 h-3.5" />
              Assigned: {complaint.assignedDepartment}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
          {complaint.title}
        </h1>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
              <div className="font-semibold text-slate-800">{complaint.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Reported On</div>
              <div className="font-semibold text-slate-800">
                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Reported By</div>
              <div className="font-semibold text-slate-800 truncate">
                {complaint.reportedBy?.name || 'Campus Student'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Resolution SLA</div>
              <div className="font-semibold text-emerald-700">
                {complaint.priority === 'Critical' ? 'Within 2 Hours' : 'Within 24 Hours'}
              </div>
            </div>
          </div>
        </div>

        {/* GPS Coordinates Verification Card (If permitted) */}
        {complaint.coordinates && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-emerald-800">GPS Location Coordinates: </span>
                <span className="font-mono text-emerald-700">
                  {complaint.coordinates.lat?.toFixed(5)}° N, {complaint.coordinates.lng?.toFixed(5)}° E
                </span>
                {complaint.coordinates.accuracy && (
                  <span className="text-emerald-600 text-[11px] ml-1.5">
                    (Accuracy: ±{complaint.coordinates.accuracy}m)
                  </span>
                )}
              </div>
            </div>

            <a
              href={`https://www.google.com/maps?q=${complaint.coordinates.lat},${complaint.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold hover:underline shrink-0"
            >
              <span>View On Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* AI Brief and Urgency Callout */}
        {(complaint.aiSummary || complaint.riskExplanation) && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-200/60 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-brand-100 text-brand-700 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-brand-900 uppercase tracking-wide text-[10px]">
                AI Operational Assessment
              </span>
              {complaint.aiSummary && (
                <p className="text-slate-700 font-medium">
                  {complaint.aiSummary}
                </p>
              )}
              {complaint.riskExplanation && (
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {complaint.riskExplanation}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Administrative / Department Resolution Action Bar (Hidden for students) */}
      {/* Administrative Resolution Action Bar (Admin only) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl p-5 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Administrative Resolution Controls
              </span>
              <p className="text-xs text-slate-300">
                Triage this ticket, dispatch to campus departments, adjust priority SLA, or record official resolution notes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Assign Department</span>
              </button>

              <button
                onClick={() => setShowStatusModal(true)}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Change Status</span>
              </button>

              <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400 text-[11px]">Priority:</span>
                <select
                  value={complaint.priority}
                  onChange={handlePriorityChange}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
                >
                  <option value="Low" className="bg-slate-900 text-white">Low</option>
                  <option value="Medium" className="bg-slate-900 text-white">Medium</option>
                  <option value="High" className="bg-slate-900 text-white">High</option>
                  <option value="Critical" className="bg-slate-900 text-white">Critical</option>
                </select>
              </div>

              {complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
                <button
                  onClick={() => handleUpdateStatus('Resolved', 'Verified resolved with campus facilities team.')}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              )}

              {complaint.status !== 'Closed' && (
                <button
                  onClick={() => handleUpdateStatus('Closed', 'Administrative closure: grievance verified and closed.')}
                  className="px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Close Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Left Column Details & Timeline, Right Column Activity / Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Description Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Issue Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>

            {/* Image Attachment */}
            {complaint.imageUrl && (
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 mb-2">
                  Attached Site Evidence Photo:
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint evidence"
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status Timeline Milestone Component */}
          <StatusTimeline complaint={complaint} />
        </div>

        {/* Right Column: Communication Updates & Feedback */}
        <div className="lg:col-span-5 space-y-6">
          {/* Student Resolution Feedback Card (if resolved) */}
          {isResolved && (
            <div className="bg-emerald-50/80 rounded-xl border border-emerald-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Resolution Feedback
                </h3>
              </div>

              {feedbackSubmitted ? (
                <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= (complaint.satisfactionRating || userRating) ? 'fill-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="text-slate-600 font-bold ml-1.5">
                      {complaint.satisfactionRating || userRating} / 5 Stars
                    </span>
                  </div>
                  {complaint.resolutionFeedback && (
                    <p className="text-slate-600 italic">
                      "{complaint.resolutionFeedback}"
                    </p>
                  )}
                  <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                    ✓ Feedback logged in campus satisfaction records
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRateSubmit} className="space-y-3">
                  <p className="text-xs text-emerald-900">
                    How satisfied are you with the speed and quality of this resolution?
                  </p>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    placeholder="Add brief feedback or comments (optional)..."
                    className="w-full p-2 text-xs border border-emerald-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                  >
                    Submit Student Rating
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Discussion & Response Log */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                Discussion & Response Notes
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                {complaint.updates?.length || 0} messages
              </span>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {(complaint.updates || []).length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No comments yet. Post an inquiry or technician update below.
                </div>
              ) : (
                complaint.updates.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-slate-900 font-bold">{item.sender}</strong>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-100 text-brand-800 font-semibold">
                          {item.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Post response form */}
            <form onSubmit={handleSendResponse} className="pt-2 border-t border-slate-100 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder={`Post an update as ${currentUser.name}...`}
                  className="w-full pl-3 pr-10 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newResponse.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Admin Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Assign Ticket to Campus Department
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Department:
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name} (Lead: {d.lead})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assignment Note / Dispatch Instructions:
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g., Immediate technician needed on 2nd floor before evening classes..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignDept}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update Ticket Lifecycle Status
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Status:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Transition Explanation (Added to Audit Trail):
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g., Parts procured from central depot. Maintenance team dispatched."
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedStatus)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
              >
                Apply Status Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
