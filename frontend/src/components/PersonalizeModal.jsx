import React, {useState} from 'react'
import Api from '../services/api'

const defaultState = {
  name: '',
  age: 25,
  gender: 'female',
  height: 170,
  currentWeight: 70,
  targetWeight: 65,
  bodyType: 'mesomorph',
  activityLevel: 'light',
  diet: 'non-veg',
  allergies: '',
  goal: 'stay_fit',
  targetBodyPart: 'abs'
};

const labelCopy = {
  name: 'Name',
  age: 'Age (years)',
  gender: 'Gender',
  height: 'Height (cm)',
  currentWeight: 'Current weight (kg)',
  targetWeight: 'Target weight (kg)',
  bodyType: 'Body type',
  activityLevel: 'Weekly activity',
  diet: 'Diet preference',
  allergies: 'Allergies',
  goal: 'Primary goal',
  targetBodyPart: 'Area to focus'
};

export default function PersonalizeModal({onClose,onSaved}){
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  function updateField(key, value){
    setForm(prev => ({...prev, [key]: value}));
  }

  async function save(){
    setLoading(true);
    try{
      await Api.personalize(form);
      onSaved(form);
    }catch(err){
      console.error(err);
      alert('Error saving');
    }
    setLoading(false);
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <h3>Personalize your plan</h3>
        <div className="form-grid">
          <label className="form-field">
            <span>{labelCopy.name}</span>
            <input value={form.name} onChange={e=>updateField('name', e.target.value)} placeholder="e.g. Jordan" />
          </label>
          <label className="form-field">
            <span>{labelCopy.age}</span>
            <input type="number" value={form.age} onChange={e=>updateField('age', +e.target.value)} />
          </label>
          <label className="form-field">
            <span>{labelCopy.gender}</span>
            <select value={form.gender} onChange={e=>updateField('gender', e.target.value)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </label>
          <label className="form-field">
            <span>{labelCopy.height}</span>
            <input type="number" value={form.height} onChange={e=>updateField('height', +e.target.value)} />
          </label>
          <label className="form-field">
            <span>{labelCopy.currentWeight}</span>
            <input type="number" value={form.currentWeight} onChange={e=>updateField('currentWeight', +e.target.value)} />
          </label>
          <label className="form-field">
            <span>{labelCopy.targetWeight}</span>
            <input type="number" value={form.targetWeight} onChange={e=>updateField('targetWeight', +e.target.value)} />
          </label>
          <label className="form-field">
            <span>{labelCopy.bodyType}</span>
            <select value={form.bodyType} onChange={e=>updateField('bodyType', e.target.value)}>
              <option>ectomorph</option>
              <option>mesomorph</option>
              <option>endomorph</option>
            </select>
          </label>
          <label className="form-field">
            <span>{labelCopy.activityLevel}</span>
            <select value={form.activityLevel} onChange={e=>updateField('activityLevel', e.target.value)}>
              <option value="sedentary">Sedentary (desk most day)</option>
              <option value="light">Light (1-3 workouts)</option>
              <option value="moderate">Moderate (3-5 workouts)</option>
              <option value="intense">Intense (athlete)</option>
            </select>
          </label>
          <label className="form-field">
            <span>{labelCopy.diet}</span>
            <select value={form.diet} onChange={e=>updateField('diet', e.target.value)}>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-veg</option>
              <option value="vegan">Vegan</option>
            </select>
          </label>
          <label className="form-field">
            <span>{labelCopy.allergies}</span>
            <input value={form.allergies} onChange={e=>updateField('allergies', e.target.value)} placeholder="e.g. peanuts, dairy" />
          </label>
          <label className="form-field">
            <span>{labelCopy.goal}</span>
            <select value={form.goal} onChange={e=>updateField('goal', e.target.value)}>
              <option value="fat_loss">Fat loss</option>
              <option value="muscle_gain">Muscle gain</option>
              <option value="stay_fit">Stay fit</option>
              <option value="stamina">Improve stamina</option>
            </select>
          </label>
          <label className="form-field">
            <span>{labelCopy.targetBodyPart}</span>
            <select value={form.targetBodyPart} onChange={e=>updateField('targetBodyPart', e.target.value)}>
              <option>abs</option>
              <option>chest</option>
              <option>arms</option>
              <option>legs</option>
              <option>glutes</option>
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save & Generate Plan'}</button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
