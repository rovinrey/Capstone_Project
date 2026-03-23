import React from 'react';
import { CheckCircle2, Clock3, FileText, XCircle } from 'lucide-react';
import type { ApplicationSubmission } from '../api/applicationStatus.api';

interface ApplicationStatusPanelProps {
  summary: Record<string, string | null>;
  submissions: ApplicationSubmission[];
}

const PROGRAM_ORDER = ['TUPAD', 'SPES', 'DILP', 'GIP', 'Jobseeker'];

const getStatusStyles = (status: string | null) => {
  if (status === 'Approved') {
    return {
      badge: 'bg-emerald-100 text-emerald-700',
      icon: <CheckCircle2 className="h-4 w-4" />,
      ring: 'ring-emerald-200'
    };
  }

  if (status === 'Rejected') {
    return {
      badge: 'bg-rose-100 text-rose-700',
      icon: <XCircle className="h-4 w-4" />,
      ring: 'ring-rose-200'
    };
  }

  if (status === 'Pending') {
    return {
      badge: 'bg-amber-100 text-amber-700',
      icon: <Clock3 className="h-4 w-4" />,
      ring: 'ring-amber-200'
    };
  }

  return {
    badge: 'bg-slate-100 text-slate-700',
    icon: <FileText className="h-4 w-4" />,
    ring: 'ring-slate-200'
  };
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const ApplicationStatusPanel: React.FC<ApplicationStatusPanelProps> = ({ summary, submissions }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl p-4 sm:p-6 bg-[linear-gradient(135deg,#eff6ff,#f8fafc)] border border-blue-100">
        <h2 className="text-xl font-black text-slate-900">Your Application Status</h2>
        <p className="text-slate-600 text-sm mt-1">Track every submitted form in one place.</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PROGRAM_ORDER.map((program) => {
            const status = summary?.[program] || null;
            const style = getStatusStyles(status);

            return (
              <article
                key={program}
                className={`rounded-xl border border-white/70 bg-white p-3 shadow-sm ring-1 ${style.ring}`}
              >
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{program}</p>
                <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style.badge}`}>
                  {style.icon}
                  {status || 'Not Submitted'}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h3 className="text-lg font-bold text-slate-900">Submission Timeline</h3>

        {submissions.length === 0 ? (
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
            No submitted forms yet. Start a new application to see updates here.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {submissions.slice(0, 8).map((item) => {
              const style = getStatusStyles(item.status);
              return (
                <article
                  key={item.application_id}
                  className="rounded-xl border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.program_type} Application</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted on {formatDate(item.applied_at)}
                    </p>
                    {item.status === 'Rejected' && item.rejection_reason && (
                      <p className="text-xs text-rose-700 mt-2">Reason: {item.rejection_reason}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${style.badge}`}>
                    {style.icon}
                    {item.status}
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationStatusPanel;
