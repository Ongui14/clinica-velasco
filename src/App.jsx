import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CalendarCheck, 
  Siren, 
  Activity, 
  Baby, 
  Brain, 
  HeartPulse, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  Share2, 
  Trash2, 
  PhoneCall, 
  MapPin, 
  AlertCircle, 
  Plus, 
  X, 
  Building2, 
  CalendarDays, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  ArrowRight, 
  LogOut, 
  Navigation, 
  Car, 
  Ambulance, 
  ChevronRight, 
  Timer,
  Shield,
  Settings,
  Megaphone,
  UserCheck,
  Stethoscope,
  Edit3,
  Compass,
  Check,
  Radio,
  RefreshCw,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Receipt,
  Upload,
  CheckCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import VelascoLogo from './components/VelascoLogo';

// Initial Specialties with room, status, location guidance and available hours
const INITIAL_SPECIALTIES = [
  { 
    id: 'cirugia', 
    name: 'Cirugía', 
    subRole: 'Cirugía General y Laparoscópica',
    doctor: 'Dr. Alejandro Velasco', 
    status: '🟢 Atendiendo Ahora', // '🟢 Atendiendo Ahora' | '🟡 En Cirugía / Pausa' | '🔴 Fuera de Turno'
    room: 'Consultorio 101 - PB',
    locationGuide: 'Planta Baja, Pasillo Derecho al lado de Farmacia Central',
    icon: 'Activity', 
    hours: ['08:30', '10:00', '16:00', '17:30'] 
  },
  { 
    id: 'pediatria', 
    name: 'Pediatría', 
    subRole: 'Pediatría Integral y Neonatología',
    doctor: 'Dra. Carmen Mendoza', 
    status: '🟢 Atendiendo Ahora',
    room: 'Consultorio 104 - PB',
    locationGuide: 'Planta Baja, Ala Materno-Infantil frente a Sala de Juegos',
    icon: 'Baby', 
    hours: ['09:15', '11:00', '15:00', '18:15'] 
  },
  { 
    id: 'neurocirugia', 
    name: 'Neurocirugía', 
    subRole: 'Neurocirugía y Columna',
    doctor: 'Dr. Mauricio Arce', 
    status: '🟡 En Cirugía / Pausa',
    room: 'Consultorio 202 - Piso 1',
    locationGuide: 'Piso 1, subiendo por ascensor principal a mano izquierda',
    icon: 'Brain', 
    hours: ['10:30', '15:30', '17:00'] 
  },
  { 
    id: 'terapia', 
    name: 'Terapia', 
    subRole: 'Terapia Intensiva (UTI)',
    doctor: 'Dr. Fernando Suárez', 
    status: '🟢 Atendiendo Ahora',
    room: 'Unidad UTI - Piso 1',
    locationGuide: 'Piso 1, Acceso Restringido UTI por pasillo central',
    icon: 'HeartPulse', 
    hours: ['08:00', '11:30', '16:30'] 
  },
];

const EMERGENCY_REASONS = [
  'Fiebre alta / Dolor agudo',
  'Accidente leve / Caída',
  'Dificultad respiratoria',
  'Otro síntoma urgente'
];

const ARRIVAL_TIMES = [
  'En 5 min',
  'En 10-15 min',
  'En 20-30 min'
];

const LOCAL_STORAGE_USER_KEY = 'clinica_velasco_paciente';
const LOCAL_STORAGE_CITAS_KEY = 'clinica_velasco_citas';
const LOCAL_STORAGE_SPECIALTIES_KEY = 'clinica_velasco_especialidades';
const LOCAL_STORAGE_EMERGENCY_ALERTS_KEY = 'clinica_velasco_alertas_emergencia';
const LOCAL_STORAGE_AMBULANCE_STATUS_KEY = 'clinica_velasco_estado_ambulancia';

// Helper icon getter
function getSpecialtyIcon(iconName, className = "w-6 h-6") {
  switch (iconName) {
    case 'Activity': return <Activity className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'Brain': return <Brain className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    default: return <Stethoscope className={className} />;
  }
}

