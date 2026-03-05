import { useState } from "react";
import { Briefcase, MapPin, Star, GraduationCap, Send } from "lucide-react";

function JobSeekerForm() {
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    age: "",
    gender: "",
    civilStatus: "",
    birthdate: "",
    barangay: "",
    city: "",
    province: "",
    contactNumber: "",
    email: "",

    // Employment Info
    status: "Unemployed",
    preferredWorkType: "Full-time",
    preferredIndustry: "",
    yearsOfExperience: "",

    // Skills
    technicalSkills: [] as string[],

    // Training
    urgentTraining: "",
    certifications: "",

    // Additional
    availability: "",
    expectedSalary: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonSkills = [
    "Construction/Masonry", "Electrical/Wiring", "Welding (NCII)",
    "Housekeeping", "Culinary/Cooking", "Driving (Professional)",
    "Customer Service", "Virtual Assistant", "Bookkeeping"
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillClick = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.includes(skill)
        ? prev.technicalSkills.filter(s => s !== skill)
        : [...prev.technicalSkills, skill]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.fullName.trim()) throw new Error("Full name is required");
      if (!formData.contactNumber.trim()) throw new Error("Contact number is required");

      console.log("Submitted Job Seeker Data:", formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white border-t-8 border-green-600 shadow-xl rounded-lg p-8 space-y-8">

        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Briefcase size={28} /> Job Seeker Profile
          </h2>
          <p className="text-green-700 font-medium italic">
            Employment & Training Profiling System
          </p>
        </div>

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✓ Profile submitted successfully!
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ✗ {error}
          </div>
        )}

        {/* Personal Information */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-green-700 font-bold text-lg">
            <MapPin size={20} /> Personal Information
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className={inputStyle}/>
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className={inputStyle}/>
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <input name="civilStatus" placeholder="Civil Status" value={formData.civilStatus} onChange={handleChange} className={inputStyle}/>
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className={inputStyle}/>
            <input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className={inputStyle}/>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <input name="barangay" placeholder="Barangay" value={formData.barangay} onChange={handleChange} className={inputStyle}/>
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inputStyle}/>
            <input name="province" placeholder="Province" value={formData.province} onChange={handleChange} className={inputStyle}/>
          </div>

          <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={`${inputStyle} mt-6`}/>
        </section>

        {/* Skills Section */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-4 text-green-700 font-bold text-lg">
            <Star size={20} /> Skills & Experience
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {commonSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillClick(skill)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.technicalSkills.includes(skill)
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-300 text-gray-600"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input type="number" name="yearsOfExperience" placeholder="Years of Experience" value={formData.yearsOfExperience} onChange={handleChange} className={inputStyle}/>
            <select name="preferredWorkType" value={formData.preferredWorkType} onChange={handleChange} className={inputStyle}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Project-based</option>
            </select>
          </div>
        </section>

        {/* Training Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-green-700 font-bold text-lg">
            <GraduationCap size={20} /> Training Needs
          </div>

          <textarea name="urgentTraining" placeholder="What training or certification do you need?" value={formData.urgentTraining} onChange={handleChange} className={inputStyle}/>
          <textarea name="certifications" placeholder="Existing Certifications (if any)" value={formData.certifications} onChange={handleChange} className={`${inputStyle} mt-6`}/>
        </section>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-black py-4 rounded-lg uppercase shadow-lg flex items-center justify-center gap-2"
        >
          <Send size={18} />
          {loading ? "Submitting..." : "Submit Job Profile"}
        </button>

      </div>
    </div>
  );
}

export default JobSeekerForm;