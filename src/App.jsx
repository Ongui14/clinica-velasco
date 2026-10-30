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
  Download,
  CheckCircle,
  FileText,
  History,
  QrCode,
  Image as ImageIcon,
  FileSpreadsheet,
  Layers,
  ClipboardList,
  Printer,
  DollarSign,
  Wallet,
  TrendingUp,
  BarChart3,
  CalendarRange
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
    price: 150,
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
    price: 180,
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
    price: 250,
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
    price: 300,
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
const LOCAL_STORAGE_MEDICAL_HISTORY_KEY = 'clinica_velasco_historial_medico';
const LOCAL_STORAGE_QR_CONFIG_KEY = 'clinica_velasco_qr_config';

// Registros de demostración iniciales de Historial Clínico Unificado
const INITIAL_MEDICAL_HISTORY = [
  {
    id: 'HC-001',
    patientName: 'Ejemplo Paciente',
    patientPhone: '72812345',
    date: '14 de Octubre, 2026',
    time: '16:30',
    specialty: 'Ginecología y Obstetricia',
    doctor: 'Dra. Carmen Mendoza',
    diagnosis: 'Control posparto favorable. Paciente refiere episodios aislados de taquicardia diurna y fatiga moderada sin disnea.',
    referralNotes: 'Se deriva a Cardiología / Medicina Interna para ecocardiograma Doppler y control de presión arterial.',
    status: 'Derivado'
  },
  {
    id: 'HC-002',
    patientName: 'Ejemplo Paciente',
    patientPhone: '72812345',
    date: '20 de Octubre, 2026',
    time: '10:15',
    specialty: 'Cirugía General y Laparoscópica',
    doctor: 'Dr. Alejandro Velasco',
    diagnosis: 'Evaluación de dolor en hipocondrio derecho posprandial. Sospecha de colelitiasis recurrente.',
    referralNotes: 'Solicitada ecografía hepatobiliopancreática. Mantener dieta hipograsa y programar resolución quirúrgica.',
    status: 'En Seguimiento'
  }
];

