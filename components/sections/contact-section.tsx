"use client";

import type React from "react";

import {
  Mail,
  MapPin,
  Users,
  Building2,
  Phone,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useState, useRef, type FormEvent } from "react";
import { MagneticButton } from "@/components/magnetic-button";
import { createClient } from "@/lib/supabase/client";
import { hospitalInfo } from "@/lib/content";

type TabType = "patients" | "hospitals";

interface ValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  hospitalName?: string;
  contactPerson?: string;
  city?: string;
}

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3);
  const [activeTab, setActiveTab] = useState<TabType>("patients");
  const [patientForm, setPatientForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [patientErrors, setPatientErrors] = useState<ValidationErrors>({});
  const [hospitalErrors, setHospitalErrors] = useState<ValidationErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const patientTimeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const hospitalTimeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Please enter your name";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly) return "Phone number is required";
    if (digitsOnly.length !== 10) return "Enter 10-digit mobile number";
    if (!["6", "7", "8", "9"].includes(digitsOnly[0]))
      return "Invalid mobile number";
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (!message.trim()) return "Message is required";
    if (message.trim().length < 10)
      return "Message too short (min 10 characters)";
    return undefined;
  };

  const handlePatientBlur = (field: keyof typeof patientForm) => {
    let error: string | undefined;
    switch (field) {
      case "name":
        error = validateName(patientForm.name);
        break;
      case "email":
        error = validateEmail(patientForm.email);
        break;
      case "phone":
        error = validatePhone(patientForm.phone);
        break;
      case "message":
        error = validateMessage(patientForm.message);
        break;
    }
    setPatientErrors((prev) => ({ ...prev, [field]: error }));

    if (error) {
      if (patientTimeoutRefs.current[field]) {
        clearTimeout(patientTimeoutRefs.current[field]);
      }
      patientTimeoutRefs.current[field] = setTimeout(() => {
        setPatientErrors((prev) => ({ ...prev, [field]: undefined }));
      }, 3000); // Changed from 5000 to 3000ms
    }
  };

  const handleHospitalBlur = (field: keyof typeof hospitalForm) => {
    let error: string | undefined;
    switch (field) {
      case "hospitalName":
        error = validateName(hospitalForm.hospitalName);
        break;
      case "contactPerson":
        error = validateName(hospitalForm.contactPerson);
        break;
      case "email":
        error = validateEmail(hospitalForm.email);
        break;
      case "phone":
        error = validatePhone(hospitalForm.phone);
        break;
      case "city":
        error = !hospitalForm.city.trim() ? "City is required" : undefined;
        break;
      case "message":
        error = validateMessage(hospitalForm.message);
        break;
    }
    setHospitalErrors((prev) => ({ ...prev, [field]: error }));

    if (error) {
      if (hospitalTimeoutRefs.current[field]) {
        clearTimeout(hospitalTimeoutRefs.current[field]);
      }
      hospitalTimeoutRefs.current[field] = setTimeout(() => {
        setHospitalErrors((prev) => ({ ...prev, [field]: undefined }));
      }, 3000); // Changed from 5000 to 3000ms
    }
  };

  const handlePatientChange = (
    field: keyof typeof patientForm,
    value: string
  ) => {
    setPatientForm({ ...patientForm, [field]: value });
    if (patientErrors[field as keyof ValidationErrors]) {
      setPatientErrors((prev) => ({ ...prev, [field]: undefined }));
      if (patientTimeoutRefs.current[field]) {
        clearTimeout(patientTimeoutRefs.current[field]);
        delete patientTimeoutRefs.current[field];
      }
    }
  };

  const handleHospitalChange = (
    field: keyof typeof hospitalForm,
    value: string
  ) => {
    setHospitalForm({ ...hospitalForm, [field]: value });
    if (hospitalErrors[field as keyof ValidationErrors]) {
      setHospitalErrors((prev) => ({ ...prev, [field]: undefined }));
      if (hospitalTimeoutRefs.current[field]) {
        clearTimeout(hospitalTimeoutRefs.current[field]);
        delete hospitalTimeoutRefs.current[field];
      }
    }
  };

  const handlePatientSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: ValidationErrors = {
      name: validateName(patientForm.name),
      email: validateEmail(patientForm.email),
      phone: validatePhone(patientForm.phone),
      message: validateMessage(patientForm.message),
    };

    setPatientErrors(errors);

    if (Object.values(errors).some((error) => error !== undefined)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("patient_inquiries").insert([
        {
          name: patientForm.name,
          phone: patientForm.phone,
          email: patientForm.email,
          message: patientForm.message,
        },
      ]);

      if (error) {
        console.error("[v0] Supabase error:", error);
        throw new Error(error.message);
      }

      setSubmitSuccess(true);
      setPatientForm({ name: "", phone: "", email: "", message: "" });
      setPatientErrors({});
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("[v0] Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHospitalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: ValidationErrors = {
      hospitalName: validateName(hospitalForm.hospitalName),
      contactPerson: validateName(hospitalForm.contactPerson),
      email: validateEmail(hospitalForm.email),
      phone: validatePhone(hospitalForm.phone),
      city: !hospitalForm.city.trim() ? "City is required" : undefined,
      message: validateMessage(hospitalForm.message),
    };

    setHospitalErrors(errors);

    if (Object.values(errors).some((error) => error !== undefined)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("hospital_inquiries").insert([
        {
          hospital_name: hospitalForm.hospitalName,
          contact_person: hospitalForm.contactPerson,
          email: hospitalForm.email,
          phone: hospitalForm.phone,
          city: hospitalForm.city,
          message: hospitalForm.message,
        },
      ]);

      if (error) {
        console.error("[v0] Supabase error:", error);
        throw new Error(error.message);
      }

      setSubmitSuccess(true);
      setHospitalForm({
        hospitalName: "",
        contactPerson: "",
        email: "",
        phone: "",
        city: "",
        message: "",
      });
      setHospitalErrors({});
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("[v0] Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={ref}
      className="flex min-h-screen w-full items-center px-4 py-16 md:px-12 md:py-20 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div className="flex flex-col justify-center">
            <div className="overflow-visible">
              <div
                className={`mb-8 transition-all duration-700 md:mb-16 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-12 opacity-0"
                }`}
              >
                <h2 className="mb-2 font-sans text-3xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-7xl lg:text-8xl">
                  Get in
                  <br />
                  touch
                </h2>
                <p className="font-mono text-xs text-foreground/60 md:text-base">
                  / Contact us
                </p>
              </div>

              <div className="space-y-3 md:space-y-6">
                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Mail className="h-3 w-3 text-foreground/60 md:h-4 md:w-4" />
                    <span className="font-mono text-xs text-foreground/60 md:text-sm">
                      Email
                    </span>
                  </div>
                  <a
                    href={`mailto:${hospitalInfo.email}`}
                    className="block min-h-[44px] flex items-center text-sm text-foreground transition-colors hover:text-foreground/70 md:text-xl"
                  >
                    {hospitalInfo.email}
                  </a>
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Phone className="h-3 w-3 text-foreground/60 md:h-4 md:w-4" />
                    <span className="font-mono text-xs text-foreground/60 md:text-sm">
                      Phone
                    </span>
                  </div>
                  <a
                    href={`tel:${hospitalInfo.phone}`}
                    className="block min-h-[44px] flex items-center text-sm text-foreground transition-colors hover:text-foreground/70 md:text-xl"
                  >
                    {hospitalInfo.phone}
                  </a>
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  }`}
                  style={{ transitionDelay: "400ms" }}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-foreground/60 md:h-4 md:w-4" />
                    <span className="font-mono text-xs text-foreground/60 md:text-sm">
                      Location
                    </span>
                  </div>
                  <p className="text-sm text-foreground md:text-xl">
                    {hospitalInfo.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Tabbed forms */}
          <div className="flex flex-col justify-center">
            <div
              className={`mb-4 flex gap-2 transition-all duration-700 md:mb-8 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-16 opacity-0"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <button
                onClick={() => {
                  setActiveTab("patients");
                  setSubmitSuccess(false);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-sans text-sm font-medium transition-all min-h-[48px] md:text-base ${
                  activeTab === "patients"
                    ? "border-foreground/30 bg-foreground/10 text-foreground"
                    : "border-foreground/10 bg-transparent text-foreground/60 hover:border-foreground/20 hover:text-foreground/80"
                }`}
              >
                <Users className="h-4 w-4" />
                Patients
              </button>
              <button
                onClick={() => {
                  setActiveTab("hospitals");
                  setSubmitSuccess(false);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-sans text-sm font-medium transition-all min-h-[48px] md:text-base ${
                  activeTab === "hospitals"
                    ? "border-foreground/30 bg-foreground/10 text-foreground"
                    : "border-foreground/10 bg-transparent text-foreground/60 hover:border-foreground/20 hover:text-foreground/80"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Hospitals
              </button>
            </div>

            {/* Patient Form */}
            {activeTab === "patients" && (
              <form
                ref={formRef}
                onSubmit={handlePatientSubmit}
                className="space-y-4 md:space-y-5"
              >
                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "250ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={patientForm.name}
                    onChange={(e) =>
                      handlePatientChange("name", e.target.value)
                    }
                    onBlur={() => handlePatientBlur("name")}
                    onFocus={handleInputFocus}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      patientErrors.name
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="Your name"
                  />
                  {patientErrors.name && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {patientErrors.name}
                    </p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "350ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={patientForm.phone}
                    onChange={(e) =>
                      handlePatientChange(
                        "phone",
                        e.target.value.replace(/[^\d]/g, "")
                      )
                    }
                    onBlur={() => handlePatientBlur("phone")}
                    onFocus={handleInputFocus}
                    maxLength={10}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      patientErrors.phone
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="9876543210"
                  />
                  {patientErrors.phone && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {patientErrors.phone}
                    </p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "450ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={patientForm.email}
                    onChange={(e) =>
                      handlePatientChange("email", e.target.value)
                    }
                    onBlur={() => handlePatientBlur("email")}
                    onFocus={handleInputFocus}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      patientErrors.email
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="your@email.com"
                  />
                  {patientErrors.email && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {patientErrors.email}
                    </p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "550ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={patientForm.message}
                    onChange={(e) =>
                      handlePatientChange("message", e.target.value)
                    }
                    onBlur={() => handlePatientBlur("message")}
                    onFocus={handleInputFocus}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      patientErrors.message
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="Describe your health concern..."
                  />
                  {patientErrors.message && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {patientErrors.message}
                    </p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  }`}
                  style={{ transitionDelay: "650ms" }}
                >
                  <MagneticButton
                    variant="primary"
                    size="lg"
                    className="w-full min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={isSubmitting || submitSuccess}
                  >
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {submitSuccess && <CheckCircle2 className="h-4 w-4" />}
                    <span>
                      {isSubmitting
                        ? "Sending..."
                        : submitSuccess
                        ? "Sent!"
                        : "Send Message"}
                    </span>
                  </MagneticButton>
                  {submitSuccess && (
                    <p className="mt-3 text-center font-mono text-xs text-foreground/80 animate-in fade-in duration-300 md:text-sm">
                      We'll contact you soon
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* Hospital Form */}
            {activeTab === "hospitals" && (
              <form
                ref={formRef}
                onSubmit={handleHospitalSubmit}
                className="space-y-4 md:space-y-5"
              >
                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "250ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    value={hospitalForm.hospitalName}
                    onChange={(e) =>
                      handleHospitalChange("hospitalName", e.target.value)
                    }
                    onBlur={() => handleHospitalBlur("hospitalName")}
                    onFocus={handleInputFocus}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      hospitalErrors.hospitalName
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="Hospital or Institute name"
                  />
                  {hospitalErrors.hospitalName && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {hospitalErrors.hospitalName}
                    </p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "350ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={hospitalForm.contactPerson}
                    onChange={(e) =>
                      handleHospitalChange("contactPerson", e.target.value)
                    }
                    onBlur={() => handleHospitalBlur("contactPerson")}
                    onFocus={handleInputFocus}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      hospitalErrors.contactPerson
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="Your name"
                  />
                  {hospitalErrors.contactPerson && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {hospitalErrors.contactPerson}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div
                    className={`transition-all duration-700 ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-16 opacity-0"
                    }`}
                    style={{ transitionDelay: "450ms" }}
                  >
                    <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={hospitalForm.email}
                      onChange={(e) =>
                        handleHospitalChange("email", e.target.value)
                      }
                      onBlur={() => handleHospitalBlur("email")}
                      onFocus={handleInputFocus}
                      className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                        hospitalErrors.email
                          ? "border-amber-500/50"
                          : "border-foreground/30 focus:border-foreground/50"
                      }`}
                      placeholder="email@hospital.com"
                    />
                    {hospitalErrors.email && (
                      <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                        {hospitalErrors.email}
                      </p>
                    )}
                  </div>

                  <div
                    className={`transition-all duration-700 ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-16 opacity-0"
                    }`}
                    style={{ transitionDelay: "500ms" }}
                  >
                    <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={hospitalForm.phone}
                      onChange={(e) =>
                        handleHospitalChange(
                          "phone",
                          e.target.value.replace(/[^\d]/g, "")
                        )
                      }
                      onBlur={() => handleHospitalBlur("phone")}
                      onFocus={handleInputFocus}
                      maxLength={10}
                      className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                        hospitalErrors.phone
                          ? "border-amber-500/50"
                          : "border-foreground/30 focus:border-foreground/50"
                      }`}
                      placeholder="9876543210"
                    />
                    {hospitalErrors.phone && (
                      <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                        {hospitalErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "550ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={hospitalForm.city}
                    onChange={(e) =>
                      handleHospitalChange("city", e.target.value)
                    }
                    onBlur={() => handleHospitalBlur("city")}
                    onFocus={handleInputFocus}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      hospitalErrors.city
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="City location"
                  />
                  {hospitalErrors.city && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {hospitalErrors.city}
                    </p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "600ms" }}
                >
                  <label className="mb-1 block font-mono text-xs text-foreground/60 md:mb-2">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={hospitalForm.message}
                    onChange={(e) =>
                      handleHospitalChange("message", e.target.value)
                    }
                    onBlur={() => handleHospitalBlur("message")}
                    onFocus={handleInputFocus}
                    className={`w-full border-b bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none md:py-2 md:text-base transition-colors ${
                      hospitalErrors.message
                        ? "border-amber-500/50"
                        : "border-foreground/30 focus:border-foreground/50"
                    }`}
                    placeholder="Tell us about your requirements..."
                  />
                  {hospitalErrors.message && (
                    <p className="mt-1.5 text-xs text-amber-500/90 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {hospitalErrors.message}
                    </p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  }`}
                  style={{ transitionDelay: "700ms" }}
                >
                  <MagneticButton
                    variant="primary"
                    size="lg"
                    className="w-full min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={isSubmitting || submitSuccess}
                  >
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {submitSuccess && <CheckCircle2 className="h-4 w-4" />}
                    <span>
                      {isSubmitting
                        ? "Sending..."
                        : submitSuccess
                        ? "Sent!"
                        : "Request Surgical Consultation"}
                    </span>
                  </MagneticButton>
                  {submitSuccess && (
                    <p className="mt-3 text-center font-mono text-xs text-foreground/80 animate-in fade-in duration-300 md:text-sm">
                      We'll contact you soon
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
