import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    home: 'Home',
    bookings: 'Bookings',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    search: 'Search',
    book: 'Book',
    cancel: 'Cancel',
    payment: 'Payment',
    total: 'Total',
    nights: 'Nights',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    orderSummary: 'Order Summary',
    paymentDetails: 'Payment Details',
    pricePerNight: 'Price per night',
    totalAmount: 'Total Amount',
    cardholderName: 'Cardholder Name',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    email: 'Email',
    address: 'Billing Address',
    submit: 'Submit',
    dashboard: 'Dashboard',
    becomeHost: 'Become a Host',
    host: 'Host',
    wishlist: 'Wishlist',
    myBookings: 'My Bookings',
    properties: 'Properties',
    guests: 'Guests',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    register: 'Register',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    findNextStay: 'Find your next stay',
    featuredProperties: 'Featured Properties',
    loading: 'Loading...',
    noWishlists: 'No wishlists yet',
    startExploring: 'Start exploring'
  },
  es: {
    home: 'Inicio',
    bookings: 'Reservas',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    profile: 'Perfil',
    search: 'Buscar',
    book: 'Reservar',
    cancel: 'Cancelar',
    payment: 'Pago',
    total: 'Total',
    nights: 'Noches',
    checkIn: 'Entrada',
    checkOut: 'Salida',
    orderSummary: 'Resumen del Pedido',
    paymentDetails: 'Detalles de Pago',
    pricePerNight: 'Precio por noche',
    totalAmount: 'Monto Total',
    cardholderName: 'Nombre del Titular',
    cardNumber: 'Número de Tarjeta',
    expiryDate: 'Fecha de Vencimiento',
    email: 'Correo Electrónico',
    address: 'Dirección de Facturación',
    submit: 'Enviar',
    dashboard: 'Panel',
    becomeHost: 'Ser Anfitrión',
    host: 'Anfitrión',
    wishlist: 'Lista de Deseos',
    myBookings: 'Mis Reservas',
    properties: 'Propiedades',
    guests: 'Huéspedes',
    status: 'Estado',
    actions: 'Acciones',
    view: 'Ver',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    register: 'Registrarse',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    firstName: 'Nombre',
    lastName: 'Apellido',
    findNextStay: 'Encuentra tu próxima estadía',
    featuredProperties: 'Propiedades Destacadas',
    loading: 'Cargando...',
    noWishlists: 'Aún no hay listas de deseos',
    startExploring: 'Comenzar a explorar'
  },
  fr: {
    home: 'Accueil',
    bookings: 'Réservations',
    login: 'Se connecter',
    logout: 'Se déconnecter',
    profile: 'Profil',
    search: 'Rechercher',
    book: 'Réserver',
    cancel: 'Annuler',
    payment: 'Paiement',
    total: 'Total',
    nights: 'Nuits',
    checkIn: 'Arrivée',
    checkOut: 'Départ',
    orderSummary: 'Résumé de la Commande',
    paymentDetails: 'Détails du Paiement',
    pricePerNight: 'Prix par nuit',
    totalAmount: 'Montant Total',
    cardholderName: 'Nom du Titulaire',
    cardNumber: 'Numéro de Carte',
    expiryDate: 'Date d\'Expiration',
    email: 'Email',
    address: 'Adresse de Facturation',
    submit: 'Soumettre',
    dashboard: 'Tableau de Bord',
    becomeHost: 'Devenir Hôte',
    host:'Hôte',
    wishlist: 'Liste de Souhaits',
    myBookings: 'Mes Réservations',
    properties: 'Propriétés',
    guests: 'Invités',
    status: 'Statut',
    actions: 'Actions',
    view: 'Voir',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    register: 'S\'inscrire',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    firstName: 'Prénom',
    lastName: 'Nom',
    findNextStay: 'Trouvez votre prochain séjour',
    featuredProperties: 'Propriétés en Vedette',
    loading: 'Chargement...',
    noWishlists: 'Pas encore de listes de souhaits',
    startExploring: 'Commencer à explorer'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang) => {
    // console.log('changeLanguage called with:', lang);
    if (translations[lang]) {
      console.log('Setting language to:', lang);
      setLanguage(lang);
    } else {
      console.log('Invalid language:', lang);
    }
  };

  const t = useMemo(() => {
    return (key) => translations[language]?.[key] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    changeLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};