export default function App() {
  // Global Mode: 'paciente' | 'admin' | 'medico' | 'guardia'
  const [systemRole, setSystemRole] = useState('paciente');
  const [showRoleSelectorModal, setShowRoleSelectorModal] = useState(false);

  // Patient Navigation views: 'inicio' | 'turnos' | 'emergencia'
  const [activeTab, setActiveTab] = useState('inicio');

  // User Profile state (Paciente)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Login form inputs
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  // Configured Specialties (Admin editable & persistent)
  const [specialtiesList, setSpecialtiesList] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SPECIALTIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SPECIALTIES;
  });

  // Save specialties to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SPECIALTIES_KEY, JSON.stringify(specialtiesList));
    } catch (e) {}
  }, [specialtiesList]);

  // Appointments (stored in state & localStorage)
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CITAS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'CV-4819',
        specialty: 'Cirugía',
        subRole: 'Cirugía General y Laparoscópica',
        doctor: 'Dr. Alejandro Velasco',
        room: 'Consultorio 101 - PB',
        locationGuide: 'Planta Baja, Pasillo Derecho al lado de Farmacia Central',
        date: 'Hoy',
        hour: '10:00',
        patientName: 'Ejemplo Paciente',
        patientPhone: '72812345',
        status: 'Programado' // 'Programado' | 'Llamando en puerta' | 'Atendido'
      }
    ];
  });

  // Sync appointments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CITAS_KEY, JSON.stringify(appointments));
    } catch (e) {}
  }, [appointments]);

  // Sync user profile to localStorage
  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userProfile));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (e) {}
  }, [userProfile]);

  // Emergency Alerts state (Shared between patient alerts and guardia monitor)
  const [emergencyAlerts, setEmergencyAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_EMERGENCY_ALERTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'EMG-101',
        type: 'camino', // 'ambulancia' | 'camino'
        patientName: 'Carlos Banegas',
        phone: '72898765',
        symptom: 'Fiebre alta / Dolor agudo',
        estimatedTime: 'En 5 min',
        timeStr: '10:15 AM',
        status: 'En camino' // 'En camino' | 'Recibido en Box' | 'Despachada / En camino'
      }
    ];
  });

  // Sync emergency alerts
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_EMERGENCY_ALERTS_KEY, JSON.stringify(emergencyAlerts));
    } catch (e) {}
  }, [emergencyAlerts]);

  // Ambulance State: 'disponible' | 'operativo'
  const [ambulanceStatus, setAmbulanceStatus] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_AMBULANCE_STATUS_KEY);
      if (saved) return saved;
    } catch (e) {}
    return 'disponible';
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_AMBULANCE_STATUS_KEY, ambulanceStatus);
    } catch (e) {}
  }, [ambulanceStatus]);

  // Selected Doctor for Doctor Panel
  const [selectedDoctorId, setSelectedDoctorId] = useState('Dr. Alejandro Velasco');

  // Booking Modal State (Paso a Paso modal for chosen specialty)
  const [selectedSpecialtyForBooking, setSelectedSpecialtyForBooking] = useState(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState('Hoy');
  const [selectedHour, setSelectedHour] = useState('');
  const [voucherNumber, setVoucherNumber] = useState('');
  const [voucherFileName, setVoucherFileName] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);

  // Patient Emergency Mode states: null | 'ambulancia' | 'camino'
  const [emergencySubMode, setEmergencySubMode] = useState(null);
  const [emergencyReason, setEmergencyReason] = useState(EMERGENCY_REASONS[0]);
  const [estimatedArrival, setEstimatedArrival] = useState(ARRIVAL_TIMES[1]);
  const [preAlertSuccess, setPreAlertSuccess] = useState(false);
  // Quick phone state for unregistered users entering emergency directly from login
  const [unregisteredPhone, setUnregisteredPhone] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState('');

  // Admin Panel Editing State
  const [editingSpecialtyId, setEditingSpecialtyId] = useState(null);
  const [newHourInput, setNewHourInput] = useState('');

  // Handle Login/Register for Patient
  const handleRegisterUser = (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setLoginError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!inputPhone.trim() || inputPhone.trim().length < 7) {
      setLoginError('Ingresa un número de celular de contacto válido.');
      return;
    }

    setLoginError('');
    const profile = {
      name: inputName.trim(),
      phone: inputPhone.trim()
    };
    setUserProfile(profile);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setInputName('');
    setInputPhone('');
    setActiveTab('inicio');
  };

  // Open Specialty Booking
  const handleOpenSpecialtyBooking = (spec) => {
    setSelectedSpecialtyForBooking(spec);
    setSelectedHour(spec.hours[0] || '10:00');
    setSelectedDateLabel('Hoy');
    setVoucherNumber('');
    setVoucherFileName('');
    setVoucherError('');
  };

  // Confirm Appointment Booking (Patient)
  const handleConfirmTurno = () => {
    if (!selectedSpecialtyForBooking || !userProfile) return;

    if (!voucherNumber.trim() && !voucherFileName.trim()) {
      setVoucherError('Es obligatorio ingresar el número de referencia del voucher o adjuntar el comprobante de transferencia.');
      return;
    }

    setVoucherError('');

    const newTicket = {
      id: `CV-${Math.floor(1000 + Math.random() * 9000)}`,
      specialty: selectedSpecialtyForBooking.name,
      subRole: selectedSpecialtyForBooking.subRole,
      doctor: selectedSpecialtyForBooking.doctor,
      room: selectedSpecialtyForBooking.room,
      locationGuide: selectedSpecialtyForBooking.locationGuide || 'Recepción Central',
      date: selectedDateLabel,
      hour: selectedHour,
      patientName: userProfile.name,
      patientPhone: userProfile.phone,
      voucherRef: voucherNumber.trim() || (voucherFileName ? `Archivo: ${voucherFileName}` : 'Voucher Adjunto'),
      paymentStatus: 'Pendiente de Verificación Admin',
      status: 'Programado'
    };

    setAppointments(prev => [newTicket, ...prev]);
    setSelectedSpecialtyForBooking(null);
    setBookingSuccessModal(newTicket);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#046A28', '#00AC46', '#22C55E']
      });
    } catch (e) {}
  };

  // Delete appointment
  const handleDeleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Doctor Action: Call patient
  const handleDoctorCallPatient = (ticketId, room) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === ticketId) {
        return { ...app, status: `Llamando en puerta - Pase al ${room}` };
      }
      return app;
    }));
  };

  // Doctor Action: Mark as attended
  const handleDoctorMarkAttended = (ticketId) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === ticketId) {
        return { ...app, status: 'Atendido' };
      }
      return app;
    }));
  };

  // Share Ticket WhatsApp
  const handleShareWhatsAppTicket = (ticket) => {
    const text = encodeURIComponent(
      `🏥 *RESERVA MÉDICA CONFIRMADA - CLÍNICA VELASCO*\n` +
      `Trinidad, Beni - Bolivia\n\n` +
      `🎫 *Ficha / Turno:* ${ticket.id}\n` +
      `👤 *Paciente:* ${ticket.patientName}\n` +
      `🩺 *Especialidad:* ${ticket.specialty} (${ticket.subRole || 'Consulta Médica'})\n` +
      `👨‍⚕️ *Médico Tratante:* ${ticket.doctor}\n` +
      `📅 *Fecha:* ${ticket.date}\n` +
      `⏰ *Hora:* ${ticket.hour}\n` +
      `💳 *Comprobante / Voucher:* ${ticket.voucherRef || 'Adjuntado'}\n` +
      `🛡️ *Estado de Pago:* ${ticket.paymentStatus || 'Pendiente'}\n` +
      `🚪 *Consultorio:* ${ticket.room}\n` +
      `🧭 *Cómo Llegar:* ${ticket.locationGuide || 'Recepción de Planta Baja'}\n\n` +
      `📍 *Dirección:* Av. Busch esq. Nicolás Suárez, Trinidad\n` +
      `⚠️ *Nota:* Presentarse 15 minutos antes en recepción con carnet de identidad.`
    );
    window.open(`https://wa.me/591${ticket.patientPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Enviar Comprobante / Voucher directamente al Administrador
  const handleSendVoucherToAdmin = (ticket) => {
    const text = encodeURIComponent(
      `🔔 *COMPROBANTE DE PAGO DE CONSULTA - CLÍNICA VELASCO*\n` +
      `Atención: Administración / Control de Turnos\n\n` +
      `🎫 *Ficha:* ${ticket.id}\n` +
      `👤 *Paciente:* ${ticket.patientName}\n` +
      `📱 *Contacto Paciente:* ${ticket.patientPhone}\n` +
      `🩺 *Especialidad:* ${ticket.specialty}\n` +
      `👨‍⚕️ *Médico:* ${ticket.doctor}\n` +
      `📅 *Fecha y Hora:* ${ticket.date} - ${ticket.hour}\n` +
      `💳 *Nº Voucher / Referencia:* ${ticket.voucherRef || 'Adjunto en esta conversación'}\n\n` +
      `Por favor confirmar la recepción y verificación del pago para el ingreso a consultorio.`
    );
    window.open(`https://wa.me/59169400096?text=${text}`, '_blank');
  };

  // Emergency Option A: WhatsApp ambulance & register in Guardia (con Geolocalización HTML5)
  const handleEmergencyAmbulanceWhatsApp = () => {
    const patientStr = userProfile ? userProfile.name : 'Paciente Urgente (Sin registro)';
    const phoneStr = userProfile ? userProfile.phone : (unregisteredPhone.trim() || '69400096');

    // Función interna para abrir WhatsApp y registrar alerta en Guardia
    const triggerDispatch = (mapsUrl = null) => {
      setIsLocating(false);

      // Registrar alerta en el Monitor de Guardia
      const newAlert = {
        id: `UTI-${Math.floor(100 + Math.random() * 900)}`,
        type: 'ambulancia',
        patientName: patientStr,
        phone: phoneStr,
        symptom: 'Solicitud de Ambulancia UTI (Gravedad Alta)',
        estimatedTime: 'Salida inmediata',
        timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Despachada / En camino',
        locationUrl: mapsUrl || null
      };
      setEmergencyAlerts(prev => [newAlert, ...prev]);

      let textContent = '';
      if (mapsUrl) {
        textContent =
          `🚨 *EMERGENCIA MÉDICA: AMBULANCIA UTI URGENTE*\n` +
          `Clínica Velasco (Trinidad, Beni)\n\n` +
          `👤 *Paciente:* ${patientStr}\n` +
          `📱 *Teléfono de Contacto:* ${phoneStr}\n` +
          `⚠️ *Gravedad:* Alta. Solicito despacho inmediato de ambulancia UTI con soporte vital.\n\n` +
          `📍 *Mi ubicación exacta en el mapa es:*\n${mapsUrl}`;
      } else {
        textContent =
          `🚨 *EMERGENCIA MÉDICA: AMBULANCIA UTI URGENTE*\n` +
          `Clínica Velasco (Trinidad, Beni)\n\n` +
          `👤 *Paciente:* ${patientStr}\n` +
          `📱 *Teléfono de Contacto:* ${phoneStr}\n` +
          `⚠️ *Gravedad:* Alta. Requiero ambulancia con soporte vital en Trinidad en mi ubicación actual.\n` +
          `*(Ubicación GPS no disponible, por favor contactar de inmediato a este número).*`;
      }

      window.open(`https://wa.me/59169400096?text=${encodeURIComponent(textContent)}`, '_blank');
    };

    // 1. Verificar si el navegador soporta Geolocation
    if (!navigator.geolocation) {
      setLocationStatusMsg('Geolocalización no soportada por el navegador. Enviando reporte directo...');
      triggerDispatch(null);
      return;
    }

    setIsLocating(true);
    setLocationStatusMsg('Obteniendo coordenadas GPS en tiempo real...');

    // Opciones de alta precisión con timeout rápido
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        setLocationStatusMsg('¡Ubicación GPS obtenida! Abriendo WhatsApp...');
        triggerDispatch(mapsLink);
      },
      (error) => {
        console.warn('Error u omisión de geolocalización:', error);
        setLocationStatusMsg('Permiso de GPS omitido o no disponible. Enviando reporte...');
        // Respaldo inmediato sin bloquear el flujo de emergencia
        triggerDispatch(null);
      },
      geoOptions
    );
  };

  // Emergency Option B: "Voy en camino" Pre-alerta
  const handleSendPreAlert = () => {
    const patientStr = userProfile ? userProfile.name : 'Paciente en Camino (Sin registro)';
    const phoneStr = userProfile ? userProfile.phone : (unregisteredPhone.trim() || 'No registrado');

    // Register alert for Guardia
    const newAlert = {
      id: `AVS-${Math.floor(100 + Math.random() * 900)}`,
      type: 'camino',
      patientName: patientStr,
      phone: phoneStr,
      symptom: emergencyReason,
      estimatedTime: estimatedArrival,
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'En camino'
    };
    setEmergencyAlerts(prev => [newAlert, ...prev]);

    const text = encodeURIComponent(
      `🚨 *PRE-AVISO DE LLEGADA A EMERGENCIAS - CLÍNICA VELASCO*\n` +
      `Trinidad, Beni\n\n` +
      `👤 *Paciente:* ${patientStr}\n` +
      `📱 *Contacto:* ${phoneStr}\n` +
      `🩺 *Motivo:* ${emergencyReason}\n` +
      `⏱️ *Tiempo estimado de llegada:* ${estimatedArrival}\n\n` +
      `⚠️ *Estado:* Vamos en camino particular a la clínica. Por favor alertar a la guardia médica.`
    );

    setPreAlertSuccess(true);
    window.open(`https://wa.me/59169400096?text=${text}`, '_blank');
  };

  // Admin: Confirm payment voucher
  const handleAdminVerifyPayment = (ticketId) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === ticketId) {
        return { ...app, paymentStatus: 'Verificado y Aprobado' };
      }
      return app;
    }));
  };

  // Admin: Update a specialty field
  const handleAdminUpdateSpecialty = (specId, field, value) => {
    setSpecialtiesList(prev => prev.map(s => {
      if (s.id === specId) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  // Admin: Add hour to a specialty
  const handleAdminAddHour = (specId) => {
    if (!newHourInput.trim()) return;
    setSpecialtiesList(prev => prev.map(s => {
      if (s.id === specId && !s.hours.includes(newHourInput.trim())) {
        return { ...s, hours: [...s.hours, newHourInput.trim()] };
      }
      return s;
    }));
    setNewHourInput('');
  };

  // Admin: Remove hour from a specialty
  const handleAdminRemoveHour = (specId, hr) => {
    setSpecialtiesList(prev => prev.map(s => {
      if (s.id === specId) {
        return { ...s, hours: s.hours.filter(h => h !== hr) };
      }
      return s;
    }));
  };

  // Guardia: Update Alert Status
  const handleGuardiaReceivePatient = (alertId) => {
    setEmergencyAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'Recibido en Box' };
      }
      return a;
    }));
  };

  // Filter appointments for Doctor Panel
  const doctorAppointments = appointments.filter(a => a.doctor === selectedDoctorId);

  return (
    <div className="min-h-screen bg-clinic-pearl flex flex-col justify-between selection:bg-clinic-emerald selection:text-white">
      
      {/* ========================================================
          BARRA SUPERIOR GLOBAL CON LOGO, SALIR Y ROL DE PERSONAL
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft-sm">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Logo brand (Click takes patient to home) */}
          <div 
            onClick={() => { 
              if (systemRole === 'paciente') {
                setActiveTab('inicio'); 
                setEmergencySubMode(null); 
              }
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <VelascoLogo iconOnly={false} className="h-9 sm:h-10" />
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 1. Botón visible de Salir / Cerrar Sesión (Para Paciente) */}
            {systemRole === 'paciente' && userProfile && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 pl-3 pr-1.5 py-1 rounded-full text-xs shadow-soft-sm">
                <span className="font-semibold text-slate-700 hidden sm:inline">
                  Hola, <strong className="text-clinic-dark">{userProfile.name.split(' ')[0]}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors cursor-pointer border border-red-200/60"
                  title="Cerrar sesión del paciente"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Salir</span>
                </button>
              </div>
            )}

            {/* 2. Botón Selector de Rol / Modo Personal Clínico */}
            <button
              onClick={() => setShowRoleSelectorModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                systemRole === 'paciente'
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-soft-sm'
                  : 'bg-clinic-dark text-white border-clinic-dark shadow-md ring-2 ring-clinic-emerald/30'
              }`}
              title="Cambiar entre Vista Paciente y Paneles del Personal"
            >
              <Shield className={`w-3.5 h-3.5 ${systemRole === 'paciente' ? 'text-clinic-emerald' : 'text-emerald-400'}`} />
              <span className="hidden md:inline">
                {systemRole === 'paciente' ? 'Acceso Personal / Admin' : `Rol: ${systemRole.toUpperCase()}`}
              </span>
              <span className="md:hidden">
                {systemRole === 'paciente' ? 'Staff' : systemRole.slice(0, 3).toUpperCase()}
              </span>
            </button>

            {/* 3. Botón de Emergencia SOS 24h siempre accesible */}
            <button
              onClick={() => { 
                setSystemRole('paciente');
                setActiveTab('emergencia'); 
                setEmergencySubMode(null); 
                setPreAlertSuccess(false); 
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-clinic-red hover:bg-clinic-redHover text-white text-xs sm:text-sm font-black rounded-2xl shadow-emergency-glow active:scale-95 transition-all cursor-pointer"
            >
              <Siren className="w-4 h-4 animate-pulse" />
              <span>🚨 SOS 24h</span>
            </button>

          </div>

        </div>
      </header>

      {/* ========================================================
          MODAL SELECTOR DE ROL (4 VISTAS DEL SISTEMA)
         ======================================================== */}
      {showRoleSelectorModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-slide-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-clinic-light flex items-center justify-center text-clinic-dark">
                  <ShieldCheck className="w-5 h-5 text-clinic-emerald" />
                </div>
                <div>
                  <h3 className="text-base font-display font-extrabold text-slate-900">
                    Modo Operativo del Sistema
                  </h3>
                  <p className="text-xs text-slate-500">Selecciona el perfil de trabajo</p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleSelectorModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Opción 1: Vista Paciente */}
              <button
                onClick={() => { setSystemRole('paciente'); setShowRoleSelectorModal(false); }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  systemRole === 'paciente'
                    ? 'bg-clinic-light border-clinic-emerald text-clinic-dark font-extrabold shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-clinic-emerald" />
                  <div>
                    <span className="block text-sm font-bold">Vista Paciente (App Normal)</span>
                    <span className="text-[11px] text-slate-500 block">Agendamiento guiado y solicitudes de auxilio</span>
                  </div>
                </div>
                {systemRole === 'paciente' && <Check className="w-4 h-4 text-clinic-emerald" />}
              </button>

              {/* Opción 2: Panel Admin */}
              <button
                onClick={() => { setSystemRole('admin'); setShowRoleSelectorModal(false); }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  systemRole === 'admin'
                    ? 'bg-clinic-light border-clinic-emerald text-clinic-dark font-extrabold shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-clinic-dark" />
                  <div>
                    <span className="block text-sm font-bold">Panel Admin (Gestión & Consultorios)</span>
                    <span className="text-[11px] text-slate-500 block">Médicos de turno, estados y guía de ubicación</span>
                  </div>
                </div>
                {systemRole === 'admin' && <Check className="w-4 h-4 text-clinic-emerald" />}
              </button>

              {/* Opción 3: Panel Médico */}
              <button
                onClick={() => { setSystemRole('medico'); setShowRoleSelectorModal(false); }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  systemRole === 'medico'
                    ? 'bg-clinic-light border-clinic-emerald text-clinic-dark font-extrabold shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-5 h-5 text-clinic-emerald" />
                  <div>
                    <span className="block text-sm font-bold">Panel Médico (Consultorio en Vivo)</span>
                    <span className="text-[11px] text-slate-500 block">Llamar pacientes a puerta y marcar atendidos</span>
                  </div>
                </div>
                {systemRole === 'medico' && <Check className="w-4 h-4 text-clinic-emerald" />}
              </button>

              {/* Opción 4: Monitor de Guardia */}
              <button
                onClick={() => { setSystemRole('guardia'); setShowRoleSelectorModal(false); }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  systemRole === 'guardia'
                    ? 'bg-red-50 border-red-500 text-red-900 font-extrabold shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Siren className="w-5 h-5 text-red-600" />
                  <div>
                    <span className="block text-sm font-bold">Monitor de Guardia de Emergencias</span>
                    <span className="text-[11px] text-slate-500 block">Recepción de pre-avisos y ambulancia UTI 24h</span>
                  </div>
                </div>
                {systemRole === 'guardia' && <Check className="w-4 h-4 text-red-600" />}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          VISTA 1: VISTA PACIENTE (APP NORMAL MINIMALISTA)
         ======================================================== */}
      {systemRole === 'paciente' && (
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">

          {/* PASO 1: PANTALLA DE INGRESO / REGISTRO RÁPIDO */}
          {!userProfile && (
            <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-xl text-center space-y-6">
                
                <div className="w-16 h-16 rounded-3xl bg-clinic-light flex items-center justify-center mx-auto text-clinic-dark">
                  <ShieldCheck className="w-9 h-9 text-clinic-emerald" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-widest text-clinic-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
                    Trinidad, Beni • Bolivia
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                    Bienvenido a Clínica Velasco
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Ingresa tus datos una sola vez para agendar turnos y acceder a atención médica personalizada.
                  </p>
                </div>

                <form onSubmit={handleRegisterUser} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="Ej. Juan Carlos Suárez"
                        className="w-full pl-10 pr-3 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinic-emerald transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Número de Celular (WhatsApp)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)}
                        placeholder="Ej. 728-12345"
                        className="w-full pl-10 pr-3 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinic-emerald transition-all"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1.5 p-3 rounded-xl bg-red-50 border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-clinic-emerald hover:bg-clinic-emeraldHover text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-emerald-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Continuar a Atención Médica</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              </div>

              {/* Botón directo de emergencia si el paciente no tiene tiempo de registrarse */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setActiveTab('emergencia'); setEmergencySubMode(null); }}
                  className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-white border border-red-200 hover:bg-red-50 text-clinic-red text-xs sm:text-sm font-extrabold shadow-soft-sm transition-all cursor-pointer"
                >
                  <Siren className="w-4 h-4 text-clinic-red animate-pulse" />
                  <span>¿Es una urgencia crítica? 🚨 EMERGENCIA INMEDIATA</span>
                </button>
              </div>

            </div>
          )}

          {/* PASO 2: PANEL PRINCIPAL ("¿Qué atención necesitas hoy?") */}
          {userProfile && activeTab === 'inicio' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Header Greeting & Patient Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Panel del Paciente
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Hola, <span className="text-clinic-dark">{userProfile.name}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ¿Qué atención médica necesitas hoy en Trinidad?
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200/80 transition-colors shadow-soft-sm cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>

              {/* Botón / Tarjeta Destacada de Emergencia */}
              <div 
                onClick={() => { setActiveTab('emergencia'); setEmergencySubMode(null); }}
                className="group bg-gradient-to-r from-red-600 via-red-700 to-rose-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg hover:shadow-red-600/30 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-500 active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Siren className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                        Guardia Activa 24/7
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-black/20 px-2 py-0.5 rounded-full">
                        {ambulanceStatus === 'disponible' ? '🟢 Ambulancia en Base' : '🔴 Ambulancia en Operativo'}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-black leading-tight">
                      🚨 EMERGENCIA 24 HORAS
                    </h3>
                    <p className="text-xs sm:text-sm text-red-100 font-medium mt-0.5">
                      Ambulancia UTI a domicilio o pre-aviso de llegada inmediata a guardia.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center bg-white text-red-600 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-sm group-hover:bg-red-50 transition-colors">
                  <span>Ingresar</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Especialidades configuradas por el Admin */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900">
                      Agendar Consulta por Especialidad
                    </h3>
                    <p className="text-xs text-slate-500">
                      Selecciona un área médica para ver consultorio y turnos disponibles
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specialtiesList.map((spec) => (
                    <div
                      key={spec.id}
                      onClick={() => handleOpenSpecialtyBooking(spec)}
                      className="bg-white hover:bg-emerald-50/40 rounded-3xl p-5 border border-slate-200/90 hover:border-clinic-emerald/50 shadow-soft-sm hover:shadow-soft-md transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-clinic-light text-clinic-dark flex items-center justify-center shrink-0 group-hover:bg-clinic-emerald group-hover:text-white transition-colors">
                          {getSpecialtyIcon(spec.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-base text-slate-900 group-hover:text-clinic-dark transition-colors">
                              {spec.name}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {spec.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {spec.doctor}
                          </p>
                          <p className="text-[11px] text-clinic-emerald font-semibold flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{spec.room}</span>
                          </p>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-clinic-emerald group-hover:text-white text-slate-400 flex items-center justify-center transition-all shrink-0">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* PASO 3: MÓDULO DE EMERGENCIA INTELIGENTE (2 OPCIONES) */}
          {activeTab === 'emergencia' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
                  CENTRAL DE ATENCIÓN DE URGENCIAS
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                  ¿Qué tipo de auxilio necesitas?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Selecciona la modalidad para activar de inmediato el protocolo médico en Trinidad.
                </p>
              </div>

              {!emergencySubMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  
                  {/* OPCIÓN A: Ambulancia UTI */}
                  <div 
                    onClick={() => setEmergencySubMode('ambulancia')}
                    className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 hover:border-red-500 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Ambulance className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block mb-1">
                          Gravedad Alta
                        </span>
                        <h3 className="text-xl font-display font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
                          🚑 Solicitar Ambulancia UTI
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                          Para pacientes que <strong>no pueden trasladarse</strong>. Envío de unidad de soporte vital con médico a bordo.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-red-600">
                      <span>Llamada y GPS inmediato</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* OPCIÓN B: Voy en Camino */}
                  <div 
                    onClick={() => { setEmergencySubMode('camino'); setPreAlertSuccess(false); }}
                    className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 hover:border-clinic-emerald shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-clinic-emerald flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Car className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                          Traslado Particular
                        </span>
                        <h3 className="text-xl font-display font-extrabold text-slate-900 group-hover:text-clinic-dark transition-colors">
                          🚗 Voy en Camino a Emergencias
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                          Para emergencias donde el paciente <strong>se traslada en vehículo propio</strong> y desea alertar a la guardia antes de llegar.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-clinic-dark">
                      <span>Pre-avisar a la guardia médica</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-VISTA: Ambulancia UTI */}
              {emergencySubMode === 'ambulancia' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-soft-xl space-y-6 animate-fade-in max-w-xl mx-auto">
                  <button
                    onClick={() => setEmergencySubMode(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    ← Volver a opciones
                  </button>

                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-pulse">
                      <Ambulance className="w-9 h-9" />
                    </div>
                    <h3 className="text-2xl font-display font-extrabold text-slate-900">
                      Despacho de Ambulancia UTI
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Base Central Clínica Velasco (Trinidad, Beni). Unidad equipada con soporte vital avanzado.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a
                      href="tel:+59169400096"
                      className="flex items-center justify-center gap-3 w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-2xl shadow-emergency-glow active:scale-95 transition-all text-center"
                    >
                      <PhoneCall className="w-5 h-5 animate-bounce" />
                      <span>Llamar Directo al 69400096</span>
                    </a>

                    {/* Si no está registrado, pedir teléfono rápido de contacto opcional */}
                    {!userProfile && (
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Tu número de celular para que la ambulancia te contacte:
                        </label>
                        <input
                          type="tel"
                          value={unregisteredPhone}
                          onChange={(e) => setUnregisteredPhone(e.target.value)}
                          placeholder="Ej. 69400096"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleEmergencyAmbulanceWhatsApp}
                      disabled={isLocating}
                      className={`flex items-center justify-center gap-2.5 w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md active:scale-95 transition-all ${
                        isLocating ? 'opacity-80 cursor-wait' : 'cursor-pointer'
                      }`}
                    >
                      {isLocating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Obteniendo Ubicación GPS...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-emerald-200 animate-bounce" />
                          <span>Enviar Ubicación por WhatsApp</span>
                        </>
                      )}
                    </button>

                    {locationStatusMsg && (
                      <p className="text-[11px] text-slate-500 text-center animate-fade-in font-medium">
                        {locationStatusMsg}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1 text-center">
                    <p className="font-bold text-slate-800">Estado de Unidad: {ambulanceStatus === 'disponible' ? '🟢 Alfa-01 Lista en Base' : '🔴 Alfa-01 en Operativo'}</p>
                    <p className="text-[11px] text-slate-500">Tiempo de arribo estimado en radio urbano: 5 a 8 minutos.</p>
                  </div>
                </div>
              )}

              {/* SUB-VISTA: Voy en Camino */}
              {emergencySubMode === 'camino' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-xl space-y-6 animate-fade-in max-w-xl mx-auto">
                  <button
                    onClick={() => setEmergencySubMode(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    ← Volver a opciones
                  </button>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                      Pre-Aviso de Llegada a Guardia
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Indica el motivo y tiempo estimado para que el equipo médico te espere en recepción sin demoras.
                    </p>
                  </div>

                  {!preAlertSuccess ? (
                    <div className="space-y-4">
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Motivo principal de urgencia:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {EMERGENCY_REASONS.map((reason) => (
                            <button
                              type="button"
                              key={reason}
                              onClick={() => setEmergencyReason(reason)}
                              className={`p-3 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                                emergencyReason === reason
                                  ? 'bg-clinic-dark text-white border-clinic-dark shadow-sm'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {reason}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Timer className="w-4 h-4 text-clinic-emerald" />
                          Tiempo estimado de llegada:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {ARRIVAL_TIMES.map((time) => (
                            <button
                              type="button"
                              key={time}
                              onClick={() => setEstimatedArrival(time)}
                              className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                                estimatedArrival === time
                                  ? 'bg-clinic-emerald text-white border-clinic-emerald shadow-sm'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Si no está registrado previamente, pedir celular rápido */}
                      {!userProfile && (
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left space-y-1">
                          <label className="block text-[11px] font-bold text-slate-700">
                            Número de Celular para registrar tu llegada en recepción:
                          </label>
                          <input
                            type="tel"
                            value={unregisteredPhone}
                            onChange={(e) => setUnregisteredPhone(e.target.value)}
                            placeholder="Ej. 69400096"
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleSendPreAlert}
                        className="w-full py-4 bg-clinic-emerald hover:bg-clinic-emeraldHover text-white font-black text-sm sm:text-base rounded-2xl shadow-emerald-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                      >
                        <Send className="w-5 h-5" />
                        <span>Avisar al Área de Emergencias que estoy yendo</span>
                      </button>

                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4 animate-fade-in">
                      <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-extrabold text-emerald-950 font-display">
                          ¡Alerta enviada a la guardia!
                        </h4>
                        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                          El equipo de guardia del <strong>Dr. Suárez</strong> ya fue alertado de tu llegada ({estimatedArrival}) y te está esperando en la recepción de Emergencias de la Clínica Velasco.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => { setActiveTab('inicio'); setEmergencySubMode(null); }}
                          className="py-2.5 px-6 bg-clinic-dark text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Volver al Inicio
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* PESTAÑA: MIS TURNOS */}
          {userProfile && activeTab === 'turnos' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                    Mis Turnos Médicos
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consultas programadas para {userProfile.name}
                  </p>
                </div>

                <span className="text-xs font-black px-3 py-1 rounded-full bg-clinic-light text-clinic-dark">
                  {appointments.length} Cita{appointments.length === 1 ? '' : 's'}
                </span>
              </div>

              {appointments.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-soft-sm space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-slate-800">No tienes citas médicas activas</p>
                    <p className="text-xs text-slate-500">
                      Elige una especialidad para agendar tu consulta de forma inmediata.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inicio')}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-clinic-emerald hover:bg-clinic-emeraldHover text-white rounded-2xl text-xs sm:text-sm font-bold shadow-emerald-glow transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agendar Cita Ahora</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-black text-clinic-emerald tracking-wider uppercase bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                            Ficha {ticket.id}
                          </span>
                          <div className="text-right">
                            <span className="text-xs font-black text-clinic-dark bg-clinic-light px-2.5 py-1 rounded-xl inline-block">
                              {ticket.hour}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-1">
                              {ticket.date}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                            {ticket.specialty}
                          </h3>
                          <p className="text-xs text-slate-600 font-semibold mt-0.5">
                            {ticket.doctor}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            🚪 {ticket.room}
                          </p>
                          
                          {/* Guía de ubicación para orientar al paciente */}
                          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2">
                            <Compass className="w-4 h-4 text-clinic-dark shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-slate-900">Cómo llegar al consultorio:</strong>
                              <span>{ticket.locationGuide || 'Consultar en recepción principal de Planta Baja.'}</span>
                            </div>
                          </div>

                          {/* Estado del voucher y verificación */}
                          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 font-semibold flex items-center gap-1">
                                <Receipt className="w-3.5 h-3.5 text-clinic-emerald" />
                                Comprobante:
                              </span>
                              <span className="font-bold text-slate-800">{ticket.voucherRef || 'Registrado'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 font-semibold">Estado de Pago:</span>
                              <span className={`font-extrabold ${ticket.paymentStatus === 'Verificado y Aprobado' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {ticket.paymentStatus || 'Pendiente de Verificación Admin'}
                              </span>
                            </div>
                          </div>

                          {/* Estado del turno en vivo */}
                          {ticket.status && (
                            <div className="mt-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ticket.status.includes('Llamando')
                                  ? 'bg-amber-100 text-amber-900 animate-pulse border border-amber-300'
                                  : ticket.status === 'Atendido'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                Estado: {ticket.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <button
                          onClick={() => handleSendVoucherToAdmin(ticket)}
                          className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-clinic-emerald text-white hover:bg-clinic-emeraldHover font-bold text-xs transition-colors cursor-pointer shadow-soft-sm"
                          title="Enviar comprobante al administrador por WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Voucher al Admin</span>
                        </button>
                        <button
                          onClick={() => handleShareWhatsAppTicket(ticket)}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
                          title="Compartir o guardar comprobante"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Ver Ficha</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      )}

      {/* ========================================================
          PANEL 1: ADMINISTRADOR (CONFIGURACIÓN EN VIVO)
         ======================================================== */}
      {systemRole === 'admin' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-clinic-dark text-white flex items-center justify-center">
                <Settings className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-clinic-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                  Área Administrativa
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Gestión de Médicos, Consultorios y Guía de Pacientes
                </h2>
                <p className="text-xs text-slate-500">
                  Los cambios que realices aquí impactan inmediatamente en la Vista Paciente.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSystemRole('paciente')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Ver como Paciente</span>
            </button>
          </div>

          {/* SECCIÓN NUEVA: CONTROL Y VERIFICACIÓN DE CITAS Y PAGOS EN TIEMPO REAL */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-clinic-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                  Control de Caja y Admisión
                </span>
                <h3 className="text-lg font-display font-extrabold text-slate-900 mt-1">
                  Citas Agendadas y Verificación de Comprobantes
                </h3>
                <p className="text-xs text-slate-500">
                  Lista en vivo de turnos solicitados para validar pagos y orientar al paciente al llegar.
                </p>
              </div>
              <span className="self-start sm:self-center text-xs font-black px-3 py-1 rounded-full bg-clinic-light text-clinic-dark">
                {appointments.length} Cita{appointments.length === 1 ? '' : 's'} Registrada{appointments.length === 1 ? '' : 's'}
              </span>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No hay citas registradas en el sistema actualmente.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Ficha</th>
                      <th className="py-2.5 px-3">Paciente / Celular</th>
                      <th className="py-2.5 px-3">Especialidad / Médico</th>
                      <th className="py-2.5 px-3">Fecha y Hora</th>
                      <th className="py-2.5 px-3">Comprobante Voucher</th>
                      <th className="py-2.5 px-3">Estado de Pago</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-extrabold text-clinic-dark whitespace-nowrap">
                          {app.id}
                        </td>
                        <td className="py-3 px-3">
                          <strong className="block text-slate-900">{app.patientName}</strong>
                          <span className="text-slate-500 text-[11px]">{app.patientPhone}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800">{app.specialty}</span>
                          <span className="block text-[11px] text-slate-500">{app.doctor} ({app.room})</span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-bold text-clinic-emerald">{app.hour}</span>
                          <span className="block text-[11px] text-slate-400">{app.date}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg text-[11px]">
                            <Receipt className="w-3 h-3 text-clinic-emerald" />
                            {app.voucherRef || 'Sin comprobante'}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            app.paymentStatus === 'Verificado y Aprobado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {app.paymentStatus || 'Pendiente de Verificación'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {app.paymentStatus !== 'Verificado y Aprobado' ? (
                            <button
                              onClick={() => handleAdminVerifyPayment(app.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all cursor-pointer"
                            >
                              ✓ Aprobar Pago
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {specialtiesList.map((spec) => (
              <div 
                key={spec.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-clinic-light text-clinic-dark flex items-center justify-center">
                      {getSpecialtyIcon(spec.icon, "w-5 h-5")}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{spec.name}</h3>
                      <span className="text-[11px] text-slate-400">{spec.subRole}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {spec.status}
                  </span>
                </div>

                {/* Edit Fields */}
                <div className="space-y-3 text-xs">
                  
                  {/* Doctor Name */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">Médico de Turno:</label>
                    <input
                      type="text"
                      value={spec.doctor}
                      onChange={(e) => handleAdminUpdateSpecialty(spec.id, 'doctor', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                    />
                  </div>

                  {/* Estado Médico */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">Estado del Médico:</label>
                    <select
                      value={spec.status}
                      onChange={(e) => handleAdminUpdateSpecialty(spec.id, 'status', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                    >
                      <option value="🟢 Atendiendo Ahora">🟢 Atendiendo Ahora</option>
                      <option value="🟡 En Cirugía / Pausa">🟡 En Cirugía / Pausa</option>
                      <option value="🔴 Fuera de Turno">🔴 Fuera de Turno</option>
                    </select>
                  </div>

                  {/* Consultorio / Oficina */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">Consultorio / Oficina Asignada:</label>
                    <input
                      type="text"
                      value={spec.room}
                      onChange={(e) => handleAdminUpdateSpecialty(spec.id, 'room', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                    />
                  </div>

                  {/* Guía de Ubicación para el Paciente */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-clinic-emerald" />
                      Guía de Ubicación (Orientación al Paciente):
                    </label>
                    <textarea
                      rows={2}
                      value={spec.locationGuide}
                      onChange={(e) => handleAdminUpdateSpecialty(spec.id, 'locationGuide', e.target.value)}
                      placeholder="Ej. Planta Baja, Pasillo Derecho al lado de Farmacia..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                    />
                  </div>

                  {/* Horarios de Atención */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <label className="block font-bold text-slate-700">Horarios Habilitados:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.hours.map((hr) => (
                        <span 
                          key={hr} 
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-clinic-light text-clinic-dark rounded-lg text-[11px] font-bold"
                        >
                          {hr}
                          <button
                            onClick={() => handleAdminRemoveHour(spec.id, hr)}
                            className="text-red-500 hover:text-red-700 ml-0.5 cursor-pointer"
                            title="Quitar horario"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Agregar nuevo horario */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Ej. 11:45"
                        value={editingSpecialtyId === spec.id ? newHourInput : ''}
                        onFocus={() => setEditingSpecialtyId(spec.id)}
                        onChange={(e) => { setEditingSpecialtyId(spec.id); setNewHourInput(e.target.value); }}
                        className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdminAddHour(spec.id)}
                        className="px-3 py-1.5 bg-clinic-emerald text-white font-bold rounded-lg text-xs hover:bg-clinic-emeraldHover cursor-pointer"
                      >
                        + Agregar Hora
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </main>
      )}

      {/* ========================================================
          PANEL 2: MÉDICO (VISTA DE CONSULTORIO EN VIVO)
         ======================================================== */}
      {systemRole === 'medico' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-clinic-dark text-white flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-clinic-emerald" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-clinic-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                  Pabellón de Consultorios
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Panel de Atención Médica en Consultorio
                </h2>
                <p className="text-xs text-slate-500">
                  Gestión de pacientes en espera, llamado a puerta y confirmación de atención.
                </p>
              </div>
            </div>

            {/* Selector de Médico Activo */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 pl-2">Médico:</span>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-dark focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
              >
                {specialtiesList.map(s => (
                  <option key={s.doctor} value={s.doctor}>{s.doctor} ({s.name})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Pacientes para este médico */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Pacientes Agendados para {selectedDoctorId}
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {doctorAppointments.length} Pacientes en Agenda
              </span>
            </div>

            {doctorAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-400" />
                <p className="font-bold text-sm text-slate-800">No hay pacientes agendados actualmente para este consultorio.</p>
                <p className="text-xs">Los turnos reservados desde la Vista Paciente aparecerán aquí en tiempo real.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctorAppointments.map((app) => (
                  <div
                    key={app.id}
                    className={`bg-white rounded-3xl p-5 border shadow-soft-sm space-y-4 flex flex-col justify-between transition-all ${
                      app.status?.includes('Llamando')
                        ? 'border-amber-400 ring-2 ring-amber-200'
                        : app.status === 'Atendido'
                        ? 'border-slate-200 opacity-75 bg-slate-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-black text-clinic-dark bg-clinic-light px-2.5 py-0.5 rounded-lg">
                            Ficha {app.id}
                          </span>
                          <span className="text-xs font-bold text-slate-400 block mt-1">
                            Hora citada: <strong className="text-slate-800">{app.hour}</strong> ({app.date})
                          </span>
                        </div>

                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          app.status?.includes('Llamando')
                            ? 'bg-amber-100 text-amber-900 animate-pulse'
                            : app.status === 'Atendido'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status || 'En espera'}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">{app.patientName}</h4>
                        <p className="text-xs text-slate-500">Tel: {app.patientPhone}</p>
                        <p className="text-[11px] text-clinic-dark font-semibold mt-1">
                          Consultorio: {app.room}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción médica */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleDoctorCallPatient(app.id, app.room)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                        title="Llama al paciente para que ingrese a consulta"
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>📢 Llamar a Puerta</span>
                      </button>

                      <button
                        onClick={() => handleDoctorMarkAttended(app.id)}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                        title="Marca la consulta como finalizada"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>✅ Atendido</span>
                      </button>

                      <button
                        onClick={() => {
                          const msg = encodeURIComponent(`Hola ${app.patientName}, le habla el consultorio de ${app.doctor} en Clínica Velasco. Su turno (${app.hour}) está listo.`);
                          window.open(`https://wa.me/591${app.patientPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                        }}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="Contactar al WhatsApp del paciente"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      )}

      {/* ========================================================
          PANEL 3: MONITOR DE GUARDIA DE EMERGENCIAS (EN VIVO)
         ======================================================== */}
      {systemRole === 'guardia' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full inline-block">
                  Central de Trauma & Triaje 24H
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Monitor de Guardia y Despacho de Emergencias
                </h2>
                <p className="text-xs text-slate-500">
                  Recepción de pre-avisos de pacientes en camino y despacho de Ambulancia UTI.
                </p>
              </div>
            </div>

            {/* Interruptor Estado de Ambulancia Alfa-01 */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Móvil UTI Alfa-01:</span>
              <button
                onClick={() => setAmbulanceStatus(prev => prev === 'disponible' ? 'operativo' : 'disponible')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  ambulanceStatus === 'disponible'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-red-600 text-white shadow-sm animate-pulse'
                }`}
              >
                {ambulanceStatus === 'disponible' ? '🟢 En Base (Disponible)' : '🔴 En Operativo (Ocupada)'}
              </button>
            </div>
          </div>

          {/* Listado en vivo de Alertas de Emergencia */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Alertas y Notificaciones de Emergencia Activas
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800">
                {emergencyAlerts.length} Evento{emergencyAlerts.length === 1 ? '' : 's'}
              </span>
            </div>

            {emergencyAlerts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="font-bold text-sm text-slate-800">Sin alertas de emergencias pendientes en este momento.</p>
                <p className="text-xs">Los pre-avisos de los pacientes se reflejarán inmediatamente en esta pantalla.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-white rounded-3xl p-5 border shadow-soft-sm space-y-4 flex flex-col justify-between ${
                      alert.type === 'ambulancia'
                        ? 'border-red-300 bg-red-50/20'
                        : 'border-emerald-300 bg-emerald-50/20'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg uppercase ${
                          alert.type === 'ambulancia'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {alert.type === 'ambulancia' ? '🚑 Despacho UTI' : '🚗 Pre-Aviso en Camino'}
                        </span>
                        
                        <span className="text-xs font-bold text-slate-400">
                          {alert.timeStr || 'Ahora'}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">{alert.patientName}</h4>
                        <p className="text-xs font-bold text-red-600 mt-0.5">Motivo: {alert.symptom}</p>
                        <p className="text-xs text-slate-600 mt-0.5">⏱️ Arribo: <strong>{alert.estimatedTime}</strong></p>
                        <p className="text-xs text-slate-500 mt-0.5">Tel: {alert.phone}</p>
                        {alert.locationUrl && (
                          <p className="mt-1">
                            <a
                              href={alert.locationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-100/70 hover:bg-red-200/70 px-2 py-0.5 rounded-md transition-colors"
                            >
                              <MapPin className="w-3 h-3 text-red-600" />
                              <span>Ver Mapa GPS de Emergencia</span>
                            </a>
                          </p>
                        )}
                      </div>

                      <div className="text-xs font-bold">
                        <span className="text-slate-400">Estado actual: </span>
                        <span className={alert.status === 'Recibido en Box' ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>
                          {alert.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleGuardiaReceivePatient(alert.id)}
                        className="flex-1 py-2 px-3 bg-clinic-dark hover:bg-clinic-darkHover text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm text-center"
                      >
                        ✅ Recibir Paciente en Box
                      </button>

                      <a
                        href={`tel:${alert.phone}`}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors cursor-pointer"
                        title="Llamar al paciente"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      )}

      {/* ========================================================
          MODAL LIMPIO: SELECCIÓN DE HORA Y CONFIRMACIÓN DE CITA
         ======================================================== */}
      {selectedSpecialtyForBooking && userProfile && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-slide-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-clinic-emerald uppercase tracking-wider block">
                  Agendamiento
                </span>
                <h3 className="text-lg font-display font-extrabold text-slate-900">
                  {selectedSpecialtyForBooking.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSpecialtyForBooking(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Indicador de paciente registrado (sin volver a pedir datos) */}
            <div className="text-xs text-slate-600 font-semibold bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <span className="text-slate-500">Agendando para:</span>
              <span className="font-extrabold text-clinic-dark">
                {userProfile.name} <span className="text-slate-500 font-normal">({userProfile.phone})</span>
              </span>
            </div>

            {/* Doctor info compact */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clinic-dark text-white flex items-center justify-center font-bold text-sm shrink-0">
                CV
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {selectedSpecialtyForBooking.doctor}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedSpecialtyForBooking.room}
                </p>
                <p className="text-[11px] text-clinic-emerald font-semibold">
                  🧭 {selectedSpecialtyForBooking.locationGuide}
                </p>
              </div>
            </div>

            {/* Quick date selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Fecha de Consulta:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['Hoy', 'Mañana', 'Próx. Día'].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDateLabel(d)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDateLabel === d
                        ? 'bg-clinic-dark text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectable Hour Pills */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Selecciona la Hora:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedSpecialtyForBooking.hours.map((hr) => (
                  <button
                    type="button"
                    key={hr}
                    onClick={() => setSelectedHour(hr)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedHour === hr
                        ? 'bg-clinic-emerald text-white shadow-emerald-glow'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{hr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SECCIÓN OBLIGATORIA: COMPROBANTE DE PAGO / TRANSFERENCIA */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-300 space-y-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-clinic-emerald" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Comprobante de Pago Obligatorio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Para confirmar su turno médico debe adjuntar o ingresar el comprobante de transferencia bancaria / QR.
              </p>

              {/* Input de número de voucher o transacción */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Nº de Operación / Código de Transferencia:
                </label>
                <input
                  type="text"
                  value={voucherNumber}
                  onChange={(e) => {
                    setVoucherNumber(e.target.value);
                    if (voucherError) setVoucherError('');
                  }}
                  placeholder="Ej. OP-984321 / Ref. 44521"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                />
              </div>

              {/* Botón o input de archivo */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  O subir foto del comprobante:
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-clinic-emerald" />
                    <span className="truncate">
                      {voucherFileName ? voucherFileName : 'Seleccionar imagen o PDF'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVoucherFileName(file.name);
                          if (voucherError) setVoucherError('');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {voucherFileName && (
                    <button
                      type="button"
                      onClick={() => setVoucherFileName('')}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                      title="Quitar archivo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {voucherError && (
                <div className="flex items-center gap-1.5 p-2 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{voucherError}</span>
                </div>
              )}
            </div>

            {/* Confirm Turno Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmTurno}
                disabled={!voucherNumber.trim() && !voucherFileName.trim()}
                className={`w-full py-4 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  !voucherNumber.trim() && !voucherFileName.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
                    : 'bg-clinic-emerald hover:bg-clinic-emeraldHover shadow-emerald-glow active:scale-[0.98] cursor-pointer'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirmar Turno y Pago</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL ÉXITO DE RESERVA (TICKET CON GUÍA DE UBICACIÓN)
         ======================================================== */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-200 text-center space-y-4 animate-slide-up">
            <div className="w-14 h-14 bg-emerald-100 text-clinic-emerald rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-clinic-emerald bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ¡TURNO CONFIRMADO!
              </span>
              <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2">
                Ficha {bookingSuccessModal.id}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Clínica Velasco • Trinidad, Beni</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2 text-xs sm:text-sm border border-slate-100">
              <div className="flex justify-between pb-1 border-b border-slate-200/60">
                <span className="text-slate-500">Paciente:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.patientName}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200/60">
                <span className="text-slate-500">Especialidad:</span>
                <span className="font-bold text-clinic-dark">{bookingSuccessModal.specialty}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200/60">
                <span className="text-slate-500">Médico:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.doctor}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200/60">
                <span className="text-slate-500">Fecha y Hora:</span>
                <span className="font-bold text-clinic-emerald">{bookingSuccessModal.date} a las {bookingSuccessModal.hour}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200/60">
                <span className="text-slate-500">Consultorio:</span>
                <span className="font-bold text-slate-800">{bookingSuccessModal.room}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200/60">
                <span className="text-slate-500">Comprobante Voucher:</span>
                <span className="font-bold text-clinic-dark">{bookingSuccessModal.voucherRef}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-200/60">
                <span className="text-slate-500">Estado de Verificación:</span>
                <span className="font-bold text-amber-600">{bookingSuccessModal.paymentStatus}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block text-[11px] font-bold">Cómo llegar a su consultorio:</span>
                <span className="text-slate-800 font-semibold text-xs flex items-start gap-1 mt-0.5">
                  <Compass className="w-3.5 h-3.5 text-clinic-dark shrink-0 mt-0.5" />
                  <span>{bookingSuccessModal.locationGuide}</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => handleSendVoucherToAdmin(bookingSuccessModal)}
                className="w-full py-3.5 bg-clinic-emerald hover:bg-clinic-emeraldHover text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Comprobante al Admin por WhatsApp</span>
              </button>

              <button
                onClick={() => handleShareWhatsAppTicket(bookingSuccessModal)}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Guardar Ficha en WhatsApp Personal</span>
              </button>

              <button
                onClick={() => {
                  setBookingSuccessModal(null);
                  setActiveTab('turnos');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Ver en Mis Citas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BARRA DE NAVEGACIÓN INFERIOR (VISTA PACIENTE)
         ======================================================== */}
      {systemRole === 'paciente' && userProfile && (
        <nav className="sticky bottom-0 inset-x-0 h-16 sm:h-18 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 flex items-center justify-around z-30 shadow-lg max-w-lg mx-auto w-full sm:rounded-t-3xl">
          
          {/* Tab 1: Inicio / Atención */}
          <button
            type="button"
            onClick={() => { setActiveTab('inicio'); setEmergencySubMode(null); }}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'inicio'
                ? 'text-clinic-dark font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Calendar className={`w-5 h-5 ${activeTab === 'inicio' ? 'text-clinic-emerald' : ''}`} />
            <span className="text-[11px] leading-none">Inicio / Atención</span>
          </button>

          {/* Tab 2: Mis Turnos */}
          <button
            type="button"
            onClick={() => { setActiveTab('turnos'); setEmergencySubMode(null); }}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all relative cursor-pointer ${
              activeTab === 'turnos'
                ? 'text-clinic-dark font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <CalendarCheck className={`w-5 h-5 ${activeTab === 'turnos' ? 'text-clinic-emerald' : ''}`} />
            <span className="text-[11px] leading-none">Mis Turnos</span>
            {appointments.length > 0 && (
              <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-clinic-emerald ring-2 ring-white" />
            )}
          </button>

          {/* Tab 3: Emergencia */}
          <button
            type="button"
            onClick={() => { setActiveTab('emergencia'); setEmergencySubMode(null); setPreAlertSuccess(false); }}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'emergencia'
                ? 'text-clinic-red font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Siren className={`w-5 h-5 ${activeTab === 'emergencia' ? 'text-clinic-red animate-pulse' : ''}`} />
            <span className="text-[11px] leading-none">Emergencia</span>
          </button>

        </nav>
      )}

    </div>
  );
}
