export const SPECIALTIES = [
  {
    id: 'cirugia-general',
    name: 'Cirugía General y Laparoscópica',
    shortName: 'Cirugía Laparoscópica',
    icon: 'Activity',
    description: 'Procedimientos mínimamente invasivos de vanguardia con pronta recuperación y mínimo dolor posoperatorio.',
    tags: ['Laparoscopía 4K', 'Vesícula y Hernias', 'Quirófano Inteligente'],
    badge: 'Alta Demanda'
  },
  {
    id: 'pediatria-neonatologia',
    name: 'Pediatría y Neonatología',
    shortName: 'Pediatría y Neonatología',
    icon: 'Baby',
    description: 'Cuidado integral desde el primer minuto de vida con tecnología de incubadoras neonatales y especialistas dedicados.',
    tags: ['Crecimiento & Desarrollo', 'Vacunación', 'Emergencias Pediátricas'],
    badge: 'Guardia 24H'
  },
  {
    id: 'terapia-intensiva',
    name: 'Terapia Intensiva (UTI Adultos y Pediátrica)',
    shortName: 'Terapia Intensiva (UTI)',
    icon: 'HeartPulse',
    description: 'Unidad de cuidados críticos equipada con respiradores de última generación y monitoreo hemodinámico 24/7.',
    tags: ['Monitoreo Continuo', 'Soporte Vital Avanzado', 'Aislamiento'],
    badge: 'Nivel III'
  },
  {
    id: 'neurocirugia',
    name: 'Neurocirugía y Columna',
    shortName: 'Neurocirugía',
    icon: 'Brain',
    description: 'Diagnóstico y microcirugía de patologías craneales, cerebrales y espinales complejas con instrumental de precisión.',
    tags: ['Microcirugía', 'Patologías de Columna', 'Traumatismo Craneal'],
    badge: 'Subespecialidad'
  },
  {
    id: 'cardiologia',
    name: 'Cardiología y Ecocardiografía',
    shortName: 'Cardiología',
    icon: 'Stethoscope',
    description: 'Evaluación integral de salud cardiovascular, ecocardiograma Doppler color, MAPA y Holter continuo.',
    tags: ['Ecocardiograma', 'Holter 24H', 'Prueba de Esfuerzo'],
    badge: 'Disponible Hoy'
  },
  {
    id: 'traumatologia',
    name: 'Traumatología y Ortopedia',
    shortName: 'Traumatología',
    icon: 'Bone',
    description: 'Atención de fracturas, reemplazos articulares, artroscopía y lesiones deportivas con fisioterapia integrada.',
    tags: ['Artroscopía', 'Prótesis de Cadera/Rodilla', 'Urgencias Óseas'],
    badge: 'Disponible Hoy'
  }
];

export const DOCTORS = [
  {
    id: 'doc-velasco',
    name: 'Dr. Alejandro Velasco Morales',
    specialtyId: 'cirugia-general',
    specialty: 'Cirugía General y Laparoscópica',
    regNumber: 'M.P. 5420-BENI',
    experience: '18 años de experiencia',
    availableToday: true,
    availableHours: ['08:30', '10:00', '16:00', '17:30'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    bio: 'Pionero en cirugía laparoscópica avanzada en el departamento del Beni. Miembro de la Sociedad Boliviana de Cirugía.',
    room: 'Consultorio 101 - Pabellón Quirúrgico'
  },
  {
    id: 'doc-mendoza',
    name: 'Dra. Carmen Rosa Mendoza',
    specialtyId: 'pediatria-neonatologia',
    specialty: 'Pediatría y Neonatología',
    regNumber: 'M.P. 6112-BENI',
    experience: '14 años de experiencia',
    availableToday: true,
    availableHours: ['09:15', '11:00', '15:00', '18:15'],
    avatar: 'https://images.unsplash.com/photo-1594824813579-2a912bb0e439?auto=format&fit=crop&w=400&q=80',
    bio: 'Especialista en cuidados intensivos neonatales y lactancia materna con maestría en Pediatría Clínica.',
    room: 'Consultorio 204 - Ala Materno Infantil'
  },
  {
    id: 'doc-suarez',
    name: 'Dr. Fernando Suárez Ribera',
    specialtyId: 'terapia-intensiva',
    specialty: 'Terapia Intensiva (UTI)',
    regNumber: 'M.P. 4880-BENI',
    experience: '20 años de experiencia',
    availableToday: true,
    availableHours: ['08:00', '11:30', '16:30'],
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    bio: 'Jefe del Departamento de Terapia Intensiva y Urgencias Críticas. Especialista certificado en soporte cardiovascular.',
    room: 'Jefatura de UTI - Piso 2'
  },
  {
    id: 'doc-arce',
    name: 'Dr. Mauricio Arce Banegas',
    specialtyId: 'neurocirugia',
    specialty: 'Neurocirugía y Columna',
    regNumber: 'M.P. 7234-BENI',
    experience: '12 años de experiencia',
    availableToday: false,
    availableHours: ['10:30', '15:30', '17:00'],
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    bio: 'Formación en neurocirugía mínimamente invasiva y microcirugía vascular cerebral en centros de referencia internacional.',
    room: 'Consultorio 108 - Neurociencias'
  },
  {
    id: 'doc-vargas',
    name: 'Dra. Silvia Vargas Justiniano',
    specialtyId: 'cardiologia',
    specialty: 'Cardiología y Ecocardiografía',
    regNumber: 'M.P. 5930-BENI',
    experience: '15 años de experiencia',
    availableToday: true,
    availableHours: ['09:00', '10:45', '14:30', '16:45'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    bio: 'Especialista en prevención de riesgo coronario, hipertensión arterial y ecocardiograma transesofágico.',
    room: 'Consultorio 202 - Centro Cardiovascular'
  },
  {
    id: 'doc-pardo',
    name: 'Dr. Roberto Pardo Aguilera',
    specialtyId: 'traumatologia',
    specialty: 'Traumatología y Ortopedia',
    regNumber: 'M.P. 6802-BENI',
    experience: '16 años de experiencia',
    availableToday: true,
    availableHours: ['08:45', '11:15', '15:45', '18:00'],
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    bio: 'Cirujano ortopedista con entrenamiento en reconstrucción articular y artroscopía de hombro y rodilla.',
    room: 'Consultorio 105 - Traumatología'
  }
];

export const TIME_SLOTS = [
  '08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM',
  '11:30 AM', '03:00 PM', '03:45 PM', '04:30 PM',
  '05:15 PM', '06:00 PM', '06:45 PM'
];

export const CLINIC_INFO = {
  name: 'Clínica Velasco',
  subtitle: 'Atención Médica de Alta Complejidad',
  city: 'Trinidad',
  department: 'Beni',
  country: 'Bolivia',
  address: 'Av. Pedro Ignacio Muiba esq. Calle Mamoré, Trinidad - Beni, Bolivia',
  emergencyPhone: '+591 69400096',
  emergencyMobile: '+591 69400096',
  receptionPhone: '+591 69400096',
  whatsappNumber: '59169400096',
  email: 'contacto@clinicavelasco.com.bo',
  hours: 'Atención ambulatoria: Lun - Sáb: 07:30 - 20:00 | Emergencias y UTI: 24 Horas / 365 Días'
};
