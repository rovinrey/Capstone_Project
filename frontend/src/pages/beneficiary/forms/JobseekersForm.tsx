import  { useState } from "react";
import { Briefcase, MapPin, Star, GraduationCap, Send } from "lucide-react";

function JobSeekerForm() {
  const [formData, setFormData] = useState({
    // Basic Profiling
    fullName: "",
    age: "",
    gender: "",
    barangay: "",
    contactNumber: "",
    // Employment Status
    status: "Unemployed", // or Underemployed/Displaced Worker
    // Skills Profiling (Objective 1)
    technicalSkills: [] as string[],
    yearsOfExperience: "",
    preferredIndustry: "",
    // Training Needs
    urgentTraining: ""
  });

  const commonSkills = [
    "Construction/Masonry", "Electrical/Wiring", "Welding (NCII)",
    "Housekeeping", "Culinary/Cooking", "Driving (Professional)",
    "Customer Service", "Virtual Assistant", "Bookkeeping"
  ];

  const handleSkillClick = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.includes(skill)
        ? prev.technicalSkills.filter(s => s !== skill)
        : [...prev.technicalSkills, skill]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white">
        <h2 className="text-3xl font-extrabold flex items-center gap-3">
          <Briefcase size={32} /> Job Seeker Profile
        </h2>
        <p className="mt-2 text-emerald-50">Provide your details to match with available employment and training programs.</p>
      </div>

      <form className="p-8 space-y-8">
        {/* Section 1: Personal Details */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold text-lg">
            <MapPin size={20} /> <h4>1. Personal Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Last Name, First Name, M.I." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Barangay</label>
              <select className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Select Barangay</option>
                <option>San Jose</option>
                <option>Poblacion</option>
                <option>Concepcion</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Skills & Work Profiling (Objective: Profiling) */}
        <section className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold text-lg">
            <Star size={20} /> <h4>2. Skills & Vocational Profile</h4>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-3">Select your Technical Skills (You can select multiple)</label>
          <div className="flex flex-wrap gap-2 mb-6">
            {commonSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillClick(skill)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.technicalSkills.includes(skill)
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
                  }`}
              >
                {skill}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Years of Experience</label>
              <input type="number" className="p-3 border border-gray-200 rounded-xl" placeholder="e.g. 2" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Preferred Work Type</label>
              <select className="p-3 border border-gray-200 rounded-xl">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Project-based</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: Training Needs (Objective: Training needs development) */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold text-lg">
            <GraduationCap size={20} /> <h4>3. Training Needs</h4>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">What specific training or certification do you need to get hired?</label>
            <textarea
              className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24"
              placeholder="e.g. I need TESDA NCII certification for Plumbing to qualify for local jobs."
            ></textarea>
          </div>
        </section>

        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
        >
          <Send size={20} /> Submit Profile
        </button>
      </form>
    </div>
  );
};
export default JobSeekerForm;