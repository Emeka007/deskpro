import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import { PRIORITIES, CATEGORIES } from '../../data/mockData';
import './CreateWizard.css';

/**
 * FORM_SCHEMA — metadata-driven form definition.
 * This is the React equivalent of Angular Formly.
 * Each step is an array of field descriptors; the renderer
 * maps them to form controls at runtime with no hard-coded JSX per field.
 */
const FORM_SCHEMA = [
  {
    step: 1,
    title: 'Ticket details',
    description: 'Describe the issue and who reported it.',
    fields: [
      { key: 'title',       label: 'Issue title',       type: 'text',     required: true,  placeholder: 'Brief description of the issue', fullWidth: true },
      { key: 'requester',   label: 'Requester email',   type: 'email',    required: true,  placeholder: 'user@company.com' },
      { key: 'description', label: 'Description',       type: 'textarea', required: false, placeholder: 'Describe the issue in detail, including steps to reproduce…', fullWidth: true },
    ],
  },
  {
    step: 2,
    title: 'Classification',
    description: 'Set the priority and category so the right team sees it.',
    fields: [
      { key: 'priority', label: 'Priority', type: 'select', required: true,  options: PRIORITIES },
      { key: 'category', label: 'Category', type: 'select', required: true,  options: CATEGORIES },
    ],
  },
];

function FieldRenderer({ field, value, onChange, error }) {
  const commonProps = {
    id:          field.key,
    value:       value || '',
    onChange:    (e) => onChange(field.key, e.target.value),
    placeholder: field.placeholder || '',
    'aria-describedby': error ? `${field.key}-error` : undefined,
    'aria-invalid':     error ? 'true' : undefined,
    className:   `form-control ${error ? 'form-control-error' : ''}`,
  };

  if (field.type === 'textarea') return <textarea {...commonProps} rows={4} />;

  if (field.type === 'select') return (
    <select {...commonProps} className={`form-control ${error ? 'form-control-error' : ''}`}>
      <option value="">Select…</option>
      {field.options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return <input type={field.type} {...commonProps} />;
}

export default function CreateWizard() {
  const navigate   = useNavigate();
  const { create, submitting } = useTickets();
  const [step,   setStep]   = useState(0);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const currentSchema = FORM_SCHEMA[step];

  const handleChange = (key, value) => {
    setValues(v => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const newErrors = {};
    currentSchema.fields.forEach(f => {
      if (f.required && !values[f.key]?.trim()) {
        newErrors[f.key] = `${f.label} is required`;
      }
      if (f.type === 'email' && values[f.key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[f.key])) {
        newErrors[f.key] = 'Please enter a valid email address';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const ticket = await create(values);
    if (ticket) navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div className="wizard-wrap">
      {/* Step indicators */}
      <nav className="wizard-steps" aria-label="Form progress">
        {FORM_SCHEMA.map((s, i) => (
          <div
            key={s.step}
            className={`wizard-step ${i < step ? 'done' : i === step ? 'active' : ''}`}
            aria-current={i === step ? 'step' : undefined}
          >
            <div className="step-dot">
              {i < step ? <Check size={12} aria-hidden="true" /> : s.step}
            </div>
            <span className="step-label">{s.title}</span>
          </div>
        ))}
        {/* Review step */}
        <div className={`wizard-step ${step === FORM_SCHEMA.length ? 'active' : ''}`}>
          <div className="step-dot">{FORM_SCHEMA.length + 1}</div>
          <span className="step-label">Review</span>
        </div>
      </nav>

      {/* Step body */}
      {step < FORM_SCHEMA.length ? (
        <div className="wizard-body card">
          <div className="wizard-header">
            <h2 className="wizard-title">{currentSchema.title}</h2>
            <p className="wizard-desc">{currentSchema.description}</p>
          </div>

          <div className={`wizard-fields ${currentSchema.fields.some(f => !f.fullWidth) ? 'fields-grid' : ''}`}>
            {currentSchema.fields.map(field => (
              <div
                key={field.key}
                className={`form-group ${field.fullWidth ? 'full-width' : ''}`}
              >
                <label className="form-label" htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="req" aria-hidden="true"> *</span>}
                </label>
                <FieldRenderer
                  field={field}
                  value={values[field.key]}
                  onChange={handleChange}
                  error={errors[field.key]}
                />
                {errors[field.key] && (
                  <p id={`${field.key}-error`} className="field-error" role="alert">
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="wizard-nav">
            {step > 0
              ? <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
                  <ChevronLeft size={15} aria-hidden="true" /> Back
                </button>
              : <button className="btn btn-ghost" onClick={() => navigate('/tickets')}>Cancel</button>
            }
            <button className="btn btn-primary" onClick={handleNext}>
              Next <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        /* Review step */
        <div className="wizard-body card">
          <div className="wizard-header">
            <h2 className="wizard-title">Review your ticket</h2>
            <p className="wizard-desc">Check the details before submitting.</p>
          </div>

          <div className="review-grid">
            {FORM_SCHEMA.flatMap(s => s.fields).filter(f => values[f.key]).map(f => (
              <div key={f.key} className="review-row">
                <span className="review-key">{f.label}</span>
                <span className="review-val">{values[f.key]}</span>
              </div>
            ))}
          </div>

          <div className="wizard-nav">
            <button className="btn btn-secondary" onClick={() => setStep(FORM_SCHEMA.length - 1)}>
              <ChevronLeft size={15} aria-hidden="true" /> Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit ticket'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
