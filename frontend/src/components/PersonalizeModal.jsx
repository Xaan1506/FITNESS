import React, {useState} from 'react'
import Api from '../services/api'

const defaultState = {
  name: '', age: 25, gender: 'female', height: 170, currentWeight: 70, targetWeight: 65,
  bodyType: 'mesomorph', activityLevel: 'light', diet: 'non-veg', allergies: '', goal: 'stay_fit', targetBodyPart: 'abs'
};

export default function PersonalizeModal({onClose,onSaved}){
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  async function save(){
    setLoading(true);
    try{
      const res = await Api.personalize(form);
      onSaved(form);
    }catch(err){ console.error(err); alert('Error saving'); }
    setLoading(false);
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <h3>Personalize your plan</h3>
        <div className="form-grid">
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input placeholder="Age" type="number" value={form.age} onChange={e=>setForm({...form,age:+e.target.value})} />
          <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="female">Female</option><option value="male">Male</option></select>
          <input placeholder="Height (cm)" type="number" value={form.height} onChange={e=>setForm({...form,height:+e.target.value})} />
          <input placeholder="Current weight (kg)" type="number" value={form.currentWeight} onChange={e=>setForm({...form,currentWeight:+e.target.value})} />
          <input placeholder="Target weight (kg)" type="number" value={form.targetWeight} onChange={e=>setForm({...form,targetWeight:+e.target.value})} />
          <select value={form.bodyType} onChange={e=>setForm({...form,bodyType:e.target.value})}><option>ectomorph</option><option>mesomorph</option><option>endomorph</option></select>
          <select value={form.activityLevel} onChange={e=>setForm({...form,activityLevel:e.target.value})}><option value="sedentary">Sedentary</option><option value="light">Light</option><option value="moderate">Moderate</option><option value="intense">Intense</option></select>
          <select value={form.diet} onChange={e=>setForm({...form,diet:e.target.value})}><option value="veg">Veg</option><option value="non-veg">Non-veg</option><option value="vegan">Vegan</option></select>
          <input placeholder="Allergies" value={form.allergies} onChange={e=>setForm({...form,allergies:e.target.value})} />
          <select value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})}><option value="fat_loss">Fat loss</option><option value="muscle_gain">Muscle gain</option><option value="stay_fit">Stay fit</option><option value="stamina">Improve stamina</option></select>
          <select value={form.targetBodyPart} onChange={e=>setForm({...form,targetBodyPart:e.target.value})}><option>abs</option><option>chest</option><option>arms</option><option>legs</option><option>glutes</option></select>
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save & Generate Plan'}</button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
