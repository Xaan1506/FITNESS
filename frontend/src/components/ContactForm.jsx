import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    alert("Message submitted! (Demo only)");
  }

  return (
    <section id="contact" className="card glassy" style={{marginTop: "60px"}}>
      <p className="eyebrow">Contact us</p>
      <h3 style={{marginTop: "6px"}}>We'd love to hear from you</h3>

      <form onSubmit={submit} style={{display:"flex", flexDirection:"column", gap:"14px", marginTop:"20px"}}>
        
        <label className="form-field">
          <span>Name</span>
          <input
            placeholder="Your name"
            value={form.name}
            onChange={e=>updateField("name", e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Email</span>
          <input
            placeholder="you@example.com"
            value={form.email}
            onChange={e=>updateField("email", e.target.value)}
            type="email"
          />
        </label>

        <label className="form-field">
          <span>Message</span>
          <textarea
            rows="4"
            placeholder="How can we help you?"
            value={form.message}
            onChange={e=>updateField("message", e.target.value)}
          />
        </label>

        <button className="btn" style={{marginTop:"6px"}}>Send Message</button>
      </form>
    </section>
  );
}
