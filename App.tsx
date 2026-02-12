
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  Heart, 
  BrainCircuit,
  Plus,
  Trash2,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  X,
  ExternalLink,
  MapPin,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { AppState, Achievement, Experience, AcademicRecord } from './types';
import { getPersonalFeedback } from './services/geminiService';

const initialData: AppState = {
  profile: {
    name: "Ahmad Rizky",
    major: "Teknik Informatika",
    university: "Universitas Indonesia",
    bio: "Mahasiswa tingkat akhir yang antusias dengan pengembangan web dan AI. Memiliki minat besar dalam membangun solusi yang berdampak sosial.",
    email: "rizky@student.ui.ac.id",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  achievements: [
    { 
      id: '1', 
      title: 'Juara 1 Hackathon Nasional', 
      issuer: 'Kementerian Komunikasi dan Informatika',
      year: 'Okt 2023', 
      description: 'Membangun solusi smart city berbasis IoT untuk manajemen limbah perkotaan.', 
      category: 'National',
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&h=400&fit=crop'
    },
    { 
      id: '2', 
      title: 'Google Developer Student Clubs Lead', 
      issuer: 'Google Developers',
      year: 'Agu 2022', 
      description: 'Terpilih menjadi pemimpin komunitas developer di kampus.', 
      category: 'International',
      certificateUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop'
    }
  ],
  experiences: [
    { 
      id: '1', 
      role: 'Frontend Developer Intern', 
      organization: 'TechCorp Indonesia', 
      location: 'Jakarta, Indonesia',
      period: 'Jul 2023 - Sep 2023', 
      type: 'Work',
      description: 'Mengembangkan dashboard internal menggunakan React dan Tailwind CSS.'
    },
    { 
      id: '2', 
      role: 'Kepala Departemen IT', 
      organization: 'BEM Fakultas Ilmu Komputer', 
      location: 'Depok, Jawa Barat',
      period: 'Jan 2022 - Des 2022', 
      type: 'Organization',
      description: 'Mengelola infrastruktur digital fakultas dan memimpin tim beranggotakan 15 orang.'
    }
  ],
  academics: [
    { semester: 'Sem 1', gpa: 3.8 },
    { semester: 'Sem 2', gpa: 3.75 },
    { semester: 'Sem 3', gpa: 3.9 },
    { semester: 'Sem 4', gpa: 3.85 },
    { semester: 'Sem 5', gpa: 4.0 },
    { semester: 'Sem 6', gpa: 3.95 }
  ],
  hobbies: [
    { id: '1', name: 'Fotografi', icon: '📷' },
    { id: '2', name: 'Open Source', icon: '💻' },
    { id: '3', name: 'Public Speaking', icon: '🎤' }
  ]
};

export default function App() {
  const [data, setData] = useState<AppState>(initialData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiFeedback, setAiFeedback] = useState<{ feedback: string[], motivation: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Achievement Form State
  const [newAch, setNewAch] = useState({
    title: '', issuer: '', year: '', description: '', category: 'Campus' as any
  });

  useEffect(() => {
    const saved = localStorage.getItem('selftrack_data_v2');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('selftrack_data_v2', JSON.stringify(data));
  }, [data]);

  const handleAiFeedback = async () => {
    setLoadingAi(true);
    const feedback = await getPersonalFeedback(data);
    setAiFeedback(feedback);
    setLoadingAi(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAchievement = () => {
    if (!newAch.title || !newAch.issuer) return;
    const achievement: Achievement = {
      ...newAch,
      id: Date.now().toString(),
      certificateUrl: previewImage || undefined
    };
    setData(prev => ({ ...prev, achievements: [achievement, ...prev.achievements] }));
    setIsModalOpen(false);
    setNewAch({ title: '', issuer: '', year: '', description: '', category: 'Campus' });
    setPreviewImage(null);
  };

  const currentGpa = data.academics[data.academics.length - 1]?.gpa || 0;
  const avgGpa = (data.academics.reduce((acc, curr) => acc + curr.gpa, 0) / data.academics.length).toFixed(2);

  return (
    <div className="flex min-h-screen bg-[#f3f2ef]">
      {/* Sidebar - Desktop */}
      <aside className="w-[280px] hidden lg:flex flex-col fixed h-full z-20 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-[#0a66c2] p-1.5 rounded text-white">
            <BrainCircuit size={22} />
          </div>
          <h1 className="text-xl font-bold text-[#0a66c2]">SelfTrack</h1>
        </div>

        <nav className="p-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Beranda" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<User size={20} />} label="Profil Profesional" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SidebarItem icon={<GraduationCap size={20} />} label="Akademik" active={activeTab === 'academic'} onClick={() => setActiveTab('academic')} />
          <SidebarItem icon={<Trophy size={20} />} label="Prestasi & Penghargaan" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
          <SidebarItem icon={<Briefcase size={20} />} label="Pengalaman" active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} />
          <SidebarItem icon={<Heart size={20} />} label="Minat & Hobi" active={activeTab === 'hobbies'} onClick={() => setActiveTab('hobbies')} />
        </nav>

        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="bg-[#0a66c2] p-4 rounded-lg text-white">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
              <BrainCircuit size={16} /> Mentor AI
            </h4>
            <p className="text-xs opacity-90 mb-3">Dapatkan analisa portofolio instan untuk persiapan karier.</p>
            <button 
              onClick={handleAiFeedback}
              disabled={loadingAi}
              className="w-full bg-white text-[#0a66c2] py-1.5 rounded font-bold text-xs hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              {loadingAi ? 'Menganalisa...' : 'Analisa Profil'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Top Banner / Hero Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
             <div className="h-32 bg-[#0a66c2] relative">
               <div className="absolute -bottom-16 left-8">
                 <img 
                   src={data.profile.avatar} 
                   className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                   alt="Avatar"
                 />
               </div>
             </div>
             <div className="pt-20 pb-6 px-8">
                <div className="flex justify-between items-start">
                   <div>
                     <h2 className="text-2xl font-bold text-gray-900">{data.profile.name}</h2>
                     <p className="text-gray-600 text-lg leading-tight mt-1">{data.profile.major} at {data.profile.university}</p>
                     <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                       <MapPin size={14} /> Jakarta Metropolitan Area • <span className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">500+ koneksi</span>
                     </p>
                   </div>
                   <div className="hidden md:flex flex-col items-end text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <img src="https://ui.ac.id/wp-content/uploads/logo-ui.png" className="w-8 h-8 object-contain" alt="UI" />
                        <span>{data.profile.university}</span>
                      </div>
                   </div>
                </div>
                <div className="mt-4 flex gap-2">
                   <button onClick={() => setActiveTab('profile')} className="bg-[#0a66c2] text-white px-4 py-1.5 rounded-full font-bold text-sm hover:bg-[#004182]">Edit Profil</button>
                   <button onClick={handleAiFeedback} className="border border-[#0a66c2] text-[#0a66c2] px-4 py-1.5 rounded-full font-bold text-sm hover:bg-[#ebf4ff]">Tanya AI Mentor</button>
                </div>
             </div>
          </div>

          {/* AI Feedback Section - If available */}
          {aiFeedback && (
            <div className="bg-[#ebf4ff] border border-[#dce6f1] p-5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 text-[#0a66c2] font-bold mb-3">
                <BrainCircuit size={20} />
                <h3>Rekomendasi Strategis AI</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiFeedback.feedback.map((f, i) => (
                  <div key={i} className="bg-white/60 p-3 rounded-lg text-sm text-gray-700 border border-white/50">
                    <span className="font-bold text-[#0a66c2]">#{i+1}</span> {f}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm italic text-gray-600">"{aiFeedback.motivation}"</p>
            </div>
          )}

          {/* Dynamic Sections */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" /> Analisa Akademik
                  </h3>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.academics}>
                        <defs>
                          <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0a66c2" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#0a66c2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} />
                        <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="gpa" stroke="#0a66c2" strokeWidth={2} fill="url(#colorGpa)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-between text-sm border-t pt-4">
                    <div>
                      <p className="text-gray-400">IPK Saat Ini</p>
                      <p className="text-2xl font-bold text-[#0a66c2]">{currentGpa}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Target Kelulusan</p>
                      <p className="text-2xl font-bold text-gray-800">Cum Laude</p>
                    </div>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Statistik Profil</h3>
                  <div className="space-y-4">
                    <StatItem label="Kunjungan Profil" value="124" trend="+12%" />
                    <StatItem label="Prestasi Tercatat" value={data.achievements.length.toString()} />
                    <StatItem label="Pengalaman Organisasi" value={data.experiences.filter(e => e.type === 'Organization').length.toString()} />
                    <StatItem label="Pengalaman Kerja" value={data.experiences.filter(e => e.type === 'Work').length.toString()} />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Prestasi & Penghargaan</h3>
                    <p className="text-sm text-gray-500">Bukti keunggulan dan kompetensi profesional Anda.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 text-[#0a66c2] hover:bg-[#ebf4ff] px-3 py-1 rounded-full font-bold transition-colors"
                  >
                    <Plus size={20} /> Tambah Prestasi
                  </button>
               </div>
               <div className="divide-y divide-gray-100">
                 {data.achievements.length === 0 && (
                   <div className="p-12 text-center text-gray-400">Belum ada prestasi. Klik tombol tambah untuk memulai.</div>
                 )}
                 {data.achievements.map(ach => (
                   <div key={ach.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <div>
                              <h4 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#0a66c2] transition-colors">{ach.title}</h4>
                              <p className="text-gray-700 font-medium mt-0.5">{ach.issuer}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> {ach.year}</span>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-semibold uppercase">{ach.category}</span>
                              </div>
                           </div>
                           <button 
                            onClick={() => setData(prev => ({...prev, achievements: prev.achievements.filter(a => a.id !== ach.id)}))}
                            className="text-gray-300 hover:text-red-500 p-1"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                        <p className="text-gray-600 text-sm mt-3 leading-relaxed">{ach.description}</p>
                        {ach.certificateUrl && (
                           <div className="mt-4 flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg group/cert hover:border-[#0a66c2] cursor-pointer transition-colors max-w-sm">
                              <img src={ach.certificateUrl} className="w-16 h-12 object-cover rounded shadow-sm" alt="Cert" />
                              <div className="flex-1 overflow-hidden">
                                 <p className="text-xs font-bold text-gray-700 truncate">Sertifikat_{ach.title.replace(/\s+/g, '_')}.pdf</p>
                                 <p className="text-[10px] text-gray-400">Klik untuk melihat file</p>
                              </div>
                              <ExternalLink size={14} className="text-gray-400 group-hover/cert:text-[#0a66c2]" />
                           </div>
                        )}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                 <h3 className="text-xl font-bold text-gray-900">Pengalaman</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {data.experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-6 flex gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="w-12 h-12 flex-shrink-0">
                       <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-gray-200">
                          <Briefcase size={24} />
                       </div>
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-lg text-gray-900 leading-tight">{exp.role}</h4>
                       <p className="text-gray-800 font-medium">{exp.organization}</p>
                       <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          {exp.period} • <MapPin size={12} /> {exp.location}
                       </p>
                       {exp.description && (
                         <div className="mt-3 text-sm text-gray-600 leading-relaxed list-disc list-inside">
                            {exp.description}
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
               <h3 className="text-xl font-bold mb-6">Informasi Personal</h3>
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nama Lengkap" value={data.profile.name} onChange={(v) => setData(p => ({...p, profile: {...p.profile, name: v}}))} />
                    <InputField label="Email Student" value={data.profile.email} onChange={(v) => setData(p => ({...p, profile: {...p.profile, email: v}}))} />
                    <InputField label="Program Studi" value={data.profile.major} onChange={(v) => setData(p => ({...p, profile: {...p.profile, major: v}}))} />
                    <InputField label="Universitas" value={data.profile.university} onChange={(v) => setData(p => ({...p, profile: {...p.profile, university: v}}))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tentang Saya</label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] text-sm min-h-[120px]"
                      value={data.profile.bio}
                      onChange={(e) => setData(p => ({...p, profile: {...p.profile, bio: e.target.value}}))}
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button className="bg-[#0a66c2] text-white px-6 py-2 rounded-full font-bold hover:bg-[#004182]">Simpan Perubahan</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'academic' && (
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="text-xl font-bold">Riwayat Akademik</h3>
                   <button 
                    onClick={() => {
                      const val = prompt("Masukkan IPK (e.g. 3.9)");
                      if (val && !isNaN(parseFloat(val))) {
                         setData(p => ({
                           ...p, 
                           academics: [...p.academics, { semester: `Sem ${p.academics.length+1}`, gpa: parseFloat(val) }]
                         }));
                      }
                    }}
                    className="text-[#0a66c2] font-bold text-sm hover:underline"
                   >
                     + Tambah Semester
                   </button>
                </div>
                <div className="p-6">
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {data.academics.map((rec, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                           <p className="text-xs text-gray-500 uppercase font-bold">{rec.semester}</p>
                           <p className="text-2xl font-black text-[#0a66c2] mt-1">{rec.gpa.toFixed(2)}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'hobbies' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
               <h3 className="text-xl font-bold mb-6">Minat & Hobi</h3>
               <div className="flex flex-wrap gap-4">
                  {data.hobbies.map(h => (
                    <div key={h.id} className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#0a66c2] transition-colors group cursor-pointer">
                      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{h.icon}</span>
                      <div>
                        <p className="font-bold text-gray-800">{h.name}</p>
                        <p className="text-xs text-gray-400">Kategori Aktif</p>
                      </div>
                    </div>
                  ))}
                  <button className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl px-6 py-4 text-gray-400 hover:text-[#0a66c2] hover:border-[#0a66c2] transition-all">
                    <Plus size={24} />
                  </button>
               </div>
            </div>
          )}

        </div>
      </main>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
        <MobileNavItem icon={<LayoutDashboard size={20} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <MobileNavItem icon={<User size={20} />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        <MobileNavItem icon={<Trophy size={20} />} active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
        <MobileNavItem icon={<Briefcase size={20} />} active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} />
      </div>

      {/* Add Achievement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-lg font-bold">Tambah Prestasi Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Penghargaan</label>
                    <input 
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#0a66c2] transition-colors"
                      placeholder="e.g. Juara 1 UI/UX Design Competition"
                      value={newAch.title}
                      onChange={e => setNewAch(p => ({...p, title: e.target.value}))}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lembaga Penerbit</label>
                    <input 
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#0a66c2] transition-colors"
                      placeholder="e.g. Universitas Gadjah Mada"
                      value={newAch.issuer}
                      onChange={e => setNewAch(p => ({...p, issuer: e.target.value}))}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Terbit</label>
                      <input 
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#0a66c2] transition-colors"
                        placeholder="e.g. Nov 2023"
                        value={newAch.year}
                        onChange={e => setNewAch(p => ({...p, year: e.target.value}))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tingkatan</label>
                      <select 
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#0a66c2]"
                        value={newAch.category}
                        onChange={e => setNewAch(p => ({...p, category: e.target.value as any}))}
                      >
                        <option value="Campus">Kampus</option>
                        <option value="National">Nasional</option>
                        <option value="International">Internasional</option>
                      </select>
                    </div>
                 </div>
                 
                 {/* Proof Image Upload */}
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Unggah Sertifikat / Foto Bukti</label>
                    <div className="relative group">
                       <input 
                         type="file" 
                         accept="image/*" 
                         onChange={handleImageUpload}
                         className="hidden" 
                         id="cert-upload"
                       />
                       <label 
                         htmlFor="cert-upload" 
                         className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                            previewImage ? 'border-[#0a66c2] bg-blue-50' : 'border-gray-200 hover:border-[#0a66c2] hover:bg-gray-50'
                         }`}
                       >
                         {previewImage ? (
                           <div className="relative w-full h-full p-2">
                             <img src={previewImage} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold rounded-lg transition-opacity">
                               Ganti Foto
                             </div>
                           </div>
                         ) : (
                           <>
                             <ImageIcon size={32} className="text-gray-300 mb-2" />
                             <span className="text-xs font-semibold text-gray-500">Klik untuk unggah (PNG, JPG)</span>
                           </>
                         )}
                       </label>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button 
                      onClick={addAchievement}
                      className="flex-1 bg-[#0a66c2] text-white py-2 rounded-full font-bold hover:bg-[#004182] transition-colors"
                    >
                      Simpan Prestasi
                    </button>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 border border-gray-300 rounded-full font-bold hover:bg-gray-50"
                    >
                      Batal
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-all ${
        active 
          ? 'bg-gray-100 text-[#0a66c2] font-bold border-l-4 border-[#0a66c2]' 
          : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      <div className={active ? 'text-[#0a66c2]' : 'text-gray-400'}>{icon}</div>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <input 
        type="text"
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function StatItem({ label, value, trend }: { label: string, value: string, trend?: string }) {
  return (
    <div className="flex justify-between items-center group cursor-pointer p-2 -m-2 rounded hover:bg-gray-50">
       <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">{label}</span>
       <div className="flex items-center gap-2">
          {trend && <span className="text-xs text-emerald-600 font-bold">{trend}</span>}
          <span className="text-sm font-bold text-[#0a66c2]">{value}</span>
       </div>
    </div>
  );
}

function MobileNavItem({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${
        active ? 'text-[#0a66c2]' : 'text-gray-400'
      }`}
    >
      {icon}
      {active && <div className="h-1.5 w-1.5 bg-[#0a66c2] rounded-full mx-auto mt-1" />}
    </button>
  );
}
