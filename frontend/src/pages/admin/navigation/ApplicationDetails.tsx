import { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface ApplicationBase {
    application_id: number;
    user_id: number;
    program_type: string;
    status: string;
    rejection_reason: string | null;
    applied_at: string | null;
    approval_date: string | null;
    updated_at: string | null;
    email: string | null;
    phone: string | null;
    beneficiary_id: number | null;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    birth_date: string | null;
    gender: string | null;
    contact_number: string | null;
    address: string | null;
}

interface ApplicationDetailsResponse {
    application: ApplicationBase;
    details: Record<string, Record<string, unknown> | null>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatLabel = (key: string) => {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "string") {
        const parsedDate = new Date(value);
        const looksLikeDate = /^\d{4}-\d{2}-\d{2}/.test(value) || value.includes("T");
        if (looksLikeDate && !Number.isNaN(parsedDate.getTime())) {
            return parsedDate.toLocaleString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: value.includes("T") ? "2-digit" : undefined,
                minute: value.includes("T") ? "2-digit" : undefined,
            });
        }
    }

    return String(value);
};

const renderObjectSection = (title: string, data: Record<string, unknown> | null) => {
    if (!data) {
        return null;
    }

    const entries = Object.entries(data).filter(([, value]) => value !== null && value !== undefined && value !== "");
    if (entries.length === 0) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-5 md:grid-cols-2">
                {entries.map(([key, value]) => (
                    <div key={key}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {formatLabel(key)}
                        </p>
                        <p className="mt-1 text-sm text-gray-900 break-words">{formatValue(value)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

function ApplicationDetails() {
    const navigate = useNavigate();
    const { applicationId } = useParams();
    const [details, setDetails] = useState<ApplicationDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            if (!applicationId) {
                setError("Application ID is missing.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get<ApplicationDetailsResponse>(
                    `${API_BASE_URL}/api/beneficiaries/${applicationId}/details`
                );
                setDetails(response.data);
            } catch (err: any) {
                console.error("Error fetching application details:", err);
                setError(err?.response?.data?.message || "Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [applicationId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
                    <p className="text-sm text-gray-500">Complete data submitted during the beneficiary application process</p>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16 shadow-sm">
                    <Loader className="animate-spin text-blue-600" size={28} />
                </div>
            )}

            {error && !loading && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && details && (
                <>
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-white px-6 py-5 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Application ID</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">#{details.application.application_id}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Applicant</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {[details.application.first_name, details.application.middle_name, details.application.last_name]
                                        .filter(Boolean)
                                        .join(" ") || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Program</p>
                                <p className="mt-1 text-sm font-medium uppercase text-gray-900">{details.application.program_type || "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">{details.application.status || "-"}</p>
                            </div>
                        </div>
                    </div>

                    {renderObjectSection("Application Information", details.application as unknown as Record<string, unknown>)}
                    {renderObjectSection("TUPAD Form Data", details.details.tupad)}
                    {renderObjectSection("SPES Form Data", details.details.spes)}
                    {renderObjectSection("DILP Form Data", details.details.dilp)}
                    {renderObjectSection("GIP Form Data", details.details.gip)}
                    {renderObjectSection("Jobseeker Form Data", details.details.jobseeker)}
                </>
            )}
        </div>
    );
}

export default ApplicationDetails;