// Configuración de cobro QR por defecto
const DEFAULT_QR_CONFIG = {
  bankName: 'Banco Nacional de Bolivia (BNB)',
  accountHolder: 'Clínica Velasco S.R.L.',
  accountNumber: 'Cta. Cte. 400-0129381',
  amount: 150,
  nit: '1028394021',
  note: 'Trinidad, Beni • Consulta Ambulatoria General',
  qrImage: null // Si es null, se muestra el vector QR elegante
};


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
    // Fechas dinámicas para la demostración
    const now = new Date();
    const dHoy = now.toISOString().slice(0, 10);
    const dHace2Dias = new Date(now.getTime() - 2 * 86400000).toISOString().slice(0, 10);
    const dHace4Dias = new Date(now.getTime() - 4 * 86400000).toISOString().slice(0, 10);
    const dHace12Dias = new Date(now.getTime() - 12 * 86400000).toISOString().slice(0, 10);
    const dHace18Dias = new Date(now.getTime() - 18 * 86400000).toISOString().slice(0, 10);

    return [
      {
        id: 'CV-4819',
        specialty: 'Cirugía',
        subRole: 'Cirugía General y Laparoscópica',
        doctor: 'Dr. Alejandro Velasco',
        price: 150,
        room: 'Consultorio 101 - PB',
        locationGuide: 'Planta Baja, Pasillo Derecho al lado de Farmacia Central',
        date: 'Hoy',
        dateISO: dHoy,
        hour: '10:00',
        patientName: 'Ejemplo Paciente',
        patientPhone: '72812345',
        voucherRef: 'BNB-92841920',
        paymentStatus: 'Verificado y Aprobado',
        status: 'Programado'
      },
      {
        id: 'CV-4822',
        specialty: 'Pediatría',
        subRole: 'Pediatría Integral y Neonatología',
        doctor: 'Dra. Carmen Mendoza',
        price: 180,
        room: 'Consultorio 104 - PB',
        locationGuide: 'Planta Baja, Ala Materno-Infantil frente a Sala de Juegos',
        date: 'Hoy',
        dateISO: dHoy,
        hour: '11:00',
        patientName: 'Carlos Suárez Roca',
        patientPhone: '73920194',
        voucherRef: 'QR-5029184',
        paymentStatus: 'Pendiente de Verificación Admin',
        status: 'Programado'
      },
      {
        id: 'CV-4825',
        specialty: 'Neurocirugía',
        subRole: 'Neurocirugía y Columna',
        doctor: 'Dr. Mauricio Arce',
        price: 250,
        room: 'Consultorio 202 - Piso 1',
        locationGuide: 'Piso 1, subiendo por ascensor principal a mano izquierda',
        date: 'Hoy',
        dateISO: dHoy,
        hour: '15:30',
        patientName: 'María Elena Justiniano',
        patientPhone: '71029384',
        voucherRef: 'Bisa-3819204',
        paymentStatus: 'Verificado y Aprobado',
        status: 'Programado'
      },
      {
        id: 'CV-4790',
        specialty: 'Pediatría',
        subRole: 'Pediatría Integral y Neonatología',
        doctor: 'Dra. Carmen Mendoza',
        price: 180,
        room: 'Consultorio 104 - PB',
        locationGuide: 'Planta Baja, Ala Materno-Infantil',
        date: 'Hace 2 días',
        dateISO: dHace2Dias,
        hour: '09:15',
        patientName: 'Mateo Vaca Rivero',
        patientPhone: '68291039',
        voucherRef: 'BNB-1029381',
        paymentStatus: 'Verificado y Aprobado',
        status: 'Atendido'
      },
      {
        id: 'CV-4785',
        specialty: 'Terapia',
        subRole: 'Terapia Intensiva (UTI)',
        doctor: 'Dr. Fernando Suárez',
        price: 300,
        room: 'Unidad UTI - Piso 1',
        locationGuide: 'Piso 1, Acceso Restringido UTI',
        date: 'Hace 4 días',
        dateISO: dHace4Dias,
        hour: '11:30',
        patientName: 'Roberto Antelo Saucedo',
        patientPhone: '72839102',
        voucherRef: 'Transf-992019',
        paymentStatus: 'Verificado y Aprobado',
        status: 'Atendido'
      },
      {
        id: 'CV-4740',
        specialty: 'Cirugía',
        subRole: 'Cirugía General y Laparoscópica',
        doctor: 'Dr. Alejandro Velasco',
        price: 150,
        room: 'Consultorio 101 - PB',
        locationGuide: 'Planta Baja, Pasillo Derecho',
        date: 'Hace 12 días',
        dateISO: dHace12Dias,
        hour: '16:00',
        patientName: 'Lucía Hurtado Paz',
        patientPhone: '71829304',
        voucherRef: 'Union-491029',
        paymentStatus: 'Verificado y Aprobado',
        status: 'Atendido'
      },
      {
        id: 'CV-4712',
        specialty: 'Neurocirugía',
        subRole: 'Neurocirugía y Columna',
        doctor: 'Dr. Mauricio Arce',
        price: 250,
        room: 'Consultorio 202 - Piso 1',
        locationGuide: 'Piso 1, Consultorio 202',
        date: 'Hace 18 días',
        dateISO: dHace18Dias,
        hour: '17:00',
        patientName: 'Jorge Parada Méndez',
        patientPhone: '69481920',
        voucherRef: 'BNB-883019',
        paymentStatus: 'Verificado y Aprobado',
        status: 'Atendido'
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

  // Configuración de cobro QR (Admin editable y visible en el modal del paciente)
  const [qrConfig, setQrConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_QR_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_QR_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_QR_CONFIG_KEY, JSON.stringify(qrConfig));
    } catch (e) {}
  }, [qrConfig]);

  // Historial Clínico Unificado (Compartido para todos los médicos)
  const [medicalHistory, setMedicalHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MEDICAL_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MEDICAL_HISTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MEDICAL_HISTORY_KEY, JSON.stringify(medicalHistory));
    } catch (e) {}
  }, [medicalHistory]);

  // Modal de Historial Clínico en Panel Médico
  const [activeHistoryPatient, setActiveHistoryPatient] = useState(null);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newReferralNotes, setNewReferralNotes] = useState('');
  const [historySavedNotification, setHistorySavedNotification] = useState('');

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

  // Estados del Módulo Financiero y Cierre de Caja (Admin / Caja)
  const [financialPeriod, setFinancialPeriod] = useState('hoy'); // 'hoy' | 'semana' | 'mes'
  const [showPrintReportModal, setShowPrintReportModal] = useState(false);

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
      price: selectedSpecialtyForBooking.price || qrConfig.amount || 150,
      room: selectedSpecialtyForBooking.room,
      locationGuide: selectedSpecialtyForBooking.locationGuide || 'Recepción Central',
      date: selectedDateLabel,
      dateISO: new Date().toISOString().slice(0, 10),
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
  // Doctor Action: Abrir Historial Clínico de un paciente
  const handleOpenPatientHistory = (app) => {
    setActiveHistoryPatient(app);
    setNewDiagnosis('');
    setNewReferralNotes('');
    setHistorySavedNotification('');
  };

  // Doctor Action: Guardar nueva evolución en el Historial Clínico Unificado
  const handleSaveMedicalHistoryEntry = (e) => {
    e.preventDefault();
    if (!newDiagnosis.trim() || !activeHistoryPatient) return;

    const newEntry = {
      id: `HC-${Date.now().toString().slice(-4)}`,
      patientName: activeHistoryPatient.patientName,
      patientPhone: activeHistoryPatient.patientPhone,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      specialty: activeHistoryPatient.specialty || 'Consulta Externa',
      doctor: selectedDoctorId,
      diagnosis: newDiagnosis.trim(),
      referralNotes: newReferralNotes.trim() || 'Sin observaciones de derivación adicionales.',
      status: newReferralNotes.trim() ? 'Derivado / En Seguimiento' : 'Consulta Finalizada'
    };

    setMedicalHistory(prev => [newEntry, ...prev]);

    // Marcar la cita como atendida si corresponde
    if (activeHistoryPatient.id) {
      handleDoctorMarkAttended(activeHistoryPatient.id);
    }

    setNewDiagnosis('');
    setNewReferralNotes('');
    setHistorySavedNotification('¡Evolución clínica guardada exitosamente y compartida con el equipo médico!');
    setTimeout(() => {
      setHistorySavedNotification('');
    }, 3500);
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

  // Helper para clasificar citas según el periodo seleccionado en Caja / Admin
  const getPeriodAppointments = () => {
    const todayISO = new Date().toISOString().slice(0, 10);
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 86400000;

    return appointments.filter(app => {
      // Si la fecha dice 'Hoy' o coincide con la fecha ISO de hoy
      if (financialPeriod === 'hoy') {
        if (app.date === 'Hoy') return true;
        if (app.dateISO && app.dateISO === todayISO) return true;
        return false;
      }
      
      if (financialPeriod === 'semana') {
        if (app.date === 'Hoy' || app.date.includes('Hace 2') || app.date.includes('Hace 4')) return true;
        if (app.dateISO) {
          const appMs = new Date(app.dateISO).getTime();
          return (nowMs - appMs) <= sevenDaysMs && (nowMs - appMs) >= -86400000;
        }
        return false;
      }

      if (financialPeriod === 'mes') {
        // Todo lo del mes en curso o citas con fechas relativas
        if (app.date === 'Hoy' || app.date.includes('Hace') || !app.dateISO) return true;
        const currentMonthPrefix = todayISO.slice(0, 7); // 'YYYY-MM'
        return app.dateISO.startsWith(currentMonthPrefix);
      }

      return true;
    });
  };

  const periodAppointments = getPeriodAppointments();

  // Cálculos de resumen financiero para el periodo
  const totalRecaudadoConfirmado = periodAppointments
    .filter(a => a.paymentStatus === 'Verificado y Aprobado')
    .reduce((sum, a) => sum + (Number(a.price) || qrConfig.amount || 150), 0);

  const totalPendienteValidacion = periodAppointments
    .filter(a => a.paymentStatus !== 'Verificado y Aprobado')
    .reduce((sum, a) => sum + (Number(a.price) || qrConfig.amount || 150), 0);

  const totalPacientesPeriodo = periodAppointments.length;
  const totalPacientesConfirmados = periodAppointments.filter(a => a.paymentStatus === 'Verificado y Aprobado').length;

  // Desglose por Médico / Especialidad en el periodo
  const doctorBreakdown = specialtiesList.map(spec => {
    const specApps = periodAppointments.filter(a => a.specialty === spec.name || a.doctor === spec.doctor);
    const countTotal = specApps.length;
    const countAprobados = specApps.filter(a => a.paymentStatus === 'Verificado y Aprobado').length;
    const subtotal = specApps
      .filter(a => a.paymentStatus === 'Verificado y Aprobado')
      .reduce((sum, a) => sum + (Number(a.price) || spec.price || 150), 0);

    return {
      specId: spec.id,
      name: spec.name,
      doctor: spec.doctor,
      price: spec.price || 150,
      room: spec.room,
      countTotal,
      countAprobados,
      subtotal
    };
  });

  return (
    <div className="min-h-screen bg-clinic-pearl flex flex-col justify-between selection:bg-clinic-emerald selection:text-white">
      
      {/* ========================================================
          BARRA SUPERIOR GLOBAL CON LOGO, SALIR Y ROL DE PERSONAL
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft-sm">
        <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo brand (Click takes patient to home) */}
          <div 
            onClick={() => { 
              if (systemRole === 'paciente') {
                setActiveTab('inicio'); 
                setEmergencySubMode(null); 
              }
            }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink min-w-0"
          >
            <VelascoLogo iconOnly={false} className="h-8 sm:h-10" />
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* 1. Botón visible de Salir / Cerrar Sesión (Para Paciente) */}
            {systemRole === 'paciente' && userProfile && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200/90 pl-2 sm:pl-3 pr-1 sm:pr-1.5 py-1 rounded-full text-xs shadow-soft-sm">
                <span className="font-bold text-slate-700 hidden md:inline text-xs">
                  Hola, <strong className="text-clinic-dark font-extrabold">{userProfile.name.split(' ')[0]}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] sm:text-xs transition-colors cursor-pointer border border-red-200/60"
                  title="Cerrar sesión del paciente"
                >
                  <LogOut className="w-3 h-3 text-red-600" />
                  <span className="hidden xs:inline sm:inline">Salir</span>
                </button>
              </div>
            )}

            {/* 2. Botón Selector de Rol / Modo Personal Clínico */}
            <button
              onClick={() => setShowRoleSelectorModal(true)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                systemRole === 'paciente'
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-soft-sm'
                  : 'bg-clinic-dark text-white border-clinic-dark shadow-md ring-2 ring-clinic-emerald/30'
              }`}
              title="Cambiar entre Vista Paciente y Paneles del Personal"
            >
              <Shield className={`w-3.5 h-3.5 ${systemRole === 'paciente' ? 'text-clinic-emerald' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">
                {systemRole === 'paciente' ? 'Acceso Personal' : `Rol: ${systemRole.toUpperCase()}`}
              </span>
              <span className="sm:hidden text-[10px] uppercase tracking-wider">
                {systemRole === 'paciente' ? 'Staff' : systemRole.slice(0, 3)}
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
              className="flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 bg-clinic-red hover:bg-clinic-redHover text-white text-[11px] sm:text-sm font-black rounded-xl sm:rounded-2xl shadow-emergency-glow active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Siren className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              <span className="hidden xs:inline">🚨 SOS 24h</span>
              <span className="xs:hidden">SOS</span>
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
                        placeholder="Ej. 69400096"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {specialtiesList.map((spec) => (
                    <div
                      key={spec.id}
                      onClick={() => handleOpenSpecialtyBooking(spec)}
                      className="bg-white hover:bg-emerald-50/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-clinic-emerald/50 shadow-soft-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-clinic-light text-clinic-dark flex items-center justify-center shrink-0 group-hover:bg-clinic-emerald group-hover:text-white transition-all shadow-inner">
                          {getSpecialtyIcon(spec.icon, "w-6 h-6 sm:w-7 sm:h-7")}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h4 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-clinic-dark transition-colors leading-tight">
                              {spec.name}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">
                              {spec.status}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5 truncate">
                            {spec.doctor}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[11px] text-clinic-emerald font-bold flex items-center gap-1 bg-emerald-50/80 px-2 py-0.5 rounded-lg border border-emerald-100">
                              <Building2 className="w-3 h-3 text-clinic-emerald shrink-0" />
                              <span className="truncate">{spec.room}</span>
                            </span>
                            <span className="text-[11px] font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              Bs. {spec.price || 150}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                              • {spec.hours.length} horarios hoy
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-50 group-hover:bg-clinic-emerald group-hover:text-white text-slate-400 flex items-center justify-center transition-all shrink-0 ml-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {appointments.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-emerald-950/5 overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-emerald-900/10"
                    >
                      {/* Ticket Header Estilo Boarding Pass */}
                      <div className="bg-gradient-to-r from-clinic-dark to-emerald-800 p-4 sm:p-5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xs">
                            CV
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-black block">
                              Pase Médico Digital
                            </span>
                            <span className="text-sm sm:text-base font-extrabold tracking-tight">
                              Ficha {ticket.id}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-black bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl inline-block border border-white/20">
                            {ticket.hour}
                          </span>
                          <span className="text-[10px] text-emerald-200 font-semibold block mt-1">
                            {ticket.date}
                          </span>
                        </div>
                      </div>

                      {/* Ticket Body con Detalles Clínicos */}
                      <div className="p-5 sm:p-6 space-y-4">
                        
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-clinic-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                            {ticket.specialty}
                          </span>
                          <h3 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">
                            {ticket.doctor}
                          </h3>
                          <p className="text-xs font-bold text-slate-600 mt-1 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-clinic-dark shrink-0" />
                            <span>{ticket.room}</span>
                          </p>
                        </div>

                        {/* Línea perforada decorativa estilo Ticket */}
                        <div className="relative py-1">
                          <div className="border-t-2 border-dashed border-slate-200"></div>
                          <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-clinic-pearl border-r border-slate-200"></div>
                          <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-clinic-pearl border-l border-slate-200"></div>
                        </div>

                        {/* Guía de ubicación para orientar al paciente */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] uppercase tracking-wide">
                            <Compass className="w-3.5 h-3.5 text-clinic-dark shrink-0" />
                            <span>Cómo llegar a su consultorio:</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                            {ticket.locationGuide || 'Consultar en recepción principal de Planta Baja.'}
                          </p>
                        </div>

                        {/* Estado del voucher y verificación con Monto Bs */}
                        <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                              <Receipt className="w-3.5 h-3.5 text-clinic-emerald shrink-0" />
                              Nº Comprobante:
                            </span>
                            <span className="font-bold text-slate-800 text-[11px] truncate max-w-[180px]">
                              {ticket.voucherRef || 'Registrado'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-emerald-100">
                            <span className="text-slate-500 font-semibold text-[11px]">Monto Consulta:</span>
                            <span className="font-extrabold text-clinic-dark text-xs bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                              Bs. {ticket.price || 150}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-emerald-100">
                            <span className="text-slate-500 font-semibold text-[11px]">Estado de Verificación:</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              ticket.paymentStatus === 'Verificado y Aprobado' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
                            }`}>
                              {ticket.paymentStatus === 'Verificado y Aprobado' ? '✓ Pago Aprobado' : '⏳ Pendiente Admin'}
                            </span>
                          </div>
                        </div>

                        {/* Estado del turno en vivo */}
                        {ticket.status && (
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-400 font-semibold text-[11px]">Turno en Recepción:</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              ticket.status.includes('Llamando')
                                ? 'bg-amber-100 text-amber-900 animate-pulse border border-amber-300'
                                : ticket.status === 'Atendido'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        )}

                      </div>

                      {/* Ticket Footer Acciones */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col xs:flex-row sm:flex-row items-center justify-between gap-2">
                        <button
                          onClick={() => handleSendVoucherToAdmin(ticket)}
                          className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-clinic-emerald text-white hover:bg-clinic-emeraldHover font-bold text-xs transition-colors cursor-pointer shadow-sm"
                          title="Enviar comprobante al administrador por WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Voucher al Admin</span>
                        </button>
                        <button
                          onClick={() => handleShareWhatsAppTicket(ticket)}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer shadow-soft-sm"
                          title="Compartir o guardar comprobante"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Ficha WhatsApp</span>
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

                    {/* ========================================================
              MÓDULO FINANCIERO Y REPORTES EN ADMIN / CAJA (DÍA, SEMANA, MES)
             ======================================================== */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm space-y-6">
            
            {/* Header del Cierre de Caja y Botón de Impresión */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md">
                  <Wallet className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-clinic-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                      Módulo Financiero y Caja
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Moneda: Bolivianos (Bs)
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 mt-1">
                    Cierre de Caja y Reportes de Ingresos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control financiero por períodos con balance confirmado y montos por verificar.
                  </p>
                </div>
              </div>

              {/* Botón Destacado: Imprimir Reporte Gerencial */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPrintReportModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-clinic-dark hover:bg-clinic-dark/90 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95 group"
                >
                  <Printer className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Imprimir Reporte ({financialPeriod === 'hoy' ? 'Día' : financialPeriod === 'semana' ? 'Semana' : 'Mes'})</span>
                </button>
              </div>
            </div>

            {/* Selector de Período: Hoy (Día), Esta Semana, Este Mes */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 px-2">
                <CalendarRange className="w-4 h-4 text-clinic-emerald shrink-0" />
                <span>Seleccionar Período de Balance:</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center">
                {[
                  { id: 'hoy', label: 'Hoy (Día)' },
                  { id: 'semana', label: 'Esta Semana' },
                  { id: 'mes', label: 'Este Mes' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFinancialPeriod(p.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
                      financialPeriod === p.id
                        ? 'bg-clinic-emerald text-white shadow-sm'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Tarjetas de Resumen Financiero Dinámicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Tarjeta 1: Total Recaudado Confirmado */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-4 rounded-2xl border border-emerald-200/90 shadow-soft-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                    Recaudado Confirmado
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    Bs
                  </div>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-display font-black text-emerald-950">
                    Bs. {totalRecaudadoConfirmado.toLocaleString()}
                  </span>
                  <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                    ✓ {totalPacientesConfirmados} pagos validados
                  </span>
                </div>
              </div>

              {/* Tarjeta 2: Monto Pendiente de Validación */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-4 rounded-2xl border border-amber-200/90 shadow-soft-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                    Pendiente Validación
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    ⏳
                  </div>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-display font-black text-amber-950">
                    Bs. {totalPendienteValidacion.toLocaleString()}
                  </span>
                  <span className="block text-[11px] text-amber-800 font-semibold mt-0.5">
                    {periodAppointments.length - totalPacientesConfirmados} vouchers por revisar
                  </span>
                </div>
              </div>

              {/* Tarjeta 3: Total Pacientes en el Período */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200/90 shadow-soft-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Pacientes / Citas
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-clinic-dark text-white flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-display font-black text-slate-900">
                    {totalPacientesPeriodo}
                  </span>
                  <span className="block text-[11px] text-slate-500 font-semibold mt-0.5">
                    Registrados en {financialPeriod === 'hoy' ? 'el día de hoy' : financialPeriod === 'semana' ? 'los últimos 7 días' : 'este mes'}
                  </span>
                </div>
              </div>

              {/* Tarjeta 4: Volumen Financiero Proyectado */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100/60 p-4 rounded-2xl border border-teal-200/90 shadow-soft-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                    Volumen Total Bruto
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-4 h-4 text-teal-200" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-display font-black text-teal-950">
                    Bs. {(totalRecaudadoConfirmado + totalPendienteValidacion).toLocaleString()}
                  </span>
                  <span className="block text-[11px] text-teal-700 font-semibold mt-0.5">
                    Confirmado + Pendiente
                  </span>
                </div>
              </div>

            </div>

            {/* Resumen Desglosado por Médico / Especialidad */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-clinic-emerald" />
                  Desglose de Ingresos por Especialidad ({financialPeriod === 'hoy' ? 'Hoy' : financialPeriod === 'semana' ? 'Esta Semana' : 'Este Mes'})
                </span>
                <span className="text-[11px] text-slate-500">
                  Valores expresados en Bolivianos (Bs)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {doctorBreakdown.map((item) => (
                  <div 
                    key={item.specId}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-black text-clinic-dark bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          Tarifa: Bs. {item.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.doctor}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        {item.countTotal} cita{item.countTotal === 1 ? '' : 's'} ({item.countAprobados} cobr.)
                      </span>
                      <strong className="text-clinic-dark font-black">
                        Bs. {item.subtotal.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
              <div>
                {/* 1. Vista Móvil: Tarjetas Apiladas (md:hidden) */}
                <div className="grid grid-cols-1 gap-3.5 md:hidden">
                  {appointments.map((app) => (
                    <div 
                      key={app.id}
                      className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="font-black text-clinic-dark text-xs bg-clinic-light px-2.5 py-0.5 rounded-lg">
                          Ficha {app.id}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          app.paymentStatus === 'Verificado y Aprobado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {app.paymentStatus || 'Pendiente'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Paciente:</span>
                          <span className="font-bold text-slate-900 text-right">{app.patientName} ({app.patientPhone})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Consulta:</span>
                          <span className="font-semibold text-slate-800 text-right">{app.specialty} • {app.doctor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Horario:</span>
                          <span className="font-bold text-clinic-emerald">{app.hour} ({app.date})</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Tarifa Consulta:</span>
                          <span className="font-black text-clinic-dark bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                            Bs. {app.price || 150}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Receipt className="w-3 h-3 text-clinic-emerald" /> Voucher:
                          </span>
                          <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px] truncate max-w-[180px]">
                            {app.voucherRef || 'Sin comprobante'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        {app.paymentStatus !== 'Verificado y Aprobado' ? (
                          <button
                            onClick={() => handleAdminVerifyPayment(app.id)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
                          >
                            ✓ Aprobar Pago y Ficha
                          </button>
                        ) : (
                          <span className="w-full py-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pago Verificado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Vista Escritorio: Tabla Completa (hidden md:block) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Ficha</th>
                        <th className="py-2.5 px-3">Paciente / Celular</th>
                        <th className="py-2.5 px-3">Especialidad / Médico</th>
                        <th className="py-2.5 px-3">Fecha y Hora</th>
                        <th className="py-2.5 px-3">Comprobante Voucher</th>
                        <th className="py-2.5 px-3">Monto (Bs)</th>
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
                            <span className="font-extrabold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                              Bs. {app.price || 150}
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
              </div>
            )}
          </div>

          {/* SECCIÓN: CONFIGURACIÓN DE COBRO QR DE LA CLÍNICA (SIMPLIFICADA) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-clinic-light text-clinic-dark flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-clinic-emerald" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-clinic-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                    Caja & Finanzas
                  </span>
                  <h3 className="text-lg font-display font-extrabold text-slate-900 mt-0.5">
                    Código QR Oficial de Cobro
                  </h3>
                </div>
              </div>
              <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                Se sincroniza en tiempo real con la app de los pacientes
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              
              {/* Vista Previa Grande del QR Activo */}
              <div className="relative group shrink-0">
                <div className="w-52 h-52 sm:w-60 sm:h-60 bg-white rounded-2xl p-3 border-2 border-emerald-300 shadow-md flex items-center justify-center overflow-hidden">
                  {qrConfig.qrImage ? (
                    <img 
                      src={qrConfig.qrImage} 
                      alt="QR Bancario Oficial" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full border-2 border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between bg-white">
                      <div className="w-full flex justify-between items-center">
                        <div className="w-8 h-8 bg-slate-900 rounded-sm"></div>
                        <div className="w-8 h-8 bg-slate-900 rounded-sm"></div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="w-16 h-2 bg-clinic-emerald rounded-full mx-auto"></div>
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                          QR Predeterminado
                        </span>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <div className="w-8 h-8 bg-slate-900 rounded-sm"></div>
                        <div className="w-4 h-4 bg-clinic-dark rounded-sm"></div>
                      </div>
                    </div>
                  )}
                </div>

                {qrConfig.qrImage && (
                  <button
                    type="button"
                    onClick={() => setQrConfig(prev => ({ ...prev, qrImage: null }))}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-xs cursor-pointer"
                    title="Restablecer al QR por defecto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Controles de Carga Limpios y Explicación */}
              <div className="space-y-4 flex-1 text-center md:text-left">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {qrConfig.qrImage ? '✓ Imagen de QR Oficial Habilitada' : 'Código QR Simple de la Clínica'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Al escanear este código desde cualquier banco (BNB, Unión, BCP, Ganadero, etc.), la aplicación bancaria reconoce automáticamente el titular y número de cuenta. Sube una foto o captura de tu QR bancario oficial para que los pacientes paguen su consulta directamente.
                  </p>
                </div>

                {/* Botón Destacado de Subida de Archivo */}
                <div>
                  <label className="inline-flex items-center gap-3 px-5 py-3.5 bg-clinic-emerald hover:bg-clinic-emeraldHover text-white text-xs font-black rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group active:scale-95">
                    <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{qrConfig.qrImage ? 'Cambiar Imagen del QR Oficial' : 'Subir / Actualizar Imagen del QR Oficial'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setQrConfig(prev => ({ ...prev, qrImage: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <span className="block text-[11px] text-slate-400 mt-2 font-medium">
                    Soporta imágenes JPG, PNG o WebP descargadas desde tu banca móvil.
                  </span>
                </div>
              </div>

            </div>
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
                        onClick={() => handleOpenPatientHistory(app)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-clinic-light hover:bg-emerald-100 text-clinic-dark font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-clinic-emerald/30 shadow-sm"
                        title="Ver antecedentes clínicos e interconsultas del paciente"
                      >
                        <History className="w-3.5 h-3.5 text-clinic-emerald" />
                        <span>Historial Clínico</span>
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

            {/* SECCIÓN OBLIGATORIA: COMPROBANTE DE PAGO / TRANSFERENCIA / QR */}
            <div className="p-4 bg-gradient-to-b from-emerald-50/50 to-slate-50 rounded-2xl border-2 border-emerald-300/80 shadow-inner space-y-3.5">
              
              {/* Header de Pago y Monto de Consulta */}
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-clinic-emerald text-white flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Pago de Consulta
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Transferencia Bancaria o QR Simple</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Monto</span>
                  <span className="text-sm font-black text-clinic-dark bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 inline-block shadow-sm">
                    Bs. {selectedSpecialtyForBooking.price || qrConfig.amount || 150}
                  </span>
                </div>
              </div>

              {/* Tarjeta Visual de QR Oficial Limpia para el Paciente */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 flex flex-col items-center text-center gap-3 shadow-soft-sm">
                
                {/* Imagen Grande de QR */}
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-2.5 border-2 border-emerald-300 shadow-md flex items-center justify-center overflow-hidden">
                  {qrConfig.qrImage ? (
                    <img 
                      src={qrConfig.qrImage} 
                      alt="Código QR de Pago" 
                      className="w-full h-full object-contain rounded-xl" 
                    />
                  ) : (
                    <div className="w-full h-full border-2 border-slate-800 rounded-xl flex flex-col items-center justify-between p-3 bg-white">
                      <div className="w-full flex justify-between items-center">
                        <div className="w-6 h-6 bg-slate-900 rounded-sm"></div>
                        <div className="w-6 h-6 bg-slate-900 rounded-sm"></div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="w-12 h-2 bg-clinic-emerald rounded-full mx-auto"></div>
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">QR Oficial Simple</span>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <div className="w-6 h-6 bg-slate-900 rounded-sm"></div>
                        <div className="w-3 h-3 bg-clinic-dark rounded-sm"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Monto de Consulta en Bs e Instrucción de Escaneo */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Monto a pagar:</span>
                    <span className="text-lg font-black text-clinic-dark bg-emerald-50 px-3 py-0.5 rounded-xl border border-emerald-200">
                      Bs. {selectedSpecialtyForBooking.price || 150}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Escanea este código desde la app de cualquier banco boliviano para transferir exactamente el monto de tu consulta.
                  </p>
                </div>

                {/* Botón para Descargar Imagen QR si el paciente está en su teléfono */}
                {qrConfig.qrImage && (
                  <a
                    href={qrConfig.qrImage}
                    download="QR-Clinica-Velasco.png"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5 text-clinic-emerald" />
                    <span>Descargar Imagen del QR</span>
                  </a>
                )}
              </div>

              {/* Input de número de voucher o transacción */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Nº de Operación / Código de Transferencia:
                  </label>
                  {voucherNumber.trim() && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Registrado
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={voucherNumber}
                  onChange={(e) => {
                    setVoucherNumber(e.target.value);
                    if (voucherError) setVoucherError('');
                  }}
                  placeholder="Ej. OP-984321 / Ref. 44521"
                  className={`w-full px-3 py-2 bg-white rounded-xl border text-xs font-semibold focus:outline-none transition-all ${
                    voucherNumber.trim() 
                      ? 'border-clinic-emerald ring-2 ring-clinic-emerald/20 bg-emerald-50/20' 
                      : 'border-slate-200 focus:ring-2 focus:ring-clinic-emerald'
                  }`}
                />
              </div>

              {/* Zona de carga moderna (Dropzone-like) */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  O adjuntar captura de la transferencia:
                </label>
                <div>
                  <label className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                    voucherFileName 
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-sm' 
                      : 'border-slate-300 hover:border-clinic-emerald bg-white hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        voucherFileName ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {voucherFileName ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <span className={`block text-xs font-bold truncate ${voucherFileName ? 'text-emerald-950' : 'text-slate-700'}`}>
                          {voucherFileName ? voucherFileName : 'Subir imagen o comprobante PDF'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {voucherFileName ? '✓ Archivo adjuntado con éxito' : 'Formatos JPG, PNG, PDF'}
                        </span>
                      </div>
                    </div>

                    {voucherFileName ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setVoucherFileName('');
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg text-xs shrink-0 cursor-pointer"
                        title="Quitar archivo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 shrink-0">
                        Examinar
                      </span>
                    )}

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
          MODAL HISTORIAL CLÍNICO UNIFICADO (INTERCONSULTA)
         ======================================================== */}
      {activeHistoryPatient && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-slide-up my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Header del Historial */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-clinic-dark text-white flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-clinic-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                    Expediente Digital Unificado • Interconsulta
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 mt-0.5">
                    Historial Clínico: {activeHistoryPatient.patientName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tel: {activeHistoryPatient.patientPhone} • Registro médico compartido en Clínica Velasco
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveHistoryPatient(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {historySavedNotification && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-clinic-emerald shrink-0" />
                <span>{historySavedNotification}</span>
              </div>
            )}

            {/* Línea de tiempo de visitas previas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-clinic-emerald" />
                  Evolución y Atenciones Anteriores ({
                    medicalHistory.filter(h => h.patientName === activeHistoryPatient.patientName || h.patientPhone === activeHistoryPatient.patientPhone).length
                  })
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">Más recientes primero</span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {medicalHistory.filter(h => h.patientName === activeHistoryPatient.patientName || h.patientPhone === activeHistoryPatient.patientPhone).length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-2xl text-center">
                    Este paciente no cuenta con registros históricos previos en el sistema.
                  </p>
                ) : (
                  medicalHistory
                    .filter(h => h.patientName === activeHistoryPatient.patientName || h.patientPhone === activeHistoryPatient.patientPhone)
                    .map((item) => (
                      <div 
                        key={item.id} 
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-clinic-dark bg-clinic-light px-2.5 py-0.5 rounded-lg text-[11px]">
                              {item.specialty}
                            </span>
                            <span className="font-bold text-slate-800">{item.doctor}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            📅 {item.date} {item.time ? `• ${item.time}` : ''}
                          </span>
                        </div>

                        <div className="text-xs space-y-1.5 pt-1">
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                              Diagnóstico / Motivo:
                            </span>
                            <p className="text-slate-800 font-medium leading-relaxed">
                              {item.diagnosis}
                            </p>
                          </div>

                          {item.referralNotes && (
                            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-950">
                              <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800">
                                🧭 Notas de Derivación / Interconsulta:
                              </span>
                              <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                                {item.referralNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Formulario para agregar nueva evolución médica actual */}
            <form onSubmit={handleSaveMedicalHistoryEntry} className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-clinic-dark flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-clinic-emerald" />
                  Nueva Entrada Médica ({selectedDoctorId})
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Consulta en curso</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Diagnóstico / Evolución Clínica:
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  placeholder="Describa el diagnóstico, hallazgos clínicos y tratamiento indicado..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-clinic-emerald resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Derivación / Observaciones para otro especialista:
                </label>
                <input
                  type="text"
                  value={newReferralNotes}
                  onChange={(e) => setNewReferralNotes(e.target.value)}
                  placeholder="Ej. Derivar a Cardiología para ecocardiograma o control quirúrgico en 7 días..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-clinic-emerald"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <p className="text-[10px] text-slate-500">
                  Al guardar, se añade al historial unificado y se marca la consulta como atendida.
                </p>
                <button
                  type="submit"
                  disabled={!newDiagnosis.trim()}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                    newDiagnosis.trim()
                      ? 'bg-clinic-emerald hover:bg-clinic-emeraldHover cursor-pointer shadow-emerald-glow'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Evolución</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          BARRA DE NAVEGACIÓN INFERIOR FIJA (VISTA PACIENTE)
         ======================================================== */}
      {systemRole === 'paciente' && userProfile && (
        <div className="fixed bottom-0 inset-x-0 z-30 pb-safe pointer-events-none">
          <nav className="pointer-events-auto h-16 sm:h-18 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-4 sm:px-8 flex items-center justify-around shadow-2xl shadow-slate-900/15 max-w-lg mx-auto w-full sm:rounded-t-3xl transition-all">
            
            {/* Tab 1: Inicio / Atención */}
            <button
              type="button"
              onClick={() => { setActiveTab('inicio'); setEmergencySubMode(null); }}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer relative ${
                activeTab === 'inicio'
                  ? 'text-clinic-dark font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'inicio' ? 'bg-clinic-light text-clinic-emerald' : ''}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-none">Agendar Cita</span>
              {activeTab === 'inicio' && (
                <span className="w-1.5 h-1.5 rounded-full bg-clinic-emerald mt-0.5" />
              )}
            </button>

            {/* Tab 2: Mis Turnos */}
            <button
              type="button"
              onClick={() => { setActiveTab('turnos'); setEmergencySubMode(null); }}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all relative cursor-pointer ${
                activeTab === 'turnos'
                  ? 'text-clinic-dark font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors relative ${activeTab === 'turnos' ? 'bg-clinic-light text-clinic-emerald' : ''}`}>
                <CalendarCheck className="w-5 h-5" />
                {appointments.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-clinic-emerald ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] leading-none">Mis Turnos</span>
              {activeTab === 'turnos' && (
                <span className="w-1.5 h-1.5 rounded-full bg-clinic-emerald mt-0.5" />
              )}
            </button>

            {/* Tab 3: Emergencia */}
            <button
              type="button"
              onClick={() => { setActiveTab('emergencia'); setEmergencySubMode(null); setPreAlertSuccess(false); }}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'emergencia'
                  ? 'text-clinic-red font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${activeTab === 'emergencia' ? 'bg-red-50 text-clinic-red' : ''}`}>
                <Siren className={`w-5 h-5 ${activeTab === 'emergencia' ? 'animate-pulse text-clinic-red' : ''}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-none">Emergencia SOS</span>
              {activeTab === 'emergencia' && (
                <span className="w-1.5 h-1.5 rounded-full bg-clinic-red mt-0.5" />
              )}
            </button>

          </nav>
        </div>
      )}


      {/* ========================================================
          MODAL / VISTA DE IMPRESIÓN GERENCIAL: CIERRE DE CAJA
         ======================================================== */}
      {showPrintReportModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-auto overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Barra de Acciones de la Modal (oculta al imprimir) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-extrabold">Vista Previa para Impresión • Cierre de Caja</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-clinic-emerald hover:bg-clinic-emeraldHover text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ahora (PDF / Papel)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintReportModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* DOCUMENTO FORMAL IMPRESO */}
            <div id="printable-report" className="p-6 sm:p-10 space-y-6 overflow-y-auto print:overflow-visible print:p-0 text-slate-900 font-sans">
              
              {/* Membrete Oficial */}
              <div className="border-b-2 border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-clinic-dark text-white flex items-center justify-center font-black text-sm">
                      CV
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        CLÍNICA VELASCO
                      </h1>
                      <p className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
                        Trinidad, Beni - Bolivia
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    Av. Busch esq. Nicolás Suárez • Central Telefónica / Emergencias: (+591) 69400096
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    NIT: 1028394021 • Autorización SNS Beni
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-md inline-block">
                    REPORTE GERENCIAL DE INGRESOS
                  </span>
                  <div className="text-xs font-extrabold text-slate-800 mt-1">
                    Período: <span className="text-clinic-dark font-black">{financialPeriod === 'hoy' ? 'HOY (DÍA)' : financialPeriod === 'semana' ? 'ESTA SEMANA' : 'ESTE MES'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Fecha de emisión: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Encargado de Caja: Administración General
                  </p>
                </div>
              </div>

              {/* Resumen Ejecutivo en Cajas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Recaudado (Validado)</span>
                  <span className="text-lg sm:text-2xl font-black text-emerald-800">
                    Bs. {totalRecaudadoConfirmado.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Pendiente de Aprobación</span>
                  <span className="text-lg sm:text-2xl font-black text-amber-700">
                    Bs. {totalPendienteValidacion.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Pacientes / Citas</span>
                  <span className="text-lg sm:text-2xl font-black text-slate-900">
                    {periodAppointments.length}
                  </span>
                </div>
              </div>

              {/* Tabla Detallada de Consultas y Cobros */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Detalle de Pacientes, Especialidades y Pagos Registrados
                </h4>

                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase font-black text-[10px]">
                    <tr>
                      <th className="py-2 px-2.5 border-r border-slate-300">Ficha</th>
                      <th className="py-2 px-2.5 border-r border-slate-300">Fecha / Hora</th>
                      <th className="py-2 px-2.5 border-r border-slate-300">Paciente</th>
                      <th className="py-2 px-2.5 border-r border-slate-300">Médico / Especialidad</th>
                      <th className="py-2 px-2.5 border-r border-slate-300">Nº Comprobante QR</th>
                      <th className="py-2 px-2.5 border-r border-slate-300">Estado</th>
                      <th className="py-2 px-2.5 text-right">Monto (Bs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {periodAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-bold border-r border-slate-200">{app.id}</td>
                        <td className="py-2 px-2.5 border-r border-slate-200 whitespace-nowrap">{app.date} • {app.hour}</td>
                        <td className="py-2 px-2.5 font-semibold border-r border-slate-200">
                          {app.patientName}
                          <span className="block text-[10px] text-slate-500">{app.patientPhone}</span>
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200">
                          <strong>{app.specialty}</strong>
                          <span className="block text-[10px] text-slate-500">{app.doctor}</span>
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200 font-mono text-[11px]">{app.voucherRef || 'N/A'}</td>
                        <td className="py-2 px-2.5 border-r border-slate-200">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            app.paymentStatus === 'Verificado y Aprobado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.paymentStatus === 'Verificado y Aprobado' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-right font-black text-slate-900 whitespace-nowrap">
                          Bs. {app.price || 150}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 border-t-2 border-slate-400 font-black">
                    <tr>
                      <td colSpan={6} className="py-2.5 px-3 text-right uppercase text-slate-800">
                        Total Liquidado en Caja ({financialPeriod === 'hoy' ? 'Hoy' : financialPeriod === 'semana' ? 'Semana' : 'Mes'}):
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm text-emerald-900">
                        Bs. {totalRecaudadoConfirmado.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Desglose resumido por médico */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-black text-slate-700 tracking-wider block">
                  Resumen de Recaudación por Especialidad / Médico
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {doctorBreakdown.map(d => (
                    <div key={d.specId} className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-800 block text-[11px] truncate">{d.name}</span>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                        <span>{d.countTotal} citas</span>
                        <strong className="text-emerald-800">Bs. {d.subtotal}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloque Inferior de Firmas de Auditoría / Cierre */}
              <div className="pt-12 grid grid-cols-2 gap-10 text-center">
                <div className="space-y-1">
                  <div className="border-t border-slate-400 pt-2 w-3/4 mx-auto"></div>
                  <p className="text-xs font-bold text-slate-900">Firma Encargado de Caja</p>
                  <p className="text-[10px] text-slate-500">Administración y Tesorería • Clínica Velasco</p>
                </div>
                <div className="space-y-1">
                  <div className="border-t border-slate-400 pt-2 w-3/4 mx-auto"></div>
                  <p className="text-xs font-bold text-slate-900">Firma Gerencia / Dirección Médica</p>
                  <p className="text-[10px] text-slate-500">Auditoría Médica y Financiera</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
