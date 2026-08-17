import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLiff } from "@/contexts/LiffContext";
import Swal from 'sweetalert2';
import { mentalAssessment, assessmentResult } from '@/app/campaign/mentalAssessment/mentalAssessment';

interface AssessmentScores {
    depress: number;
    anxiety: number;
    stress: number;
    created_at?: string;
}

export default function MentalAssessment() {
    const { profile } = useLiff();
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assessmentScores, setAssessmentScores] = useState<AssessmentScores | null>(null);

    useEffect(() => {
        const fetchAssessment = async () => {
            if (!profile?.userId) return;
            setLoading(true);
            try {
                const res = await axios.get(`/api/campaign/mental?user_id=${profile.userId}`);
                if (res.data && res.data.length > 0) {
                    const latest = res.data[0];
                    setAssessmentScores({
                        depress: latest.depress || 0,
                        anxiety: latest.anxiety || 0,
                        stress: latest.stress || 0,
                        created_at: latest.created_at,
                    });
                    setSubmitted(true);
                }
            } catch (error) {
                console.error("Error fetching mental health assessment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessment();
    }, [profile?.userId]);

    const handleAnswerChange = (questionId: number, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async () => {
        if (!profile?.userId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User profile not found. Please try again.',
            });
            return;
        }

        // Check if all questions are answered
        if (Object.keys(answers).length < mentalAssessment.length) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete',
                text: 'Please answer all questions before submitting.',
            });
            return;
        }

        setSubmitting(true);
        try {
            const scores = mentalAssessment.reduce((acc, item) => {
                const score = answers[item.id] || 0;
                if (item.type === 'anxiety') acc.anxiety += score;
                else if (item.type === 'depress') acc.depress += score;
                else if (item.type === 'stress') acc.stress += score;
                return acc;
            }, { anxiety: 0, depress: 0, stress: 0 });

            await axios.post('/api/campaign/mental', {
                user_id: profile?.userId,
                depress: scores.depress,
                anxiety: scores.anxiety,
                stress: scores.stress
            });

            setAssessmentScores(scores);
            setSubmitted(true);
            Swal.fire({
                icon: 'success',
                title: 'Submitted!',
                text: 'Your mental health assessment has been recorded.',
            });
        } catch (error) {
            console.error("Error submitting assessment:", error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an error submitting your assessment.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getLevelKey = (score: number, type: 'depress' | 'anxiety' | 'stress'): 'normal' | 'little' | 'moderate' | 'severe' => {
        if (type === 'anxiety') {
            if (score <= 3) return 'normal';
            if (score <= 5) return 'little';
            if (score <= 7) return 'moderate';
            return 'severe';
        }
        if (type === 'stress') {
            if (score <= 7) return 'normal';
            if (score <= 9) return 'little';
            if (score <= 12) return 'moderate';
            return 'severe';
        }
        // depress
        if (score <= 4) return 'normal';
        if (score <= 6) return 'little';
        if (score <= 10) return 'moderate';
        return 'severe';
    };

    const getLevelBadge = (level: 'normal' | 'little' | 'moderate' | 'severe') => {
        switch (level) {
            case 'normal':
                return { label: 'ปกติ', color: 'badge-success text-white' };
            case 'little':
                return { label: 'เล็กน้อย', color: 'badge-info text-white' };
            case 'moderate':
                return { label: 'ปานกลาง', color: 'badge-warning text-white' };
            case 'severe':
                return { label: 'รุนแรง', color: 'badge-error text-white' };
        }
    };

    if (loading) {
        return (
            <div className="card bg-base-100 shadow-xl border border-base-200 p-8 text-center flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <p className="mt-2 text-sm text-base-content/70">กำลังโหลดข้อมูลผลการประเมิน...</p>
            </div>
        );
    }

    if (submitted && assessmentScores) {
        return (
            <div className="card bg-base-100 shadow-xl border border-base-200 w-full">
                <div className="card-body space-y-4">
                    <div className="text-center border-b border-base-200 pb-3">
                        <h2 className="text-xl font-bold text-primary mb-1">ผลการประเมินสุขภาพจิต</h2>
                        <p className="text-xs text-base-content/60">
                            {assessmentScores.created_at
                                ? `บันทึกเมื่อ: ${new Date(assessmentScores.created_at).toLocaleDateString('th-TH')}`
                                : 'บันทึกผลเรียบร้อยแล้ว'}
                        </p>
                    </div>

                    {/* Scores Summary */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-base-200/80 p-3 rounded-xl flex flex-col items-center">
                            <p className="text-xs font-semibold text-base-content/70">ซึมเศร้า</p>
                            <p className="text-2xl font-bold text-primary my-1">{assessmentScores.depress}</p>
                            <span className={`badge badge-sm ${getLevelBadge(getLevelKey(assessmentScores.depress, 'depress')).color}`}>
                                {getLevelBadge(getLevelKey(assessmentScores.depress, 'depress')).label}
                            </span>
                        </div>
                        <div className="bg-base-200/80 p-3 rounded-xl flex flex-col items-center">
                            <p className="text-xs font-semibold text-base-content/70">วิตกกังวล</p>
                            <p className="text-2xl font-bold text-secondary my-1">{assessmentScores.anxiety}</p>
                            <span className={`badge badge-sm ${getLevelBadge(getLevelKey(assessmentScores.anxiety, 'anxiety')).color}`}>
                                {getLevelBadge(getLevelKey(assessmentScores.anxiety, 'anxiety')).label}
                            </span>
                        </div>
                        <div className="bg-base-200/80 p-3 rounded-xl flex flex-col items-center">
                            <p className="text-xs font-semibold text-base-content/70">ความเครียด</p>
                            <p className="text-2xl font-bold text-accent my-1">{assessmentScores.stress}</p>
                            <span className={`badge badge-sm ${getLevelBadge(getLevelKey(assessmentScores.stress, 'stress')).color}`}>
                                {getLevelBadge(getLevelKey(assessmentScores.stress, 'stress')).label}
                            </span>
                        </div>
                    </div>

                    {/* Recommendations and Definitions */}
                    <div className="space-y-3 mt-2">
                        <h3 className="font-bold text-sm text-base-content/80">คำแนะนำและคำอธิบายผลประเมิน</h3>
                        {[
                            { key: 'depress', title: 'ภาวะซึมเศร้า (Depress)', score: assessmentScores.depress, info: assessmentResult.find(r => r.title === 'Depress') },
                            { key: 'anxiety', title: 'ความวิตกกังวล (Anxiety)', score: assessmentScores.anxiety, info: assessmentResult.find(r => r.title === 'Anxiety') },
                            { key: 'stress', title: 'ความเครียด (Stress)', score: assessmentScores.stress, info: assessmentResult.find(r => r.title === 'Stress') },
                        ].map((cat) => {
                            const levelKey = getLevelKey(cat.score, cat.key as 'depress' | 'anxiety' | 'stress');
                            const crit = cat.info?.criteria[levelKey] as Record<string, string> | undefined;
                            const def = crit ? (crit.definition || crit.difinition || '') : '';
                            const sug = crit?.suggestion || '';
                            const badge = getLevelBadge(levelKey);

                            return (
                                <div key={cat.key} className="bg-base-200/50 p-3 rounded-lg border border-base-200 text-xs space-y-1.5">
                                    <div className="flex justify-between items-center font-bold text-sm">
                                        <span>{cat.title}</span>
                                        <span className={`badge badge-xs ${badge.color}`}>{badge.label}</span>
                                    </div>
                                    {def && (
                                        <p className="text-base-content/80 leading-relaxed">
                                            <span className="font-semibold text-primary">คำอธิบาย:</span> {def}
                                        </p>
                                    )}
                                    {sug && (
                                        <p className="text-base-content/80 leading-relaxed">
                                            <span className="font-semibold text-secondary">คำแนะนำ:</span> {sug}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* <div className="pt-2">
                        <button
                            className="btn btn-outline btn-primary btn-sm w-full"
                            onClick={() => setSubmitted(false)}
                        >
                            ทำแบบประเมินอีกครั้ง
                        </button>
                    </div> */}
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl border border-base-200 w-full">
            <div className="card-body">
                <h2 className="card-title text-primary mb-4 shrink-0">แบบประเมินสุขภาพจิต (Mental Health Assessment)</h2>
                <div className="space-y-4">
                    {mentalAssessment.map((item) => (
                        <div key={item.id} className="p-3 bg-base-200 rounded-lg">
                            <p className="font-medium">{item.id}. {item.question}</p>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map((score) => (
                                    <label key={score} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`question-${item.id}`}
                                            value={score}
                                            checked={answers[item.id] === score}
                                            onChange={() => handleAnswerChange(item.id, score)}
                                            className="radio radio-primary radio-sm"
                                        />
                                        <span className="text-sm">
                                            {score === 0 && "ไม่เลย"}
                                            {score === 1 && "เล็กน้อย"}
                                            {score === 2 && "มาก"}
                                            {score === 3 && "มากที่สุด"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card-actions justify-end mt-6 shrink-0">
                    <button
                        className="btn btn-primary w-full md:w-auto"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Assessment"}
                    </button>
                </div>
            </div>
        </div>
    );
}
