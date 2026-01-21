import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLiff } from "@/contexts/LiffContext";
import Swal from 'sweetalert2';
import { mentalAssessment } from '@/app/campaign/mentalAssessment/mentalAssessment'

export default function MentalAssessment() {
    const { profile } = useLiff();
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
            const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);

            await axios.post('/api/campaign/mental', {
                user_id: profile.userId,
                score: totalScore
            });

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

    if (submitted) {
        return (
            <div className="card bg-base-100 shadow-xl border border-base-200 p-8 text-center">
                <h2 className="text-2xl font-bold text-success mb-2">Thank You!</h2>
                <p>You have completed the mental health assessment.</p>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
                <h2 className="card-title text-primary mb-4">แบบประเมินสุขภาพจิต (Mental Health Assessment)</h2>
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
                <div className="card-actions justify-end mt-6">
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
