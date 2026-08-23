'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const initialData = {
  full_name: '',
  phone: '',
  whatsapp: '',
  email: '',
  country: '',
  city: '',
  birth_date: '',
  gender: 'male',
  education_level: '',
  specialization: '',
  university: '',
  teaching_experience_years: '',
  previous_teaching_places: '',
  quran_memorization_level: '',
  ijazah: 'no',
  ijazah_details: '',
  recitation_style: '',
  teaching_age_groups: '',
  teaching_method: '',
  handling_difficult_student: '',
  availability_days: '',
  availability_hours: '',
  timezone: '',
  devices_available: '',
  internet_quality: '',
  notes: '',
};

export default function TeacherRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [photoFile, setPhotoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 8;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const uploadFile = async (file, folder) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('teacher-files')
      .upload(fileName, file);
    if (uploadError) {
      throw uploadError;
    }
    return fileName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const photoPath = await uploadFile(photoFile, 'photos');
      const audioPath = await uploadFile(audioFile, 'audio');
      const videoPath = await uploadFile(videoFile, 'videos');

      const { error: insertError } = await supabase.from('applicants').insert([
        {
          ...formData,
          photo_path: photoPath,
          audio_path: audioPath,
          video_path: videoPath,
          status: 'pending',
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إرسال البيانات، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <h2 style={styles.successTitle}>تم إرسال طلبك بنجاح ✅</h2>
          <p style={styles.successText}>
            شكرًا لتقديمك للانضمام إلى أكاديمية أبرار القرآن. سيتم مراجعة طلبك والتواصل معك قريبًا.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>تسجيل معلم - أكاديمية أبرار القرآن</h1>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(step / totalSteps) * 100}%`,
            }}
          />
        </div>
        <p style={styles.stepIndicator}>
          الخطوة {step} من {totalSteps}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {step === 1 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>البيانات الشخصية</h3>
            <input style={styles.input} name="full_name" placeholder="الاسم الكامل" value={formData.full_name} onChange={handleChange} required />
            <input style={styles.input} name="phone" placeholder="رقم الهاتف" value={formData.phone} onChange={handleChange} required />
            <input style={styles.input} name="whatsapp" placeholder="رقم الواتساب" value={formData.whatsapp} onChange={handleChange} />
            <input style={styles.input} name="email" type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} required />
            <input style={styles.input} name="country" placeholder="الدولة" value={formData.country} onChange={handleChange} required />
            <input style={styles.input} name="city" placeholder="المدينة" value={formData.city} onChange={handleChange} />
            <input style={styles.input} name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
            <select style={styles.input} name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>المؤهلات</h3>
            <input style={styles.input} name="education_level" placeholder="المؤهل الدراسي" value={formData.education_level} onChange={handleChange} />
            <input style={styles.input} name="specialization" placeholder="التخصص" value={formData.specialization} onChange={handleChange} />
            <input style={styles.input} name="university" placeholder="الجامعة" value={formData.university} onChange={handleChange} />
            <input style={styles.input} name="teaching_experience_years" placeholder="سنوات الخبرة في التدريس" value={formData.teaching_experience_years} onChange={handleChange} />
            <textarea style={styles.textarea} name="previous_teaching_places" placeholder="أماكن تدريس سابقة" value={formData.previous_teaching_places} onChange={handleChange} />
          </div>
        )}

        {step === 3 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>البيانات القرآنية</h3>
            <input style={styles.input} name="quran_memorization_level" placeholder="مستوى الحفظ" value={formData.quran_memorization_level} onChange={handleChange} />
            <select style={styles.input} name="ijazah" value={formData.ijazah} onChange={handleChange}>
              <option value="no">بدون إجازة</option>
              <option value="yes">لديه إجازة</option>
            </select>
            <textarea style={styles.textarea} name="ijazah_details" placeholder="تفاصيل الإجازة (السند)" value={formData.ijazah_details} onChange={handleChange} />
            <input style={styles.input} name="recitation_style" placeholder="رواية القراءة" value={formData.recitation_style} onChange={handleChange} />
          </div>
        )}

        {step === 4 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>أسئلة تربوية</h3>
            <input style={styles.input} name="teaching_age_groups" placeholder="الفئات العمرية التي يفضل تدريسها" value={formData.teaching_age_groups} onChange={handleChange} />
            <textarea style={styles.textarea} name="teaching_method" placeholder="طريقته في التدريس" value={formData.teaching_method} onChange={handleChange} />
            <textarea style={styles.textarea} name="handling_difficult_student" placeholder="كيف يتعامل مع الطالب الصعب؟" value={formData.handling_difficult_student} onChange={handleChange} />
          </div>
        )}

        {step === 5 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>التفرغ</h3>
            <input style={styles.input} name="availability_days" placeholder="الأيام المتاحة" value={formData.availability_days} onChange={handleChange} />
            <input style={styles.input} name="availability_hours" placeholder="الساعات المتاحة" value={formData.availability_hours} onChange={handleChange} />
            <input style={styles.input} name="timezone" placeholder="المنطقة الزمنية" value={formData.timezone} onChange={handleChange} />
            <input style={styles.input} name="devices_available" placeholder="الأجهزة المتاحة" value={formData.devices_available} onChange={handleChange} />
            <input style={styles.input} name="internet_quality" placeholder="جودة الإنترنت" value={formData.internet_quality} onChange={handleChange} />
          </div>
        )}

        {step === 6 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>تسجيل صوتي</h3>
            <p style={styles.hint}>ارفع تسجيل صوتي لتلاوة قصيرة</p>
            <input style={styles.input} type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
          </div>
        )}

        {step === 7 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>فيديو تعريفي</h3>
            <p style={styles.hint}>ارفع صورة شخصية وفيديو تعريفي قصير</p>
            <input style={styles.input} type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
            <input style={styles.input} type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
            <textarea style={styles.textarea} name="notes" placeholder="ملاحظات إضافية" value={formData.notes} onChange={handleChange} />
          </div>
        )}

        {step === 8 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>مراجعة وإرسال</h3>
            <p style={styles.hint}>تأكد من صحة بياناتك قبل الإرسال</p>
            <p style={styles.reviewText}>الاسم: {formData.full_name}</p>
            <p style={styles.reviewText}>الهاتف: {formData.phone}</p>
            <p style={styles.reviewText}>البريد: {formData.email}</p>
            {error && <p style={styles.errorText}>{error}</p>}
          </div>
        )}

        <div style={styles.navButtons}>
          {step > 1 && (
            <button type="button" onClick={prevStep} style={styles.secondaryButton}>
              السابق
            </button>
          )}
          {step < totalSteps && (
            <button type="button" onClick={nextStep} style={styles.primaryButton}>
              التالي
            </button>
          )}
          {step === totalSteps && (
            <button type="submit" disabled={submitting} style={styles.primaryButton}>
              {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f1f17', padding: '20px', direction: 'rtl', fontFamily: 'Tahoma, Arial, sans-serif' },
  header: { maxWidth: '600px', margin: '0 auto 20px' },
  title: { color: '#d4af37', fontSize: '22px', textAlign: 'center', marginBottom: '15px' },
  progressBar: { backgroundColor: '#1a3a2a', height: '8px', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { backgroundColor: '#2f7a4f', height: '100%', transition: 'width 0.3s' },
  stepIndicator: { color: '#a0c4b0', textAlign: 'center', marginTop: '8px', fontSize: '14px' },
  form: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#16281e', borderRadius: '12px', padding: '20px' },
  stepBox: { display: 'flex', flexDirection: 'column', gap: '12px' },
  stepTitle: { color: '#d4af37', fontSize: '18px', marginBottom: '8px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #2f4a3a', backgroundColor: '#0f1f17', color: '#fff', fontSize: '15px' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #2f4a3a', backgroundColor: '#0f1f17', color: '#fff', fontSize: '15px', minHeight: '80px' },
  hint: { color: '#a0c4b0', fontSize: '14px' },
  reviewText: { color: '#fff', fontSize: '15px' },
  errorText: { color: '#ff6b6b', fontSize: '14px' },
  navButtons: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' },
  primaryButton: { backgroundColor: '#2f7a4f', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', flex: 1 },
  secondaryButton: { backgroundColor: 'transparent', color: '#a0c4b0', border: '1px solid #2f4a3a', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', flex: 1 },
  successBox: { maxWidth: '500px', margin: '100px auto', textAlign: 'center', backgroundColor: '#16281e', padding: '40px', borderRadius: '12px' },
  successTitle: { color: '#2f7a4f', fontSize: '22px', marginBottom: '10px' },
  successText: { color: '#a0c4b0', fontSize: '15px' },
};
